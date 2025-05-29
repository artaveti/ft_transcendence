const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async function (fastify, opts) {
  fastify.post('/api/verify-2fa', {
    schema: {
      body: {
        type: 'object',
        required: ['temp_token', 'code'],
        properties: {
          temp_token: { type: 'string' },
          code: { type: 'string', minLength: 6, maxLength: 6 }
        },
        additionalProperties: false
      }
    }
  }, async (request, reply) => {
    const { temp_token, code } = request.body;

    try {
      const decoded = jwt.verify(temp_token, JWT_SECRET);

      if (decoded.twofa_verified !== false) {
        return reply.code(400).send({ error: ['Invalid or expired token'] });
      }

      const user = await new Promise((resolve, reject) => {
        fastify.db.get(
          'SELECT id, username, twofa_secret FROM users WHERE id = ?',
          [decoded.id],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          }
        );
      });

      if (!user || !user.twofa_secret) {
        return reply.code(400).send({ error: ['2FA not set up'] });
      }

      const isValid = speakeasy.totp.verify({
        secret: user.twofa_secret,
        encoding: 'base32',
        token: code,
        window: 1
      });

      if (!isValid) {
        return reply.code(400).send({ error: ['Invalid 2FA code'] });
      }

      // ✅ Set user online
      await new Promise((resolve, reject) => {
        fastify.db.run(
          'UPDATE users SET online_status = ? WHERE id = ?',
          [true, user.id],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });

      // ✅ Issue final access JWT
      const fullToken = jwt.sign(
        { id: user.id, username: user.username, twofa_verified: true },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      reply.code(200).send({ token: fullToken });

    } catch (err) {
      console.error('2FA verification failed:', err);
      return reply.code(401).send({ error: ['Invalid or expired token'] });
    }
  });
};
