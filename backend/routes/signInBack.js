const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async function (fastify, opts) {
  fastify.post('/api/login', {
    schema: {
      body: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string', minLength: 1, maxLength: 30 },
          password: { type: 'string', minLength: 9, maxLength: 100 }
        },
        additionalProperties: false
      }
    }
  }, async (request, reply) => {
    const { username, password } = request.body;

    try {
      const user = await new Promise((resolve, reject) => {
        fastify.db.get(
          `SELECT id, username, email, password, twofa_enabled FROM users WHERE username = ?`,
          [username],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          }
        );
      });

      if (!user) {
        return reply.code(400).send({ error: ['Invalid credentials'] });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return reply.code(400).send({ error: ['Invalid credentials'] });
      }

      // If 2FA is enabled, send short-lived token and require second step
      if (user.twofa_enabled) {
        const tempToken = jwt.sign(
          { id: user.id, username: user.username, twofa_verified: false },
          JWT_SECRET,
          { expiresIn: '5m' }
        );
        return reply.code(200).send({ twofa_required: true, temp_token: tempToken });
      }

      // ✅ If no 2FA, issue full access JWT
      const fullToken = jwt.sign(
        { id: user.id, username: user.username, twofa_verified: true },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Optionally update online status
      await new Promise((resolve, reject) => {
        fastify.db.run(
          'UPDATE users SET online_status = ? WHERE id = ?',
          [true, user.id],
          (err) => err ? reject(err) : resolve()
        );
      });

      reply.code(200).send({ token: fullToken });

    } catch (err) {
      console.error('Login error:', err);
      return reply.code(500).send({ error: ['Server error'] });
    }
  });
};
