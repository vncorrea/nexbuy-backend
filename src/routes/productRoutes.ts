import express from "express";
import Product from "../models/Product";

const Router = express.Router();

Router.post("/create", async (req, res) => {
    try {
        const { name, price, description, image, category, countInStock } = req.body;

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
        res.status(500).json({ message: "Server Error" });
    }
});

export default Router;
