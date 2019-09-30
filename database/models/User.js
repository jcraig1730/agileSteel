const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, require: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: Number, required: true },
  phone: { type: Number, required: true },
  orders: [String],
  cart: [{ partNumber: String, quantity: Number, length: Number }]
})

module.exports = mongoose.model('User', UserSchema);
