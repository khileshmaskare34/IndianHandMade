const jwt = require('jsonwebtoken');

const isLoggedIn = function (req, res, next) {
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
};
module.exports = isLoggedIn;
