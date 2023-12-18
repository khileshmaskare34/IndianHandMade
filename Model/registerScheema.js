const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const registerSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  number: {
    type: Number,
    required: true,
    unique: true,
  },
  Password: {
    type: String,
    required: true,
  },

  city: {
    type: String,
  },
  country: {
    type: String,
  },
  line1: {
    type: String,
  },
  line2: {
    type: String,
  },
  postal_code: {
    type: String,
  },
  state: {
    type: String,
  },
});

registerSchema.pre('save', async function (next) {
  // const address = (await city) + country + line1 + line2 + state + postal_code;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.Password, salt);
  this.Password = hashedPassword;
  next();
});

registerSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const register = mongoose.model('register', registerSchema);
module.exports = register;
