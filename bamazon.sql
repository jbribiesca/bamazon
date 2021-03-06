DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT default 0,
  product_sales DECIMAL(10,2) NULL,
  PRIMARY KEY (item_id)
);

create TABLE departments(
	department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(45) NOT NULL,
    over_head_costs INT NULL,
    PRIMARY KEY (department_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("42 inch Sony 4K TV", "Electronics", 499.98, 100),
("Bamazon Echo", "Electronics", 79.99, 100),
("Bamazon Dot", "Electronics", 29.99, 50),
("Crocs", "Fashion", 19.97, 60);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Electronics", "100"),
("Fashion", "100")

