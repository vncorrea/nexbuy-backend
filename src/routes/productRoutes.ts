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
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
});

export default Router;
