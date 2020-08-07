//* Creates web server
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const adminProductsRouter = require('./routes/admin/products');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();

app.use(express.static('public'));
//* All router handles will use middleware to parse data
app.use(bodyParser.urlencoded({ extended: true }));

//* Use cookies to have unique users
app.use(
  cookieSession({
    keys: ['adfd2342f323243dsfay789784r2d'],
  })
);

//* Run routes from other files
app.use(authRouter);
app.use(productsRouter);
app.use(adminProductsRouter);
app.use(cartsRouter);

//* Start up server
app.listen(3000, () => {
  console.log('Listening');
});

//* NOT MEANT FOR PRODUCTION USE
//* Express Server -> Data Store(users, products) -> Hard Drive (products, users)
//* Problems with using storing data on hard drive
//* Will error if we try to open/write to the same file twice at the same time
//* Won't work if we have multiple servers running on different machines
//* We have to write to the File System every time we want to update some data
