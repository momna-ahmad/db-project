const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
    username: {
        type : string ,
        required: true ,
        unique : true ,
        minlength : 3 ,
      } ,
      name : string,
      password: {
        type : string,
        required : true 
      },
      product: [{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'product' 
      }] ,
      review : [{
        comment: string ,
        reviewer : {
            type: mongoose.Schema.Types.ObjectId ,
            ref: 'user'
        }
      }],
     
    //picture ?
    cart : {
        type: mongoose.Schema.Types.ObjectId ,
        ref: 'shoppingCart' 
    }
  });
  
  let userModel = mongoose.model("user", productSchema);
  
  module.exports = userModel;