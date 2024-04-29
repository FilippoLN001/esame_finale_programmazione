const mysql = require('mysql2/promise');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

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
      password VARCHAR(255) NOT NULL
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
  const { nome, categoria, prezzo, immagine, descrizione, data_messa_in_vendita } = req.body;
  const query = 'INSERT INTO Prodotti (Nome, categoria, prezzo, immagine, descrizione, data_messa_in_vendita) VALUES (?, ?, ?, ?, ?, ?)';
  try {
    const [results] = await pool.query(query, [nome, categoria, prezzo, immagine, descrizione, data_messa_in_vendita]);
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
  const { nome, categoria, prezzo, immagine, descrizione, data_messa_in_vendita } = req.body;
  const updateQuery = `
    UPDATE Prodotti 
    SET Nome = ?, categoria = ?, prezzo = ?, immagine = ?, descrizione = ?, data_messa_in_vendita = ?
    WHERE id = ?`;
  try {
    const [results] = await pool.query(updateQuery, [nome, categoria, prezzo, immagine, descrizione, data_messa_in_vendita, productId]);
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

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});