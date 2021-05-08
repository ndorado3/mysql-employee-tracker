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
          break;
        case "Add a new Employee":
          addEmployee();
        // break;
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
          message: "What is the annual Salary of the new Role?",
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
        //it obtains the department id
        connection.query("SELECT * FROM departments", (err, results) => {
          if (err) throw err;
          let departmentFilter = results.filter((results) => {
            return results.department_name === chosenDepartment;
          });
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
              init();
            }
          );
        });
      });
  });
};

//function to Add an Employee to the database
const addEmployee = () => {
  //getting all items in the role table from the db
  connection.query("SELECT * FROM role", (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the Employee's first name?",
          name: "firstName",
        },
        {
          type: "input",
          message: "What is the Employee's last name?",
          name: "lastName",
        },
        {
          type: "rawlist",
          message: "What is the new Employee role?",
          name: "roleID",
          //It pulls all the roles by name from the db
          choices() {
            const choiceArray = [];
            results.forEach(({ title }) => {
              choiceArray.push(title);
            });
            return choiceArray;
          },
        },
      ])
      .then((response) => {
        //it obtains the roles id from the choosen role title
        const chosenRole = response.roleID;
        connection.query("SELECT * FROM role", (err, results) => {
          if (err) throw err;
          let roleFilter = results.filter((results) => {
            return results.title === chosenRole;
          });
          //it obtains the manager id from the choosen employee name
          connection.query("SELECT * FROM employee", (err, results) => {
            if (err) throw err;
            inquirer
              .prompt([
                {
                  type: "rawlist",
                  message: "Who is the Employee's Manager?",
                  name: "managerID",
                  choices() {
                    const choiceManager = [];
                    results.forEach(({ first_name }) => {
                      choiceManager.push(first_name);
                    });
                    return choiceManager;
                  },
                },
              ])
              .then((responseManager) => {
                const chosenManager = responseManager.managerID;
                connection.query("SELECT * FROM employee", (err, results) => {
                  if (err) throw err;
                  let managerIDfilter = results.filter((results) => {
                    return results.first_name === chosenManager;
                  });
                  let sql =
                    "INSERT INTO employee (first_name,last_name,role_id, manager_id) VALUES (?,?,?,?)";
                  connection.query(
                    sql,
                    [
                      response.firstName,
                      response.lastName,
                      roleFilter[0].id,
                      managerIDfilter[0].id,
                    ],
                    (err) => {
                      if (err) throw err;
                      console.log(
                        `The new Employee ${response.firstName} was added successfully!!`
                      );
                      //viewRoles ();
                      init();
                    }
                  );
                });
              });
          });
        });
      });
  });
};

// connects to mysql server and sql database
connection.connect((err) => {
  if (err) throw err;
  init();
});
