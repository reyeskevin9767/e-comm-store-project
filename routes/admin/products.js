const express = require('express');
const multer = require('multer');

const { handleErrors, requireAuth } = require('./middlewares');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index');
const productsEditTemplate = require('../../views/admin/products/edit');
const { requireTitle, requirePrice, requireImage } = require('./validators');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

//* Products SHOW Route
router.get('/admin/products', requireAuth, async (req, res) => {
  const products = await productsRepo.getAll();
  res.send(productsIndexTemplate({ products }));
});

//* Products NEW Route
router.get('/admin/products/new', requireAuth, (req, res) => {
  res.send(productsNewTemplate({}));
});

//* Products CREATE Route
// Not The best way to save images, avoid in production applications
router.post(
  '/admin/products/new',
  requireAuth,
  upload.single('image'),
  [requireTitle, requirePrice, requireImage],
  handleErrors(productsNewTemplate),
  async (req, res) => {
    const image = req.file.buffer.toString('base64');
    const { title, price } = req.body;

    // Save into products.json
    await productsRepo.create({ title, price, image });
    res.redirect('/admin/products');
  }
);

//* Products Edit Route
router.get('/admin/products/:id/edit', requireAuth, async (req, res) => {
  const product = await productsRepo.getOne(req.params.id);

  if (!product) {
    return res.send('Product not found');
  }

  res.send(productsEditTemplate({ product }));
});

//* Products Edit Post Route
router.post('./admin/products/:id/edit', requireAuth, async (req, res) => {});

module.exports = router;
