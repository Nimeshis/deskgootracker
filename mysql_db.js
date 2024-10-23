const express = require("express");
const mysql = require("mysql2");

const app = express();

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: "localhost", // Replace with your database host
  user: "root", // Replace with your database user
  password: "admin", // Replace with your database password
  database: "_613bd2a576ea0e88", // Replace with your database name
});

// Connect to the database and show success message
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database");
});

// Route to fetch data from the MySQL table and field
app.get("/fetch-data/:table/:field", (req, res) => {
  const { table, field } = req.params;
  const query = `SELECT ?? FROM ??`;

  connection.query(query, [field, table], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Database query failed");
      return;
    }

    // Log the results on the server console
    console.log("Query Results:", results);

    // Send the results as JSON to the client
    res.json(results);
  });
});

// Start the server and log the port
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
