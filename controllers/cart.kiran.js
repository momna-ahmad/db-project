const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

const OrderModel = require("../models/order.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");


router.use(cookieParser());
router.use(
  session({
    secret: "SecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
router.use(flash());
router.use((req, res, next) => {
  res.locals.messages = req.flash("messages");
  next();
});

// Cart page route
router.get("/cart", async (req, res) => {
  let cart = req.cookies.cart || []; // Default to empty array if cart is not set
  console.log(cart);

  let products = await Product.find({ _id: { $in: cart } });

  // Calculate total amount
  let totalAmount = products.reduce((sum, product) => sum + product.price, 0);

  res.render("cart", {
    products,
    totalAmount,
    layout: "cartLayout", // Optional custom layout
    messages: req.flash("messages"), // Flash messages
  });
});


// Add to cart route
router.get("/add-to-cart/:id", async (req, res) => {
  let cart = req.cookies.cart || [];

  if (cart.includes(req.params.id)) {
    req.flash("messages", "Product is already in the cart!");
  } else {
    cart.push(req.params.id);
    res.cookie("cart", cart);
    req.flash("messages", "Product added to your cart!");
  }

  const redirectUrl = req.get("Referer") || "/";
  res.redirect(redirectUrl);
});

router.get("/remove-product/:productId", (req, res) => {
  const productId = req.params.productId;
  let cart = req.cookies.cart || []; // Use cookies to access the cart (or use session if preferred)

  // Ensure cart items are compared as strings
  const productIndex = cart.findIndex(
    (item) => item && item.toString() === productId
  );

  if (productIndex !== -1) {
    // Remove the product from the cart
    cart.splice(productIndex, 1);
  }

  res.cookie("cart", cart);

  // Redirect back to the cart page with a flash message
  req.flash("messages", "Product removed from the cart!");
  res.redirect("/cart");
});

module.exports = router;
