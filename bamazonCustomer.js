var mysql = require("mysql");
var inquirer = require("inquirer");
var columnify = require("columnify")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "789fwhsm38",
    database: "bamazon"
});

var products = [];

connection.connect(function (err) {
    readProducts();
});

function CreateItem(id, productname, department, price, qty) {
    this.id = id;
    this.productname = productname;
    this.department = department;
    this.price = price;
    this.qty = qty;
}

var search = what => products.find(element => element.id === what);

function readProducts() {
    console.log("Selecting all products in Bamazon!...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        res.forEach(element => {
            var newProduct = new CreateItem(element.item_id, element.product_name, element.department_name, element.price, element.stock_quantity)
            products.push(newProduct)
        });
        console.log(columnify(products))
        buyProducts();
    });
}

function buyProducts() {
    inquirer
        .prompt([
            {
                name: "itemid",
                type: "input",
                message: "What is the Item ID of the product you would like to buy?",
                validate: function (value) {
                    if (search(parseInt(value))) {
                        return true;
                    } console.log("\nPlease enter a valid Item ID!!");
                }
            },
        ])
        .then(function (answer) {
            checkInventory(answer.itemid);
        })
}

function checkInventory(tmpid) {
    var productObj = products.find(item => item.id === parseInt(tmpid));
    var actualQty = productObj.qty
    var price = productObj.price
    var itemName = productObj.productname
    inquirer
        .prompt([
            {
                name: "itemqty",
                type: "input",
                message: "How many " + itemName + "(s) would you like to buy?",
                validate: function (value) {
                    if (value <= actualQty) {
                        return true;
                    } console.log("\nInsufficient quantity! We only have " + actualQty + " left!")
                }
            }
        ])
        .then(function (answer) {
            updateInventory(tmpid, answer.itemqty, actualQty, price);
        })
}

function updateInventory(tmpid, tmpqty, actualQty, price) {
    var newQty = actualQty - tmpqty
    var totalSale = tmpqty * price
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
            if (error) throw err;
            console.log("Total Sale: $" + totalSale);
        }
    );
    connection.end();
}