const express = require("express");
const Order = require("../models/order.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");


const router = express.Router();

// Render checkout page
router.get("/checkout", async (req, res) => {
    try {
        const user = req.session.user; 
        if (!user) return res.redirect("/login");

        // Fetch user's cart
        const cart = req.cookies.cart ;
        console.log(cart) ;
        if (!cart || cart.length === 0) {
            return res.status(400).render("checkoutForm", {
                error: "Your cart is empty.",
                cart: [],
                totalAmount: 0,
            });
        }

        let products = await Product.find({ _id: { $in: cart } });
        console.log(products) ;
        // Calculate total amount
        let totalAmount = products.reduce((sum, product) => sum + product.price, 0);
        
        return res.render("checkoutForm", {
            layout : 'profilelayout' ,
            error: null,
            cart,
            products,
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
        const buyer = req.session.user; // Assuming user is stored in the session
        if (!buyer) return res.redirect("/login");

       

        // Create orders for each product in the cart
        
        for (const product of req.cookies.cart) {
            let item = await Product.findById(product).select('price')
console.log(item) ;
            // Create order object
            const order = new Order({
                buyer,
                product ,
                totalAmount: item.price, // Single product price
                location: {
                    country,
                    city,
                    address,
                },
                orderDate: new Date(),
                payment
            });

            await order.save();
        }

       
        req.cookies.cart = null ;
        console.log(req.cookies.cart) ;
        res.render("success" , {layout : 'success' , name :req.session.user.name  });
    } catch (error) {
        console.error("Error processing order:", error);
        res.status(500).render("checkoutForm", {
            layout : 'profileform',
            name : req.session.user.name ,
            error: "An error occurred while processing your order. Please try again.",
            cart: req.session.cart || [],
            totalAmount: req.session.totalAmount || 0,
        });
    }
});

module.exports = router;