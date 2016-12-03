CREATE DATABASE spamazon;
USE spamazon;
CREATE TABLE products(
item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
product_name VARCHAR(256) NOT NULL,
department_name VARCHAR (100),
price FLOAT(10) NOT NULL,
stock_quantity INTEGER(100) NOT NULL,
PRIMARY KEY (item_id)
);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Crazy Cat Lady Action Figure", "Entertainment", 14.19, 10),
("Bath Buzz Caffeinated Soap", "Beauty", 11.69, 15), ("1,500 Live Ladybugs", "Food", 8.90, 5),
("Unicorns Are Jerks: A Coloring Book Exploring The Cold, Hard, Sparkly Truth", "Books", 6.99, 15),
("Canned Unicorn Meat", "Food", 14.95, 50), ("Smuggle Your Booze Tampon Flask and Funnel", "Food", 12.95, 20),
("Dancing With Cats", "Book", 10.23, 17), ("One Pound of Cereal Marshmallows", "Food", 14.99, 23),
("The Cat's Ass Salt and Pepper Shaker Set", "Home", 8.03, 8), ("Men's Handerpants", "Clothes", 10.53, 19); 
SELECT * FROM products;