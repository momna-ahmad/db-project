const express = require("express");
const mongoose = require("mongoose");
const multer = require('multer') ;

const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const ejsLayouts = require("express-ejs-layouts"); 
let server = express();


server.set("view engine", "ejs");
server.use(ejsLayouts);
// importing controller which render pages on base of category of products

//expose public folder for publically accessible static files
server.use(express.static("public"));



// add support for fetching data from request body
server.use(express.urlencoded({extended : true} ));


const productController = require('./controllers/product.kiran');
const checkoutController = require('./controllers/checkout.controller');
const cartController = require('./controllers/cart.kiran');
const userController = require('./controllers/user.controller') ;
const categoryController = require('./controllers/categories.momina')
server.use(productController);
server.use(cartController);
server.use(checkoutController);
server.use(userController) ;
server.use(categoryController);


let Product = require("./models/product.model");
let user = require("./models/user.model");
let order = require("./models/order.model");
let cart = require("./models/shoppingCart.model");





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
//shafqaat
// Homepage route
server.get('/', (req, res) => {
  if(req.session.user)
    res.render('partials/profile') ;
  else
  res.render("partials/landing");
  
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





server.listen(5000, () => {
  console.log(`Server Started at localhost:5000`);
});
