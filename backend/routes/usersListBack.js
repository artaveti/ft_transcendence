// routes/usersListBack.js

const fp = require('fastify-plugin');
const { authenticateUser } = require('../middlewares/authenticateUser');

module.exports = fp(async function (fastify, opts) {
  fastify.get('/api/users_list', { preHandler: [authenticateUser] }, async (request, reply) => {
    try {
      const db = fastify.db;

      const users = await new Promise((resolve, reject) => {
        db.all(
          'SELECT username, profile_picture, online_status FROM users',
          (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          }
        );
      });

      return reply.code(200).send(users);

    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
});
