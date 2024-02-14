const con = require('../database/db.js');
const reviewsTableName = 'reviews';

con.query(`SHOW TABLES LIKE '${reviewsTableName}'`, (err, rows) => {
    if (rows.length === 0) {
        const createReviewsTableSql = `
        CREATE TABLE ${reviewsTableName} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        body TEXT NOT NULL,
        rating INT NOT NULL,
        campground_id INT,
        FOREIGN KEY (campground_id) REFERENCES ${campgroundsTableName}(id)
        )`;
        
        con.query(createReviewsTableSql, (err, result) => {
        if (err) {
          console.error('Error creating reviews table:', err);
          return;
        }
        console.log('Reviews table created');
      });
}})