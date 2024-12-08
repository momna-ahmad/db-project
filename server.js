const express = require("express");
const mongoose = require("mongoose");
const multer = require('multer') ;

let Product = require("./models/product.model");
let user = require("./models/user.model");
let order = require("./models/order.model");
let cart = require("./models/shoppingCart.model");


var expressLayouts = require("express-ejs-layouts");
let server = express();
server.set("view engine", "ejs");
server.use(expressLayouts);


//expose public folder for publically accessible static files
server.use(express.static("public"));



// add support for fetching data from request body
server.use(express.urlencoded({extended : true} ));


// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Directory to store files
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});

const upload = multer({ storage: storage });





let connectionString = "mongodb+srv://kiranshehzadiroshni:p4yNLb4Y5NIi3rvZ@vintagethrift.x4ymp.mongodb.net/vintasy";
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
  res.render("partials/landing")
});

// Read Profile
server.get('/readProfile', async (req, res) => {
  try {
      // Fetch user profiles
      console.log(req.id) ;
      let Profiles = await user.find();
      
      // Fetch products associated with the profile (assuming products have a `profileId` field)
      let products = await Product.find(); // Optionally filter products by profileId
      
      res.render('readProfile', { Profiles, products });
  } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while fetching profiles and products.");
  }
});

//addProfile
server.post('/addProfile', upload.single('image'), async (req, res) => {
  try {
      const {  storename, name, description } = req.body;
      const image = req.file ? req.file.path : null; // Get file path
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
        return res.render('partials/profile'); // Redirect to the profile listing page
    } catch (error) {
        console.error("Error creating profile:", error);
        res.status(500).send("An error occurred while creating the profile.");
    }
});


// Route to render the Add Product form
server.get('/addProduct', async (req, res) => {
  const profiles = await user.find(); // Ensure there is at least one profile before adding a product
  if (profiles.length === 0) {
      return res.redirect('/readProfile'); // Redirect to readProfile if no profile exists
  }
  res.render('addProduct');
});


// Edit Profile
server.get('/editProfile/:id', async (req, res) => {
  let profile = await user.findById(req.params.id);
  res.render('editProfile', { profile });
});

// Update Profile
server.post('/updateProfile/:id', upload.single('image'), async (req, res) => {
  const { storename, name, description } = req.body;
  const image = req.file ? req.file.path : null;
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

/* Create Profile
app.post('/createProfile', upload.single('image'), async (req, res) => {
  const { storename, name, description } = req.body;
  const image = req.file ? req.file.path : null;
  let newProfile = new Profile({ image, storename, name, description });
  await newProfile.save();
  res.redirect('/readProfile');
});*/

// add Product

server.post('/add-product', upload.single('image'), async (req, res) => {
  try {
      const { name, price, description } = req.body;
      const image = req.file ? req.file.path : null; // Save the file path
      const product = new Product({
          name,
          price,
          description,
          image,
      });
      await product.save();
      res.redirect('/readProfile');
  } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).send("An error occurred while adding the product.");
  }
});

// Read Products
server.get('/readProducts', async (req, res) => {
  let products = await Product.find();
  res.render('readProducts', { products });
});
 
//shafqaat end


server.listen(5000, () => {
  console.log(`Server Started at localhost:5000`);
});