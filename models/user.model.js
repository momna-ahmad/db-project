const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
    username: {
        type : String ,
        required: true ,
        unique : true ,
        minlength : 3 ,
      } ,
      name : String,
      password: {
        type : String,
        required : true 
      },
      product: [{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Product' 
      }] ,
      review : [{
        comment: String ,
        reviewer : {
            type: mongoose.Schema.Types.ObjectId ,
            ref: 'User'
        }
      }],
     
    
    cart : {
        type: mongoose.Schema.Types.ObjectId ,
        ref: 'ShoppingCart' 
    } ,

    location : {
      city: String ,
      address: String,
      country : String
    }

    
  });
  
  let userModel = mongoose.model("User", userSchema);
  
  module.exports = userModel;