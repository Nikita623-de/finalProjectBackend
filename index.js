const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const app = express();
const cors = require("cors");
const port = 3001;

const db = new sqlite3.Database('C:/Users/Nikita-Nik 10/Desktop/chat.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT)");
});
app.use(cors());
app.use(express.json());

app.get('/messages', (req, res) => {
  db.all('SELECT * FROM messages', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch messages' });
    } else {
      res.json(rows);
    }
  });
});

app.post('/messages', (req, res) => {
  const text = req.body.text;

  db.run('INSERT INTO messages (text) VALUES (?)', [text], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to insert message' });
    } else {
      res.json({ id: this.lastID, text });
    }
  });
});

app.delete('/messages', (req, res) => {
  db.run('DELETE FROM messages', function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete messages' });
    } else {
      res.json({ message: 'All messages deleted' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});