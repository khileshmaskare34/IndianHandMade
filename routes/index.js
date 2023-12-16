var express = require('express');
var router = express.Router();
var multer = require('multer');
const register = require('../modules/registerScheema');
const jwt = require('jsonwebtoken');
const isLoggedIn = require('./../modules/isloggedIn');
const product = require('./../modules/product');
const order = require('./../modules/orderdProductScheema');
const path = require('path');
const mongoose = require('mongoose');
const ObjectId = require('mongodb');
const app = require('./../app');

// const { ObjectId } = require('mongodb');
// const user = require('./../modules/registerScheema');
// import { ObjectId } from 'bson';

// ,,,,,,,,,,111111111111111111<<<<<Keys>>>>>>>>>>>>>11!1!!!!!!!!!!!,,,,,,,,,,,,,,

const PUBLISHABLE_KEY =
  'pk_test_51JBzFESAprUbcjS1IVUHcVBGh24zbCTH8HK2NhXeRLEzRhUKP6FiuH61n5PcorRItdXQVpJM5NCuEXkYsZZir2ol00nRBIzQe1';
const SECRET_KEY =
  'sk_test_51JBzFESAprUbcjS1at26Z56lRs0XajJ4DwJKStXGIF95jCDEiOaUaYPGicwThsXyQYxgsEZ1wfBoyRJRU8vH1BwW00ROd7GquN';

const stripe = require('stripe')(SECRET_KEY);

// <<<<<<<<<<<<<<<<<<<    the middlevares    >>>>>>>>>>>>>>>
router.use('./../public', express.static(path.join(__dirname, './../public')));
// const upload = require('./../modules/imageMulter');
// const __dirname = path.resolve();

// /****************** */ GET routs ******************************/
router.get('/', async function (req, res, next) {
  // getting all products in the category of carpets
  var carpets = await product.find({ catagory: 'carpets' });
  var bags = await product.find({ catagory: 'bags' });
  var token = req.cookies.Token;
  var email = req.cookies.user_email;
  if (!token) {
    res.render('index', { carpets: carpets, bags: bags });
  } else if (token && email) {
    res.redirect('/loggedIndex');
  }
});

// *********************payment interation here************
router.post('/price/payment', isLoggedIn, (req, res) => {
 

  console.log('reqbb');
  console.log(req.body.price);
  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
      name: 'gotm sharma',

      address: {
        city: 'bhopal',
        country: 'india',
        line1: 'bhopaldkfj',
        line2: 'badfadsf',
        postal_code: 'asdfasdf',
        state: 'asdfasdf',
      },
    })
    .then((customer) => {
      return stripe.charges.create({
        amount: req.body.price * 100,
        description: 'indianrugs',
        currency: 'inr',
        customer: customer.id,
      });
    })
    .then(async (charge) => {
      console.log('saving product in order section');

      try {
        const product1 = await product.find({ _id: req.body.product_id });

        const user = await register.find({ Email: req.body.user_id });
        console.log(user);
        console.log(product1);

        let product_id = product1[0]._id;
        let productName = product1[0].title;
        let seller_id = product1[0].seller_id;
        let customer_id = user[0]._id;

        const NForder = new order({
          product_id: product_id,
          productName: productName,
          seller_id: seller_id,
          customer_id: customer_id,
        });
        NForder.save().then((doc) => {
          console.log('order saved11111111111111111111');
        });
      } catch (error) {
        console.log(error);
      }
      console.log('payment succesfull');
      res.redirect('..');
    })
    .catch((err) => {
      res.send(err);
    });
});

// ********* this is the index for logged in users only ****************

router.get('/loggedIndex', isLoggedIn, async function (req, res, next) {
  // getting all products in the category of carpets
  var carpets = await product.find({ catagory: 'carpets' });
  var bags = await product.find({ catagory: 'bags' });
  var email = req.cookies.user_email;
  var user = await register.find({ Email: email });

  res.render('indexForLoggedInUser', {
    carpets: carpets,
    bags: bags,
    user: user,
  });
});

router.get('/menu', function (req, res, next) {
  res.render('menu');
});

