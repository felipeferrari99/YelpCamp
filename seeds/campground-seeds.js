const connection = require('../database/db');
const tableName = 'campgrounds';
const imageSource = 'https://source.unsplash.com/collection/483251';

const titles = ['Riverside Retreat', 'Mountain View Campsite', 'Forest Haven Camping', 'Lakefront Escape', 'Sunset Campground', 'Pine Grove Camping', 'Valley Vista Campsite', 'Desert Oasis Campground', 'Creek Side Retreat', 'Hilltop Haven Camping', 'Meadowland Campsite', 'Starlight Camping', 'Seaside Serenity Campground', 'Wildflower Campsite', 'Tranquil Trail Campground', 'Canyon Edge Camping', 'Misty Mountain Campsite', 'Riverbank Rendezvous Camping', 'Lakeside Bliss Campground', 'Whispering Pines Campsite'];

const locations = ['New York, New York', 'Los Angeles, California', 'Chicago, Illinois', 'Houston, Texas', 'Phoenix, Arizona', 'Philadelphia, Pennsylvania', 'San Antonio, Texas', 'San Diego, California', 'Dallas, Texas', 'San Jose, California', 'Austin, Texas', 'Jacksonville, Florida', 'Fort Worth, Texas', 'Columbus, Ohio', 'San Francisco, California', 'Charlotte, North Carolina', 'Indianapolis, Indiana', 'Seattle, Washington', 'Denver, Colorado', 'Washington, District of Columbia'];

const descriptions = ['A peaceful camping spot by the river.', 'Enjoy stunning mountain views at this campsite.', 'Immerse yourself in nature at this serene forest campsite.', 'Camp by the lake and experience tranquility.', 'Watch breathtaking sunsets from your campsite.', 'Surrounded by tall pine trees, this campground offers a peaceful retreat.', 'Overlook the valley from this scenic camping spot.', 'Experience the beauty of the desert at this oasis campsite.', 'Camp beside a babbling creek for a soothing experience.', 'Set up your tent on a hilltop for panoramic views.', 'Camp in a peaceful meadow and connect with nature.', 'Stargaze from your campsite at this remote location.', 'Enjoy the sound of waves at this seaside campsite.', 'Surrounded by wildflowers, this campsite offers a colorful retreat.', 'Discover tranquility on the hiking trails near this campsite.', 'Camp on the edge of a canyon for a thrilling experience.', 'Wake up to misty mountain views at this picturesque campground.', 'Set up your tent along the riverbank for a memorable stay.', 'Experience lakeside bliss at this idyllic camping spot.', 'Listen to the whispers of the pines at this serene campground.'];

function insertSeedData() {
  const campgrounds = [];

  for (let i = 0; i < titles.length; i++) {
    const price = Math.floor(Math.random() * (150 - 10 + 1) + 10);
    const author = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
    campgrounds.push({
      title: titles[i],
      image: imageSource,
      price: price.toFixed(2),
      description: descriptions[i],
      location: locations[i],
      author: author
    });
  }

  const insertDataSql = `INSERT INTO ${tableName} (title, image, price, description, location, author) VALUES ?`;

connection.query(insertDataSql, [campgrounds.map(campground => [campground.title, campground.image, campground.price, campground.description, campground.location, campground.author])], (err, result) => {
  if (err) throw err;
  console.log(`${result.affectedRows} campgrounds inserted`);
  connection.end();
});
}

connection.query(`SELECT COUNT(*) AS count FROM ${tableName}`, (err, rows) => {
if (err) throw err;

const rowCount = rows[0].count;

if (rowCount === 0) {
  insertSeedData();
} else {
  console.log('Data already exists in the table');
  connection.end();
}
});