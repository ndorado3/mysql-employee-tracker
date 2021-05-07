USE employeeTracker_DB;
INSERT INTO
  departments (department_name)
VALUES
  ("Legal"),("IT"),("Human Resources"),("Finance"),("Sales"),("Marketing");
INSERT INTO
  role (title, salary, department_id)
VALUES
  ("Lawyer", 60000, 001),("Paralegal", 15000, 001),
  ("Information", 50000, 002),("Database Administrator", 46000, 002),
  ("HR Specialist", 32000, 003),("HR Manager", 42000, 003),("Accountant", 55000, 004),
  ("Sales Lead", 30000, 005),("Sales Rep", 20000, 005),("Marketing Specialist", 32000, 006),("Marketing Manager", 42000, 006);