const express = require("express");
const mongoose = require("mongoose");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");


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
      console.log(Profiles) ;
      
      // Fetch products associated with the profile (assuming products have a `profileId` field)
      let products = await Product.find(); // Optionally filter products by profileId
      
      return res.render("partials/readProfile", {layout : 'profileForm' , Profiles, products , stylesheet : '/css/styles2' });
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

/* Create Profile
app.post('/createProfile', upload.single('image'), async (req, res) => {
  const { storename, name, description } = req.body;
  const image = req.file ? req.file.path : null;
  let newProfile = new Profile({ image, storename, name, description });
  await newProfile.save();
  res.redirect('/readProfile');
});*/

// add Product
server.get('/add-product', async (req, res) => {
  const profiles = await user.find(); // Ensure there is at least one profile before adding a product
  if (profiles.length === 0) {
      return res.redirect('/readProfile'); // Redirect to readProfile if no profile exists
  }
  res.render('addProduct');
});

server.post('/add-product', upload.single('image'), async (req, res) => {
  try {
      const { name, price, description } = req.body;
      const image = req.file ? req.file.path.secure_url : null;  // Save the file path
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
  res.render('readProducts', { products })});



server.get('/read-product/:category', async (req, res) => {
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

 
//shafqaat end


server.listen(5000, () => {
  console.log(`Server Started at localhost:5000`);
});