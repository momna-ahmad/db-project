const express = require("express");
let router = express.Router();

let User = require("../models/user.model");

const bcrypt = require("bcryptjs");

const Product = require("../models/product.model");

router.get("/login", (req, res) => {
  return res.render("partials/loginform", { layout: "profileForm" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ username });

    // If user does not exist
    if (!user) {
      return res.redirect("/admin/sign-in"); // Redirect back to register page since user hasnt created an account
    }

    // Compare the password provided by the user with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("redirecting back to login");
      return res.redirect("/login"); // Redirect back to login page on incorrect password
    }

    // Set user session (ensure the role is correctly assigned)
    //req.session.user = user;  // Store the whole user object in session

    // Ensure the role is properly checked and set

    req.session.user = user;
    console.log("session" + req.session.user);

    return res.redirect("/?btn=partials/logout-tag"); // Regular user redirected to homepage
  } catch (error) {
    console.error(error);
    return res.redirect("/login"); // Redirect back to login page on error
  }
});

router.get("/user/logout", (req, res) => {
  req.session.user = null;
  res.clearCookie("cart");
  res.redirect("/");
});

// Route to render the Add Profile form
router.get("/register", (req, res) => {
  res.render("partials/sign-in.ejs", {
    layout: "profileForm",
  });
});

router.post("/register", async (req, res) => {
  try {
    let { username, password, name } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send("Username already exists.");
    }

    // Create new user
    let newUser = new User({ username, password, name });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    // Save user to the database
    await newUser.save();

    // Redirect to login page
    res.redirect("/login");

    //const { username, password, name } = req.body;
    //await user.create({ username,password, name});
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).send("An error occurred while creating the profile.");
  }
});

// the user which has logged in is shown thier personal profile with registered products
router.get("/readProfile", async (req, res) => {
  try {
    let user = new User(req.session.user);
    const products = await Product.find({ seller: req.session.user._id });

    return res.render("readProfile", {
      layout: "profilelayout",
      user,
      products,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while fetching profiles and products.");
  }
});

module.exports = router;