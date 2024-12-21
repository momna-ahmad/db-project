const express = require("express");
let router = express.Router();

let User = require("../models/user.model");


const bcrypt = require('bcryptjs');
const session = require('express-session');
const cookieParser = require("cookie-parser"); 


router.use(cookieParser());
router.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
    }));


    
router.post('/login' , async(req,res)=>{
    const { username , password } = req.body;

  try {
      // Find the user by email
      const user = await User.findOne({ username });

      // If user does not exist
      if (!user) {
          return res.redirect("/sign-up");  // Redirect back to register page since user hasnt created an account
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

module.exports = router ;

