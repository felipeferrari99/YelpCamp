const connection = require('../database/db');

const titles = ['Riverside Retreat', 'Mountain View Campsite', 'Forest Haven Camping', 'Lakefront Escape', 'Sunset Campground', 'Pine Grove Camping', 'Valley Vista Campsite', 'Desert Oasis Campground', 'Creek Side Retreat', 'Hilltop Haven Camping', 'Meadowland Campsite', 'Starlight Camping', 'Seaside Serenity Campground', 'Wildflower Campsite', 'Tranquil Trail Campground', 'Canyon Edge Camping', 'Misty Mountain Campsite', 'Riverbank Rendezvous Camping', 'Lakeside Bliss Campground', 'Whispering Pines Campsite'];

const locations = ['New York, New York', 'Los Angeles, California', 'Chicago, Illinois', 'Houston, Texas', 'Phoenix, Arizona', 'Philadelphia, Pennsylvania', 'San Antonio, Texas', 'San Diego, California', 'Dallas, Texas', 'San Jose, California', 'Austin, Texas', 'Jacksonville, Florida', 'Fort Worth, Texas', 'Columbus, Ohio', 'San Francisco, California', 'Charlotte, North Carolina', 'Indianapolis, Indiana', 'Seattle, Washington', 'Denver, Colorado', 'Washington, District of Columbia'];

const descriptions = ['A peaceful camping spot by the river.', 'Enjoy stunning mountain views at this campsite.', 'Immerse yourself in nature at this serene forest campsite.', 'Camp by the lake and experience tranquility.', 'Watch breathtaking sunsets from your campsite.', 'Surrounded by tall pine trees, this campground offers a peaceful retreat.', 'Overlook the valley from this scenic camping spot.', 'Experience the beauty of the desert at this oasis campsite.', 'Camp beside a babbling creek for a soothing experience.', 'Set up your tent on a hilltop for panoramic views.', 'Camp in a peaceful meadow and connect with nature.', 'Stargaze from your campsite at this remote location.', 'Enjoy the sound of waves at this seaside campsite.', 'Surrounded by wildflowers, this campsite offers a colorful retreat.', 'Discover tranquility on the hiking trails near this campsite.', 'Camp on the edge of a canyon for a thrilling experience.', 'Wake up to misty mountain views at this picturesque campground.', 'Set up your tent along the riverbank for a memorable stay.', 'Experience lakeside bliss at this idyllic camping spot.', 'Listen to the whispers of the pines at this serene campground.'];

const filenames = ['YelpCamp/lglwo7v8ppuvocjtxk9e', 'YelpCamp/n9eil9fui7nuelq5hw7d', 'YelpCamp/wxppvgqoajcuqwqoie3b'];

const urls = ['https://res.cloudinary.com/dsv8lpacy/image/upload/v1708356803/YelpCamp/lglwo7v8ppuvocjtxk9e.png', 'https://res.cloudinary.com/dsv8lpacy/image/upload/v1708356804/YelpCamp/n9eil9fui7nuelq5hw7d.png', 'https://res.cloudinary.com/dsv8lpacy/image/upload/v1708356804/YelpCamp/wxppvgqoajcuqwqoie3b.jpg'];

const extendedFilenames = [];
const extendedUrls = [];

for (let i = 0; i < 20; i++) {
    const index = i % filenames.length;
    extendedFilenames.push(filenames[index]);
    extendedUrls.push(urls[index]);
}

connection.query(`SELECT COUNT(*) AS count FROM campgrounds`, (err, rows) => {
    if (err) throw err;

    const rowCount = rows[0].count;

    if (rowCount === 0) {
        const campgrounds = [];

        for (let i = 0; i < 20; i++) {
            const price = Math.floor(Math.random() * (150 - 10 + 1) + 10);
            const author = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
            campgrounds.push([
                titles[i],
                price.toFixed(2),
                descriptions[i],
                locations[i],
                author
            ]);
        }

        connection.query(`INSERT INTO campgrounds (title, price, description, location, author) VALUES ?`, [campgrounds], (err, result) => {
            if (err) throw err;
            console.log(`${result.affectedRows} campgrounds inserted`);

            const images = [];
            for (let i = 0; i < 20; i++) {
                const url = extendedUrls[i];
                const filename = extendedFilenames[i];
                const campground_id = i + 1;
                images.push([url, filename, campground_id]);
            }

            connection.query(`INSERT INTO images (url, filename, campground_id) VALUES ?`, [images], (err, result) => {
                if (err) throw err;
                console.log(`${result.affectedRows} images inserted`);
                connection.end();
            });
        });
    } else {
        console.log('Data already exists in the table');
        connection.end();
    }
});