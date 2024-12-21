const express = require("express");
const router = express.Router();
let Product = require("../models/product.model");
let User = require("../models/user.model");
const path = require("path");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");


cloudinary.config({
  cloud_name: "dwu0k8o5c",
  api_key: "845284654399189",
  api_secret: "XVgZm8ajlHu6SxIBUd7K94A-2yc",
});


// Multer Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Cloudinary folder name
    allowed_formats: ["jpg", "png", "jpeg"], // Allowed file types
  },
});

const upload = multer({ storage: storage });
router.get('/admin/add-product/:userId', async (req, res) => {
  const userId = req.params.userId; // Get the userId from the route parameter
  const user = await User.findById(userId);
    res.render('admin/addProduct', {
       layout: "profileForm",
       seller:user.name, 
    });
});

router.post('/admin/products/create',upload.single('image'),async (req, res) => {
    try {
      const { name, description, price, category,seller ,isAvailable } = req.body;
      const file = req.file; // Access the uploaded file
  
      if (!name || !description || !price || !category||seller||isAvailable) {
        return res.status(400).send("All fields are required.");
      }
  
      const imageUrl = file ? file.path : null;
  
      const newProduct = new Product({
        name,
        description,
        price,
        category,
        seller,
        isAvailable,  // Added missing comma here
        picture: imageUrl,  // Correctly placed this field
      });

  
      await newProduct.save();
  
      res.redirect("/readProfile");
    } catch (error) {
      console.error("Error creating product:", error.message);
      res.status(500).json({ message: "Error creating product" });
    }
  });
  
  router.get("/admin/deleteProduct/:id", async(req, res) => {
    try{
      let product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).send("Product not found.");
      }
  
      res.redirect('/readProfile');
      
    } catch (err) {
      console.error(err);
      res.status(500).send("Error deleting product.");
    }
  });
  router.get("/admin/editProduct/:id", async (req, res) => {
    try {
      const { id } = req.params;  // Get the product ID from the URL parameter
      const product = await Product.findById(id);  // Find the product by ID
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" });  // If the product doesn't exist
      }
      // Render the product edit form and pass the product data to it
      res.render("admin/edit-product-form", {
            layout:"profileForm",
           // Set the layout for the page
            product,  // Pass the product data to the form for editing
       
      });
    } catch (error) {
      res.status(500).json({ message: "Invalid Server Error" });  // Handle any server errors
    }
  });
  


 router.post("/admin/editProduct/:id", upload.single('image'), async (req, res) => {
    try {
      // Find the product by ID
      let product = await Product.findById(req.params.id);
  
      // Get updated product data from request body
      let data = req.body;
  
      // Check if a new picture is uploaded
      if (req.file) {
        // Use the existing picture's public_id to overwrite it
        let publicId = product.picture 
          ? product.picture.split('/').pop().split('.')[0] // Extract public ID from URL
          : `product_images/${req.params.id}`; // Default public_id if no picture exists
        
        // Upload the new picture to Cloudinary, using the same public_id
        const result = await cloudinary.uploader.upload(req.file.path, {
          public_id: publicId, // Overwrite the existing picture
          folder: 'product_images', // Optional: specify folder
          use_filename: true,      // Retain the original filename
          overwrite: true          // Ensure the picture is replaced
        });
  
        // Store the Cloudinary URL of the uploaded picture
        data.picture = result.secure_url;
      }
  
      // Update the product with the new data (including the new picture URL if uploaded)
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
  
      // Redirect to the products page
      res.redirect('/readProfile');
  
    } catch (err) {
      console.error(err);
      res.status(500).send("Error updating product.");
    }
  });

  // Search route
router.get('/search', async (req, res) => {
  const searchQuery = req.query.query; // Get search query from URL parameters

  try {
    // Perform case-insensitive search on name, category, and description
    const products = await Product.find({
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { category: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } }
      ]
    });

    // Handle cases with no products
    if (products.length === 0) {
      return res.render('partials/productList', { products: [], category: searchQuery , message: 'No products found.' });
    }

    // Render search products page
    res.render('partials/productList', { products,category: searchQuery , message: null });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while performing the search.');
  }
});

  module.exports = router ;
  
  