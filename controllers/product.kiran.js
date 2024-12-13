const express = require("express");
const router = express.Router();
let Product = require("../models/product.model");
let user = require("../models/user.model");
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
router.get('/admin/add-product', async (req, res) => {
    const user = await user.find();
    res.render('admin/addProducts', {
       layout: "profileForm",
      user, 
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

  