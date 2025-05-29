// syncUsersAutoIncrement.js

module.exports = async function setUserIdAutoIncrementStart(db) {
    function getMaxUserId() {
      return new Promise((resolve, reject) => {
        db.get(`SELECT MAX(user_id) as maxId FROM pong_tournaments`, (err, row) => {
          if (err) reject(err);
          else resolve(row.maxId || 0);
        });
      });
    }

    function updateSequence(tableName, seqValue) {
      return new Promise((resolve, reject) => {
        db.run(`UPDATE sqlite_sequence SET seq = ? WHERE name = ?`, [seqValue, tableName], function (err) {
          if (err || this.changes === 0) {
            db.run(`INSERT INTO sqlite_sequence (name, seq) VALUES (?, ?)`, [tableName, seqValue], function (insertErr) {
              if (insertErr) reject(insertErr);
              else resolve();
            });
          } else {
            resolve();
          }
        });
      });
    }

    try {
      const maxUserId = await getMaxUserId();
      console.log("🔢 Max user_id from tournaments:", maxUserId);
      await updateSequence('users', maxUserId);
      console.log("✅ sqlite_sequence updated. Next user.id will start from", maxUserId + 1);
    } catch (err) {
      console.error("❌ Failed to update sqlite_sequence:", err);
    }
  };
