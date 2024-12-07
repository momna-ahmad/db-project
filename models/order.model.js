const mongoose = require("mongoose");


let orderSchema = mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      products: [{
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'product',
        }
      }],
      totalAmount: {
        type: Number,
        required: true,
      },
      //status: {
      //  type: String,
      //  enum: ['pending', 'shipped', 'delivered', 'cancelled'],
      //  default: 'pending',
      //},
      orderDate: {
        type: Date,
        default: Date.now,
      },
      location : {
        country: {
          type : String ,
          requred: true
        },
        city : {
            type : String ,
            required : true 
        },
        address : {
            type : String ,
            required : true 
        }
      }
});

let orderModel = mongoose.model("order", orderSchema);

module.exports = orderModel;