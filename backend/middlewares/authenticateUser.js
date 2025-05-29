const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

async function authenticateUser(request, reply) {
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

  const user = await new Promise((resolve, reject) => {
    request.server.db.get(
      'SELECT id, username, email, profile_picture, online_status FROM users WHERE id = ?',
      [userId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });

  if (!user) {
    return reply.code(404).send({ error: 'User not found' });
  }

  request.user = user; // Attach to request for downstream handlers
}

module.exports = { authenticateUser };
