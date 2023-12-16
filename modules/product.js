const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const productSchema = new mongoose.Schema({
  seller_id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  catagory: {
    type: String,
    required: true,
  },
  image1: {
    type: String,
  },
  image2: {
    type: String,
  },
  image3: {
    type: String,
  },
  image4: {
    type: String,
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

const product = mongoose.model('product', productSchema);
module.exports = product;
