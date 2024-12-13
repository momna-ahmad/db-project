const express = require("express");
const mongoose = require("mongoose");
const multer = require('multer') ;

const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

let Product = require("./models/product.model");
let user = require("./models/user.model");
let order = require("./models/order.model");
let cart = require("./models/shoppingCart.model");
const ejsLayouts = require("express-ejs-layouts"); 


const cookieParser = require("cookie-parser");
const session = require("express-session");

let server = express();
server.use(cookieParser()); // Parse cookies
server.use(session({ secret: "my session secret", resave: false, saveUninitialized: true })); // Set up sessions


server.set("view engine", "ejs");
server.use(ejsLayouts);
// importing controller which render pages on base of category of products
const userController = require('./controllers/user/user.controller');
server.use(userController);



//expose public folder for publically accessible static files
server.use(express.static("public"));



// add support for fetching data from request body
server.use(express.urlencoded({extended : true} ));


// Set up storage for multer
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


let connectionString = "mongodb+srv://momnaahmdd:thri1ft7mo@vintasycluster.hpn5p.mongodb.net/";

mongoose
  .connect(connectionString)
  .then( async () =>
    {
      console.log("Connected to Mongo DB Server: " + connectionString);
    } )
  .catch((error) => console.log(error.message));
//CART fucntionality
server.get("/cart", async (req, res) => {
  let cart = req.cookies.cart;
  cart = cart ? cart : [];
  let products = await Product.find({ _id: { $in: cart } });
  return res.render("cart", { products });
});
server.get("/add-to-cart/:id", (req, res) => {
  let cart = req.cookies.cart;
  cart = cart ? cart : [];
  cart.push(req.params.id);
  res.cookie("cart", cart);
  return res.redirect("readProfile");
});

//shafqaat
// Homepage route
server.get('/', (req, res) => {
  res.render("partials/landing")
});

// Read Profile
server.get('/readProfile', async (req, res) => {
  try {
    const userId = req.query.userId; // Get the userId from the query parameter

    if (!userId) {
      return res.status(400).send("User ID is required.");
    }

    // Fetch user profiles
    let Profiles = await user.findById(userId);
    console.log(Profiles);

    // Fetch products associated with the profile
    let products = await Product.find();

    return res.render("readProfile", { layout: 'profilelayout', Profiles, products });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching profiles and products.");
  }
});


//addProfile
server.post('/addProfile', upload.single('image'), async (req, res) => {
  try {
      const {  storename, name, description } = req.body;

      const image = req.file ? req.file.path.secure_url : null;  // Get file path

      await user.create({ image, storename, name, description });
      res.redirect('/readProfile'); // Redirect to the profile listing page
      console.log("Form data:", req.body);
      console.log("File data:", req.file);

  } catch (error) {
          console.error("Error creating profile:", error);
    res.status(500).send("An error occurred while creating the profile.");
  }
});


// Route to render the Add Profile form
server.get('/admin/sign-in', (req, res) => {
  
  res.render('./partials/sign-in.ejs' , {
    layout : 'profileForm' 
  });
});

server.post('/admin/sign-in', async (req, res) => {
  
    try {
      let data = req.body ;
      let newUser = new user(data) ;
      await newUser.save() ;
        //const { username, password, name } = req.body;
        //await user.create({ username,password, name});
        return res.render('partials/profile', { userId: newUser._id }); // Redirect to the profile listing page
    } catch (error) {
        console.error("Error creating profile:", error);
        res.status(500).send("An error occurred while creating the profile.");
    }
});


// Route to render the Add Product form
// server.get('/addProduct', async (req, res) => {
//   const profiles = await user.find(); // Ensure there is at least one profile before adding a product
//   if (profiles.length === 0) {
//       return res.redirect('/readProfile'); // Redirect to readProfile if no profile exists
//   }
//   res.render('./partials/addProduct');
// });



// Edit Profile
server.get('/editProfile/:id', async (req, res) => {
  let profile = await user.findById(req.params.id);
  res.render('editProfile', { profile });
});

// Update Profile
server.post('/updateProfile/:id', upload.single('image'), async (req, res) => {
  const { storename, name, description } = req.body;

  const image = req.file ? req.file.path.secure_url : null; 

  let updatedProfile = await user.findByIdAndUpdate(
    req.params.id,
    { image, username, name, description },
    { new: true }
  );
  res.redirect('/readProfile');
});



