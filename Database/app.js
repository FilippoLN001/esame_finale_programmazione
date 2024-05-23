const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'ecommerce',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; font-src 'self' http://localhost:3000;");
  next();
});

// Configurazione per servire i file statici
app.use('/assets/imagines', express.static(path.join(__dirname, '../src/assets/imagines')));

const handleError = (error, res) => {
  console.error(error);
  res.status(500).json({ error: error.message || 'Internal Server Error' });
};

// Configurazione di multer per salvare le immagini nella cartella esistente
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../src/assets/imagines');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.use(express.json());

app.post('/products', upload.single('immagine'), async (req, res) => {
  const { nome, marca, categoria, prezzo, descrizione, data_messa_in_vendita } = req.body;
  const immagine = req.file ? `assets/imagines/${req.file.filename}` : null;

  if (!immagine) {
    return res.status(400).json({ message: 'Errore: il file immagine non è stato caricato correttamente.' });
  }

  try {
    const query = 'INSERT INTO Prodotti (nome, marca, categoria, prezzo, immagine, descrizione, data_messa_in_vendita) VALUES (?, ?, ?, ?, ?, ?, ?)';
    await pool.query(query, [nome, marca, categoria, prezzo, immagine, descrizione, data_messa_in_vendita]);
    res.status(201).json({ message: 'Prodotto aggiunto con successo' });
  } catch (error) {
    console.error('Errore durante l\'aggiunta del prodotto:', error);
    res.status(500).json({ message: 'Errore durante l\'aggiunta del prodotto', error: error.message });
  }
});

app.get('/products', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM Prodotti');
    res.status(200).json(results);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    res.status(500).json({ error: 'Database operation failed' });
  }
});

app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM Prodotti WHERE id = ?';
  try {
    const [results] = await pool.query(query, [id]);
    if (results.length === 0) {
      res.status(404).json({ message: 'Prodotto non trovato' });
    } else {
      res.status(200).json(results[0]);
    }
  } catch (error) {
    handleError(error, res);
  }
});

app.put('/products/:id', upload.single('immagine'), async (req, res) => {
  try {
    const productId = req.params.id;
    const productUpdates = req.body;

    if (req.file) {
      const imagePath = `assets/imagines/${req.file.filename}`;
      productUpdates.immagine = imagePath;
    }

    const data_messa_in_vendita = moment(req.body.data_messa_in_vendita, 'ddd MMM DD YYYY HH:mm:ss').format('YYYY-MM-DD');
    
    await updateProduct(productId, productUpdates, data_messa_in_vendita);
    res.status(200).send({ message: 'Product updated successfully' });
  } catch (error) {
    handleError(error, res);
  }
});

app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Prodotti WHERE id = ?';
  try {
    const [results] = await pool.query(query, [id]);
    if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Prodotto non trovato' });
    } else {
      res.status(200).json({ message: 'Prodotto eliminato con successo' });
    }
  } catch (error) {
    handleError(error, res);
  }
});

app.post('/signup', async (req, res) => {
  const { nome, cognome, username, email, password } = req.body;
  const userExistsQuery = 'SELECT * FROM Utenti WHERE username = ? OR email = ?';

  try {
    const [userExists] = await pool.query(userExistsQuery, [username, email]);
    if (userExists.length > 0) {
      res.status(409).json({ message: 'Utente già registrato' });
      return;
    }

    crypto.randomBytes(48, async (err, buffer) => {
      if (err) {
        console.error('Errore durante la generazione della chiave segreta', err);
        return res.status(500).json({ message: 'Errore durante la generazione della chiave segreta' });
      }
      const secretKey = buffer.toString('hex');
      const token = jwt.sign({ username: username }, secretKey, { expiresIn: '1h' });
      const hashedPassword = await bcrypt.hash(password, 10);
      const insertUserQuery = 'INSERT INTO Utenti (nome, cognome, username, email, password, tipo,token) VALUES (?, ?, ?, ?, ?, "User",?)';
      const [results] = await pool.query(insertUserQuery, [nome, cognome, username, email, hashedPassword,token]);

      res.status(201).json({
        id: results.insertId,
        token: token,
        message: "Utente registrato con successo!"
      });
    });

  } catch (error) {
    console.error('Errore durante la registrazione', error);
    res.status(500).json({ message: 'Errore durante la registrazione' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const query = 'SELECT id, username, password, tipo FROM Utenti WHERE email = ?';
    const [users] = await pool.query(query, [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }

    const user = users[0];
    console.log('User found:', user);

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      const token = jwt.sign({ userId: user.id, username: user.username, role: user.tipo }, 'your_secret_key', { expiresIn: '1h' });
      res.json({ token, username: user.username, userRole: user.tipo });
      console.log('Login response:', { token, username: user.username, userRole: user.tipo });
    } else {
      res.status(401).json({ message: 'Credenziali non valide' });
    }
  } catch (error) {
    console.error('Errore durante il login', error);
    res.status(500).json({ message: 'Errore interno server' });
  }
});

function isAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Token non fornito' });
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token non valido' });
    }

    if (decoded.role !== 'Admin') {
      return res.status(403).json({ message: 'Accesso non autorizzato' });
    }

    req.user = decoded;
    next();
  });
}

app.get('/admin/data', isAdmin, (req, res) => {
  res.json({ message: 'Dati sensibili solo per Admin' });
});

app.post('/acquista', async (req, res) => {
  const { id_prodotto } = req.body;
  const id_utente = req.user.id;

  try {
    const inserisciAcquisto = 'INSERT INTO Acquisto (id_prodotto, id_utente, data_acquisto) VALUES (?, ?, NOW())';
    await pool.query(inserisciAcquisto, [id_prodotto, id_utente]);
    res.status(201).json({ message: 'Acquisto completato con successo!' });
  } catch (error) {
    console.error('Errore durante l\'acquisto: ' + error.message);
    res.status(500).json({ error: 'Errore interno server' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

async function updateProduct(productId, updates, data_messa_in_vendita) {
  const {
    nome = '', 
    marca = '', 
    categoria = '', 
    prezzo = 0, 
    immagine = '', 
    descrizione = ''
  } = updates;
  const query = `
    UPDATE Prodotti SET
    nome = ?, 
    marca = ?, 
    categoria = ?, 
    prezzo = ?, 
    immagine = ?, 
    descrizione = ?, 
    data_messa_in_vendita = ?
    WHERE id = ?
  `;

  const values = [nome, marca, categoria, prezzo, immagine, descrizione, data_messa_in_vendita, productId];

  try {
    await pool.query(query, values);
  } catch (error) {
    throw error;
  }
}
