import express from "express";
import Product from "../models/Product";

const Router = express.Router();

Router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: errorMessage });
  }
});

Router.post("/create", async (req, res) => {
  try {
    const { name, price, description, image, category, countInStock } =
      req.body;

    const product = new Product({
      name,
      price,
      description,
      image,
      category,
      countInStock,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: errorMessage });
  }
});

Router.put("/update/:id", async (req, res) => {
  try {
    const { name, price, description, image, category, countInStock } =
      req.body;
    const productId = req.params.id;

    if (!productId) {
      res.status(400).json({ message: "Product ID not found." });
      return;
    }

    const product = await Product.findById(productId);

    if (!product) {
      res.status(404).json({ message: "Product not found." });
      return;
    }

    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: errorMessage });
  }
});

Router.delete("/delete/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      res.status(400).json({ message: "Product ID not found." });
      return;
    }

    const product = await Product.findById(productId);

    if (!product) {
      res.status(404).json({ message: "Product not found." });
      return;
    }

    await product.deleteOne();
    res.json({ message: "Product removed." });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: errorMessage });
  }
});

export default Router;
