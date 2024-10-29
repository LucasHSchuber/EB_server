// MAIN SERVER 
import express from "express";
import cors from "cors";
import mysql from "mysql";
import bodyParser from 'body-parser';

// import dbConfig
import dbConfig from "./dbConfig.js";


const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

// MySQL database connection
const db = mysql.createPool(dbConfig);

db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
  connection.release(); 
});

app.get("/", (req, res) => {
    res.send("Welcome to this api")
})



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});