const mongoose = require("mongoose");


let productSchema = mongoose.Schema({
  name: {
    type : string ,
    required : true
  },
  category: {
    type : string ,
    required : true 
  },
  price: int ,

  picture : [{
    name : string ,
    imgUrl : string
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
    type : boolean ,
    default : true
  } ,
  description : string ,
  
});

let ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;