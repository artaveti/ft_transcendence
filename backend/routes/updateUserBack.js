const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async function (fastify, opts) {
  fastify.put('/api/update_user', async (request, reply) => {
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

      // ✅ Handle multipart form data
      const parts = request.parts();
      const formFields = {};
      let uploadedProfilePicturePath = null;

      const uploadDir = path.join(__dirname, '..', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      for await (const part of parts) {
        if (part.type === 'file') {
          if (part.fieldname === 'profile_picture') {
            const extension = path.extname(part.filename) || '.jpg';
            const allowedExtensions = ['.jpg', '.jpeg', '.png'];
            if (!allowedExtensions.includes(extension.toLowerCase())) {
              return reply.code(400).send({ error: 'Invalid file type' });
            }

            const filename = `avatar_${userId}_${Date.now()}${extension}`;
            const filepath = path.join(uploadDir, filename);

            await new Promise((resolve, reject) => {
              const writeStream = fs.createWriteStream(filepath);
              part.file.pipe(writeStream);
              writeStream.on('finish', resolve);
              writeStream.on('error', reject);
            });

            uploadedProfilePicturePath = filepath;
          } else {
            await part.file.resume(); // Drain unexpected file parts
          }
        } else {
          formFields[part.fieldname] = part.value;
        }
      }

      const { username, email, password } = formFields;
      const errors = {};

      if (username && username.length < 3) {
        errors.username = ['username-too-short'];
      }
      if (email && !email.includes('@')) {
        errors.email = ['invalid-email'];
      }
      if (password && password.length < 6) {
        errors.password = ['password-too-short'];
      }

      if (Object.keys(errors).length > 0) {
        return reply.code(400).send(errors);
      }

      const fields = [];
      const values = [];

      if (username) {
        fields.push('username = ?');
        values.push(username);
      }
      if (email) {
        fields.push('email = ?');
        values.push(email);
      }
      if (password) {
        fields.push('password = ?');
        values.push(password);
      }
      if (uploadedProfilePicturePath) {
        fields.push('profile_picture = ?');
        values.push(uploadedProfilePicturePath);
      }

      if (fields.length === 0) {
        return reply.code(400).send({ error: 'Nothing to update' });
      }

      const updateQuery = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
      values.push(userId);

      await new Promise((resolve, reject) => {
        db.run(updateQuery, values, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      return reply.code(200).send({ success: true });
    } catch (err) {
      console.error('UpdateUserBack Fatal error:', err);
      return reply.code(500).send({ error: 'Server error' });
    }
  });
};
