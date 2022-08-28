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
var employeeArray = [];
var employeeIDArray = [];
var departmentArray = [];
var departmentIDArray = [];
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

function buildEmployeeArray() {
  const query = `SELECT DISTINCT CONCAT(x.first_name, " ", x.last_name) AS employee_name, x.id AS employee_id
   FROM employee e
   LEFT JOIN employee x
   ON e.id = x.id`;

  db.query(query, function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      employeeArray.push(res[i].employee_name);
    }
    //console.log(employeeArray);
  });
}

function buildEmployeeIDArray() {
  const query = `SELECT DISTINCT CONCAT(x.first_name, " ", x.last_name) AS employee_name, x.id AS employee_id
   FROM employee e
   LEFT JOIN employee x
   ON e.id = x.id`;

  db.query(query, function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      employeeIDArray.push(res[i]);
    }
    //console.log(employeeIDArray);
  });
}

function buildDepartmentArray() {
  const query = `select * from department`;
  db.query(query, function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      departmentArray.push(res[i].name);
    }
    //console.log(departmentArray);
  });
}

function buildDepartmentIDArray() {
  const query = `select * from department`;
  db.query(query, function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      departmentIDArray.push(res[i]);
    }
    // console.log(departmentIDArray);
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
      "Add Roles",
      "View All Departments",
      "Add Department",
      "Quit",
    ],
  },
];

//add employee question
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

//update employee role question
const empRoleQ = [
  {
    type: "list",
    name: "employee",
    message: "which employee do you want to update their role",
    choices: employeeArray,
  },

  {
    type: "list",
    name: "role",
    message: "Which role do you want to update to the employee?",
    choices: roleArray,
  },
];

//add role question
const addRoleQ = [
  {
    name: "departmentName",
    type: "list",
    message: "Please select department for the new role",
    choices: departmentArray,
  },
  {
    name: "newRole",
    type: "input",
    message: "Please enter the title of the new role.",
  },
  {
    name: "newSalary",
    type: "number",
    message: "Please enter the salary of the new role.",
  },
];

//add department question
const addDeptQ = [
  {
    name: "newDept",
    type: "input",
    message: "Please enter the name of new department",
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

  buildRoleArray();
  buildRoleIDArray();
  buildManagerArray();
  buildManagerIDArray();
  buildEmployeeArray();
  buildEmployeeIDArray();
  buildDepartmentArray();
  buildDepartmentIDArray();

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
    } else if (nextStep === "Add Roles") {
      addRoles();
    } else if (nextStep === "View All Departments") {
      viewDepartment();
    } else if (nextStep === "Add Department") {
      addDepartment();
    } else if (nextStep === "Quit") {
      stopApp();
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

//function to view all employee
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
      for (let j = 0; j < departmentIDArray.length; j++) {
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
}

//function to update employee role
function addEmployeeRole() {
  inquirer.prompt(empRoleQ).then(function (answer) {
    function roleIDLoop() {
      for (let i = 0; i < roleIDArray.length; i++) {
        if (roleIDArray[i].title === answer.role) {
          return roleIDArray[i].id;
        }
      }
    }

    //console.log(roleIDLoop());

    function empIDloop() {
      for (let i = 0; i < employeeIDArray.length; i++) {
        if (employeeIDArray[i].employee_name === answer.employee) {
          return employeeIDArray[i].employee_id;
        }
      }
    }

    //console.log(empIDloop());

    let newRoleID = roleIDLoop();
    let empID = empIDloop();

    // console.log("updated role for employee");

    const empRoleQuery = "UPDATE employee SET role_id = ? WHERE id = ?";

    db.query(empRoleQuery, [newRoleID, empID], function (err, res) {
      if (err) throw err;
    });
    start();
  });
}

//function to view all roles
function viewRoles() {
  const roleQuery = `SELECT * FROM role`;
  queryResult(roleQuery);
}

//function to add roles
function addRoles() {
  inquirer.prompt(addRoleQ).then(function (answer) {
    let newRoleName = answer.newRole;
    //console.log(newRoleName);
    let newRoleSalary = answer.newSalary;
    //console.log(newRoleSalary);

    function roleIDLoop() {
      for (let j = 0; j < departmentIDArray.length; j++) {
        if (departmentIDArray[j].name === answer.departmentName) {
          return departmentIDArray[j].id;
        }
      }
    }

    let newRoleID = roleIDLoop();
    //console.log(newRoleID);

    let addNewRole = new Role(newRoleName, newRoleSalary, newRoleID);

    db.query("insert into role set ?", addNewRole, function (err, res) {
      if (err) throw err;
    });

    start();
  });
}

//function to view all department
function viewDepartment() {
  const departmentQuery = `SELECT * FROM department`;
  queryResult(departmentQuery);
}

//function to add department
function addDepartment() {
  inquirer.prompt(addDeptQ).then(function (answer) {
    let newDeptName = answer.newDept;

    let addnewDept = new Department(newDeptName);

    db.query("insert into department set ?", addnewDept, function (err, res) {
      if (err) throw err;
    });

    start();
  });
}

//function to quit
function stopApp() {
  console.log("end");
  db.end();
}

//----------------------------------------------------------
db.connect(function (err) {
  if (err) throw err;
  start();
});
