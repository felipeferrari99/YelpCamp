const con = require('../database/db.js');

con.query(`SHOW TABLES LIKE 'images'`, (err, rows) => {
    if (rows.length === 0) {
        const createImagesTableSql = `
        CREATE TABLE images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        url VARCHAR(255) NOT NULL,
        campground_id INT NOT NULL,
        FOREIGN KEY (campground_id) REFERENCES campgrounds(id)
        )`;
        
        con.query(createImagesTableSql, (err, result) => {
        if (err) {
          console.error('Error creating images table:', err);
          return;
        }
        console.log('Images table created');
      });
}})