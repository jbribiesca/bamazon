var mysql = require("mysql");
var inquirer = require("inquirer");
var columnify = require("columnify");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "789fwhsm38",
    database: "bamazon"
});

var departmentObj = [];

connection.connect(function (err) {
    start()
});

function CreateDept(id, deptname, overhead, sales, profit){
    this.id = id;
    this.deptname = deptname;
    this.overhead = overhead;
    this.sales = sales;
    this.profit = profit;
}

function start() {
    readProducts();
    inquirer
        .prompt([
            {
                name: "menu",
                type: "list",
                message: "Would you like to do?",
                choices: ["View Product Sales by Department", "Create New Department"]
            }
        ])
        .then(function (answer) {
            if (answer.menu === "View Product Sales by Department") {
                listProducts();

            } else if (answer.menu === "Create New Department") {
                addDepartment();

            } 
        })
}

function readProducts() {
    departmentObj = [];
    connection.query("select departments.department_id,departments.department_name, departments.over_head_costs ,products.product_sales from departments inner join products where departments.department_name=products.department_name group by department_name", function (err, res) {
        res.forEach(element => {
            var profit = element.product_sales - element.over_head_costs 
            var newDepartments = new CreateDept(element.department_id, element.department_name, element.over_head_costs, element.product_sales, profit)
            departmentObj.push(newDepartments)
        });
    });
}

function listProducts() {

    console.log(columnify(departmentObj))

    start();
}

function addDepartment() {
    inquirer
        .prompt([
            {
                name: "adddept",
                type: "input",
                message: "What is the name of the deparment you would like to add?"
            },
            {
                name: "overhead",
                type: "input",
                message: "What is your over head costs?",
            }
        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO departments SET ?",
                {
                    department_name: answer.adddept,
                    over_head_costs: parseInt(answer.overhead),
                },
                function () {
                    start();
                }
            );
        })
}