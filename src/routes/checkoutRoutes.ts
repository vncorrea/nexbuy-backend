import express from 'express';
import Checkout from '../models/Checkout';

const Router = express.Router();

Router.get('/', async (req, res) => {
  try {
    const checkouts = await Checkout.find({});
    res.json(checkouts);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: errorMessage });
  }
});

Router.post('/create', async (req, res) => {
  try {
    const { userId, cartId, paymentMethod, total, status } = req.body;

    const checkout = new Checkout({
      userId,
      cartId,
      total,
      paymentMethod,
      status,
    });

    const createdCheckout = await checkout.save();
    res.status(201).json(createdCheckout);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: errorMessage });
  }
});

Router.put('/update/:id', async (req, res) => {
  try {
    const { userId, cartId, paymentMethod, total, status } = req.body;
    const checkoutId = req.params.id;

    if (!checkoutId) {
      res.status(400).json({ message: 'Checkout ID not found.' });
      return;
    }

    const checkout = await Checkout.findById(checkoutId);

    if (!checkout) {
      res.status(404).json({ message: 'Checkout not found.' });
      return;
    }

    checkout.userId = userId;
    checkout.cartId = cartId;
    checkout.total = total;
    checkout.status = status;
    checkout.paymentMethod = paymentMethod;

    const updatedCheckout = await checkout.save();
    res.json(updatedCheckout);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: errorMessage });
  }
});

Router.delete('/delete/:id', async (req, res) => {
  try {
    const checkoutId = req.params.id;

    if (!checkoutId) {
      res.status(400).json({ message: 'Checkout ID not found.' });
      return;
    }

    const checkout = await Checkout.findById(checkoutId);

    if (!checkout) {
      res.status(404).json({ message: 'Checkout not found.' });
      return;
    }

    await checkout.deleteOne();
    res.json({ message: 'Checkout removed' });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: errorMessage });
  }
});

export default Router;