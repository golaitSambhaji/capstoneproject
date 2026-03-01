
CREATE DATABASE ecommerce;

USE ecommerce;

CREATE TABLE products (
 id INT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(255),
 price DECIMAL(10,2),
 stock INT
);

CREATE TABLE orders (
 id INT AUTO_INCREMENT PRIMARY KEY,
 product_id INT,
 quantity INT,
 status VARCHAR(50),
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory (
 product_id INT PRIMARY KEY,
 stock INT
);
