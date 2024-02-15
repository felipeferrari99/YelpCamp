const ExpressError = require('./utils/ExpressError');
const {campgroundSchema, reviewSchema, userSchema} = require('./schemas');
const con = require('./database/db');

module.exports.isLoggedIn = (req, res, next) => {
    req.session.returnTo = req.originalUrl;
    if (!req.isAuthenticated()){
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
}

module.exports.validateUser = (req, res, next) => {
    const {error} = userSchema.validate(req.body);
    if(error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
}

module.exports.isAuthor = async(req, res, next) => {
  const { id } = req.params;
  const [campgrounds] = await con.promise().query('SELECT * FROM campgrounds WHERE id = ?', [id]);
  const campground = campgrounds[0];
  if (!campground) {
    req.flash('error', 'Cannot find that campground.')
    return res.redirect('/campgrounds')
  }
  if (campground.author !== req.user.id) {
      req.flash('error', 'You do not have permission to do that!');
      return res.redirect(`/campgrounds/${id}`);
  }
  next();
}

module.exports.isReviewAuthor = async(req, res, next) => {
  const { id, reviewId } = req.params;
  const [reviews] = await con.promise().query('SELECT * FROM reviews WHERE id = ?', [reviewId]);
  const review = reviews[0];
  if (review.author !== req.user.id) {
      req.flash('error', 'You do not have permission to do that!');
      return res.redirect(`/campgrounds/${id}`);
  }
  next();
}