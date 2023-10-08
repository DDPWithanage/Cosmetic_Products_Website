const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const csv = require('csv-parser');
require('dotenv').config();
const dbPath = process.env.DB_PATH;

//Connected to the database
const db = new sqlite3.Database(`${dbPath}`, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the database');
});

function populateDatabase() {
    const products = [];

    fs.createReadStream('products.csv')
    .pipe(csv())
    .on('data', (row) => {
        const product = {
        product_uniqueId: row.product_uniqueId,    
        product_id: row.product_id,
        product_name: row.product_name,
        product_category: row.product_category,
        product_description: row.product_description,
        directions: row.directions,
        price: row.price,
        in_stock: row.in_stock,
        image_filename: row.image_filename
        };
        products.push(product);
    })
    .on('end', () => {
        products.forEach(product => {
        const imagePath = `images/${product.image_filename}`;
        db.run('INSERT INTO products (product_uniqueId, product_id, product_name, product_category, product_description, directions, price, in_stock, image_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [product.product_uniqueId, product.product_id, product.product_name, product.product_category, product.product_description, product.directions, product.price, product.in_stock, imagePath],
            function(err) {
                if (err) {
                    return console.error(err.message);
                }
            });
        });
        console.log(`Data has been successfully inserted to the Database`);
        db.close();
    }); 
}

module.exports = { db, populateDatabase };
