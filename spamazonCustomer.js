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
		head: ["ID", "Product Name", "Department Name", "Price", "Stock Quantity"]
		, colWidths: [5, 45, 18, 10, 18]
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
		//run customer prompt function to ask what they would like to do
		customerPrompt(response);
	});
};
//Run show table function on start
showTable();
//customer prompt function to ask what ID and how many units to buy
var customerPrompt = function(response){
	inquirer.prompt([
	{
		type: "input",
		message: "Input the ID of the product you would like to buy.",
		name: "customerInput",
		//validate to get only numbers
		validate: function(value) {
	      if (isNaN(value) === false) {
	        return true;
	      } else
	      return false;
	    }
	},
	{
		type: "input",
		message: "How many units would you like to buy?",
		name: "customerAmount",
		validate: function(value) {
	      if (isNaN(value) === false) {
	        return true;
	      }
	      return false;
	    }
	}]).then(function(customer){
		//store customerinput and customer amount into variables for easy typing
		var theInput = customer.customerInput;
		var theAmount = customer.customerAmount;
		//if user doesn't type anything for an input, shoot a console log
		if(theInput.trim() === "" || theAmount.trim() === ""){
			console.log("You did not input anything into one of the fields. Do it again, but better.");
			console.log("-------------------");
			customerPrompt(response);
		} else
		//if user types a 0 for an input, shoot a console log
		if(theInput.trim() === "0" || theAmount.trim() === "0"){
			console.log("You put 0 into a field.. why??");
			console.log("-------------------");
			customerPrompt(response);
		} else
		//if user types an ID that is invalid, shoot a console log
		if(theInput.trim() > response.length){
			console.log("The ID you input is invalid. There is no such item.");
			console.log("-------------------");
			customerPrompt(response);
		} else
		//if user types a quantity greater than the stock, shoot a console
		if(theAmount.trim() > response[theInput-1].stock_quantity){
			console.log("There is not enough inventory for your purchase.");
			console.log("-------------------");
			customerPrompt(response);
		} else {
			//else subtract the stock quantity from customer amount
			var remainingStock = response[theInput-1].stock_quantity - theAmount.trim();
			//calculate how much the products cost
			var howMuchDat = theAmount.trim() * response[theInput-1].price;
			console.log("Your purchase of " + theAmount.trim() + " " + response[theInput-1].product_name + "(s) was $" + howMuchDat + ".");
			console.log("-------------------");
			//run customerTransaction function to update the database
			customerTransaction(remainingStock, theInput);
		}
	});
};
//customer Transaction function updates the database and prompts the user if they want to do another purchase
var customerTransaction = function(remainingStock, theInput){
	//Update the products table to change the stock quantity where an item id matches the user input
	var query = "UPDATE products SET ? WHERE ?";
	connection.query(query, [{stock_quantity: remainingStock}, {item_id: (theInput)}], function(err, res){
		if (err) throw err;
	});
	//prompt if they want to purchase another item
	inquirer.prompt([
	{
		type: "confirm",
		message: "Would you like to purchase another item?",
		name: "anotherPurchase"
	}]).then(function(another){
		//if yes, show table and recurse through the functions again
		if(another.anotherPurchase){
			showTable();
		} else{
			console.log("Thank you for your purchase today! Please come again!");
			console.log("-------------------");
			endTransaction();
		}
	});
};
//end connection function to prevent connection ending prematurely
var endTransaction = function(){
	connection.end();
}