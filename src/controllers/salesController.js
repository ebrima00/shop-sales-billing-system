const prisma = require('../config/prisma');
const { Prisma } = require('@prisma/client');

// POST - Create Sale
const createSale = async (request, response) => {
    try {
        const { productId, quantity } = request.body;

        const id = Number(productId);
        const qty = Number(quantity);

        if (!Number.isInteger(id) || id <= 0 ||
            !Number.isInteger(qty) || qty <= 0) {
            return response.status(400).json({
                message: "Valid product ID and quantity are required"
            });
        }

        const sale = await prisma.$transaction(async (tx) => {

            const product = await tx.product.findUnique({
                where: { id }
            });

            if (!product) {
                throw new Error("PRODUCT_NOT_FOUND");
            }

            const stock = await tx.product.updateMany({
                where: {
                    id,
                    quantity: { gte: qty }
                },
                data: {
                    quantity: { decrement: qty }
                }
            });

            if (stock.count === 0) {
                throw new Error("INSUFFICIENT_STOCK");
            }

            const unitPrice = new Prisma.Decimal(product.price);
            const totalAmount = unitPrice.mul(qty);

            return await tx.sale.create({
                data: {
                    productId: id,
                    quantity: qty,
                    unitPrice,
                    totalAmount
                },
                include: {
                    product: true
                }
            });
        });

        response.status(201).json({
            message: "Sale recorded successfully",
            sale
        });

    } catch (error) {
        response.status(
            error.message === "PRODUCT_NOT_FOUND" ? 404 :
            error.message === "INSUFFICIENT_STOCK" ? 400 : 500
        ).json({
            message: error.message === "PRODUCT_NOT_FOUND"
                ? "Product not found"
                : error.message === "INSUFFICIENT_STOCK"
                ? "Insufficient product stock"
                : "Error recording sale",
            error: error.message
        });
    }
};


// GET - Get All Sales
const getAllSales = async (request, response) => {
    try {
        const sales = await prisma.sale.findMany({
            include: {
                product: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        response.json(sales);

    } catch (error) {
        response.status(500).json({
            message: "Error fetching sales",
            error: error.message
        });
    }
};


// GET - Get One Sale
const getSaleById = async (request, response) => {
    try {
        const id = Number(request.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return response.status(400).json({
                message: "Invalid sale ID"
            });
        }

        const sale = await prisma.sale.findUnique({
            where: { id },
            include: {
                product: true
            }
        });

        if (!sale) {
            return response.status(404).json({
                message: "Sale not found"
            });
        }

        response.json(sale);

    } catch (error) {
        response.status(500).json({
            message: "Error fetching sale",
            error: error.message
        });
    }
};


// PUT - Update Entire Sale
const updateSale = async (request, response) => {
    try {
        const id = Number(request.params.id);
        const productId = Number(request.body.productId);
        const quantity = Number(request.body.quantity);

        if (!Number.isInteger(id) || id <= 0 ||
            !Number.isInteger(productId) || productId <= 0 ||
            !Number.isInteger(quantity) || quantity <= 0) {
            return response.status(400).json({
                message: "Valid sale ID, product ID and quantity are required"
            });
        }

        const sale = await prisma.$transaction(async (tx) => {

            const oldSale = await tx.sale.findUnique({
                where: { id }
            });

            if (!oldSale) {
                throw new Error("SALE_NOT_FOUND");
            }

            const product = await tx.product.findUnique({
                where: { id: productId }
            });

            if (!product) {
                throw new Error("PRODUCT_NOT_FOUND");
            }

            // Restore previous stock
            await tx.product.update({
                where: { id: oldSale.productId },
                data: {
                    quantity: {
                        increment: oldSale.quantity
                    }
                }
            });

            // Deduct new quantity
            const stock = await tx.product.updateMany({
                where: {
                    id: productId,
                    quantity: { gte: quantity }
                },
                data: {
                    quantity: { decrement: quantity }
                }
            });

            if (stock.count === 0) {
                throw new Error("INSUFFICIENT_STOCK");
            }

            const unitPrice = new Prisma.Decimal(product.price);

            return await tx.sale.update({
                where: { id },
                data: {
                    productId,
                    quantity,
                    unitPrice,
                    totalAmount: unitPrice.mul(quantity)
                },
                include: {
                    product: true
                }
            });
        });

        response.json({
            message: "Sale updated successfully",
            sale
        });

    } catch (error) {
        const status =
            error.message === "SALE_NOT_FOUND" ||
            error.message === "PRODUCT_NOT_FOUND" ? 404 :
            error.message === "INSUFFICIENT_STOCK" ? 400 : 500;

        response.status(status).json({
            message: error.message
        });
    }
};


// PATCH - Update Sale Quantity
const patchSale = async (request, response) => {
    try {
        const id = Number(request.params.id);
        const quantity = Number(request.body.quantity);

        if (!Number.isInteger(id) || id <= 0 ||
            !Number.isInteger(quantity) || quantity <= 0) {
            return response.status(400).json({
                message: "Valid sale ID and quantity are required"
            });
        }

        const sale = await prisma.$transaction(async (tx) => {

            const oldSale = await tx.sale.findUnique({
                where: { id }
            });

            if (!oldSale) {
                throw new Error("SALE_NOT_FOUND");
            }

            const difference = quantity - oldSale.quantity;

            if (difference > 0) {

                const stock = await tx.product.updateMany({
                    where: {
                        id: oldSale.productId,
                        quantity: { gte: difference }
                    },
                    data: {
                        quantity: { decrement: difference }
                    }
                });

                if (stock.count === 0) {
                    throw new Error("INSUFFICIENT_STOCK");
                }

            } else if (difference < 0) {

                await tx.product.update({
                    where: { id: oldSale.productId },
                    data: {
                        quantity: {
                            increment: Math.abs(difference)
                        }
                    }
                });
            }

            return await tx.sale.update({
                where: { id },
                data: {
                    quantity,
                    totalAmount: oldSale.unitPrice.mul(quantity)
                },
                include: {
                    product: true
                }
            });
        });

        response.json({
            message: "Sale updated successfully",
            sale
        });

    } catch (error) {
        response.status(
            error.message === "SALE_NOT_FOUND" ? 404 :
            error.message === "INSUFFICIENT_STOCK" ? 400 : 500
        ).json({
            message: error.message
        });
    }
};


// DELETE - Delete Sale
const deleteSale = async (request, response) => {
    try {
        const id = Number(request.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return response.status(400).json({
                message: "Invalid sale ID"
            });
        }

        await prisma.$transaction(async (tx) => {

            const sale = await tx.sale.findUnique({
                where: { id }
            });

            if (!sale) {
                throw new Error("SALE_NOT_FOUND");
            }

            // Restore product stock
            await tx.product.update({
                where: { id: sale.productId },
                data: {
                    quantity: {
                        increment: sale.quantity
                    }
                }
            });

            await tx.sale.delete({
                where: { id }
            });
        });

        response.json({
            message: "Sale deleted successfully"
        });

    } catch (error) {
        response.status(
            error.message === "SALE_NOT_FOUND" ? 404 : 500
        ).json({
            message: error.message === "SALE_NOT_FOUND"
                ? "Sale not found"
                : "Error deleting sale"
        });
    }
};


module.exports = {
    createSale,
    getAllSales,
    getSaleById,
    updateSale,
    patchSale,
    deleteSale
};