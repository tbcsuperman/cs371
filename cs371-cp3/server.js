const express = require('express');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const mysql = require('mysql');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'jonathan',
  password: 'capstone',
  database: 'runs',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

app.get('/runs', (req, res) => {
  db.query('SELECT * FROM runs', (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

app.post('/runs', (req, res) => {
  const { date, distance, duration, avgpace, starttime, heartrate, temperature, humidity, weather } = req.body;
  const sql = 'INSERT INTO runs (date, distance, duration, avgpace, starttime, heartrate, temperature, humidity, weather) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [date, distance, duration, avgpace, starttime, heartrate, temperature, humidity, weather], (err, result) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json('Run inserted successfully.');
  });
});

app.put('/runs', (req, res) => {
  const { distance, duration, avgpace, starttime, heartrate, temperature, humidity, weather, date } = req.body;
  const sql = 'UPDATE runs SET distance = ?, duration = ?, avgpace = ?, starttime = ?, heartrate = ?, temperature = ?, humidity = ?, weather = ? WHERE date = ?';
  db.query(sql, [distance, duration, avgpace, starttime, heartrate, temperature, humidity, weather, date], (err) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.send('Run updated successfully.');
  });
});

app.delete('/runs', (req, res) => {
  const { date } = req.body;
  const sql = 'DELETE FROM runs WHERE date = ?';
  db.query(sql, [date], (err) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.send('Run deleted successfully.');
  });
});
