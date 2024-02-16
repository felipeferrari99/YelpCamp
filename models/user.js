const con = require('../database/db');
const bcrypt = require('bcrypt');

const saltRounds = 10;

con.query(`SHOW TABLES LIKE 'users'`, (err, rows) => {
  if (err) {
    console.error('Error checking for users table:', err);
    return;
  }
  if (rows.length === 0) {
    const createUsersTableSql = `
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        UNIQUE (username),
        UNIQUE (email)
      )`;

    con.query(createUsersTableSql, (err, result) => {
      if (err) {
        console.error('Error creating users table:', err);
        return;
      }
      console.log('Users table created');
    });      
  }
});

async function userExists(username, email) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE username = ? OR email = ?`;
    con.query(query, [username, email], function (err, rows) {
      if (err) {
        reject(err);
      } else {
        if (rows.length > 0) {
          reject(new Error('Username or email already exists'));
        } else {
          resolve(false);
        }
      }
    });
  });
}

async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

module.exports = {
  userExists,
  hashPassword
};