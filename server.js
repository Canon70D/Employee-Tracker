const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const sequelize = require("./config/connection");

const Employee = require("./lib/Employee");
const Role = require("./lib/Role");
const Department = require("./lib/Department");
