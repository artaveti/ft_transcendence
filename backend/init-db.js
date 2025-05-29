const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

// Define updated schema with default datetime values
const schema = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT,
    profile_picture TEXT DEFAULT 'media/profile_pictures/default.jpg',
    online_status BOOLEAN DEFAULT 0,
    total_pong_matches INTEGER DEFAULT 0,
    total_pong_time INTEGER DEFAULT 0,
    total_pong_ai_matches INTEGER DEFAULT 0,
    total_pong_pvp_matches INTEGER DEFAULT 0,
    total_tournament_played INTEGER DEFAULT 0,
    total_pacman_matches INTEGER DEFAULT 0,
    total_pacman_time INTEGER DEFAULT 0,
    max_endless_score INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS user_friends (
    user_id INTEGER,
    friend_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, friend_id)
  );

  CREATE TABLE IF NOT EXISTS pvp_pong_matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_one TEXT,
    player_two TEXT,
    winner TEXT,
    match_score TEXT,
    match_duration INTEGER,
    match_date TEXT DEFAULT (datetime('now')),
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS ai_pong_matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_one TEXT,
    ai_level TEXT,
    winner TEXT,
    match_score TEXT,
    match_duration INTEGER,
    match_date TEXT DEFAULT (datetime('now')),
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS pong_tournaments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_one TEXT,
    player_two TEXT,
    player_three TEXT,
    player_four TEXT,
    winner TEXT,
    duration INTEGER,
    date TEXT DEFAULT (datetime('now')),
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`;

// Check if a column exists before adding it
function addColumnIfNotExists(table, column, type) {
  return new Promise((resolve, reject) => {
    db.all(`PRAGMA table_info(${table});`, (err, columns) => {
      if (err) return reject(err);
      const exists = columns.some(col => col.name === column);
      if (!exists) {
        db.run(`ALTER TABLE ${table} ADD COLUMN ${column} ${type};`, (err) => {
          if (err) return reject(err);
          console.log(`Added column '${column}' to '${table}'`);
          resolve();
        });
      } else {
        resolve(); // Column already exists
      }
    });
  });
}

db.serialize(async () => {
  db.exec("BEGIN TRANSACTION;");
  db.exec(schema, async (err) => {
    if (err) {
      console.error('DB init error:', err);
      db.exec("ROLLBACK;");
      db.close();
      return;
    }

    try {
      await addColumnIfNotExists('users', 'twofa_enabled', 'BOOLEAN DEFAULT 0');
      await addColumnIfNotExists('users', 'twofa_secret', 'TEXT');
      await addColumnIfNotExists('users', 'google_id', 'TEXT');
      db.exec("COMMIT;");
      console.log('SQLite schema updated!');
    } catch (e) {
      console.error('Error adding extra columns:', e);
      db.exec("ROLLBACK;");
    } finally {
      db.close();
    }
  });
});
