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
  let cart = req.cookies.cart;
  cart = cart ? cart : [];
  console.log(cart) ;

  let productIds = cart.map((item) => item.id); // Extract product IDs from the cart
  let products = await Product.find({ _id: { $in: productIds } });

  // Calculate total amount of the products in the cart
  let totalAmount = 0;
  products = products.map((product) => {
    let cartItem = cart.find(
      (item) => item.id.toString() === product._id.toString()
    );
    let quantity = cartItem ? cartItem.quantity : 1; // Default quantity if not specified
    let amount = product.price * quantity;
    totalAmount += amount;

    return {
      ...product.toObject(),
      quantity,
      amount,
    };
  });

  // Pass both products, totalAmount, and a custom body content to the layout
  res.render("cart", {
    products,
    totalAmount,
    layout: "cartLayout", // Custom layout
    messages: req.flash("messages"), // Flash messages
  });
});


// Add to cart route
router.get("/add-to-cart/:id", async (req, res) => {
  let cart = req.cookies.cart || []; // Default to empty array if cart is not set

  if(cart.includes(req.params.id)){
    //flash mesage should be displayed that product is already added to cart
  }
  else
  {
    cart.push(req.params.id) ;
    // Save the updated cart in the cookie
    res.cookie("cart", cart);
  }

  

  // Flash success message
  req.flash("messages", "Product added to your cart!");

  const redirectUrl = req.get('Referer') || '/'; // Fallback to the home page if no referer is found
  res.redirect(redirectUrl);
});

router.post("/remove-product/:productId", (req, res) => {
  const productId = req.params.productId;
  let cart = req.cookies.cart || []; // Use cookies to access the cart (or use session if preferred)

  // Check if the product exists in the cart
  const productIndex = cart.findIndex(
    (item) => item.id.toString() === productId
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
