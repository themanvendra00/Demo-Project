const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
  },
  description: {
    type: String,
    required: true,
    minlength: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: ["Electronics", "Clothing", "Books", "Toys", "Other"],
  },
  manufacturer: {
    type: String,
    required: true,
    minlength: 1,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = {Product};
