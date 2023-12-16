let register = require('../Model/registerScheema')
const product = require('../Model/product');
const jwt = require('jsonwebtoken');


exports.addItem = async (req, res, next) => {
    var email = req.cookies.user_email;
    var user = await register.find({ Email: email });
    res.render('addnewpro', { user: user });
}
exports.newProduct = async (req, res, next) => {
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
      });   
}