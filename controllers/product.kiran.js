const express = require("express");
const router = express.Router();
let Product = require("../models/product.model");
let User = require("../models/user.model");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dwu0k8o5c",
  api_key: "845284654399189",
  api_secret: "XVgZm8ajlHu6SxIBUd7K94A-2yc",
});


// Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"], // Allowed image formats
  },
});

// Use multer with Cloudinary storage
const upload = multer({ storage: storage });
router.get('/admin/add-product/:userId', async (req, res) => {
  const userId = req.params.userId; // Get the userId from the route parameter
  const user = await User.findById(userId);
    res.render('admin/addProduct', {
       layout: "profileForm",
       seller:user.name, 
    });
});

router.post('/admin/products/create', upload.single('image'), async (req, res) => {
  try {
      const { name, description, price, category, seller, isAvailable } = req.body;

      // Validate required fields
      if (!name || !price || !category || !seller) {
          return res.status(400).send("All required fields must be filled.");
      }

      const file = req.file; // Uploaded file
      if (!file) {
          return res.status(400).send('Image upload failed.');
      }

      // Prepare the picture object
      const picture = {
        name: file.originalname,
        imgUrl: file.path,  // This should be file.url instead of file.path for Cloudinary
    };
    

      // Create the product
      const newProduct = new Product({
          name,
          description,
          price,
          category,
          seller,
          isAvailable,
          picture,
      });

      await newProduct.save(); // Save to database
      res.redirect('/readProfile'); // Adjust redirect route as needed
  } catch (error) {
      console.error("Error creating product:", error.message);
      res.status(500).send("Internal Server Error");
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
      res.render("admin/editProduct", {
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
        const product = await Product.findById(req.params.id);

        // Get updated product data from the request body
        const data = req.body;

        // Check if a new image is uploaded
        const file = req.file;
        let imageUrl = null;
        let imageName = null;

        if (file) {
            // New image uploaded, use the file path and the file name
            imageUrl = file.path;
            imageName = file.originalname; // You can use file.originalname for the image name if needed
        } else {
            // No new image uploaded, retain the current image details
            imageUrl = product.picture.imgUrl;
            imageName = product.picture.name;
        }

        // Update the image details in the data object
        data.picture = {
            imgUrl: imageUrl,
            name: imageName,
        };

        // Update the product with the new data
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
   
    let page = req.params.page;
    page = page ? Number(page) : 1;
    let pageSize = 6;
    let totalRecords =  products.length;
    let totalPages = Math.ceil(totalRecords / pageSize);
    // return res.send({ page });

        

    // Handle cases with no products
    if (products.length === 0) {
      return res.render('partials/productList', { products: [], layout: 'basiclayout' , category: searchQuery , message: 'No products found.' ,page,
        pageSize,
        totalPages,
        totalRecords,});
    }

    // Render search products page
    res.render('partials/productList', { products,category: searchQuery , layout: 'basiclayout' , message: null,page,
      pageSize,
      totalPages,
      totalRecords, });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while performing the search.');
  }
});

  module.exports = router ;
  
  