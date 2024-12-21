import express from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import validator from "validator";

const Router = express.Router();

Router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: errorMessage });
  }
});

Router.post("/register", async (req, res) => {
  try {
    const { name, email, password, isAdmin = false } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "Please enter all fields" });
      return;
    }

    if (!validator.isEmail(email)) {
      res.status(400).json({ message: "Please enter a valid email" });
      return;
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const user = new User({
      name,
      email,
      password,
      isAdmin,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    const createdUser = await user.save();
    res.status(201).json(createdUser);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: errorMessage });
  }
});

Router.put("/update/:id", async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;
    const userId = req.params.id;

    if (!userId) {
      res.status(400).json({ message: "User ID not found." });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    if (!validator.isEmail(email)) {
      res.status(400).json({ message: "Please enter a valid email" });
    }

    user.name = name;
    user.email = email;
    user.isAdmin = isAdmin;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: errorMessage });
  }
});

Router.delete("/delete/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      res.status(400).json({ message: "User ID not found." });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    await user.deleteOne();
    res.json({ message: "User removed" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: errorMessage });
  }
});

Router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Please enter all fields" });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    res.json(user);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: errorMessage });
  }
});

export default Router;
