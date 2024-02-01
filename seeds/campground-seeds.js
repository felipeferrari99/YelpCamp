const connection = require('../database/db');
const tableName = 'campgrounds';

function insertSeedData() {
  const campgrounds = [
    { title: 'Riverside Retreat', price: 19.99, description: 'A peaceful camping spot by the river.', location: 'New York, New York' },
    { title: 'Mountain View Campsite', price: 29.99, description: 'Enjoy stunning mountain views at this campsite.', location: 'Los Angeles, California' },
    { title: 'Forest Haven Camping', price: 14.99, description: 'Immerse yourself in nature at this serene forest campsite.', location: 'Chicago, Illinois' },
    { title: 'Lakefront Escape', price: 39.99, description: 'Camp by the lake and experience tranquility.', location: 'Houston, Texas' },
    { title: 'Sunset Campground', price: 24.99, description: 'Watch breathtaking sunsets from your campsite.', location: 'Phoenix, Arizona' },
    { title: 'Pine Grove Camping', price: 49.99, description: 'Surrounded by tall pine trees, this campground offers a peaceful retreat.', location: 'Philadelphia, Pennsylvania' },
    { title: 'Valley Vista Campsite', price: 34.99, description: 'Overlook the valley from this scenic camping spot.', location: 'San Antonio, Texas' },
    { title: 'Desert Oasis Campground', price: 59.99, description: 'Experience the beauty of the desert at this oasis campsite.', location: 'San Diego, California' },
    { title: 'Creek Side Retreat', price: 44.99, description: 'Camp beside a babbling creek for a soothing experience.', location: 'Dallas, Texas' },
    { title: 'Hilltop Haven Camping', price: 69.99, description: 'Set up your tent on a hilltop for panoramic views.', location: 'San Jose, California' },
    { title: 'Meadowland Campsite', price: 54.99, description: 'Camp in a peaceful meadow and connect with nature.', location: 'Austin, Texas' },
    { title: 'Starlight Camping', price: 79.99, description: 'Stargaze from your campsite at this remote location.', location: 'Jacksonville, Florida' },
    { title: 'Seaside Serenity Campground', price: 64.99, description: 'Enjoy the sound of waves at this seaside campsite.', location: 'Fort Worth, Texas' },
    { title: 'Wildflower Campsite', price: 89.99, description: 'Surrounded by wildflowers, this campsite offers a colorful retreat.', location: 'Columbus, Ohio' },
    { title: 'Tranquil Trail Campground', price: 74.99, description: 'Discover tranquility on the hiking trails near this campsite.', location: 'San Francisco, California' },
    { title: 'Canyon Edge Camping', price: 99.99, description: 'Camp on the edge of a canyon for a thrilling experience.', location: 'Charlotte, North Carolina' },
    { title: 'Misty Mountain Campsite', price: 84.99, description: 'Wake up to misty mountain views at this picturesque campground.', location: 'Indianapolis, Indiana' },
    { title: 'Riverbank Rendezvous Camping', price: 119.99, description: 'Set up your tent along the riverbank for a memorable stay.', location: 'Seattle, Washington' },
    { title: 'Lakeside Bliss Campground', price: 104.99, description: 'Experience lakeside bliss at this idyllic camping spot.', location: 'Denver, Colorado' },
    { title: 'Whispering Pines Campsite', price: 139.99, description: 'Listen to the whispers of the pines at this serene campground.', location: 'Washington, District of Columbia' }
  ];

  const insertDataSql = `INSERT INTO ${tableName} (title, price, description, location) VALUES ?`;

connection.query(insertDataSql, [campgrounds.map(campground => [campground.title, campground.price, campground.description, campground.location])], (err, result) => {
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