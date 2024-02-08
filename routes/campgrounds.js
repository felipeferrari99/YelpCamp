const express = require("express");
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {campgroundSchema} = require('../schemas.js');
const con = require('../database/db.js');

const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    con.query('SELECT * FROM campgrounds', function (err, campgrounds) {
      res.render('campgrounds/index', { campgrounds });
    });
}));
  
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});
    
router.post('/', validateCampground, catchAsync(async (req, res) => {
    const { title, image, price, description, location } = req.body;
    const [campground] = await con.promise().query('INSERT INTO campgrounds (title, image, price, description, location) VALUES (?, ?, ?, ?, ?)', [title, image, price, description, location]);
    const newCampgroundId = campground.insertId;
    req.flash('success', 'Campground successfully added!');
    res.redirect(`/campgrounds/${newCampgroundId}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    con.query('SELECT * FROM campgrounds WHERE id = ?', [id], function (err, results) {
        const campground = results[0];
        if (!campground) {
            req.flash('error', 'Cannot find that campground.')
            return res.redirect('/campgrounds')
        }
        con.query('SELECT id, body, rating FROM reviews WHERE campground_id = ?', id, (err, reviewResults) => {
        const reviews = reviewResults;
        res.render('campgrounds/show', { campground, reviews });
    })});
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    con.query('SELECT * FROM campgrounds WHERE id = ?', [id], function (err, results) {
      const campground = results[0];
      if (!campground) {
        req.flash('error', 'Cannot find that campground.')
        return res.redirect('/campgrounds')
      }
      res.render('campgrounds/edit', { campground });
    });
}));
    
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { title, image, price, description, location } = req.body;
    const { id } = req.params;
    await con.promise().query('UPDATE campgrounds SET title = ?, image = ?, price = ?, description = ?, location = ? WHERE id = ?', [title, image, price, description, location, id]);
    req.flash('success', 'Campground successfully updated!');
    res.redirect(`/campgrounds/${id}`);
}));
    
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await con.promise().query('DELETE FROM reviews WHERE campground_id = ?', [id]);
    await con.promise().query('DELETE FROM campgrounds WHERE id = ?', [id]);
    req.flash('success', 'Campground successfully deleted!');
    res.redirect('/campgrounds');
}));

module.exports = router;