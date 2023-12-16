var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const http = require('http');
const hostname = '0.0.0.0';
//  const port = process.env.PORT || 3000;
// const hbs = require('hbs');
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // to support JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
//   express.static(path.join(__dirname, '/new gi'));
const mongoose = require('mongoose');
const register = require('./modules/registerScheema');
app.use(cookieParser());
mongoose.connect(
  'mongodb+srv://pulkit:shraddhap@cluster0.hochl.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true },
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection
  .once('open', () => console.log('condected'))
  .on('error', () => console.log('error db'));

// here mongo

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './public')));
// app.use(express.static('public'));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(express.urlencoded({ extended: true }));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
// module.exports = register;
module.exports = app;
