const mysql = require('mysql2');

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
  }
});

module.exports = con;