CREATE DATABASE spamazon;
USE spamazon;
CREATE TABLE products(
item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
product_name VARCHAR(256) NOT NULL,
department_name VARCHAR (100) NULL,
price FLOAT(10,2) NOT NULL,
stock_quantity INTEGER(100) NOT NULL,
PRIMARY KEY (item_id)
);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Crazy Cat Lady Action Figure", "Toys", 14.19, 400),
("Bath Buzz Caffeinated Soap", "Beauty", 11.69, 300), ("1,500 Live Ladybugs", "Food", 8.90, 200),
("Unicorns Are Jerks: A Coloring Book Exploring The Cold, Hard, Sparkly Truth", "Books", 6.99, 150),
("Canned Unicorn Meat", "Food", 14.95, 500), ("Smuggle Your Booze Tampon Flask and Funnel", "Food", 12.95, 200),
("Dancing With Cats", "Books", 10.23, 170), ("One Pound of Cereal Marshmallows", "Food", 14.99, 230),
("The Cat's Ass Salt and Pepper Shaker Set", "Home", 8.03, 160), ("Men's Handerpants", "Clothes", 10.53, 190),
("Nintendo 64 Console", "Electronics", 49.99, 100), ("Canned Spam", "Food", 4.99, 1000), ("Pre-baked Spam", "Food", 5.99, 1200),
("Spam Masterpiece", "Art", 99.99, 100), ("Spam Action Figure", "Toys", 9.99, 200), ("Spam Bar Soap", "Beauty", 3.99, 150),
("1,000 count Junk Mail", "Art", 200.00, 200), ("How to clear your spam/junk for Dummies", "Books", 16.99, 250), 
("Spam flavored scarf", "Clothes", 14.99, 350), ("Limited Edition Spam covered XBOX ONE", "Electronics", 599.99, 10), ("Iphone 8 Spam-edition", "Electronics", 1200.69, 6); 
CREATE TABLE departments(
department_id INTEGER (11) NOT NULL AUTO_INCREMENT,
department_name VARCHAR (100) NULL,
over_head_costs FLOAT(10,2) NOT NULL,
product_sales FLOAT(10,2) DEFAULT 0,
total_profit FLOAT(10,2) DEFAULT 0,
PRIMARY KEY (department_id)
);
INSERT INTO departments(department_name, over_head_costs)
VALUES("Beauty", 696.96), ("Food", 999.99), ("Books", 808.00), ("Home", 1337.69), ("Clothes", 200.49), ("Electronics", 8008.13), ("Art", 500.01), ("Toys", 600);
SELECT * FROM products;
SELECT * FROM departments;