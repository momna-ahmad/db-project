const express = require("express");
const Order = require("../models/order.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");


const router = express.Router();

// Render checkout page
router.get("/checkout", async (req, res) => {
    try {
        const user = req.session.user; 
        if (!user) return res.redirect("/login");

        // Fetch user's cart
        const cart = req.cookies.cart ;
        console.log(cart) ;
        if (!cart || cart.length === 0) {
            return res.status(400).render("checkoutForm", {
                error: "Your cart is empty.",
                cart: [],
                totalAmount: 0,
            });
        }

        let products = await Product.find({ _id: { $in: cart } });
        console.log(products) ;
        // Calculate total amount
        let totalAmount = products.reduce((sum, product) => sum + product.price, 0);
        
        return res.render("checkoutForm", {
            layout : 'profilelayout' ,
            error: null,
            cart,
            products,
            totalAmount,
        });
    } catch (error) {
        console.error("Error loading checkout page:", error);
        res.status(500).send("Server error");
    }
});

// Handle checkout form submission
router.post("/checkout", async (req, res) => {
    const { country, city, address, payment } = req.body;

    try {
        const buyer = req.session.user; // Assuming user is stored in the session
        if (!buyer) return res.redirect("/login");

       

        // Create orders for each product in the cart
        
        for (const product of req.cookies.cart) {
            let item = await Product.findById(product).select('price')
console.log(item) ;
            // Create order object
            const order = new Order({
                buyer,
                product ,
                totalAmount: item.price, // Single product price
                location: {
                    country,
                    city,
                    address,
                },
                orderDate: new Date(),
                payment
            });

            await order.save();
        }

       
        req.cookies.cart = null ;
        console.log(req.cookies.cart) ;
        res.render("success" , {layout : 'success' , name :req.session.user.name  });
    } catch (error) {
        console.error("Error processing order:", error);
        res.status(500).render("checkoutForm", {
            layout : 'profileform',
            name : req.session.user.name ,
            error: "An error occurred while processing your order. Please try again.",
            cart: req.session.cart || [],
            totalAmount: req.session.totalAmount || 0,
        });
    }
});

//hira filtering products 
// Route for filtering products by price
router.get('/products/under/:filter', async (req, res) => {
  try {
    let maxPrice;

    // Determine the max price based on the filter parameter
    switch (req.params.filter) {
      case '10':
        maxPrice = 10;
        break;
      case '50':
        maxPrice = 50;
        break;
      case '100':
        maxPrice = 100;
        break;
      default:
        return res.status(404).send('Invalid filter.');
    }

    // Fetch products with price less than or equal to the max price
    const products = await Product.find({ price: { $lte: maxPrice } });

    // Pagination logic (optional)
    let page = req.query.page ? Number(req.query.page) : 1;
    let pageSize = 6; // Number of products per page
    let totalRecords = products.length;
    let totalPages = Math.ceil(totalRecords / pageSize);

    // Paginate products
    const paginatedProducts = products.slice((page - 1) * pageSize, page * pageSize);

    // Render the filtered products on the page
    res.render('partials/searchproducts', {
      products: paginatedProducts,
      layout: 'basiclayout', // Assuming layout is applied
      maxPrice,
      page,
      pageSize,
      totalPages,
      totalRecords,
      message: products.length ? null : 'No products found in this price range.',
    });
  } catch (error) {
    console.error('Error filtering products:', error);
    res.status(500).send('An error occurred while filtering products.');
  }
});

// Route for custom price filter
router.get('/products/custom', async (req, res) => {
  try {
    const maxPrice = parseInt(req.query.price, 10);

    if (isNaN(maxPrice) || maxPrice < 0) {
      return res.status(400).send('Invalid price input.');
    }

    const products = await Product.find({ price: { $lte: maxPrice } });
    // Pagination logic (optional)
    let page = req.query.page ? Number(req.query.page) : 1;
    let pageSize = 6; // Number of products per page
    let totalRecords = products.length;
    let totalPages = Math.ceil(totalRecords / pageSize);

    // Paginate products
    const paginatedProducts = products.slice((page - 1) * pageSize, page * pageSize);

    // Render the filtered products on the page
    res.render('partials/searchproducts', {
      products: paginatedProducts,
      layout: 'basiclayout',
      maxPrice,
      page,
      pageSize,
      totalPages,
      totalRecords,
      message: products.length ? null : 'No products found in this price range.',
    });
  } catch (error) {
    console.error('Error with custom price filter:', error);
    res.status(500).send('An error occurred while filtering products.');
  }
});

module.exports = router;