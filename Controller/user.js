const register = require('../Model/registerScheema');
const product = require('../Model/product');
const order = require('../Model/orderdProductScheema');
const jwt = require('jsonwebtoken');
const PUBLISHABLE_KEY = process.env.PUBLISHABLE_KEY

exports.Home = async (req, res, next) =>{
  var carpets = await product.find({ catagory: 'carpets' });
  var bags = await product.find({ catagory: 'bags' });
  var token = req.cookies.Token;
  var email = req.cookies.user_email;
  if (!token) {
    res.render('index', { carpets: carpets, bags: bags });
  } else if (token && email) {
    res.redirect('/loggedIndex');
  }
}
exports.signUp = async (req, res, next) =>{
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
}
exports.signIn = async (req, res, next) => {
    console.log(req.body)
    const { Email, password } = req.body;
  
    if (!Email || !password) {
      return next('please enter valid email or password sp fdf');
    }
    const User = await register.findOne({Email});
    if (!User || !(await User.correctPassword(password, User.Password))) {
      return next('enter the correcr cridentals');
    }
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
}
exports.signOut = async (req, res, next) => {
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
}
exports.loggedInIndex = async (req, res, next) => {
  var carpets = await product.find({ catagory: 'carpets' });
  var bags = await product.find({ catagory: 'bags' });
  var email = req.cookies.user_email;
  var user = await register.find({ Email: email });

  res.render('indexForLoggedInUser', {
    carpets: carpets,
    bags: bags,
    user: user,
  });
}
exports.priceId = async (req, res, next) => {
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
}
exports.myOrders = async (req, res, next) => {
    var email = req.cookies.user_email;
    var user = await register.findOne({ Email: email });
    var orders = await order.find({ customer_id: user._id });
    let products = [];
    let sellers = [];
  
    for (var i = 0; i < orders.length; i++) {
      var productObj = await product.findOne({ _id: orders[i].product_id });
      var sellersObj = await register.findOne({ _id: productObj.seller_id });
      products.push(productObj);
      sellers.push(sellersObj);
    }
   
    res.render('myOrders', {
      products: products,
      orders: orders,
      customers: user,
      sellers: sellers,
    });
}
exports.paymentGty = async (req, res, next) => {
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
}

exports.isLoggedIn = async (req, res, next) =>{
  jwt.verify(
    req.cookies.Token,
    'mynameispulkitupadhyayfromharda',
    (err, authData) => {
      if (err) {
        res.render('notLogin');
      } else {
        //   res.sendStatus(403);
        next();
        // res.clearCookie('Token');
      }
    }
  );
}