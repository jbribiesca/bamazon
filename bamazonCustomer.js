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

var itemNum = [];

connection.connect(function (err) {
    readProducts();
});

function readProducts() {
    console.log("Selecting all products in Bamazon!...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        res.forEach(element => {
            console.log("ITEM ID: " + element.item_id + " -- " + "PRODUCT: " + element.product_name + " -- " + "PRICE: " + element.price + "\n");
            itemNum.push(element.item_id);
        });
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
                    if (itemNum.includes(parseInt(value))) {
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
    connection.query("SELECT * FROM products WHERE item_id=?", [tmpid], function (err, res) {
        var actualQty = res[0].stock_quantity
        var price = res[0].price
        var itemName = res[0].product_name
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
    });
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