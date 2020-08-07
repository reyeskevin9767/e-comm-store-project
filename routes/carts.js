const express = require('express');
const cartsRepo = require('../repositories/carts');
const carts = require('../repositories/carts');

const router = express.Router();

// Recieve a post request to add an item to a cart
router.post('/cart/products', async (req, res) => {
  let cart;
  if (!req.session.cartId) {
    // Create cart and set id to req.session.cartId
    cart = await cartsRepo.create({ items: [] });
    req.session.cartId = cart.id;
  } else {
    // get cart from repository
    cart = await cartsRepo.getOne(req.session.cartId);
  }

  // Find product in cart
  const exisitingItem = cart.items.find(
    (item) => item.id === req.body.productId
  );

  if (exisitingItem) {
    // increment quantity and save cart
    exisitingItem.quantity++;
  } else {
    // ad new product id to items array
    cart.items.push({ id: req.body.productId, quantity: 1 });
  }

  await cartsRepo.update(cart.id, { items: cart.items });

  res.send('Product Addded To Cart');
});

// Recieve a get request to show all items in cart

// REceive a post request to delete an item from cart

module.exports = router;
