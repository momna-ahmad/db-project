const mongoose = require("mongoose");


let productSchema = mongoose.Schema({
  name: {
    type : String ,
    required : true
  },
  category: {
    type : String ,
    required : true 
  },
  price: Number ,

  picture : [{
    name : String ,
    imgUrl : String
  }],

  seller : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  dateAdded : {
    type : Date  ,
    default : Date.now
  },
  isAvailable : {
    type : Boolean ,
    default : true
  } ,
  description : String ,
  
});

let ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;