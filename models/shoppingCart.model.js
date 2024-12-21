const mongoose = require("mongoose");

let shoppingCartSchema = mongoose.Schema({
  count : Number ,
  items : [{
    type : mongoose.Schema.Types.ObjectId ,
    ref : 'Product'
  }]
});

let shoppingCartModel = mongoose.model("ShoppingCart", shoppingCartSchema);

module.exports = shoppingCartModel;