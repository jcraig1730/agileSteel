const mongoose = require('mongoose');

const { Schema } = mongoose;

// mongoose.connect('mongodb://database/agileSteelOrders');

const OrderSchema = new Schema({
  items: [Number],
  user: Number,
  total: Number,
  shipping: Number,
  subTotal: Number,
  date: Date
})

module.exports = mongoose.model('Order', OrderSchema);
