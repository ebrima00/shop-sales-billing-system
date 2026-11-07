const express = require('express');

const router = express.Router();

const {
    createSale,
    getAllSales,
    getSaleById,
    updateSale,
    patchSale,
    deleteSale
} = require('../controllers/salesController');

// POST
router.post('/', createSale);

// GET ALL
router.get('/', getAllSales);

// GET ONE
router.get('/:id', getSaleById);

// PUT
router.put('/:id', updateSale);

// PATCH
router.patch('/:id', patchSale);

// DELETE
router.delete('/:id', deleteSale);

module.exports = router;