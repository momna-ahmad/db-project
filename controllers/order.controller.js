const express = require("express");
const router = express.Router();
const Order = require("../models/order.model");
const Product = require("../models/product.model");

//shafqaat 
// GET: Orders placed by the logged-in user (as a buyer)
router.get("/your-order", async (req, res) => {
    try {
        const userId = req.session.user._id;
  
        // Fetch orders where the logged-in user is the buyer
        const userOrders = await Order.find({ buyer: userId })
            .populate("product", "name price category")
            .lean();
  
        res.render("yourOrder", {
            orders: userOrders,
            layout:"basiclayout",
            error: null,
        });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).render("yourOrder", {
            layout:"basiclayout",
            orders: [],
            error: "Unable to fetch your orders. Please try again later.",
        });
    }
  });
  
  // GET: Orders received on products sold by the logged-in user (as a seller)
  router.get("/shop-order", async (req, res) => {
    try {
        const userId = req.session.user._id;
  
        // Fetch products owned by the logged-in user
        const userProducts = await Product.find({ seller: userId }).select("_id").lean();
  
        // Extract product IDs for matching
        const productIds = userProducts.map(product => product._id);
  
        // Fetch orders containing the user's products
        const shopOrders = await Order.find({ product: { $in: productIds } })
            .populate("product", "name price category")
            .populate("buyer", "username email")
            .lean();
  
        res.render("shopOrder", {
            orders: shopOrders,
            layout:"basiclayout",
            error: null,
        });
    } catch (error) {
        console.error("Error fetching shop orders:", error);
        res.status(500).render("shopOrder", {
            layout:"basiclayout",
            orders: [],
            error: "Unable to fetch shop orders. Please try again later.",
        });
    }
  });
  
  
  //status
  router.post("/admin/update-order-status", async (req, res) => {
  const { orderId, status } = req.body;
  
  try {
      // Validate status value
      if (!['pending', 'shipped', 'delivered', 'cancelled'].includes(status)) {
          throw new Error("Invalid status value.");
      }
  
      // Update the order's status
      await Order.findByIdAndUpdate(orderId, { status }, { new: true });
  
      // Redirect back to the shop orders page
      res.redirect("/shopOrder");
      
  } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).send("Failed to update order status. Please try again.");
  }
  });
  

module.exports = router;