const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async function (fastify, opts) {
  fastify.post('/api/logout', async (request, reply) => {
    const db = fastify.db;

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({ error: 'Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;

    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return reply.code(401).send({ error: 'Invalid or expired token' });
    }

    const userId = decoded.id;

    // Update online_status to false
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET online_status = ? WHERE id = ?',
        [false, userId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Optionally clear cookies
    reply
      .clearCookie('user_id', { path: '/' })
      .code(200)
      .send({ success: true });
  });
};
