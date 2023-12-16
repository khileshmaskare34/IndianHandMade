const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const orderSchema = new mongoose.Schema({
  product_id: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
  },

  seller_id: {
    type: String,
    required: true,
  },
  customer_id: {
    type: String,
    required: true,
  },
});

// registerSchema.pre('save', async function (next) {
//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(this.Password, salt);
//   this.Password = hashedPassword;
//   next();
// });

// registerSchema.methods.correctPassword = async function (
//   candidatePassword,
//   userPassword
// ) {
//   return await bcrypt.compare(candidatePassword, userPassword);
// };

const order = mongoose.model('order', orderSchema);
module.exports = order;
