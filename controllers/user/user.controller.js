const express = require('express');
const router = express.Router();
let Product = require("../../models/product.model");

// Men Clothing route
router.get('/mensclothing', async (req, res) => {
  try {
    const products = await Product.find({ category: 'Men Clothing' });
    res.render("MensClothing", {
      layout: 'allProductTypeLayout',
      products,
    });
  } catch (error) {
    console.error('Error fetching Men Clothing products:', error.message);
    res.status(500).send('Error fetching Men Clothing products');
  }
});

// Women Clothing route
router.get('/womenclothing', async (req, res) => {
  try {
    const products = await Product.find({ category: 'Women Clothing' });
    res.render('WomenClothing', {
      layout: 'allProductTypeLayout',
      products,
    });
  } catch (error) {
    console.error('Error fetching Women Clothing products:', error.message);
    res.status(500).send('Error fetching Women Clothing products');
  }
});

// Accessories route
router.get('/accessories', async (req, res) => {
  try {
    const products = await Product.find({ category: 'Accessories' });
    res.render('Accessories', {
      layout: 'allProductTypeLayout',
      products,
    });
  } catch (error) {
    console.error('Error fetching Accessories products:', error.message);
    res.status(500).send('Error fetching Accessories products');
  }
});

// Footwear route
router.get('/footwear', async (req, res) => {
  try {
    const products = await Product.find({ category: 'Footwear' });
    res.render('Footware', {
      layout: 'allProductTypeLayout',
      products,
    });
  } catch (error) {
    console.error('Error fetching Footwear products:', error.message);
    res.status(500).send('Error fetching Footwear products');
  }
});

// Vintage Pieces route
router.get('/vintagepieces', async (req, res) => {
  try {
    const products = await Product.find({ category: 'Vintage Pieces' });
    res.render('VintagePieces', {
      layout: 'allProductTypeLayout',
      products,
    });
  } catch (error) {
    console.error('Error fetching Vintage Pieces products:', error.message);
    res.status(500).send('Error fetching Vintage Pieces products');
  }
});

module.exports = router;
