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
  // asciiArt.font("Employee", "doom", (err, rendered) => {
  //   console.log(err || rendered);
  // });
  // asciiArt.font("Manager", "doom", (err, rendered) => {
  //   console.log(err || rendered);
  // });

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

//function to display qurey request
function queryResult(query) {
  db.query(query, (err, res) => {
    if (err) throw err;
    console.log(`==============================`);
    console.table(res);
    console.log(`==============================`);

    start();
  });
}

//function to display all employee
function viewEmployee() {
  const empQuery = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name "department", role.salary ,CONCAT( manager.first_name, " ", manager.last_name) AS "manager"
  FROM employee
  left join role ON role.id = employee.role_id
  left join department ON department.id = role.department_id
  left join employee as manager on manager.id = employee.manager_id`;

  queryResult(empQuery);
}

//function to add employee
function addEmployee() {}

//----------------------------------------------------------
start();
