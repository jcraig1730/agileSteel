const mongoose = require('mongoose')
const { parseString } = require('xml2js')
const { mongoConfig } = require('../../config/atlasKey.js');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const axios = require('axios');
const uspsKeys = require('../../config/uspsKey');

const dimensionalWeightDivisor = 139



mongoose.connect(`mongodb://127.0.0.1:27017/agileSteel`, { useNewUrlParser: true })
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

const findProduct = (req, res) => {
  const _id = req.params.id;
  Product.find({ _id })
    .then(productData => res.status(200).json(productData))
    .catch(err => res.status(400).json(err));
}

const addProduct = (req, res) => {
  const itemData = req.body;
  const newItem = new Product(itemData);
  newItem.save()
    .then(savedItem => res.status(201).json(savedItem))
    .catch(err => res.status(400).json(err))
}

const addUser = (req, res) => {
  const userData = req.body;
  const newData = new User(userData);
  newData.save()
    .then(savedUser => res.status(201).json(savedUser))
    .catch(err => res.status(400).json(err));
}

const updateCart = (req, res) => {
  let { partNumber, user, quantity, length } = req.body;
  User.findById(user)
    .then(user => {
      const itemInCart = user.cart.filter(item => item.partNumber === partNumber && item.length === Number(length));
      if (itemInCart.length > 0) {
        itemInCart[0].quantity += Number(quantity)
      } else {
        user.cart.push({ partNumber, quantity, length });
      }
      user.save()
        .then(user => res.status(201).json(user.cart))
        .catch(err => res.status(400).json(err))
    })
    .catch(err => res.status(400).json(err))
}

const removeFromCart = (req, res) => {
  let { item, user } = req.body;
  User.findById(user)
    .then(user => {
      while (user.cart.includes(item)) {
        user.cart.splice(user.cart.indexOf(item), 1);
      }
      user.save()
        .then(user => res.status(201).json(user.cart))
        .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(400).json(err));
}

const calculateTotal = async (req, res) => {
  const { user } = req.body;
  let total = 0;
  let shipping = 0;
  let tax = 0;
  let subtotal = 0
  let totalWeight = 0;
  let totalHeight = 0;
  let widestItem;
  let tallestItem;
  let longestItem;
  let customerZip;
  User.findById(user)
    .then(user => {
      customerZip = user.zip
      user.cart.forEach(item => {
        Product.findById(item.partNumber)
          .then(itemData => {
            const { weightPerFoot, pricePerPound } = itemData;
            const { quantity, length } = item;
            const itemWeight = weightPerFoot * (length / 12)
            let itemTotal = itemWeight * quantity * pricePerPound;
            itemTotal = itemTotal.toFixed(2);

            total += Number(itemTotal);

            let dims = checkWidthAndHeight(itemData);

            if (dims.height > tallestItem || !tallestItem) {
              tallestItem = dims.height;
            }
            if (dims.width > widestItem || !widestItem) {
              widestItem = dims.width;
            }
            if (length > longestItem || !longestItem) {
              longestItem = length;
            }
            console.log(widestItem)
            totalWeight += itemWeight;

            totalHeight += dims.height;
          })
      })
    })

  setTimeout(() => {
    findShippingCost(totalWeight, totalHeight, longestItem, widestItem, customerZip, (err, result) => {
      shipping = result;
      tax = (total * 0.0825).toFixed(2);
      subtotal = Number(total) + Number(shipping) + Number(tax)
      let response = { total, tax, shipping, subtotal }
      res.status(200).json(response)
    })

  }, 100)

}

async function findShippingCost(totalWeight, totalHeight, longestItem, widestItem, customerZip, callback) {
  const dimensionalWeight = (totalHeight * widestItem * longestItem) / dimensionalWeightDivisor;
  const shippingWeight = dimensionalWeight > totalWeight ? dimensionalWeight : totalWeight;
  let ounces = (shippingWeight % 1);
  const pounds = shippingWeight - ounces;
  ounces = Math.ceil(ounces * 16);

  const xmlReq = `https://secure.shippingapis.com/shippingapi.dll?API=RateV4&XML=<RateV4Request USERID="${uspsKeys.uspsUser}">
    <Revision>2</Revision>
  <Package ID="1ST">
  <Service>PRIORITY</Service>
  <ZipOrigination>94115</ZipOrigination>
  <ZipDestination>${customerZip}</ZipDestination>
  <Pounds>${pounds}</Pounds>
  <Ounces>${ounces}</Ounces>
  <Container>VARIABLE</Container>
  <Width>${widestItem + 2}</Width>
  <Length>${longestItem + 2}</Length>
  <Height>${totalHeight}</Height>
  <Girth></Girth>
  <Machinable>false</Machinable>
  </Package>
  </RateV4Request>`
  let result;
  await axios.get(xmlReq)
    .then(data => {
      parseString(data.data, (err, resp) => {
        result = (resp.RateV4Response.Package[0].Postage[0].Rate[0])
      })
    })
  result ? callback(null, result) : callback('Could not get shipping cost', null)
}

function checkWidthAndHeight(item) {
  let height;
  let width;
  if (item.diameter) {
    height = diameter;
    width = diameter;
  } else if (item.leg1) {
    height = item.leg1;
    width = item.leg2;
  } else if (!item.height) {
    height = item.thickness;
    width = item.width;
  }
  height = fractionToDecimal(height);
  width = fractionToDecimal(width)
  return { height, width }
}

function fractionToDecimal(number) {
  let fractionNumbers;
  if (number.includes('-')) {
    number = number.split('-');
    fractionNumbers = number[1].split('/');
    number = Number(number[0]) + (fractionNumbers[0] / fractionNumbers[1])
  } else if (number.includes('/')) {
    fractionNumbers = number.split('/');
    number = fractionNumbers[0] / fractionNumbers[1];
  } else {
    number = Number(number)
  }
  return number
}

module.exports = {
  findProductsByShape,
  findProductsByMaterial,
  addProduct,
  addUser,
  findProduct,
  updateCart,
  removeFromCart,
  calculateTotal
}
