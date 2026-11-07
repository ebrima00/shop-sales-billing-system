const prisma = require('../config/prisma');

// POST - Create a product
const createProduct = async (request, response) => {
    try {
        const { name, price, quantity } = request.body;

        if (!name || price === undefined || quantity === undefined) {
            return response.status(400).json({
                message: "All fields are required"
            });
        }

        const product = await prisma.product.create({
            data: {
                name,
                price: Number(price),
                quantity: Number(quantity)
            }
        });

        response.status(201).json({
            message: "Product created successfully",
            product
        });

    } catch (error) {
        response.status(500).json({
            message: "Error creating product",
            error: error.message
        });
    }
};


// GET - Get all products
const getAllProducts = async (request, response) => {
    try {
        const products = await prisma.product.findMany();

        response.json(products);

    } catch (error) {
        response.status(500).json({
            message: "Error fetching products",
            error: error.message
        });
    }
};


// GET - Get one product
const getProductById = async (request, response) => {
    try {
        const id = Number(request.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return response.status(400).json({
                message: "Invalid product ID"
            });
        }

        const product = await prisma.product.findUnique({
            where: { id }
        });

        if (!product) {
            return response.status(404).json({
                message: "Product not found"
            });
        }

        response.json(product);

    } catch (error) {
        response.status(500).json({
            message: "Error fetching product",
            error: error.message
        });
    }
};


// PUT - Update entire product
const updateProduct = async (request, response) => {
    try {
        const id = Number(request.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return response.status(400).json({
                message: "Invalid product ID"
            });
        }

        const { name, price, quantity } = request.body;

        if (!name || price === undefined || quantity === undefined) {
            return response.status(400).json({
                message: "Name, price and quantity are required"
            });
        }

        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                price: Number(price),
                quantity: Number(quantity)
            }
        });

        response.json({
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        response.status(error.code === 'P2025' ? 404 : 500).json({
            message: error.code === 'P2025'
                ? "Product not found"
                : "Error updating product"
        });
    }
};


// PATCH - Update specific product details
const patchProduct = async (request, response) => {
    try {
        const id = Number(request.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return response.status(400).json({
                message: "Invalid product ID"
            });
        }

        const { name, price, quantity } = request.body;

        const data = {};

        if (name !== undefined) data.name = name;
        if (price !== undefined) data.price = Number(price);
        if (quantity !== undefined) data.quantity = Number(quantity);

        if (Object.keys(data).length === 0) {
            return response.status(400).json({
                message: "Provide at least one field to update"
            });
        }

        if (
            (data.name !== undefined && !data.name.trim()) ||
            (data.price !== undefined && (!Number.isFinite(data.price) || data.price < 0)) ||
            (data.quantity !== undefined && (!Number.isInteger(data.quantity) || data.quantity < 0))
        ) {
            return response.status(400).json({
                message: "Invalid product information"
            });
        }

        const product = await prisma.product.update({
            where: { id },
            data
        });

        response.json({
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        response.status(error.code === 'P2025' ? 404 : 500).json({
            message: error.code === 'P2025'
                ? "Product not found"
                : "Error updating product"
        });
    }
};


// DELETE - Delete a product
const deleteProduct = async (request, response) => {
    try {
        const id = Number(request.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return response.status(400).json({
                message: "Invalid product ID"
            });
        }

        await prisma.product.delete({
            where: { id }
        });

        response.json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        response.status(error.code === 'P2025' ? 404 : 500).json({
            message: error.code === 'P2025'
                ? "Product not found"
                : "Error deleting product"
        });
    }
};


module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    patchProduct,
    deleteProduct
};