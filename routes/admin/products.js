const express = require('express');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const router = express.Router();

//* Products SHOW Route
router.get('/admin/products', (req, res) => {});

//* Products NEW Route
router.get('/admin/products/new', (req, res) => {
  res.send(productsNewTemplate({}));
});

module.exports = router;
