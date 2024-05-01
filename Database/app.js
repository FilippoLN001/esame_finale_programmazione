const mysql = require('mysql2/promise');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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

const handleError = (error, res) => {
  console.error(error);
  res.status(500).json({ error: error.message || 'Internal Server Error' });
};

// Definizione delle tabelle nel database se non esistono
const createTables = async () => {
  try {
    const createProdottiTable = `
    CREATE TABLE IF NOT EXISTS Prodotti (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        marca VARCHAR(255) NOT NULL,
        categoria ENUM('tablet', 'monitor', 'smartphone','pc','laptop','tastiera','mouse','componenti_pc') NOT NULL,
        prezzo INT NOT NULL,
        immagine VARCHAR(255) NOT NULL, 
        descrizione VARCHAR(255),
        data_messa_in_vendita DATE NOT NULL
    );`;

    const createUtentiTable = `
    CREATE TABLE IF NOT EXISTS Utenti (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      tipo ENUM('Admin', 'User') NOT NULL,
      nome VARCHAR(255) NOT NULL,
      cognome VARCHAR(255) NOT NULL,
      username VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      token VARCHAR(512) 
  );`;

    const createAcquistoTable = `
    CREATE TABLE IF NOT EXISTS Acquisto (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_prodotto INT NOT NULL,
        id_utente INT NOT NULL,
        FOREIGN KEY (id_prodotto) REFERENCES Prodotti(id),
        FOREIGN KEY (id_utente) REFERENCES Utenti(id)
    );`;

    await pool.query(createProdottiTable);
    console.log('Tabella Prodotti creata con successo');

    // Assicurati di non eseguire questa query se la tabella 'Utenti' esiste già e ha dati. Potrebbe essere necessario gestire diversamente l'aggiunta di una colonna se la tabella è già in uso.
    await pool.query(createUtentiTable);
    console.log('Tabella Utenti creata con successo');

    await pool.query(createAcquistoTable);
    console.log('Tabella Acquisto creata con successo');
  } catch (err) {
    console.error('Errore durante la creazione delle tabelle: ' + err.message);
  }
};


// Chiama la funzione per creare le tabelle in modo asincrono
createTables();


// Operazioni CRUD
app.post('/products', async (req, res) => {
  const { nome, marca, categoria, prezzo, immagine, descrizione, data_messa_in_vendita } = req.body;
  const query = 'INSERT INTO Prodotti (nome, marca, categoria, prezzo, immagine, descrizione, data_messa_in_vendita) VALUES (?, ?, ?, ?, ?, ?, ?)';
  try {
    const [results] = await pool.query(query, [nome, marca, categoria, prezzo, immagine, descrizione, data_messa_in_vendita]);
    res.status(201).json({ id: results.insertId });
  } catch (error) {
    handleError(error, res);
  }
});

app.get('/products', async (req, res) => {
  console.log('Attempting to fetch products...');
  try {
    const [results] = await pool.query('SELECT * FROM Prodotti');
    console.log('Products fetched:', results);
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

// Funzione per modificare un prodotto
app.put('/products/:id', async (req, res) => {
  const productId = req.params.id;
  const { nome, marca, categoria, prezzo, immagine, descrizione, data_messa_in_vendita } = req.body;
  const updateQuery = `
    UPDATE Prodotti 
    SET nome = ?, marca= ?, categoria = ?, prezzo = ?, immagine = ?, descrizione = ?, data_messa_in_vendita = ?
    WHERE id = ?`;
  try {
    const [results] = await pool.query(updateQuery, [nome, marca, categoria, prezzo, immagine, descrizione, data_messa_in_vendita, productId]);
    if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Prodotto non trovato' });
    } else {
      res.status(200).json({ message: 'Prodotto modificato con successo' });
    }
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

//Utenti 

app.post('/signup', async (req, res) => {
  const { nome, cognome, username, email, password } = req.body;
  const userExistsQuery = 'SELECT * FROM Utenti WHERE username = ? OR email = ?';

  try {
    const [userExists] = await pool.query(userExistsQuery, [username, email]);
    if (userExists.length > 0) {
      res.status(409).json({ message: 'Utente già registrato' });
      return;
    }

    // Genera una chiave segreta casuale per ogni utente
    crypto.randomBytes(48, async (err, buffer) => {
      if (err) {
        console.error('Errore durante la generazione della chiave segreta', err);
        return res.status(500).json({ message: 'Errore durante la generazione della chiave segreta' });
      }
      const secretKey = buffer.toString('hex');
      // Crea un token JWT usando la chiave segreta generata
      const token = jwt.sign({ username: username }, secretKey, { expiresIn: '1h' });
      const hashedPassword = await bcrypt.hash(password, 10); // Hash della password con bcrypt
      // Inserisci il nuovo utente nel database insieme al token
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

    // Confronta la password hashata con quella fornita
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      // Crea un token JWT includendo il ruolo dell'utente
      const token = jwt.sign({ userId: user.id, username: user.username, role: user.tipo }, 'your_secret_key', { expiresIn: '1h' });
      res.json({ token, userRole: user.tipo });
    } else {
      res.status(401).json({ message: 'Credenziali non valide' });
    }
  } catch (error) {
    console.error('Errore durante il login', error);
    res.status(500).json({ message: 'Errore interno server' });
  }
});

function isAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer Token
  if (!token) {
    return res.status(403).json({ message: 'Token non fornito' });
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token non valido' });
    }

    // Controlla se l'utente è un amministratore
    if (decoded.role !== 'Admin') {
      return res.status(403).json({ message: 'Accesso non autorizzato' });
    }

    req.user = decoded; // Salva l'utente decodificato nella richiesta per l'uso nei controller
    next();
  });
}

// Esempio di rotta protetta che solo gli amministratori possono accedere
app.get('/admin/data', isAdmin, (req, res) => {
  res.json({ message: 'Dati sensibili solo per Admin' });
});


//Acquisto

app.post('/acquista', async (req, res) => {
  const { id_prodotto } = req.body;  // ID del prodotto acquistato
  const id_utente = req.user.id;  // ID dell'utente, estratto da sessione o JWT

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



