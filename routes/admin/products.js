const express = require('express');
const { validationResult } = require('express-validator');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const { requireTitle, requirePrice } = require('./validators');
const router = express.Router();

//* Products SHOW Route
router.get('/admin/products', (req, res) => {});

//* Products NEW Route
router.get('/admin/products/new', (req, res) => {
  res.send(productsNewTemplate({}));
});

router.post('/admin/products/new', [requireTitle, requirePrice], (req, res) => {
  const errors = validationResult(req);
  console.log(req.body);
  res.send('submitted');
});

module.exports = router;
