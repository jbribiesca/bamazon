# bamazon
Amazon-like application for homework.

# How to begin

This Bamazon application requires the following NPM packages (you will need to npm install):
var mysql = require("mysql");
var inquirer = require("inquirer");
var columnify = require("columnify");

This application will also require a mysql database. I have created a bamazon.sql script to help you create the database

Once configured, you will run the application by the following:

Ordering like a customer: node bamazonCustomer.js
If you are the manager, to view inventory and add inventory: node bamazonManager.js
if you are the supervisor, to view product sales and create new departments: node bamazonSupervisor.js

# Video of the application in action


