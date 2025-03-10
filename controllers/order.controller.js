const express = require("express");
const router = express.Router();
const Order = require("../models/order.model");
const Product = require("../models/product.model");

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
            orders: [],
            error: "Unable to fetch your orders. Please try again later.",
        });
    }
});

// GET: Orders received on products sold by the logged-in user (as a seller)
router.get("/shop-order", async (req, res) => {
    try {
        const userId = req.session.user._id;
        console.log("Logged-in user ID:", userId);

        const userProducts = await Product.find({ seller: userId }).select("_id").lean();
        console.log("User products:", userProducts);

        const productIds = userProducts.map(product => product._id);
        console.log("Product IDs:", productIds);

        const shopOrders = await Order.find({ product: { $in: productIds } })
            .populate("product", "name price category")
            .populate("buyer", "username email")
            .lean();
        console.log("Shop orders:", shopOrders);

        res.render("shopOrder", {
            orders: shopOrders,
            layout: "basiclayout",
            error: null,
        });
    } catch (error) {
        console.error("Error fetching shop orders:", error);
        res.status(500).render("shopOrder", {
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
      let order = await Order.findById(orderId) ;
      order.status = status ;
      order.save() ;
      //await Order.findByIdAndUpdate(orderId, { status }, { new: true });
console.log(order) ;
      // Redirect back to the shop orders page
      res.redirect("/shop-order");
      
  } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).send("Failed to update order status. Please try again.");
  }
});

module.exports = router;

