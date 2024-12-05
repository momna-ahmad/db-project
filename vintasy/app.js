const express = require('express');
const mongoose = require("mongoose");
const multer = require('multer');
const Profile = require('./models/profile');
const Product = require('./models/product');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/vintasy", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected successfully");
}).catch((error) => {
  console.error("MongoDB connection error:", error);
});

// Homepage route
app.get('/', (req, res) => {
  res.render("homepage");
});

// Read Profile
app.get('/readProfile', async (req, res) => {
  try {
      // Fetch user profiles
      let Profiles = await Profile.find();
      
      // Fetch products associated with the profile (assuming products have a `profileId` field)
      let products = await Product.find(); // Optionally filter products by profileId
      
      res.render('readProfile', { Profiles, products });
  } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while fetching profiles and products.");
  }
});

//addProfile
app.post('/addProfile', upload.single('image'), async (req, res) => {
  try {
      const {  storename, name, description } = req.body;
      const image = req.file ? req.file.path : null; // Get file path
      await Profile.create({ image, storename, name, description });
      res.redirect('/readProfile'); // Redirect to the profile listing page
      console.log("Form data:", req.body);
console.log("File data:", req.file);

  } catch (error) {
      console.error("Error creating profile:", error);
      res.status(500).send("An error occurred while creating the profile.");
  }
});


// Route to render the Add Profile form
app.get('/addProfile', (req, res) => {
  res.render('addProfile');
});
app.post('/addProfile', async (req, res) => {
    try {
        const { image, storename, name, description } = req.body;
        await Profile.create({ image, storename, name, description });
        res.redirect('/readProfile'); // Redirect to the profile listing page
    } catch (error) {
        console.error("Error creating profile:", error);
        res.status(500).send("An error occurred while creating the profile.");
    }
});


// Route to render the Add Product form
app.get('/addProduct', async (req, res) => {
  const profiles = await Profile.find(); // Ensure there is at least one profile before adding a product
  if (profiles.length === 0) {
      return res.redirect('/readProfile'); // Redirect to readProfile if no profile exists
  }
  res.render('addProduct');
});


// Edit Profile
app.get('/editProfile/:id', async (req, res) => {
  let profile = await Profile.findById(req.params.id);
  res.render('editProfile', { profile });
});

// Update Profile
app.post('/updateProfile/:id', upload.single('image'), async (req, res) => {
  const { storename, name, description } = req.body;
  const image = req.file ? req.file.path : null;
  let updatedProfile = await Profile.findByIdAndUpdate(
    req.params.id,
    { image, storename, name, description },
    { new: true }
  );
  res.redirect('/readProfile');
});



// Delete Profile
app.get('/deleteProfile/:id', async (req, res) => {
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

app.post('/add-product', upload.single('image'), async (req, res) => {
  try {
      const { name, price, status } = req.body;
      const image = req.file ? req.file.path : null; // Save the file path
      const product = new Product({
          name,
          price,
          status,
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
app.get('/readProducts', async (req, res) => {
  let products = await Product.find();
  res.render('readProducts', { products });
});

// Server listening on port 3000
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
