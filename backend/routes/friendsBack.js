// routes/friendsBack.js
const fp = require('fastify-plugin');
const { authenticateUser } = require('../middlewares/authenticateUser');

module.exports = fp(async function (fastify, opts) {
  // Get list of friends
  fastify.get('/api/friends_list', { preHandler: [authenticateUser] }, async (request, reply) => {
    const userId = request.user.id;

    try {
      const query = `
        SELECT u.username, u.profile_picture AS profile_picture_url, u.online_status
        FROM users u
        INNER JOIN user_friends f ON f.friend_id = u.id
        WHERE f.user_id = ?
      `;

      const friends = await new Promise((resolve, reject) => {
        fastify.db.all(query, [userId], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });

      return reply.send(friends);

    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Could not fetch friends' });
    }
  });

  // Add a friend
  fastify.post('/api/add_friend', { preHandler: [authenticateUser] }, async (request, reply) => {
    const { username } = request.body;
    const userId = request.user.id;

    if (username === request.user.username) {
      return reply.code(400).send({ error: 'You cannot add yourself as a friend' });
    }

    try {
      const friend = await new Promise((resolve, reject) => {
        fastify.db.get(
          'SELECT id FROM users WHERE username = ?',
          [username],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          }
        );
      });

      if (!friend) {
        return reply.code(404).send({ error: 'User not found' });
      }

      const isAlreadyFriend = await new Promise((resolve, reject) => {
        fastify.db.get(
          'SELECT 1 FROM user_friends WHERE user_id = ? AND friend_id = ?',
          [userId, friend.id],
          (err, row) => {
            if (err) reject(err);
            else resolve(!!row);
          }
        );
      });

      if (isAlreadyFriend) {
        return reply.code(400).send({ error: 'This user is already your friend' });
      }

      await new Promise((resolve, reject) => {
        fastify.db.run(
          'INSERT INTO user_friends (user_id, friend_id) VALUES (?, ?)',
          [userId, friend.id],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });

      return reply.code(200).send({ success: true });

    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Could not add friend' });
    }
  });

  // Remove a friend
  fastify.post('/api/remove_friend', { preHandler: [authenticateUser] }, async (request, reply) => {
    const { username } = request.body;
    const userId = request.user.id;

    if (username === request.user.username) {
      return reply.code(400).send({ error: 'You cannot remove yourself from friends' });
    }

    try {
      const friend = await new Promise((resolve, reject) => {
        fastify.db.get(
          'SELECT id FROM users WHERE username = ?',
          [username],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          }
        );
      });

      if (!friend) {
        return reply.code(404).send({ error: 'User not found' });
      }

      const isFriend = await new Promise((resolve, reject) => {
        fastify.db.get(
          'SELECT 1 FROM user_friends WHERE user_id = ? AND friend_id = ?',
          [userId, friend.id],
          (err, row) => {
            if (err) reject(err);
            else resolve(!!row);
          }
        );
      });

      if (!isFriend) {
        return reply.code(400).send({ error: 'This user is not your friend' });
      }

      await new Promise((resolve, reject) => {
        fastify.db.run(
          'DELETE FROM user_friends WHERE user_id = ? AND friend_id = ?',
          [userId, friend.id],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });

      return reply.code(200).send({ success: true });

    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Could not remove friend' });
    }
  });
});
