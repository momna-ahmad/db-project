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
  try {
    let cart = req.cookies.cart || [];
    let products = await Product.find({ _id: { $in: cart } });
    return res.render("cart", { layout: "cartLayout", products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).send("Internal Server Error");
  }
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

    // if (!userId) {
    //   return res.status(400).send("User ID is required.");
    // }

    // Fetch user profile
    const profile = await user.findById(userId);
    if (!profile) {
      return res.status(404).send("User not found.");
    }
    console.log(profile);

    // Fetch products where seller matches the user's username
    const products = await Product.find({ seller: profile.name });

    // Render the readProfile view
    return res.render("readProfile", { 
      layout: 'profilelayout', 
      Profiles: profile, 
      products 
    });
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



//addproduct


// add Product




//route to delete a product 


//route for updation of product

//kiran Part end
//shafqaat end





const checkoutController = require('./controllers/checkout.controller');

//Route to render the checkout page
router.get('/checkout', checkout.controller.renderCheckoutPage);

// Route to handle checkout form submission
router.post('/checkout', checkout.controller.processCheckout);

server.listen(5000, () => {
  console.log(`Server Started at localhost:5000`);
});
