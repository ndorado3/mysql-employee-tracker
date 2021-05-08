const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
// const { restoreDefaultPrompts } = require("inquirer");

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
        "Add a new Department",
        "Add a new Role",
        "Add a new Employee",
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
        case "Add a new Department":
          addDepartment();
          break;
        case "Add a new Role":
          addRole();
        //break;
      }
    });
};

//function to Add a Department to the database
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
          console.log(
            `The Department ${response.departmentName} was added successfully!!`
          );
          //re-prompt the menu questions
          init();
        }
      );
    });
};

//function to Add a Role to the database
const addRole = () => {
  //getting all items in the departments table from the db
  connection.query("SELECT * FROM departments", (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the Title of the new Role?",
          name: "roleTitle",
        },
        {
          type: "input",
          message: "What is the Salary of the new Role?",
          name: "roleSalary",
        },
        {
          type: "rawlist",
          message: "Which Department the new Role belongs to?",
          name: "roleDepartment",
          //It pulls all the departments by name from the db
          choices() {
            const choiceArray = [];
            results.forEach(({ department_name }) => {
              choiceArray.push(department_name);
            });
            return choiceArray;
          },
        },
      ])
      .then((response) => {
        const chosenDepartment = response.roleDepartment;
        connection.query("SELECT * FROM departments", (err, results) => {
          if (err) throw err;
          let departmentFilter = results.filter((results) => {
            return results.department_name === chosenDepartment;
          });
          // let deptId = departmentFilter[0].id;
          let sql =
            "INSERT INTO role (title, salary, department_id) VALUES (?,?,?)";
          connection.query(
            sql,
            [response.roleTitle, response.roleSalary, departmentFilter[0].id],
            (err) => {
              if (err) throw err;
              console.log(
                `The Role ${response.roleTitle} was added successfully!!`
              );
              //viewRoles ();
            }
          );
        });
      });
  });
};

// connects to mysql server and sql database
connection.connect((err) => {
  if (err) throw err;
  init();
});

// .then((response) => {
//   connection.query("SELECT * FROM departments", (err, res) => {
//     let chosenDepartment;
//     if (err) throw err;
//     results.forEach((department) => {
//       if (department.department_name === response.roleDepartment) {
//         chosenDepartment = department;
//       }
//     });
//     let id = chosenDepartment[0].id;
//     let sql =
//       "INSERT INTO role SET (title, salary, department_id) VALUES (?,?,?) ";
//     let values = [response.roleTitle, parseInt(response.roleSalary), id];
//     console.log(vlaues);
//     connection.query(sql, values, (err) => {
//       if (err) throw err;
//       console.log(
//         `The Role ${response.roleTitle} was added successfully!!`
//       );
//     });
//   });
//   // viewRoles()
// });
