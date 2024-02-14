const express = require("express");
const router = express.Router();

const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {userSchema} = require('../schemas.js');
const con = require('../database/db.js');
const { userExists, hashPassword } = require('../models/user');

const validateUser = (req, res, next) => {
  const {error} = userSchema.validate(req.body);
  if(error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

router.get('/register', function(req, res, next) {
  res.render('users/register');
});

router.get('/login', function(req, res, next) {
  const flashMessages = req.flash();
  res.render('users/login', { flashMessages: flashMessages });
});

router.post('/register', validateUser, catchAsync(async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await userExists(username, email);
    const hashedPassword = await hashPassword(password);
    con.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], function (err) {
      req.flash('success', 'Welcome to YelpCamp!');  
      res.redirect('/campgrounds');
    });
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/register');
  }
}));

passport.use(new LocalStrategy(async function(username, password, done) {
  try {
    const rows = await new Promise((resolve, reject) => {
      con.query('SELECT * FROM users WHERE username=?', [username], function(err, rows){
          if (err) reject(err);
          resolve(rows);
      });
    });
    if (rows.length === 0) {
      return done(null, false, { message: 'Username or password is incorrect.' });
    }
    const foundUser = rows[0];
    const isValid = await bcrypt.compare(password, foundUser.password);
    if (!isValid) {
      return done(null, false, { message: 'Username or password is incorrect.' });
    }
    return done(null, foundUser);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser(function(user, done) {done(null, user)});
passport.deserializeUser(function(user, done) {done(null, user)});

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), function(req, res, next) {
  req.flash('success', 'Welcome back!');
  res.redirect('/campgrounds');
});

module.exports = router;