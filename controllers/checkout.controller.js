const express = require("express");
const orderModel = require("../models/order.model");
const userModel = require("../models/user.model");
const productModel = require("../models/product.model");


const router = express.Router();

// Render checkout page
router.get("/checkout", async (req, res) => {
    try {
        const user = req.user; 
        if (!user) return res.redirect("/login");

        // Fetch user's cart
        const cart = await shoppingCartModel.findById(user.cart).populate("items");
        if (!cart || cart.items.length === 0) {
            return res.status(400).render("checkoutForm", {
                error: "Your cart is empty.",
                cart: [],
                totalAmount: 0,
            });
        }

        // Calculate total amount
        const totalAmount = cart.items.reduce((sum, item) => sum + item.price, 0);

        res.render("checkoutForm", {
            error: null,
            cart: cart.items,
            totalAmount,
        });
    } catch (error) {
        console.error("Error loading checkout page:", error);
        res.status(500).send("Server error");
    }
});

// Handle checkout form submission
router.post("/checkout", async (req, res) => {
    const { country, city, address, payment } = req.body;

    try {
        const user = req.user; // Assuming user is stored in the session
        if (!user) return res.redirect("/login");

        // Fetch user's cart
        const cart = await shoppingCartModel.findById(user.cart).populate("items");
        if (!cart || cart.items.length === 0) {
            return res.status(400).render("checkoutForm", {
                error: "Your cart is empty.",
                cart: [],
                totalAmount: 0,
            });
        }

        // Create orders for each product in the cart
        const orders = [];
        for (const product of cart.items) {
            // Fetch seller of the product
            const seller = await userModel.findOne({ product: product._id });
            if (!seller) {
                console.warn('Seller not found for product: ${product._id}');
                continue;
            }

            // Create order object
            const order = new orderModel({
                buyer: user._id,
                products: [{ product: product._id }],
                totalAmount: product.price, // Single product price
                location: {
                    country,
                    city,
                    address,
                },
                orderDate: new Date(),
            });

            await order.save();
            orders.push(order);
        }

        // Clear user's cart
        cart.items = [];
        await cart.save();

        res.render("success", {
            name: user.name || "Customer",
            orders,
        });
    } catch (error) {
        console.error("Error processing order:", error);
        res.status(500).render("checkoutForm", {
            error: "An error occurred while processing your order. Please try again.",
            cart: req.session.cart || [],
            totalAmount: req.session.totalAmount || 0,
        });
    }
});

module.exports = router;