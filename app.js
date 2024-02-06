const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const ejsMate = require("ejs-mate");
const {campgroundSchema} = require('./schemas.js');
const catchAsync = require('./utils/catchAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const methodOverride = require("method-override");
var connection = require('./database/db.js');

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded( {extended: true}));
app.use(methodOverride('_method'));

const validateCampground = (req, res, next) => {
  const {error} = campgroundSchema.validate(req.body);
  if(error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/campgrounds', catchAsync(async (req, res) => {
  connection.query('SELECT * FROM campgrounds', function (err, campgrounds) {
    res.render('campgrounds/index', { campgrounds });
  });
}));

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});
  
app.post('/campgrounds', validateCampground, catchAsync(async (req, res) => {
  const { title, image, price, description, location } = req.body;
  const [campground] = await connection.promise().query('INSERT INTO campgrounds (title, image, price, description, location) VALUES (?, ?, ?, ?, ?)', [title, image, price, description, location]);
  const newCampgroundId = campground.insertId;
  res.redirect(`/campgrounds/${newCampgroundId}`);
}));

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM campgrounds WHERE id = ?', [id], function (err, results) {
    const campground = results[0];
    res.render('campgrounds/show', { campground });
  });
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM campgrounds WHERE id = ?', [id], function (err, results) {
    const campground = results[0];
    res.render('campgrounds/edit', { campground });
  });
}));
  
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
  const { title, image, price, description, location } = req.body;
  const { id } = req.params;
  const [results] = await connection.promise().query('UPDATE campgrounds SET title = ?, image = ?, price = ?, description = ?, location = ? WHERE id = ?', [title, image, price, description, location, id]);
  res.redirect(`/campgrounds/${id}`);
}));
  
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const [results] = await connection.promise().query('DELETE FROM campgrounds WHERE id = ?', [id]);
  res.redirect('/campgrounds');
}));

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if(!err.message) err.message = 'Oh no, something went wrong!'
  res.status(statusCode).render('error', { err });
});

app.listen(port, () => {
    console.log("App listening on port 3000");
});