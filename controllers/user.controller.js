const express = require("express");
let router = express.Router();

let User = require("../models/user.model");


const bcrypt = require('bcryptjs');
const session = require('express-session');
const cookieParser = require("cookie-parser"); 
const ProductModel = require("../models/product.model");


router.use(cookieParser());
router.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
    }));

router.get('/login', (req,res)=>{
    return res.render('partials/loginform' , {layout : 'profileForm'}) ;
});
    
router.post('/login' , async(req,res)=>{
    const { username , password } = req.body;

  try {
      // Find the user by email
      const user = await User.findOne({ username });

      // If user does not exist
      if (!user) {
          return res.redirect('/admin/sign-in');  // Redirect back to register page since user hasnt created an account
      }

      // Compare the password provided by the user with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
          return res.redirect("/login");  // Redirect back to login page on incorrect password
      }

      // Set user session (ensure the role is correctly assigned)
      //req.session.user = user;  // Store the whole user object in session

      // Ensure the role is properly checked and set
    
      req.session.user = user;
      console.log(user) ;
    
     return res.redirect("/?btn=partials/logout-tag");  // Regular user redirected to homepage

  } catch (error) {
      console.error(error);
      return res.redirect("/login");  // Redirect back to login page on error
  }
});

router.get("/user/logout", (req,res)=>{
    req.session.user = null ;
    res.clearCookie('cart');
    res.redirect('/') ;
});


// Route to render the Add Profile form
router.get('/register', (req, res) => {
  
    res.render('partials/sign-in.ejs' , {
      layout : 'profileForm' 
    });
  });
  
 router.post('/register', async (req, res) => {
    
      try {
        let data = req.body ;
        let newUser = new User(data) ;
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, salt);
        
        await newUser.save(); 
        res.redirect("/login") 
        
          //const { username, password, name } = req.body;
          //await user.create({ username,password, name});
          
      } catch (error) {
          console.error("Error creating profile:", error);
          res.status(500).send("An error occurred while creating the profile.");
      }
  });


  // the user which has logged in is shown thier personal profile with registered products
router.get('/readProfile', async (req, res) => {
    try {
        console.log(req.session.user) ;
        let user = new User(req.session.user) ;
        let products = await User.findById(req.session.user._id).populate('product') ;
      
  
      return res.render("readProfile", { 
        layout: 'profilelayout', 
        user, 
        products 
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while fetching profiles and products.");
    }
  });
  
  

module.exports = router ;
