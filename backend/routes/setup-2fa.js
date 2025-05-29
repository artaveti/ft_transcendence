const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

module.exports = async function (fastify, opts) {
  fastify.post('/api/setup-2fa', {
    schema: {
      body: {
        type: 'object',
        required: ['token'],
        properties: {
          token: { type: 'string' }
        },
        additionalProperties: false
      }
    }
  }, async (request, reply) => {
    const { token } = request.body;
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET;

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.id;

      // Generate 2FA secret
      const secret = speakeasy.generateSecret({
        name: `YourApp (${decoded.username})`,
        length: 20
      });

      // Save secret temporarily (don't enable yet)
      await new Promise((resolve, reject) => {
        fastify.db.run(
          'UPDATE users SET twofa_secret = ?, twofa_enabled = 0 WHERE id = ?',
          [secret.base32, userId],
          (err) => (err ? reject(err) : resolve())
        );
      });

      // Generate QR code from otpauth URL
      const qrCodeDataURL = await qrcode.toDataURL(secret.otpauth_url);

      reply.code(200).send({
        secret: secret.base32,       // for testing / development
        qrCode: qrCodeDataURL        // scan with Authenticator app
      });

    } catch (err) {
      console.error('2FA setup error:', err);
      return reply.code(401).send({ error: ['Invalid or expired token'] });
    }
  });
};
