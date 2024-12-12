const express = require("express");
let router = express.Router();

let Product = require("../models/product.model");
let user = require("../models/user.model");
let order = require("../models/order.model");
let cart = require("../models/shoppingCart.model");

router.get('/products/mensclothing', async (req,res)=>{
    try {
      // Find products where category is 'men'
      const products = await Product.find({ category: 'men' });
      
      // Check if products were found
      if (products.length > 0) {
        // Render a page to display the products or send the products as JSON
        return res.render('./partials/productList', { products , layout : "profileForm" , category : 'mens' } );
      } else {
        // If no products are found, return a message or render an empty product list
        return res.render('./partials/productList', { message: 'No products found in this category.' });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).send("An error occurred while fetching products.");
    }
  
  })

  router.get('/products/womensclothing', async (req,res)=>{
    try {
      // Find products where category is 'men'
      const products = await Product.find({ category: 'women' });
      
      // Check if products were found
      if (products.length > 0) {
        // Render a page to display the products or send the products as JSON
        return res.render('./partials/productList', { products , layout : "profileForm" , category : 'womens' } );
      } else {
        // If no products are found, return a message or render an empty product list
        return res.render('./partials/productList', { message: 'No products found in this category.' });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).send("An error occurred while fetching products.");
    }
  
  })

  router.get('/products/accessories', async (req,res)=>{
    try {
      // Find products where category is 'men'
      const products = await Product.find({ category: 'accessories' });
      
      // Check if products were found
      if (products.length > 0) {
        // Render a page to display the products or send the products as JSON
        return res.render('./partials/productList', { products , layout : "profileForm" , category : 'accessories' } );
      } else {
        // If no products are found, return a message or render an empty product list
        return res.render('./partials/productList', { message: 'No products found in this category.' });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).send("An error occurred while fetching products.");
    }
  
  })

  router.get('/products/vintage', async (req,res)=>{
    try {
      // Find products where category is 'men'
      const products = await Product.find({ category: 'vintage' });
      
      // Check if products were found
      if (products.length > 0) {
        // Render a page to display the products or send the products as JSON
        return res.render('./partials/productList', { products , layout : "profileForm" , category : 'vintage' } );
      } else {
        // If no products are found, return a message or render an empty product list
        return res.render('./partials/productList', { message: 'No products found in this category.' });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).send("An error occurred while fetching products.");
    }
  
  })


  router.get('/products/footwear', async (req,res)=>{
    try {
      // Find products where category is 'men'
      const products = await Product.find({ category: 'footwear' });
      
      // Check if products were found
      if (products.length > 0) {
        // Render a page to display the products or send the products as JSON
        return res.render('./partials/productList', { products , layout : "profileForm" , category : 'footwear' } );
      } else {
        // If no products are found, return a message or render an empty product list
        return res.render('./partials/productList', { message: 'No products found in this category.' });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).send("An error occurred while fetching products.");
    }
  
  })

module.exports= router ;