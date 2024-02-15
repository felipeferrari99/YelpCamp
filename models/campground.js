const con = require('../database/db.js');
const campgroundsTableName = 'campgrounds';

con.query(`SHOW TABLES LIKE '${campgroundsTableName}'`, (err, rows) => {
    if (rows.length === 0) {
      const createCampgroundsTableSql = `
        CREATE TABLE ${campgroundsTableName} (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          image VARCHAR(255),
          price FLOAT NOT NULL,
          description VARCHAR(255),
          location VARCHAR(255) NOT NULL,
          author INT NOT NULL,
          FOREIGN KEY (author) REFERENCES users(id)
        )`;
      
      con.query(createCampgroundsTableSql, (err, result) => {
        if (err) {
          console.error('Error creating campgrounds table:', err);
          return;
        }
        console.log('Campgrounds table created');
      });
}})