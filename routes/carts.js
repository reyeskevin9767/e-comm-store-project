const express = require('express');
const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../views/carts/show');

const router = express.Router();

//* Cart Post Route
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

  res.redirect('/cart');
});

//* Cart SHOW Route
// Recieve a get request to show all items in cart
router.get('/cart', async (req, res) => {
  if (!req.session.cartId) {
    return res.redirect('/');
  }

  const cart = await cartsRepo.getOne(req.session.cartId);

  for (let item of cart.items) {
    const product = await productsRepo.getOne(item.id);

    item.product = product;
  }

  res.send(cartShowTemplate({ items: cart.items }));
});

//* Cart DELETE Route
router.post('/cart/products/delete', async (req, res) => {
  const { itemId } = req.body;
  const cart = await cartsRepo.getOne(req.session.cartId);

  const items = cart.items.filter((item) => item.id !== itemId);

  await cartsRepo.update(req.session.cartId, { items });

  res.redirect('/cart');
});
// Receive a post request to delete an item from cart

module.exports = router;
