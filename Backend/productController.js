const { db,} = require('./db');

function createProduct(req, res) {
  const {
    product_id,
    product_name,
    product_category,
    product_description,
    directions,
    price,
    in_stock
  } = req.body;

    const splitValue = req.file.path.split('\\');
    //console.log(splitValue);
    const image_path = splitValue.slice(splitValue.indexOf('images')).join('\\').replace(/\\/g, '/');
    console.log(image_path)

  const sql =
    'INSERT INTO products (product_id, product_name, product_category, product_description, directions, price, in_stock, image_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const params = [
    product_id,
    product_name,
    product_category,
    product_description,
    directions,
    price,
    in_stock,
    image_path
  ];

  db.run(sql, params, function (err) {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Product created successfully', productId: this.lastID });
  });
}


function deleteProductById(product_uniqueId) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM products WHERE product_uniqueId = ?';
      db.run(sql, [product_uniqueId], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
  }
  
  function deleteProduct(req, res) {
    const product_uniqueId = req.params.product_uniqueId;
  
    deleteProductById(product_uniqueId)
      .then((numDeleted) => {
        if (numDeleted > 0) {
          res.json({ message: 'Product deleted successfully' });
        } else {
          res.status(404).json({ error: 'Product not found' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  }

  function updateProduct(product_uniqueId, updatedData) {
    return new Promise((resolve, reject) => {
      const sql =
        'UPDATE products SET product_id = ?, product_name = ?, product_category = ?, product_description = ?, directions = ?, price = ?, in_stock = ?, image_path = ? WHERE product_uniqueId = ?';
      const params = [
        updatedData.product_id,
        updatedData.product_name,
        updatedData.product_category,
        updatedData.product_description,
        updatedData.directions,
        updatedData.price,
        updatedData.in_stock,
        updatedData.image_path,
        product_uniqueId
      ];
  
      db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
  }
  
module.exports = {
  createProduct, deleteProduct, updateProduct
};
