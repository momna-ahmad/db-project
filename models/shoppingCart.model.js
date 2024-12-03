const mongoose = require("mongoose");

let shoppingCartSchema = mongoose.Schema({
  count : int ,
  product : [{
    type : mongoose.Schema.Types.ObjectId ,
    ref : 'product'
  }]
});

let shoppingCartModel = mongoose.model("shoppingCart", shoppingCartSchema);

module.exports = shoppingCartModel;