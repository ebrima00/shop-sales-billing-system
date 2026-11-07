const express = require('express');

const router = express.Router();

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    patchProduct,
    deleteProduct
} = require('../controllers/productController');


// POST - Create product
router.post('/', createProduct);

// GET - Get all products
router.get('/', getAllProducts);

// GET - Get one product
router.get('/:id', getProductById);

// PUT - Update product
router.put('/:id', updateProduct);

// PATCH - Update specific product details
router.patch('/:id', patchProduct);

// DELETE - Delete product
router.delete('/:id', deleteProduct);


module.exports = router;