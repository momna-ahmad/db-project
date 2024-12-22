const express = require("express");
let router = express.Router();

let Product = require("../models/product.model");
let user = require("../models/user.model");
let order = require("../models/order.model");
let cart = require("../models/shoppingCart.model");

/*

router.get('/products/mensclothing/:page?', async (req,res)=>{
    try {
      // Find products where category is 'men'
      let page = req.params.page;
  page = page ? Number(page) : 1;
  let pageSize = 6;
  let totalRecords = await Product.countDocuments();
  let totalPages = Math.ceil(totalRecords / pageSize);
  // return res.send({ page });
  let products = await Product.find({category : 'men'})
    .limit(pageSize)
    .skip((page - 1) * pageSize);
      
      // Check if products were found
      if (products.length > 0) {
        // Render a page to display the products or send the products as JSON
        return res.render('partials/productList', { products , layout : "basiclayout" , category : 'mens' ,page,
          pageSize,
          totalPages,
          totalRecords, } );
      } else {
        // If no products are found, return a message or render an empty product list
        return res.render('partials/noproductsfound', { message: 'No products found in this category.', layout : "basiclayout" });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).send("An error occurred while fetching products.");
    }
  
  })

  router.get('/products/womensclothing/:page?', async (req,res)=>{
    try {
      // Find products where category is 'men'
      let page = req.params.page;
  page = page ? Number(page) : 1;
  let pageSize = 6;
  let totalRecords = await Product.countDocuments();
  let totalPages = Math.ceil(totalRecords / pageSize);
  // return res.send({ page });
  let products = await Product.find({category : 'women'})
    .limit(pageSize)
    .skip((page - 1) * pageSize);
      
      // Check if products were found
      if (products.length > 0) {
        // Render a page to display the products or send the products as JSON
        return res.render('./partials/productList', { products , layout : "basiclayout" , category : 'womens' ,page,
          pageSize,
          totalPages,
          totalRecords,} );
      } else {
        // If no products are found, return a message or render an empty product list
        return res.render('./partials/noproductsfound', { message: 'No products found in this category.' , layout : "basiclayout"});
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).send("An error occurred while fetching products.");
    }
  
  })

  router.get('/products/accessories/:page?', async (req,res)=>{
    try {
      // Find products where category is 'men'
      let page = req.params.page;
  page = page ? Number(page) : 1;
  let pageSize = 6;
  let totalRecords = await Product.countDocuments();
  let totalPages = Math.ceil(totalRecords / pageSize);
  // return res.send({ page });
  let products = await Product.find({category : 'accessories'})
    .limit(pageSize)
    .skip((page - 1) * pageSize);
      
      // Check if products were found
      if (products.length > 0) {
        // Render a page to display the products or send the products as JSON
        return res.render('./partials/productList', { products , layout : "basiclayout" , category : 'accessories' ,page,
          pageSize,
          totalPages,
          totalRecords,} );
      } else {
        // If no products are found, return a message or render an empty product list
        return res.render('./partials/noproductsfound', { message: 'No products found in this category.', layout : "basiclayout" });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).send("An error occurred while fetching products.");
    }
  
  })

  router.get('/products/vintage/:page?', async (req,res)=>{
    try {
      // Find products where category is 'men'
      let page = req.params.page;
  page = page ? Number(page) : 1;
  let pageSize = 6;
  let totalRecords = await Product.countDocuments();
  let totalPages = Math.ceil(totalRecords / pageSize);
  // return res.send({ page });
  let products = await Product.find({category : 'vintage'})
    .limit(pageSize)
    .skip((page - 1) * pageSize);
      
      // Check if products were found
      if (products.length > 0) {
        // Render a page to display the products or send the products as JSON
        return res.render('./partials/productList', { products , layout : "basiclayout" , category : 'vintage',page,
          pageSize,
          totalPages,
          totalRecords, } );
      } else {
        // If no products are found, return a message or render an empty product list
        return res.render('./partials/noproductsfound', { message: 'No products found in this category.', layout : "basiclayout" });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).send("An error occurred while fetching products.");
    }
  
  })


  router.get('/products/footwear/:page?', async (req,res)=>{
    try {
      // Find products where category is 'men'
      let page = req.params.page;
  page = page ? Number(page) : 1;
  let pageSize = 6;
  let totalRecords = await Product.countDocuments();
  let totalPages = Math.ceil(totalRecords / pageSize);
  // return res.send({ page });
  let products = await Product.find({category : 'footwear'})
    .limit(pageSize)
    .skip((page - 1) * pageSize);
      
      // Check if products were found
      if (products.length > 0) {
        // Render a page to display the products or send the products as JSON
        return res.render('./partials/productList', { products , layout : "basiclayout" , category : 'footwear',page,
          pageSize,
          totalPages,
          totalRecords, } );
      } else {
        // If no products are found, return a message or render an empty product list
        return res.render('./partials/noproductsfound',  { message: 'No products found in this category.' , layout : "basiclayout"});
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).send("An error occurred while fetching products.");
    }
  
  })

*/


router.get('/products/:category/:page?', async (req,res)=>{
  try {
    let Category = req.params.category ;
    // Find products where category is 'men'
    let page = req.params.page;
page = page ? Number(page) : 1;
let pageSize = 6;
let totalRecords = await Product.countDocuments();
let totalPages = Math.ceil(totalRecords / pageSize);
// return res.send({ page });
let products = await Product.find({category : Category})
  .limit(pageSize)
  .skip((page - 1) * pageSize);
    
    // Check if products were found
    if (products.length > 0) {
      // Render a page to display the products or send the products as JSON
      return res.render('./partials/productList', { products , layout : "basiclayout" , Category,page,
        pageSize,
        totalPages,
        totalRecords, } );
    } else {
      // If no products are found, return a message or render an empty product list
      return res.render('./partials/noproductsfound',  { message: 'No products found in this category.' , Category, layout : "basiclayout"});
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).send("An error occurred while fetching products.");
  }

})


module.exports= router ;