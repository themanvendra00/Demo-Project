const express = require("express");

const { Product } = require("../models/product.model");
const authenticator = require("../middlewares/authenticator");

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
});

productRouter.post("/", authenticator, async (req, res) => {
  const { name, description, price, quantity, category, manufacturer } =
    req.body;
  try {
    const newProduct = new Product({
      name,
      description,
      price,
      quantity,
      category,
      manufacturer,
    });
    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully!", product: newProduct });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
});

productRouter.patch("/:ID", authenticator, async (req, res) => {
  const ID = req.params.ID;
  const payload = req.body;
  try {
    const product = await Product.findByIdAndUpdate({ _id: ID }, payload);

    if (!product) {
      res.status(404).json({ message: `Product with ${ID} not found!` });
    } else {
      res.status(200).json({ message: "Product Updated Successfully!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
});

productRouter.delete("/:ID", authenticator, async (req, res) => {
  const ID = req.params.ID;
  try {
    const product = await Product.findByIdAndDelete({ _id: ID });
    if (!product) {
      res.status(404).json({ message: `Product with ${ID} not found!` });
    } else {
      res.status(200).json({ message: "Product Deleted Successfully!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
});

module.exports = productRouter;
