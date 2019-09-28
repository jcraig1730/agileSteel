const mongoose = require('mongoose');

const { Schema } = mongoose;

// mongoose.connect('mongodb://database/agileSteelUsers');

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  address: String,
  city: String,
  state: String,
  zip: Number,
  phone: Number,
  orders: [Number],
  cart: [Number]
})

module.exports = mongoose.model('User', UserSchema);
