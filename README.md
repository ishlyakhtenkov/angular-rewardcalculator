Reward Calculating System project 
=================================

This is the frontend part of Reward Calculating System designed for calculating monthly reward of employees
of the department based on the reward allocated to the department, the number of hours worked by the employee, and his success in work.

### Technology stack used: 
* Angular 2
* Bootstrap

### Project key logic:
* System main purpose: calculating monthly reward of employees of the department based on the reward allocated
 to the department, the number of hours worked by the employee, and his success in work. Obtaining a reporting form for rewards in pdf format.  
 The system also allows to receive data of the payment periods of the company, departments, positions and employees of the department.
* There are 4 types of users: admin, personnel officer, economist and department head.
* Admins have full control over the system. They can receive, create, update and delete any data. But their main task is user management.
* Personnel officers can manage data about departments of the company, data about positions in departments, as well as data about employees.
They also have read-only access to payment periods data in the company.
* Economists can manage data of payments periods in the company, as well as data about department rewards.  
They also have read-only access to departments, employees and positions data in the company.  
* Department heads can manage data of employee rewards of their department.
They have read-only access to payment periods data in the company, as well as data about their department, their department's positions and employees.
* Every user has access to their profile data and can also change their password. 