// ***************************this is the login route
router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/register', (req, res, next) => {
  let userName = req.body.fullName;
  let useremail = req.body.Email;
  let userMobile = req.body.mobileNumber;
  let userPassword = req.body.password;

  const user = new register({
    Name: userName,
    number: userMobile,
    Email: useremail,
    Password: userPassword,
  });

  user.save().then((doc) => {
    const token = jwt.sign(
      { id: user.__id },
      'mynameispulkitupadhyayfromharda',
      {
        expiresIn: '10d',
      }
    );
    console.log("lucky"+user);
    res.cookie('Token', token, { httpOnly: true, maxAge: 1.728e8 });
    res.cookie('user_email', user.Email);
    res.redirect('/loggedIndex');
  });
});

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

router.post('/newProduct', upload.array('testimage'), (req, res, next) => {
  console.log(req.files);
 
  try {
    var arrimages = [];
    for (let i = 0; i < req.files.length; i++) {
      arrimages[i] = req.files[i].filename;
    }
  } catch (error) {
    console.log(error);
  }

 
  const prod = new product({
    seller_id: req.body.seller_id,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    catagory: req.body.catagory,
    image1: req.files[0].filename,
    image2: req.files[1].filename,
    image3: req.files[2].filename,
    image4: req.files[3].filename,
  });

  prod.save().then((doc) => {
    console.log(doc);
    console.log(prod);

    res.redirect('/');
    // res.render('index');
  });
});

// ********************add new products *******************

router.get('/addnewpro', isLoggedIn, async function (req, res, next) {
  var email = req.cookies.user_email;
  var user = await register.find({ Email: email });
  res.render('addnewpro', { user: user });
});

router.post('/login', async (req, res, next) => {
  console.log(req.body)
  const { Email, password } = req.body;

  if (!Email || !password) {
    return next('please enter valid email or password sp fdf');
  }

  // console.log("prem")

  // cheaking if the email exist in database

  const User = await register.findOne({Email});

  console.log(User);
  // console.log("prem")

  if (!User || !(await User.correctPassword(password, User.Password))) {
    return next('enter the correcr cridentals');
  }
  console.log("lucky"+User);

  const token = await jwt.sign(
    { id: User.__id },
    'mynameispulkitupadhyayfromharda',
    {
      expiresIn: '10d',
    }
  );
  res.cookie('Token', token, { httpOnly: true, maxAge: 1.728e8 });
  res.cookie('user_email', User.Email);

  var prevPage = req.originalUrl;

  res.redirect(`/`);
});

router.post('/logout', isLoggedIn, (req, res, next) => {
  jwt.verify(
    req.cookies.Token,
    'mynameispulkitupadhyayfromharda',
    (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        res.clearCookie('Token');
        res.clearCookie('user_email');
        res.redirect('/');
      }
    }
  );
});

// *****************getting perticuler product***************************
router.get(`/price/:id`, async (req, res, next) => {
  console.log(req.params);

  const nproduct = await product.findById(req.params.id);
  console.log(nproduct);
  var email = req.cookies.user_email;
  var user = await register.find({ Email: email });

  var displayItems = await product.find({ catagory: nproduct.catagory });

  console.log(nproduct);
  res.render('product', {
    product: nproduct,
    displayItems: displayItems,
    key: PUBLISHABLE_KEY,
    user: user,
  });
});

router.get('/register', function (req, res, next) {
  res.render('register');
});

router.get('/submit', function (req, res, next) {
  res.render('submit');
});

// ab jo bhi banega is ke niche banega

router.get('/myOrders', isLoggedIn, async (req, res, next) => {
  // console.log(req.cookies);
  var email = req.cookies.user_email;

  var user = await register.findOne({ Email: email });

  // console.log(user);
  var orders = await order.find({ customer_id: user._id });

  // const products = await product.find({ _id: or});

  let products = [];
  let sellers = [];

  for (var i = 0; i < orders.length; i++) {
    var productObj = await product.findOne({ _id: orders[i].product_id });
    var sellersObj = await register.findOne({ _id: productObj.seller_id });
    products.push(productObj);
    sellers.push(sellersObj);
  }
  // console.log(products);

  // var allUsers = register.find({});
  res.render('myOrders', {
    products: products,
    orders: orders,
    customers: user,
    sellers: sellers,
  });
});

router.post('/deletorder', async (req, res, next) => {
  console.log(req.body);
  let orderId = req.body.order_id;
  console.log(orderId);
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

module.exports = router;
