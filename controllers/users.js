const con = require('../database/db');
const { userExists, hashPassword } = require('../models/user');
const bcrypt = require('bcrypt');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.renderLogin = (req, res) => {
    const flashMessages = req.flash();
    res.render('users/login', { flashMessages: flashMessages });
}

module.exports.register = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const existingUser = await userExists(username, email);
      const hashedPassword = await hashPassword(password);
      con.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], function (err, registeredUser) {
        req.login(registeredUser, err => {
          if(err) return next(err);
          req.flash('success', 'Welcome to YelpCamp!');
          res.redirect('/campgrounds');
        })
      });
    } catch (err) {
      req.flash('error', err.message);
      res.redirect('/register');
    }
}

module.exports.loginStrategy = async (username, password, done) => {
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
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}