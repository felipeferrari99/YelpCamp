const con = require('../database/db');

module.exports.createReview = async (req, res) => {
    const campgroundId = req.params.id;
    const { body, rating } = req.body;
    author = req.user.id
    await con.promise().query('INSERT INTO reviews (body, rating, campground_id, author) VALUES (?, ?, ?, ?)', [body, rating, campgroundId, author]);
    req.flash('success', 'Review successfully added!');
    res.redirect(`/campgrounds/${campgroundId}`);
}

module.exports.deleteReview = async (req, res) => {
    const campgroundId = req.params.id;
    const { reviewId } = req.params;
    await con.promise().query('DELETE FROM reviews WHERE id = ?', [reviewId]);
    req.flash('success', 'Review successfully deleted!');
    res.redirect(`/campgrounds/${campgroundId}`);
}