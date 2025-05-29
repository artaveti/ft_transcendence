// plugins/db.js
const fp = require('fastify-plugin');
const sqlite3 = require('sqlite3').verbose();

module.exports = fp(async function (fastify, opts) {
  const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
      fastify.log.error('Failed to connect to database:', err);
    } else {
      fastify.log.info('Database connected');
    }
  });

  fastify.decorate('db', db);

  fastify.addHook('onClose', (instance, done) => {
    db.close(done);
  });
});
