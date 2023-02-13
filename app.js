const express = require('express')
const path = require("path");
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express()
// #############################################################################
// Logs all request paths and method
let products = [];
let orders = [];
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.set('x-timestamp', Date.now())
  res.set('x-powered-by', 'cyclic.sh')
  console.log(`[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.path}`);
  next();
});

// #############################################################################
// This configures static hosting for files in /public that have the extensions
// listed in the array.
var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
  index: ['index.html'],
  maxAge: '1m',
  redirect: false
}
app.use(express.static('public', options))

// #############################################################################
// Catch all handler for all other request.
app.use('*', (req,res) => {
  res.json({
      at: new Date().toISOString(),
      method: req.method,
      hostname: req.hostname,
      ip: req.ip,
      query: req.query,
      headers: req.headers,
      cookies: req.cookies,
      params: req.params
    })
    .end()
})

app.post('/product', (req, res) => {
  const product = req.body;

  // output the product to the console for debugging
  console.log(product);
  products.push(product);

  res.send('Product is added to the database');
});

app.get('/product', (req, res) => {
  res.json(products);
});

app.get('/product/:id', (req, res) => {
  // reading id from the URL
  const id = req.params.id;

  // searching products for the id
  for (let product of products) {
      if (product.id === id) {
          res.json(product);
          return;
      }
  }

  // sending 404 when not found something is a good practice
  res.status(404).send('Product not found');
});

app.delete('/product/:id', (req, res) => {
  // reading id from the URL
  const id = req.params.id;

  // remove item from the products array
  products = products.filter(i => {
      if (i.id !== id) {
          return true;
      }

      return false;
  });

  // sending 404 when not found something is a good practice
  res.send('Product is deleted');
});

app.post('/product/:id', (req, res) => {
  // reading id from the URL
  const id = req.params.id;
  const newProduct = req.body;

  // remove item from the products array
  for (let i = 0; i < products.length; i++) {
      let product = products[i]

      if (product.id === id) {
          products[i] = newProduct;
      }
  }

  // sending 404 when not found something is a good practice
  res.send('Product is edited');
});

app.post('/checkout', (req, res) => {
  const order = req.body;

  // output the product to the console for debugging
  orders.push(order);

  res.redirect(302, 'https://assettracker.cf');
});

app.get('/checkout', (req, res) => {
  res.json(orders);

});

module.exports = app
