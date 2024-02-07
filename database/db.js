const mysql = require('mysql2');
const campgroundsTableName = 'campgrounds';
const reviewsTableName = 'reviews';

const con = mysql.createConnection({
  host: 'mysql_db',
  user: 'root',
  password: '1234',
  database: 'yelpCamp',
});
  
con.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
    con.query(`SHOW TABLES LIKE '${campgroundsTableName}'`, (err, rows) => {
      if (rows.length === 0) {
        const createCampgroundsTableSql = `
          CREATE TABLE ${campgroundsTableName} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            image VARCHAR(255),
            price FLOAT NOT NULL,
            description VARCHAR(255),
            location VARCHAR(255) NOT NULL
          )`;
        
        con.query(createCampgroundsTableSql, (err, result) => {
          if (err) {
            console.error('Error creating campgrounds table:', err);
            return;
          }
          console.log('Campgrounds table created');
          checkReviewsTable();
        });
      } else {
        checkReviewsTable();
      }
    });
  }
});

function checkReviewsTable() {
  con.query(`SHOW TABLES LIKE '${reviewsTableName}'`, (err, rows) => {
    if (rows.length === 0) {
      createReviewsTable();
    }
  });
}

function createReviewsTable() {
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
}

module.exports = con;