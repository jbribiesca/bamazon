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

var products = [];
var departments = [];

connection.connect(function (err) {
    start()
});

function CreateItem(id, productname, department, price, qty) {
    this.id = id;
    this.productname = productname;
    this.department = department;
    this.price = price;
    this.qty = qty;
}


var search = what => products.find(element => element.id === what);

function start() {
    readProducts();
    inquirer
        .prompt([
            {
                name: "menu",
                type: "list",
                message: "Would you like to do?",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
            }
        ])
        .then(function (answer) {
            if (answer.menu === "View Products for Sale") {
                listProducts();

            } else if (answer.menu === "View Low Inventory") {
                lowInventory();

            } else if (answer.menu === "Add to Inventory") {
                addInventory();

            } else if (answer.menu === "Add New Product") {
                addProduct();
            }
        })
}

function readProducts() {
    products = [];
    connection.query("SELECT * FROM products", function (err, res) {
        res.forEach(element => {
            var newProduct = new CreateItem(element.item_id, element.product_name, element.department_name, element.price, element.stock_quantity)
            products.push(newProduct);
        });
    });
    departments = [];
    connection.query("SELECT * FROM departments", function (err, res) {
        res.forEach(element => {
            var newDepartment = element.department_name
            departments.push(newDepartment);
        });
    });
}

function listProducts() {
    console.log(columnify(products))
    start();
}

function lowInventory() {
    var productObj = products.filter(item => item.qty <= 5);
    if (productObj) {
        console.log(columnify(productObj))
    } else console.log("No low inventory, get to selling!")
    start();
}

function addInventory() {
    inquirer
        .prompt([
            {
                name: "addinventory",
                type: "input",
                message: "\nWhat item would you like to add inventory too?",
                validate: function (value) {
                    if (search(parseInt(value))) {
                        return true;
                    } console.log("\nItem does not exist in database!")
                }
            }
        ])
        .then(function (answer) {
            updateInventory(answer.addinventory);
        })
}

function updateInventory(tmpid) {
    var productObj = products.find(item => item.id === parseInt(tmpid));
    inquirer
        .prompt([
            {
                name: "updateqty",
                type: "input",
                message: "How many more " + productObj.productname + " would you like to add?",

            }
        ])
        .then(function (answer) {
            var newQty = parseInt(productObj.qty) + parseInt(answer.updateqty)
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: newQty
                    },
                    {
                        item_id: tmpid
                    }
                ],
                function (error) {
                    if (error) throw error;
                }
            );
            start();
        })
}

function addProduct() {
    inquirer
        .prompt([
            {
                name: "addname",
                type: "input",
                message: "What is the name of the product you would like to sell?"
            },
            {
                name: "department",
                type: "list",
                message: "What department does this item belong in?",
                choices: function(){
                    return departments
                }

            },
            {
                name: "price",
                type: "input",
                message: "Wbat is the price?"
            },
            {
                name: "qty",
                type: "input",
                message: "What is the quantity?"
            }
        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.addname,
                    department_name: answer.department,
                    price: parseFloat(answer.price),
                    stock_quantity: parseInt(answer.qty)
                },
                function () {
                    start();
                }
            );
        })
}