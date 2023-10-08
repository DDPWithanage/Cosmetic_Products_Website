const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { db, populateDatabase } = require('./db');
const productController = require('./productController');
const { updateProduct } = require('./productController');

const app = express();
app.use(express.static('images'));
require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()); 

const PORT = process.env.PORT || 8080;

//Image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'images'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Check if products table exists in the database
db.get("SELECT * FROM products", (err, row) => {
    if (!row) {
        populateDatabase(db, () => { 
            startServer(); 
        });
    } else {
        startServer();
    }
});

function startServer() {
    // API endpoint for display all products
    app.get('/api/products', (req, res) => {
        const page = req.query.page || 1; // Default to page 1 if not provided
        const pageSize = req.query.pageSize || 10; // Default to 10 items per page if not provided

        const offset = (page - 1) * pageSize; 

        const sql = 'SELECT * FROM products LIMIT ? OFFSET ?';
        const params = [pageSize, offset];
        db.all(sql, [pageSize, offset], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
            console.log('Data sent to the frontend successfully!');
        });
    });

}

//send images to frontend
app.get('/images/:filename', (req, res) => {
    const filename = req.params.filename;
    //console.log(`Requested file: ${filename}`);
    res.sendFile(path.join(__dirname, 'images', filename));
});

// API endpoint for get product details by Id
app.get('/api/products/:product_uniqueId', (req, res) => {
    const product_uniqueId = req.params.product_uniqueId;
    const sql = 'SELECT * FROM products WHERE product_uniqueId = ?';
    db.get(sql, [product_uniqueId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(row);
    });
});

// API endpoint for creating a product
app.post('/api/products', upload.single('image'), productController.createProduct);

// API endpoint for deleting a product
app.delete('/api/products/delete/:product_uniqueId', productController.deleteProduct);

// API endpoint for updating a product
app.put('/api/products/edit/:product_uniqueId', (req, res) => {
    const product_uniqueId = req.params.product_uniqueId;
    const updatedProductData = req.body;
  
    updateProduct(product_uniqueId, updatedProductData)
      .then((numUpdated) => {
        if (numUpdated > 0) {
          res.json({ message: 'Product updated successfully' });
        } else {
          res.status(404).json({ error: 'Product not found' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  });
  
  app.post('/api/products/updateImage', upload.single('image'), (req, res) => {
    const image_path = req.file.path.replace(/\\/g, '/');
    res.json({ image_path });
  });

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
