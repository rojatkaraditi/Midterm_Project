const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "AprApr_2606",
    database: "institute"
});

connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
  });

  module.exports = connection;