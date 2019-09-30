const mongoose = require('mongoose');
const { mongoConfig } = require('../../config/atlasKey.js');

const { Schema } = mongoose;

const ProductSchema = new Schema({
  shape: String,
  width: String,
  height: String,
  diameter: String,
  wall: String,
  material: String,
  thickness: String,
  leg1: String,
  leg2: String,
  weightPerFoot: Number,
  pricePerPound: Number,
  stock: Number
});

module.exports = mongoose.model('Product', ProductSchema);
