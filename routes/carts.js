const express = require('express');

const router = express.Router();

// Recieve a post request to add an item to a cart
router.post('/cart/products', (req, res) => {
  console.log(req.body.productId);

  res.send('Product Addded To Cart');
});

// Recieve a get request to show all items in cart

// REceive a post request to delete an item from cart

module.exports = router;
