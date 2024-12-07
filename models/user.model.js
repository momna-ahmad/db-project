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
        ref: 'product' 
      }] ,
      review : [{
        comment: String ,
        reviewer : {
            type: mongoose.Schema.Types.ObjectId ,
            ref: 'user'
        }
      }],
     
    //picture ?
    cart : {
        type: mongoose.Schema.Types.ObjectId ,
        ref: 'shoppingCart' 
    } ,

    location : {
      city: String ,
      address: String,
      country : String
    }

    
  });
  
  let userModel = mongoose.model("user", userSchema);
  
  module.exports = userModel;