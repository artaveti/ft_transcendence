const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(
  '533060755960-kfel2q1fm958u6ui38mooe5psojci4tr.apps.googleusercontent.com'
);

module.exports = async function (fastify, opts) {
  const db = fastify.db;

  fastify.post('/api/google-login', async (request, reply) => {
    const { id_token } = request.body;

    if (!id_token) {
      return reply.code(400).send({ error: 'Missing id_token' });
    }

    try {
      const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: '533060755960-kfel2q1fm958u6ui38mooe5psojci4tr.apps.googleusercontent.com'
      });

      const payload = ticket.getPayload();
      const googleId = payload.sub;
      const email = payload.email;
      const name = payload.name || email;

      // Check if user already exists
      const user = await new Promise((resolve, reject) => {
        db.get(
          `SELECT id, username FROM users WHERE google_id = ? OR email = ?`,
          [googleId, email],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          }
        );
      });

      let userId, username;

      if (user) {
        userId = user.id;
        username = user.username;
      } else {
        // Create new user
        const newUsername = name.replace(/\s+/g, '').toLowerCase().slice(0, 15);

        const result = await new Promise((resolve, reject) => {
          db.run(
            `INSERT INTO users (username, email, google_id) VALUES (?, ?, ?)`,
            [newUsername, email, googleId],
            function (err) {
              if (err) reject(err);
              else resolve({ id: this.lastID });
            }
          );
        });

        userId = result.id;
        username = newUsername;
      }

      // Generate JWT
      const token = jwt.sign(
        { id: userId, username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return reply.send({ token });

    } catch (err) {
      console.error('Google Sign-In failed:', err);
      return reply.code(401).send({ error: 'Invalid ID token' });
    }
  });
};
