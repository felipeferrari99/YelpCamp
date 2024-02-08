const express = require("express");
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {reviewSchema} = require('../schemas.js');
const con = require('../database/db.js');

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const campgroundId = req.params.id;
    const { body, rating } = req.body;
    await con.promise().query('INSERT INTO reviews (body, rating, campground_id) VALUES (?, ?, ?)', [body, rating, campgroundId]);
    req.flash('success', 'Review successfully added!');
    res.redirect(`/campgrounds/${campgroundId}`);
}))
  
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const campgroundId = req.params.id;
    const { reviewId } = req.params;
    await con.promise().query('DELETE FROM reviews WHERE id = ?', [reviewId]);
    req.flash('success', 'Review successfully deleted!');
    res.redirect(`/campgrounds/${campgroundId}`);
}))

module.exports = router;