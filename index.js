const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Valencia21!",
  database: "employeeTracker_DB",
});

// connection.connect((err) => {
//   if (err) throw err;
//   // start();
// });

//function that prompts the menu questions
const init = () => {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "View all Departments ",
        "View all Roles ",
        "View all employees",
        "Updated employee role",
        "EXIT",
      ],
      name: "menu",
    })
    .then((response) => {
      // console.log("sucess!!!");
      switch (response.menu) {
        case "Add a Department":
          addDepartment();
          // break;
      }
    });
};

//function to Add a department to the database
const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the Department name?",
        name: "departmentName",
      },
    ])
    .then((response) => {
      // when finished prompting, insert the input into the db
      // ? = in mysql is a place holder for a variable
      connection.query(
        "INSERT INTO departments SET ?",
        {
          department_name: response.departmentName,
        },
        (err) => {
          if (err) throw err;
          console.log("Department was added successfully");
          //re-prompt the menu questions
          init();
        }
      );
    });
};

// connects to mysql server and sql database
connection.connect((err) => {
  if (err) throw err;
  init();
});
