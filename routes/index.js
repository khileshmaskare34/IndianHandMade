var express = require('express');
var router = express.Router();
var multer = require('multer');
const register = require('../Model/registerScheema');
const jwt = require('jsonwebtoken');
// const loggedInIndex = require('./../modules/loggedInIndex');
// const product = require('./../modules/product');
// const order = require('./../modules/orderdProductScheema');
const path = require('path');
const mongoose = require('mongoose');
const ObjectId = require('mongodb');
const app = require('./../app');
const { signIn, signOut, signUp, loggedInIndex, Home, paymentGty, priceId, myOrders, isLoggedIn } = require('../Controller/user');
const { addItem, newProduct } = require('../Controller/seller');


const PUBLISHABLE_KEY = process.env.PUBLISHABLE_KEY
const SECRET_KEY = process.env.SECRET_KEY
const stripe = require('stripe')(SECRET_KEY);

// <<<<<<<<<<<<<<<<<<<    the middlevares    >>>>>>>>>>>>>>>
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, './../public/upload'), function () {
      if (err) {
        throw err;
      }
    });
  },
  filename: (req, file, cb) => {
    const name = Date.now() + '-' + file.originalname;
    cb(null, name, (error, sucess) => {
      if (error) {
        throw error;
      }
    });
  },
});

var upload = multer({ storage: storage });
router.use('./../public', express.static(path.join(__dirname, './../public')));

router.get('/menu', function (req, res, next) {
  res.render('menu');
});
router.get('/login', (req, res, next) => {
  res.render('login');
});

router.get('/', Home);
router.post('/price/payment', isLoggedIn, paymentGty);
router.get('/loggedIndex', isLoggedIn, loggedInIndex);
router.post('/register', signUp);
router.post('/newProduct', upload.array('testimage'), newProduct);
router.get('/addnewpro', isLoggedIn, addItem);
router.post('/login', signIn);
router.post('/logout', isLoggedIn, signOut);
router.get(`/price/:id`, priceId);

router.get('/register', function (req, res, next) {
  res.render('register');
});
router.get('/submit', function (req, res, next) {
  res.render('submit');
});
router.get('/myOrders', isLoggedIn, myOrders);

router.post('/deletorder', async (req, res, next) => {
  // console.log(req.body);
  let orderId = req.body.order_id;
  // console.log(orderId);
  await order.deleteOne({ _id: orderId });

  res.redirect('/myOrders');
});

router.get('/myAccount', isLoggedIn, async (req, res, next) => {
  var email = req.cookies.user_email;
  var user = await register.findOne({ Email: email });

  res.render('myAccount', { user });
});

router.get('/test', async (req, res, next) => {
  res.render('testMyAc');
});

router.post('/editProfile', async (req, res, next) => {
  const prevuser = await register.findOne({ Email: req.cookies.user_email });

  let name, email, contact, country, city, state, postal_code, line1;

  if (req.body.name == '') {
    name = prevuser.Name;
  } else {
    name = req.body.name;
  }

  if (req.body.email == '') {
    email = prevuser.Email;
  } else {
    email = req.body.email;
  }
  if (req.body.contact == '') {
    contact = prevuser.number;
  } else {
    contact = req.body.contact;
  }

  if (req.body.country == '') {
    country = prevuser.country;
  } else {
    country = req.body.country;
  }

  if (req.body.city == '') {
    city = prevuser.city;
  } else {
    city = req.body.city;
  }

  if (req.body.state == '') {
    state = prevuser.state;
  } else {
    state = req.body.state;
  }

  if (req.body.line1 == '') {
    line1 = prevuser.line1;
  } else {
    line1 = req.body.line1;
  }

  if (req.body.postal_code == '') {
    postal_code = prevuser.postal_code;
  } else {
    postal_code = req.body.postal_code;
  }

  // console.log(req.cookies);

  try {
    await register.findOneAndUpdate(
      { Email: req.cookies.user_email },
      {
        $set: {
          Name: name,
          Email: email,
          number: contact,
          city: city,
          country: country,
          postal_code: postal_code,
          line1: line1,
          state: state,
        },
      },
      { new: true }
    );
  } catch (error) {
    console.log(error);
  }
  res.redirect('/myAccount');
});

router.get('/about', function (req, res, next) {
  res.render('about');
});

module.exports = router;
