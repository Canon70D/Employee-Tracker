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

//========Array List===================
var roleArray = [];
var roleIDArray = [];
var managerArray = [];
var managerIDArray = [];
//=====================================

//========Build Array==================
function buildRoleArray() {
  const query = `SELECT id, title FROM role;`;
  db.query(query, function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      roleArray.push(res[i].title);
    }
    //console.log(roleArray);
  });
}

function buildRoleIDArray() {
  const query = `SELECT id, title FROM role;`;
  db.query(query, function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      roleIDArray.push(res[i]);
    }
    //console.log(roleIDArray);
  });
}

function buildManagerArray() {
  const query = `
  SELECT DISTINCT x.id, CONCAT(x.first_name, " ", x.last_name) 
  AS manager_name
  FROM employee e
  INNER JOIN employee x
  ON e.manager_id = x.id`;

  db.query(query, function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      managerArray.push(res[i].manager_name);
    }
    managerArray.push("Null");
    //console.log(managerArray);
  });
}

function buildManagerIDArray() {
  const query = `
  SELECT DISTINCT CONCAT(x.first_name, " ", x.last_name) AS manager_name, x.id AS manager_id
  FROM employee e
  LEFT JOIN employee x
  ON e.manager_id = x.id`;

  db.query(query, function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      managerIDArray.push(res[i]);
      //console.log(managerIDArray[i].manager_id);
    }
    //console.log(managerIDArray);
  });
}
//=====================================

//=====================Question List===========================
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

const empQ = [
  {
    name: "first_name",
    type: "input",
    message: "Please enter the First Name of the New Employee:",
    validate: function (nameInput) {
      letters = /^[A-Za-z]+$/.test(nameInput);
      if (letters) {
        return true;
      } else {
        console.log(`invalid name, please check and re-enter`);
        return false;
      }
    },
  },
  {
    name: "last_name",
    type: "input",
    message: "Please enter the Last Name of the New Employee:",
    validate: function (nameInput) {
      letters = /^[A-Za-z]+$/.test(nameInput);
      if (letters) {
        return true;
      } else {
        console.log(`invalid name, please check and re-enter`);
        return false;
      }
    },
  },
  {
    name: "role",
    type: "list",
    message: "Please select the job title for this new employee",
    choices: roleArray,
  },
  {
    name: "manager",
    type: "list",
    message: "Please select the manager for this new employee",
    choices: managerArray,
  },
];

//=============================================================

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
function addEmployee() {
  inquirer.prompt(empQ).then(function (answer) {
    let empFirstName = answer.first_name;
    let empLastName = answer.last_name;

    function roleLoop() {
      for (let i = 0; i < roleIDArray.length; i++) {
        if (roleIDArray[i].title === answer.role) {
          return roleIDArray[i].id;
        }
      }
    }

    //console.log(roleLoop());

    function ManagerLoop() {
      for (let j = 0; j < managerIDArray.length; j++) {
        if (managerIDArray[j].manager_name === answer.manager) {
          return managerIDArray[j].manager_id;
        }
      }
    }

    //console.log(ManagerLoop());

    let empRole = roleLoop();
    let empManager = ManagerLoop();

    let addEmployee = new Employee(
      empFirstName,
      empLastName,
      empRole,
      empManager
    );

    console.log("new employee added successfully!");

    db.query("insert into employee set ?", addEmployee, function (err, res) {
      if (err) throw err;
    });

    start();
  });

  //start();
}

//----------------------------------------------------------
db.connect(function (err) {
  if (err) throw err;
  start();
  buildRoleArray();
  buildRoleIDArray();
  buildManagerArray();
  buildManagerIDArray();
});
