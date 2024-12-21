import express from "express";
import Product from "../models/Product";

const Router = express.Router();

Router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
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
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
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
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
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
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
});

export default Router;
