const mongoose = require('mongoose');

const { Schema } = mongoose;

const OrderSchema = new Schema({
  items: [Number],
  user: Number,
  total: Number,
  shipping: Number,
  subTotal: Number,
  date: Date
})

module.exports = mongoose.model('Order', OrderSchema);
