const express = require('express');
const mongoose = require("mongoose");
const orderModel = require("../models/order.model");

app.get('/checkout', (req, res) => {
    res.render('checkout', {
      error: null, // Pass null by default for error
      cart: req.session.cart || [], // Optional: Pass cart details if stored in session
      totalAmount: req.session.totalAmount || 0, // Optional: Pass total amount
    });
  });
  
  // Handle checkout form submission
  app.post('/checkout', async (req, res) => {
    const { country, city, address, payment } = req.body;
    
    // Assuming you have a logged-in user
    const buyer = req.user?._id; // Replace with actual logic to retrieve logged-in user ID
    
    // Basic validation
    if (!buyer || !country || !city || !address || !payment) {
      return res.status(400).render('checkout', {
        error: 'All fields are required.',
        cart: req.session.cart || [],
        totalAmount: req.session.totalAmount || 0,
      });
    }
  
    try {
      // Create order object
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
  
      // Save the order to the database
      const Order = require('./models/order'); // Ensure the correct path
      const newOrder = new Order(orderData);
      await newOrder.save();
  
      // Clear the session/cart after successful order
      req.session.cart = [];
      req.session.totalAmount = 0;
  
      // Render success page
      res.render('success', { name: req.user?.name || 'Customer' });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).render('checkout', {
        error: 'An error occurred while processing your order. Please try again.',
        cart: req.session.cart || [],
        totalAmount: req.session.totalAmount || 0,
      });
    }
  });