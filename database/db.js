const mysql = require('mysql2');
const tableName = 'campgrounds';

const connection = mysql.createConnection({
  host: 'mysql_db',
  user: 'root',
  password: '1234',
  database: 'yelpCamp',
});
  
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
    connection.query(`SHOW TABLES LIKE '${tableName}'`, (err, rows) => {
      if (rows.length === 0) {
        const createTableSql = `
        CREATE TABLE ${tableName} (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          price VARCHAR(255) NOT NULL,
          description VARCHAR(255),
          location VARCHAR(255) NOT NULL
        )`;
      
        connection.query(createTableSql, (err, result) => {
          if (err) throw err;
          console.log('Table created');
        });
      }
    });
  }
})

module.exports = connection