const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employee_db",
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
  } else {
    console.log("Conectado ao banco de dados MySQL!");
  }
});

app.get("/employee", (req, res) => {
  const sql = "SELECT * FROM employees";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post("/employee", (req, res) => {
  const sql = "INSERT INTO employees (name, email) VALUES (?, ?)";
  const { name, email } = req.body;
  db.query(sql, [name, email], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, name, email });
  });
});

app.put("/employee/:id", (req, res) => {
  const sql = "UPDATE employees SET name = ?, email = ? WHERE id = ?";
  const { name, email } = req.body;
  const { id } = req.params;
  db.query(sql, [name, email, id], (err) => {
    if (err) throw err;
    res.json({ id, name, email });
  });
});

app.delete("/employee/:id", (req, res) => {
  const sql = "DELETE FROM employees WHERE id = ?";
  const { id } = req.params;
  db.query(sql, [id], (err) => {
    if (err) throw err;
    res.status(204).send();
  });
});


app.get("/order", (req, res) => {
  const sql = "SELECT * FROM orders";
  db.query(sql, (err, results) => {
      if (err) throw err;
      res.json(results);
  });
});

app.post("/order", (req, res) => {
  const sql = "INSERT INTO orders (name, brand, category, price, quantity, store, manager) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const { name, brand, category, price, quantity, store, manager } = req.body;
  db.query(sql, [name, brand, category, price, quantity, store, manager], (err, result) => {
      if (err) throw err;
      res.json({ id: result.insertId, name, brand, category, price, quantity, store, manager });
  });
});


app.put("/order/:id", (req, res) => {
  const sql = "UPDATE orders SET name = ?, brand = ?, category = ?, price = ?, quantity = ?, store = ?, manager = ? WHERE id = ?";
  const { name, brand, category, price, quantity, store, manager } = req.body;
  const { id } = req.params;
  db.query(sql, [name, brand, category, price, quantity, store, manager, id], (err) => {
      if (err) throw err;
      res.json({ id, name, brand, category, price, quantity, store, manager });
  });
});


app.delete("/order/:id", (req, res) => {
  const sql = "DELETE FROM orders WHERE id = ?";
  const { id } = req.params;
  db.query(sql, [id], (err) => {
      if (err) throw err;
      res.status(204).send();
  });
});



app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});
