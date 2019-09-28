const mongoose = require('mongoose')
const { mongoConfig } = require('../../config/atlasKey.js');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

mongoose.connect(mongoConfig, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Mongo running'))
  .catch(err => console.log(err))


const findProductsByShape = (req, res) => {
  const { shape } = req.params;
  Product.find({ shape })
    .then(data => res.status(200).json(data))
    .catch(err => res.send(err));
}

const findProductsByMaterial = (req, res) => {
  const { material } = req.params;
  Product.find({ material })
    .then(data => res.json(data))
    .catch(err => res.json(err));
}

const addProduct = (req, res) => {
  const itemData = req.body;
  console.log(itemData)
  let newItem = new Product(itemData);
  newItem.save()
    .then(savedItem => res.status(201).json(savedItem))
    .catch(err => res.status(400).json(err))

}

module.exports = {
  findProductsByShape,
  findProductsByMaterial,
  addProduct
}