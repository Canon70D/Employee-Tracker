const inquirer = require("inquirer");
const cTable = require("console.table");
const asciiArt = require("ascii-art");

const db = require("./config/connection");

const Employee = require("./lib/Employee");
const Role = require("./lib/Role");
const Department = require("./lib/Department");
const { end } = require("./config/connection");

// asciiArt.font("Employee", "doom", (err, rendered) => {
//   console.log(err || rendered);
// });
// asciiArt.font("Manager", "doom", (err, rendered) => {
//   console.log(err || rendered);
// });

//

//start questions
const startQ = [
  {
    type: "rawlist",
    message: "What would you like to do?",
    name: "startQuery",
    choices: [
      "View All Employee",
      "Add Employee",
      "Update Employee Role",
      "View All Roles",
      "View All Departments",
      "Add Department",
      "Quit",
    ],
  },
];

//start app
function start() {
  asciiArt.font("Employee", "doom", (err, rendered) => {
    console.log(err || rendered);
  });
  asciiArt.font("Manager", "doom", (err, rendered) => {
    console.log(err || rendered);
  });

  inquirer.prompt(startQ).then(function (answer) {
    const nextStep = answer.startQuery;
    if (nextStep === "View All Employee") {
      viewEmployee();
    } else if (nextStep === "Add Employee") {
      addEmployee();
    } else if (nextStep === "Update Employee Role") {
      addEmployeeRole();
    } else if (nextStep === "View All Roles") {
      viewRoles();
    } else if (nextStep === "View All Departments") {
      viewDepartment();
    } else if (nextStep === "Add Department") {
      addDepartment();
    } else if (nextStep === "Quit") {
      end();
    }
  });
}
