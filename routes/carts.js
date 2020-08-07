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
  console.log(cart);
  // Either increment quantity for exisiting product
  // Or Add  product to items array

  res.send('Product Addded To Cart');
});

// Recieve a get request to show all items in cart

// REceive a post request to delete an item from cart

module.exports = router;
