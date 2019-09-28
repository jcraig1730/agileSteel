const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const controllers = require('../database/controllers');


app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get item by shap
app.get('/api/products/shape/:shape', (req, res) => {
  controllers.findProductsByShape(req, res);
})

// Get item by material
app.get('/api/products/material/:material', (req, res) => {
  controllers.findProductsByMaterial(req, res);
})

app.post('/api/products', (req, res) => {
  controllers.addProduct(req, res);
})

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => console.log(`agileSteel running on port ${PORT}`));
