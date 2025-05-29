const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async function (fastify, opts) {
  fastify.get('/api/profile', async (request, reply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return reply.status(401).send({ error: 'Not authenticated' });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.id;

      const user = await new Promise((resolve, reject) => {
        fastify.db.get(
          'SELECT id, username, email FROM users WHERE id = ?',
          [userId],
          (err, row) => (err ? reject(err) : resolve(row))
        );
      });

      if (!user) {
        return reply.status(404).send({ error: 'User not found' });
      }

      reply.code(200).send({ user });
    } catch (err) {
      console.error("Profile auth error:", err);
      return reply.status(401).send({ error: 'Invalid or expired token' });
    }
  });
};
