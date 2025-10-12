import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  avl_peices:{
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const Product = mongoose.model("Product", productSchema);

export default Product;
