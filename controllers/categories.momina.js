const express = require("express");
let router = express.Router();

let Product = require("../models/product.model");
let User = require("../models/user.model");
let order = require("../models/order.model");

router.get("/products/:category/:sort?/:page?", async (req, res) => {
  try {
    let sort = req.params.sort;
    let sortOrder;
    if (sort === "sort-hightolow") {
      sortOrder = { price: -1 }; // Sort by price descending
    } else if (sort === "sort-lowtohigh") {
      sortOrder = { price: 1 }; // Sort by price ascending
    }  else if (sort === "newlyListed") {
      sortOrder = { dateAdded: -1 }; // Sort by most recent first
    } else {
      sortOrder = {}; // Default: no sorting
    }
    let Category = req.params.category;
    // Find products where category is 'men'
    let page = req.params.page;
    page = page ? Number(page) : 1;
    let pageSize = 6;
    const totalRecords = await Product.countDocuments({ category: Category , isAvailable : true});
    let totalPages = Math.ceil(totalRecords / pageSize);
    console.log('pages' + totalPages) ;
    // return res.send({ page });
    let products = await Product.find({ category: Category , isAvailable : true })
      .sort(sortOrder)
      .limit(pageSize)
      .skip((page - 1) * pageSize);

      console.log(products) ;
    
    // Check if products were found
    if (products.length > 0) {
      // Render a page to display the products or send the products as JSON
      return res.render("./partials/productList", {
        products,
        layout: "basiclayout",
        Category,
        page,
        sort,
        pageSize,
        totalPages,
        totalRecords,
      });
    } else {
      // If no products are found, return a message or render an empty product list
      return res.render("./partials/noproductsfound", {
        message: "No products found in this category.",
        Category,
        layout: "basiclayout",
      });
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).send("An error occurred while fetching products.");
  }
});
//kiran 
router.get("/product/price/:priceRange/:page?", async (req, res) => {
  try {
    // Extract price range and pagination info
    const priceRange = req.params.priceRange;
    const page = req.params.page ? Number(req.params.page) : 1;
    const pageSize = 6;

    // Define price filter
    let priceFilter = {};
    if (priceRange === "under-3000") {
      // Show products with prices less than 3000
      priceFilter = { price: { $lt: 3000 } };
    } else if (priceRange === "under-5000") {
      // Show products with prices greater than or equal to 3000 but less than 5000
      priceFilter = { price: { $gte: 3000, $lt: 5000 } };
    } else if (priceRange === "under-7000") {
      // Show products with prices greater than or equal to 5000 but less than 7000
      priceFilter = { price: { $gte: 5000, $lt: 7000 } };
    } else {
      return res.status(400).send("Invalid price range.");
    }
    

    // Combine filters
    const filter = { isAvailable: true, ...priceFilter };

    // Fetch total records and calculate total pages
    const totalRecords = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / pageSize);

    // Fetch filtered products
    const products = await Product.find(filter)
      .limit(pageSize)
      .skip((page - 1) * pageSize);

    // Check if products are found
    if (products.length > 0) {
      return res.render("under-price", {
        products,
        layout: "basiclayout",
        priceRange,
        page,
        pageSize,
        totalPages,
        totalRecords,
      });
    } else {
      return res.render("./partials/noproductsfound", {
        message: "No products found in this price range.",
        layout: "basiclayout",
      });
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).send("An error occurred while fetching products.");
  }
});

//display details of a product

router.get("/details/:id", async (req, res) => {
  
  let product = await Product.findById(req.params.id).populate("seller"); // Populate the sellerId field with seller details from the User model
  

  return res.render("partials/productdetails", {
    layout: "basiclayout",
    product,
  });
});

router.get("/sellerdetails/:id" , async(req,res)=>{
  let seller = await User.findById(req.params.id) ;
  let products = await Product.find({ seller: req.params.id });
  let sold =  await Product.find({ seller: req.params.id , isAvailable : false }) ;
  console.log(sold) ;
  return res.render("partials/showseller" , {
    seller,
    products,
    layout: "basiclayout" ,
    sold,

    
  })
});


//filtering products route

module.exports = router;
