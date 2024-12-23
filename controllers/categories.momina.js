const express = require("express");
let router = express.Router();

let Product = require("../models/product.model");
let user = require("../models/user.model");
let order = require("../models/order.model");


router.get('/products/:category/:sort?/:page?', async (req,res)=>{
  try {
    let sort = req.params.sort ;
    let sortOrder;
        if (sort === 'sort-hightolow') {
            sortOrder = { price: -1 };  // Sort by price descending
        } else if (sort === 'sort-lowtohigh') {
            sortOrder = { price: 1 };   // Sort by price ascending
        } else {
            sortOrder = {};  // Default: no sorting, or fetch as usual
        }
    let Category = req.params.category ;
    // Find products where category is 'men'
    let page = req.params.page;
page = page ? Number(page) : 1;
let pageSize = 6;
const totalRecords = await Product.countDocuments({ category: Category });
let totalPages = Math.ceil(totalRecords / pageSize);
// return res.send({ page });
let products = await Product.find({category : Category}).sort(sortOrder)
  .limit(pageSize)
  .skip((page - 1) * pageSize);
    console.log(products) ;
    // Check if products were found
    if (products.length > 0) {
      // Render a page to display the products or send the products as JSON
      return res.render('./partials/productList', { products , layout : "basiclayout" , Category,page,sort,
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

});
 
//display details of a product

router.get('/details/:id' , async(req,res)=>{
  
  let product = await Product.findById(req.params.id).populate('seller')  // Populate the sellerId field with seller details from the User model
  console.log(product) ;

  return res.render('partials/productdetails' , { layout : 'basiclayout' , product}) ; 
});




//filtering products route

module.exports= router ;