const speakeasy = require('speakeasy');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async function (fastify, opts) {
  fastify.post('/api/enable-2fa', {
    schema: {
      body: {
        type: 'object',
        required: ['token', 'code'],
        properties: {
          token: { type: 'string' },
          code: { type: 'string', minLength: 6, maxLength: 6 }
        },
        additionalProperties: false
      }
    }
  }, async (request, reply) => {
    const { token, code } = request.body;

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.id;

      // Get user and stored secret
      const user = await new Promise((resolve, reject) => {
        fastify.db.get(
          'SELECT twofa_secret FROM users WHERE id = ?',
          [userId],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          }
        );
      });

      if (!user || !user.twofa_secret) {
        return reply.code(400).send({ error: ['2FA not initialized'] });
      }

      // Verify the 2FA code
      const isValid = speakeasy.totp.verify({
        secret: user.twofa_secret,
        encoding: 'base32',
        token: code,
        window: 1
      });

      if (!isValid) {
        return reply.code(400).send({ error: ['Invalid 2FA code'] });
      }

      // ✅ Enable 2FA
      await new Promise((resolve, reject) => {
        fastify.db.run(
          'UPDATE users SET twofa_enabled = 1 WHERE id = ?',
          [userId],
          (err) => (err ? reject(err) : resolve())
        );
      });

      reply.code(200).send({ success: true });

    } catch (err) {
      console.error('2FA enable error:', err);
      return reply.code(401).send({ error: ['Invalid or expired token'] });
    }
  });
};
