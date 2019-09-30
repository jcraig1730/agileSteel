const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const controllers = require('../database/controllers');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get items by shape
app.get('/api/products/shape/:shape', (req, res) => {
  controllers.findProductsByShape(req, res);
})

// Get items by material
app.get('/api/products/material/:material', (req, res) => {
  controllers.findProductsByMaterial(req, res);
})

// Get single item
app.get('/api/products/:id', (req, res) => {
  controllers.findProduct(req, res)
})

// Create a new product
app.post('/api/products', (req, res) => {
  console.log('route hit')
  controllers.addProduct(req, res);
})

// Add item to cart
app.post('/api/users/cart', (req, res) => {
  controllers.updateCart(req, res);
})

// Remove item from cart
app.delete('/api/users/cart', (req, res) => {
  controllers.removeFromCart(req, res);
})

// Create a new user
app.post('/api/users', (req, res) => {
  controllers.addUser(req, res)
})

// Get total for items in cart
app.get('/api/users/cart/total', (req, res) => {
  controllers.calculateTotal(req, res);
})

// Checkout
// app.post('/api/users/cart/checkout', (req, res) => {
//   controllers.checkout(req, res);
// })



const PORT = process.env.PORT || 3000;


app.listen(PORT, () => console.log(`agileSteel running on port ${PORT}`));
