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
  //picture ?
  date : date ,
  isAvailable : boolean ,
  description : string 
});

let ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;