// Delete Profile
server.get('/deleteProfile/:id', async (req, res) => {
  await Profile.findByIdAndDelete(req.params.id);
  res.redirect('/readProfile');
});



// Delete Product
server.get('/product/deleteProduct/:id', async (req, res) => {
  try {
      const productId = req.params.id;
      await Product.findByIdAndDelete(productId); // Deletes the product with the given ID
      res.redirect('/readProfile'); // Redirect to the products listing page
  } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).send("An error occurred while deleting the product.");
  }
});


//addproduct


// add Product


server.get('/admin/add-product', async (req, res) => {
  const profiles = await user.find(); // Ensure there is at least one profile before adding a product
  if (profiles.length === 0) {
      return res.redirect('/readProfile'); // Redirect to readProfile if no profile exists
  }
  res.render('admin/addProduct',{layout: "profileForm"});
});
//route to add new product
server.post('/admin/add-product', upload.single('image'), async (req, res) => {
  try {
      const { name, price, description } = req.body;
      const file = req.file;
      const imageUrl = file ? file.path : null;  // Save the file path

      const product = new Product({
          name,
          category, // Save the category
          price,
          description,
          image: imageUrl,
      });
      await product.save();
      res.redirect('/readProfile');
  } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).send("An error occurred while adding the product.");
  }
});



// Read Products

// server.get('/readProducts', async (req, res) => {
//   let products = await Product.find();
//   res.render('readProducts', { products })});
//Kiran part start
// Read Products

  
  
  
server.get('/product/productRead/:category', async (req, res) => {
  try {
    // Step 1: Extract the category name from the request parameters
    const categoryName = req.params.category.toLowerCase(); // Ensure case-insensitive comparison
    // Step 3: Fetch products directly based on the category string in the Product model
    const products = await Product.find({ category: categoryName });

    // Step 4: Render the specific page for the category
    return res.render(readProducts[categoryName], {
    // styles: '/css/globalStyle.css', 
      title: `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} and Related Items`,
      products
    });
  } catch (err) {
    console.error(err); // Log any errors
    res.status(500).send("Error retrieving products.");
  }
});



server.get("/product/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;  // Get the product ID from the URL parameter
    const product = await Product.findById(id);  // Find the product by ID

    if (!product) {
      return res.status(404).json({ message: "Product not found" });  // If the product doesn't exist
    }
    // Render the product edit form and pass the product data to it
    res.render("/product-edit-form", {
         // Set the layout for the page
      product,  // Pass the product data to the form for editing
     
    });
  } catch (error) {
    res.status(500).json({ message: "Invalid Server Error" });  // Handle any server errors
  }
});
//route to delete a product 
server.post("/product/delete/:id", async(req, res) => {
  try{
    let product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found.");
    }

    res.redirect('/readProducts');
    
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting product.");
  }
});


//route for updation of product

server.post("/product/edit/:id",  upload.single('productImage'), async (req, res) => {
  try {
    // Find the product by ID
    let product = await Product.findById(req.params.id);

    // Get updated product data from request body
    let data = req.body;

    // Check if a new image is uploaded
    if (req.file) {
      // If the product already has an image, delete it from Cloudinary
      if (product.image) {
        const imageName = product.image.split('/').pop().split('.')[0]; // Extract image public ID from URL
        await cloudinary.upload.destroy(imageName); // Delete old image from Cloudinary
      }

      // Upload the new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'product_images', // Optional: specify the folder on Cloudinary
        use_filename: true,
      });

      // Store the Cloudinary URL of the uploaded image
      data.image = result.secure_url;
    }

    // Update the product with the new data (including the new image URL if uploaded)
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, data, { new: true });

    // Redirect to the products page
    res.redirect('/productRead');
    
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating product.");
  }
});
//kiran Part end
//shafqaat end




server.get('/products/mensclothing', async (req,res)=>{
  try {
    // Find products where category is 'men'
    const products = await Product.find({ category: 'men' });
    console.log(products) ;
    // Check if products were found
    if (products.length > 0) {
      // Render a page to display the products or send the products as JSON
      return res.render('partials/productList', { products });
    } else {
      // If no products are found, return a message or render an empty product list
      return res.render('partials/productList', { message: 'No products found in this category.' });
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).send("An error occurred while fetching products.");
  }

})
server.listen(5000, () => {
  console.log(`Server Started at localhost:5000`);
});