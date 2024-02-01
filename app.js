const express = require("express");
const app = express();
const path = require("path")
const port = 3000;
const methodOverride = require("method-override")
var connection = require('./database/db.js');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded( {extended: true}));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campgrounds', async (req, res) => {
    connection.query('SELECT * FROM campgrounds', function (err, campgrounds) {
        res.render('campgrounds/index', { campgrounds });
    })
})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})
  
app.post('/campgrounds', (req, res) => {
    const { title, price, description, location } = req.body;
    connection.query('INSERT INTO campgrounds (title, price, description, location) VALUES (?, ?, ?, ?)', [title, price, description, location], function (err, result) {
    if (err) {
        console.log("NOT ALLOWED!!!")
    } else {
        const newCampgroundId = result.insertId;
        res.redirect(`/campgrounds/${newCampgroundId}`);
    }});
});

app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM campgrounds WHERE id = ?', [id], function (err, results) {
      const campground = results[0];
      res.render('campgrounds/show', { campground });
    });
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM campgrounds WHERE id = ?', [id], function (err, results) {
      const campground = results[0];
      res.render('campgrounds/edit', { campground });
    });
  });
  
  app.put('/campgrounds/:id', async (req, res) => {
    const { title, price, description, location } = req.body;
    const { id } = req.params;
    connection.query('UPDATE campgrounds SET title = ?, price = ?, description = ?, location = ? WHERE id = ?', [title, price, description, location, id], function (err, results) {
      res.redirect(`/campgrounds/${id}`);
    });
  });
  
  app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM campgrounds WHERE id = ?', [id], function (err) {
      res.redirect('/campgrounds')
    })
  })

app.listen(port, () => {
    console.log("App listening on port 3000");
})