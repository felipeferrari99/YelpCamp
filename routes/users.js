const express = require("express");
const router = express.Router();
const users = require('../controllers/users');

const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const catchAsync = require('../utils/catchAsync');
const { storeReturnTo, validateUser } = require('../middleware');

router.get('/register', users.renderRegister);
router.get('/login', users.renderLogin);
router.post('/register', validateUser, catchAsync(users.register));

passport.serializeUser(function(user, done) {done(null, user)});
passport.deserializeUser(function(user, done) {done(null, user)});

passport.use(new LocalStrategy(users.loginStrategy));
router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login);
router.get('/logout', users.logout)

module.exports = router;