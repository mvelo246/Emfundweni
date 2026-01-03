const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const DB_PATH = path.join(__dirname, 'school.db');

async function resetAdmin() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }
    });

    // Create tables first
    db.serialize(() => {
      // Create admin_users table
      db.run(`CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
      )`, (err) => {
        if (err) {
          console.error('Error creating admin_users table:', err);
          db.close();
          reject(err);
          return;
        }

        const password = 'admin123';
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            console.error('Error hashing password:', err);
            db.close();
            reject(err);
            return;
          }

          // Delete existing admin user if exists
          db.run('DELETE FROM admin_users WHERE username = ?', ['admin'], (err) => {
            if (err && !err.message.includes('no such table')) {
              console.error('Error deleting admin:', err);
            }

            // Insert new admin user
            db.run(
              'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)',
              ['admin', hash],
              (err) => {
                if (err) {
                  console.error('Error creating admin:', err);
                  db.close();
                  reject(err);
                  return;
                }
                console.log('✅ Admin user created successfully!');
                console.log('Username: admin');
                console.log('Password: admin123');
                db.close();
                resolve();
              }
            );
          });
        });
      });
    });
  });
}

resetAdmin().catch(console.error);
