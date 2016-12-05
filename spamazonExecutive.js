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
//function to update the product sales column
var updateProductSales = function(){
	connection.query("SELECT * FROM departments", function(erra, res){
		if (erra) throw erra;
		for(var i = 0; i < res.length; i++){
			if(res[i].product_sales === 0){
				var zeroProfitLoser = -(res[i].over_head_costs);
				//sql query to update department's total profit column at the input department name
				connection.query("UPDATE departments SET ? WHERE ?", [{total_profit:zeroProfitLoser}, {department_name:res[i].department_name}], function(errr, ress){
					if (errr) throw errr;
				});
			} else{
				var datProfitBaby = res[i].product_sales - res[i].over_head_costs;
				connection.query("UPDATE departments SET ? WHERE ?", [{total_profit: datProfitBaby}, {department_name: res[i].department_name}], function(error, response){
					if (error) throw error;
				});
			}
		}
	});
}
//function to view the table 
var viewSales = function(){
	var table = new Table({
		head: ["Department ID", "Department Name", "Over Head Costs ($)", "Product Sales ($)", "Total Profit ($)"]
		, colWidths: [15, 18, 21, 19, 18]
	});
	connection.query("SELECT * FROM departments", function(err, res){
		if (err) throw err;
		for(var i = 0; i < res.length; i++){
			table.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, res[i].total_profit]);
		}
		console.log(table.toString());
		executivePlatinum();
	});
};
//function to add a new department to the table
var addDepartment = function(){
	inquirer.prompt([
	{
		type: "input",
		message: "Input Department Name: ",
		name: "inputName"
	},
	{
		type: "input",
		message: "Input Over Head Costs: ",
		name: "inputOver",
		validate: function(value) {
	      if (isNaN(value) === false) {
	        return true;
	      } else
	      return false;
	    }
	}]).then(function(newDepartment){
		var depName = newDepartment.inputName;
		var depOver = newDepartment.inputOver;
		if(depName.trim() === "" || depOver.trim() === ""){
			console.log("You did not input anything into one of the fields. Do it again, but better.");
			console.log("-------------------");
			addDepartment();
		} else
		if(depOver.trim() === "0"){
			console.log("Over Head Costs can't be 0... It costs money to make the products.");
			console.log("-------------------");
			addDepartment();
		} else{
			connection.query("SELECT * FROM departments", function(err,res){
				if (err) throw err;
				//sql query to select all from departments where the department name matches the input
				connection.query("SELECT * FROM departments WHERE department_name = ?", [depName.trim()], function(error, response){
					if (error) throw error;
					//if there is no department with that name, insert it as a new row
					if(response[0] === undefined){
						connection.query("INSERT INTO departments SET ?", {department_name: depName.trim(), over_head_costs: depOver.trim()}, function(erro,reso){
							if (erro) throw erro;
							console.log("Added a new department!");
							console.log("-------------------");
							var zeroProfitLoser = -(depOver.trim());
							connection.query("UPDATE departments SET ? WHERE ?", [{total_profit:zeroProfitLoser}, {department_name:depName.trim()}], function(errr, ress){
								if (errr) throw errr;
							});
							executivePlatinum();
						});
					} else{
						//else, console log that there is already a department with that name
						console.log("There is already a department with that name. Choose another name.");
						console.log("-------------------");
						addDepartment();
					}
				});
			});
		}
	});
};
//function to prompt users what to do
var executivePlatinum = function(){
	inquirer.prompt([
	{
		type: "list",
		message: "What would you like to do?",
		choices: ["View Product Sales by Department", "Create New Department", "Sign Off"],
		name: "executiveChoices"
	}]).then(function(executive){
		if(executive.executiveChoices === "View Product Sales by Department"){
			viewSales();
		}
		if(executive.executiveChoices === "Create New Department"){
			addDepartment();
		}
		if(executive.executiveChoices === "Sign Off"){
			console.log("Executive Platinum member signed off\n----------------------");
			connection.end();
		}
	})
}
//On start, run console logs and functions
console.log("Greetings Executive Platinum member. How are you doing today?");
console.log("-------------------");
updateProductSales();
executivePlatinum();