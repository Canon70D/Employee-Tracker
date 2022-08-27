const mysql = require("mysql2");

// Enable access to .env variables
require("dotenv").config();

// Use environment variables to connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.ROOT_NAME,
    password: process.env.ROOT_KEY,
    database: process.env.ROOT_DB,
  },
  console.log(`Connected to the company_db database.`)
);

module.exports = db;
