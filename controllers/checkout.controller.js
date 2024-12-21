const express = require('express');
const orderModel = require("../models/order.model");

const router = express.Router();

// Render checkout page
router.get('/checkout', (req, res) => {
    res.render('checkoutForm', {
        error: null, // No error by default
        cart: req.session.cart || [], // Retrieve cart details from session
        totalAmount: req.session.totalAmount || 0, // Retrieve total amount from session
    });
});

// Handle checkout form submission
router.post('/checkout', async (req, res) => {
    const { country, city, address, payment } = req.body;

    // Assuming a logged-in user is available
    const buyer = req.user?._id; // Replace with actual logic to retrieve user ID

    // Validation
    if (!buyer || !country || !city || !address || !payment) {
        return res.status(400).render('checkoutForm', {
            error: 'All fields are required.',
            cart: req.session.cart || [],
            totalAmount: req.session.totalAmount || 0,
        });
    }

    try {
        // Prepare order data
        const orderData = {
            buyer,
            products: req.session.cart.map(item => ({
                product: item.productId,
            })),
            totalAmount: req.session.totalAmount,
            location: {
                country,
                city,
                address,
            },
        };

        // Save order to database
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Clear session/cart after successful order
        req.session.cart = [];
        req.session.totalAmount = 0;

        // Render success page
        res.render('success', { name: req.user?.name || 'Customer' });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).render('checkoutForm', {
            error: 'An error occurred while processing your order. Please try again.',
            cart: req.session.cart || [],
            totalAmount: req.session.totalAmount || 0,
        });
    }
});

module.exports = router;