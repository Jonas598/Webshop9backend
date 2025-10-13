import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  products: [
    {product_name:{
    type: String,
    required: true,
  },
  product_desc:{
    type:String,
    required: true,
  },
  product_weight:{
    type:Number,
    required: true,
  },
  product_price:{
    type:Number,
    required: true,
  },
  product_quantity:{
    type:Number,
    required: true,
  }

}
  ],
  total_price:{
    type: Number,
    required: true,
  },
  order_status:{
    type: String,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  }
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
