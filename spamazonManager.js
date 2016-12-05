//Require 3 npm packages: mysql, cli-table, and inquirer
var mysql = require("mysql");
var Table = require('cli-table');
var inquirer = require("inquirer");
//connection mysql server
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "root",
	database: "spamazon"
});
//connecting to server, throw err if there is an err
connection.connect(function(err){
	if (err) throw err;
	//console.log("connected as id " + connection.threadId);
});
//Show table function
var showTable = function(){
	var table = new Table({
		head: ["ID", "Product Name", "Department Name", "Price ($)", "Stock Quantity"]
		, colWidths: [5, 45, 18, 13, 18]
	});
	//mysql query to select all of the items in the database
	connection.query("SELECT * FROM products", function(error, response){
		if(error) throw error;
		//console.log(response);
		for(var i = 0; i < response.length; i++){
			table.push([response[i].item_id, response[i].product_name, response[i].department_name, response[i].price, response[i].stock_quantity]);		
		}
		//print all items and columns into cli-table
		console.log(table.toString());
		//ask if user wants to do more manager stuff
		doMoreManagerStuffs();
	});
};
//function to check if there are any products < 6 items
var viewLowInventory = function(){
	connection.query("SELECT * FROM products WHERE stock_quantity BETWEEN 0 and 5", function(error, managerResponse){
		if(error) throw error;
		//Check if there are no items below 6 inventory
		if(managerResponse.length < 1){
			console.log("There are no items that are low inventory");
			console.log("-------------------");
			doMoreManagerStuffs();
		}else{
			var table = new Table({
				head: ["ID", "Product Name", "Department Name", "Price ($)", "Stock Quantity"]
				, colWidths: [5, 45, 18, 13, 18]
			});
			for(var i = 0; i < managerResponse.length; i++){
				table.push([managerResponse[i].item_id, managerResponse[i].product_name, managerResponse[i].department_name, managerResponse[i].price, managerResponse[i].stock_quantity]);		
			}
			//print all items and columns into cli-table
			console.log(table.toString());
			doMoreManagerStuffs();
		}
	});
}
//function to add more stock to an existing item
var addInventory = function(){
	connection.query("SELECT * FROM products", function(err,res){
	inquirer.prompt([
	{
		type: "input",
		message: "Input the ID of the product you would like to restock.",
		name: "addStock",
		validate: function(value){
			if(isNaN(value) === false){
				return true;
			} else{
				return false;
			}
		}
	},
	{
		type: "input",
		message: "How many units would you like to add to the inventory?",
		name: "addAmnt",
		validate: function(value){
			if(isNaN(value)===false){
				return true;
			} else {
				return false;
			}
		}
	}]).then(function(add){
		var addInput = add.addStock;
		var addAmount = add.addAmnt;
		if(addInput.trim() === "" || addAmount.trim() === ""){
			console.log("You did not input anything into one of the fields. Do it again, but better.");
			console.log("-------------------");
			addInventory();
		} else 
		if(addInput.trim() === "0" || addAmount.trim() === "0"){
			console.log("You put 0 into a field.. why??");
			console.log("-------------------");
			addInventory();
		} else
		if(addInput.trim() > res.length){
			console.log("There is no item with that ID. Try again maybe?");
			console.log("-------------------");
			addInventory();
		} else{
			var query = "SELECT * FROM products WHERE ?";
			connection.query(query, {item_id: addInput}, function(error, response){
				if (error) throw error;
				var newStock = parseInt(addAmount.trim()) + response[0].stock_quantity;
				connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newStock}, {item_id: addInput}], function(err, res){
					if (err) throw err;

					doMoreManagerStuffs();
				});
			});
		}
	});	
	});
	
};
//function to add new products to inventory
var addProduct = function(){
	var departmentArray = [];
	connection.query("SELECT department_name FROM departments", function(error,response){
		if (error) throw error;
		for(var i = 0; i < response.length;i++){
			departmentArray.push(response[i].department_name);
		}
	});
	inquirer.prompt([
	{
		type: "input",
		message: "What is the product name?",
		name: "newName"
	},
	{
		type: "list",
		message: "Which department does the item belong to?",
		choices: departmentArray,
		name: "newDepartment"
	},
	{
		type: "input",
		message: "What is the price on each product?",
		name: "newPrice",
		validate: function(value){
			if(isNaN(value) === false){
				return true;
			} else{
				return false;
			}
		}
	},
	{
		type: "input",
		message: "How many products do you want to put on inventory?",
		name: "newStock",
		validate: function(value){
			if(isNaN(value) === false){
				return true;
			} else{
				return false;
			}
		}
	}]).then(function(anew){
		if(anew.newName.trim() === "" || anew.newPrice.trim() === "" || anew.newStock.trim() === ""){
			console.log("One of the input fields are blank. Are you sure you're a manager?");
			console.log("-------------------");
			addProduct();
		} else
		if(anew.newPrice.trim() === "0" || anew.newStock.trim() === "0"){
			console.log("One of the input fields has a 0. Are you sure you're a manager?");
			console.log("-------------------");
			addProduct();
		} else{
			//insert into products table values of product name, department name, price, stock quantity
			connection.query("INSERT INTO products SET ?", {
				product_name: anew.newName.trim(),
				department_name: anew.newDepartment.trim(),
				price: anew.newPrice.trim(),
				stock_quantity: anew.newStock.trim()
			}, function(err, res){
				if (err) throw err;
				console.log("A new product has been added!");
				console.log("-------------------");
				doMoreManagerStuffs();
			});
		}
	})
};
//end connection if user says no
var endManager = function(){
	connection.end();
};
//does the user want to do more manager actions?
var doMoreManagerStuffs = function(){
	inquirer.prompt([
	{
		type: "confirm",
		message: "Would you like to do other managerial duties?",
		name: "moreManager"
	}]).then(function(more){
		if(more.moreManager){
			managerDuties();	
		}else{
			endManager();
		}
	});
};
//Initial prompt of duties the manager can do
var managerDuties = function(){
	inquirer.prompt([
	{
		type: "list",
		message: "What would you like to do?",
		choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
		name: "managerduty"
	}]).then(function(manager){
		if(manager.managerduty === "View Products for Sale"){
			showTable();
		}
		if(manager.managerduty === "View Low Inventory"){
			viewLowInventory();
		}
		if(manager.managerduty === "Add to Inventory"){
			addInventory();
		}
		if(manager.managerduty === "Add New Product"){
			addProduct();
		}
	});
};
//display on initial run
console.log("Greetings Manager. How are you doing?");
managerDuties();