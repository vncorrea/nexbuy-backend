import express from "express";
import Cart from "../models/Cart";
import User from "../models/User";

const Router = express.Router();

Router.get("/", async (req, res) => {
  try {
    const cart = await Cart.find({});
    res.json(cart);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: errorMessage });
  }
});

Router.post("/create", async (req, res) => {
  try {
    const { userId, cartItems } = req.body;

    if(!userId || !cartItems) {
      res.status(400).json({ message: "Invalid request. Please provide a userId and cartItems." });
      return;
    }

    const user = await User
      .findById(userId)
      .select("_id");

    if(!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const existingCart = await Cart.findOne({
      userId,
    });

    if (existingCart) {
      res.status(400).json({ message: "Cart already exists for this user." });
      return;
    }

    const anyItemNotValid = cartItems.some(
      (item: { productId: string; quantity: number }) => !item.productId || !item.quantity || item.quantity <= 0
    );

    if(anyItemNotValid) {
      res.status(400).json({ message: "Invalid cart item(s) provided." });
      return;
    }

    const cart = new Cart({
      userId,
      cartItems,
    });

    const createdCart = await cart.save();
    res.status(201).json(createdCart);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: errorMessage });
  }
});

Router.put("/update/:id", async (req, res) => {
  try {
    const { userId, cartItems } = req.body;
    const cartId = req.params.id;

    if (!cartId) {
      res.status(400).json({ message: "Cart ID not found." });
      return;
    }

    const cart = await Cart.findById(cartId);

    if (!cart) {
      res.status(404).json({ message: "Cart not found." });
      return;
    }

    const anyItemNotValid = cartItems.some(
      (item: { productId: string; quantity: number }) => !item.productId || !item.quantity || item.quantity <= 0
    );

    if(anyItemNotValid) {
      res.status(400).json({ message: "Invalid cart item(s) provided." });
      return;
    }

    cart.userId = userId;
    cart.cartItems = cartItems;

    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: errorMessage });
  }
});

Router.delete("/delete/:id", async (req, res) => {
  try {
    const cartId = req.params.id;

    if (!cartId) {
      res.status(400).json({ message: "Cart ID not found." });
      return;
    }

    const cart = await Cart.findById(cartId);

    if (!cart) {
      res.status(404).json({ message: "Cart not found." });
      return;
    }

    await cart.deleteOne();
    res.json({ message: "Cart removed" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: errorMessage });
  }
});

export default Router;
