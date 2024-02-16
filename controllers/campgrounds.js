const con = require('../database/db');

module.exports.index = async (req, res) => {
    con.query('SELECT * FROM campgrounds', function (err, campgrounds) {
      res.render('campgrounds/index', { campgrounds });
    });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res) => {
    const { title, image, price, description, location } = req.body;
    const author = req.user.id;
    const [campground] = await con.promise().query('INSERT INTO campgrounds (title, image, price, description, location, author) VALUES (?, ?, ?, ?, ?, ?)', [title, image, price, description, location, author]);
    const newCampgroundId = campground.insertId;
    req.flash('success', 'Campground successfully added!');
    res.redirect(`/campgrounds/${newCampgroundId}`);
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    con.query('SELECT campgrounds.*, users.username FROM campgrounds INNER JOIN users ON campgrounds.author = users.id WHERE campgrounds.id = ?', [id], function (err, results) {
        const campground = results[0];
        if (!campground) {
            req.flash('error', 'Cannot find that campground.')
            return res.redirect('/campgrounds')
        }
        con.query('SELECT reviews.*, users.username FROM reviews INNER JOIN users ON reviews.author = users.id WHERE campground_id = ?', id, (err, reviewResults) => {
        const reviews = reviewResults;
        res.render('campgrounds/show', { campground, reviews });
    })});
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const [campgrounds] = await con.promise().query('SELECT * FROM campgrounds WHERE id = ?', [id]);
    const campground = campgrounds[0];
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
    const { title, image, price, description, location } = req.body;
    const { id } = req.params;
    await con.promise().query('UPDATE campgrounds SET title = ?, image = ?, price = ?, description = ?, location = ? WHERE id = ?', [title, image, price, description, location, id]);
    req.flash('success', 'Campground successfully updated!');
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await con.promise().query('DELETE FROM reviews WHERE campground_id = ?', [id]);
    await con.promise().query('DELETE FROM campgrounds WHERE id = ?', [id]);
    req.flash('success', 'Campground successfully deleted!');
    res.redirect('/campgrounds');
}