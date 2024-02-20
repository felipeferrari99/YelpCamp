const con = require('../database/db');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken})
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    con.query('SELECT campgrounds.*, (SELECT url FROM images WHERE campground_id = campgrounds.id ORDER BY id ASC LIMIT 1) AS url FROM campgrounds', (err, campgrounds) => {
      res.render('campgrounds/index', { campgrounds });
    });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()
    const coordinates = geoData.body.features[0].geometry.coordinates
    const { title, price, description, location } = req.body;
    const author = req.user.id;
    const [campground] = await con.promise().query('INSERT INTO campgrounds (title, price, description, location, longitude, latitude, author) VALUES (?, ?, ?, ?, ?, ?, ?)', [title, price, description, location, coordinates[0], coordinates[1], author]);
    const newCampgroundId = campground.insertId;
    const images = req.files.map(f => ({url: f.path, filename: f.filename}))
    for(let i in images) {
      con.query('INSERT INTO images (filename, url, campground_id) VALUES (?, ?, ?)', [images[i].filename, images[i].url, newCampgroundId]);
    }
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
        con.query('SELECT url FROM images WHERE campground_id = ?', id, (err, imageResults) => {
            const images = imageResults;
            con.query('SELECT reviews.*, users.username FROM reviews INNER JOIN users ON reviews.author = users.id WHERE campground_id = ?', id, (err, reviewResults) => {
                const reviews = reviewResults;
                res.render('campgrounds/show', { campground, reviews, images });
    })})});
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const [campgrounds] = await con.promise().query('SELECT * FROM campgrounds WHERE id = ?', [id]);
    const campground = campgrounds[0];
    con.query('SELECT * FROM images WHERE campground_id = ?', id, (err, imageResults) => {
        const images = imageResults;
        res.render('campgrounds/edit', { campground, images });
    })}

module.exports.updateCampground = async (req, res) => {
    const { title, price, description, location } = req.body;
    const { id } = req.params;
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()
    const coordinates = geoData.body.features[0].geometry.coordinates
    await con.promise().query('UPDATE campgrounds SET title = ?, price = ?, description = ?, location = ?, longitude = ?, latitude = ? WHERE id = ?', [title, price, description, location, coordinates[0], coordinates[1], id]);
    const images = req.files.map(f => ({url: f.path, filename: f.filename}))
    for(let i in images) {
      con.query('INSERT INTO images (filename, url, campground_id) VALUES (?, ?, ?)', [images[i].filename, images[i].url, id]);
    }
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        con.query('DELETE FROM images WHERE filename IN (?)', req.body.deleteImages)
    }
    req.flash('success', 'Campground successfully updated!');
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await con.promise().query('DELETE FROM reviews WHERE campground_id = ?', [id]);
    const filenames = await con.promise().query('SELECT filename FROM images WHERE campground_id = ?', [id]);
    for (let i = 0; i < filenames[0].length; i++) {
      let { filename } = filenames[0][i];
      await cloudinary.uploader.destroy(filename);
      await con.promise().query('DELETE FROM images WHERE filename = ?', [filename]);
    }
    await con.promise().query('DELETE FROM campgrounds WHERE id = ?', [id]);
    req.flash('success', 'Campground successfully deleted!');
    res.redirect('/campgrounds');
  };