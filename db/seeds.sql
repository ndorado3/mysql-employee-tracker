USE employeeTracker_DB;
INSERT INTO
  departments (department_name)
VALUES
  ("Legal"),("IT"),("Human Resources"),("Finance"),("Sales"),("Marketing");
INSERT INTO
  role (title, salary, department_id)
VALUES
  ("Lawyer", 60, 001),("Paralegal", 15, 001),
  ("Information", 50, 002),("Database Administrator", 46, 002),
  ("HR Specialist", 32, 003),("HR Manager", 42, 003),("Accountant", 55, 004),
  ("Sales Lead", 30, 005),("Sales Rep", 20, 005),("Marketing Specialist", 32, 006),("Marketing Manager", 42, 006);
INSERT INTO
  employee (first_name, last_name, role_id)
VALUES
  ("William", "Dorado", 1),
  ("Alexander", "Brumlik", 7),
  ("Sarah", "White", 6),
  ("James", "Brown", 8);