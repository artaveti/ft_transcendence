const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async function (fastify, opts) {
  fastify.get('/api/user_avatar', async (request, reply) => {
    try {
      const db = fastify.db;

      // ✅ Extract JWT from Authorization header
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return reply.code(401).send({ error: 'Missing or invalid token' });
      }

      const token = authHeader.split(" ")[1];
      let decoded;

      try {
        decoded = jwt.verify(token, JWT_SECRET);
      } catch (err) {
        return reply.code(401).send({ error: 'Invalid or expired token' });
      }

      const userId = decoded.id;

      const user = await new Promise((resolve, reject) => {
        db.get('SELECT profile_picture FROM users WHERE id = ?', [userId], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      if (!user || !user.profile_picture) {
        return reply.code(404).send({ error: 'No profile photo found' });
      }

      const profilePicturePath = path.resolve(user.profile_picture);

      if (!fs.existsSync(profilePicturePath)) {
        return reply.code(404).send({ error: 'No profile photo found' });
      }

      return reply
        .header('Content-Type', 'image/jpeg')
        .send(fs.createReadStream(profilePicturePath));
    } catch (err) {
      console.error("Avatar fetch error:", err);
      return reply.code(500).send({ error: 'Server error' });
    }
  });
};
