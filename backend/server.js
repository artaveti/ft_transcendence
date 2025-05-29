const Fastify = require('fastify');
/*const Fastify = require('fastify')({
  ignoreTrailingSlash: true,
});*/
const sqlite3 = require('sqlite3').verbose();
const fastifyCookie = require('@fastify/cookie');
const fastifyMultipart = require('@fastify/multipart');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { syncBlockchainToDB } = require('./utils/sync');
const setUserIdAutoIncrementStart = require('./utils/syncUsersAutoIncrement');

// Create log file stream
const logStream = fs.createWriteStream(path.join(__dirname, 'server.log'), { flags: 'a' });

const fastify = Fastify({
  logger: {
    level: 'debug',
    stream: logStream
  }
});

// Connect to database
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  }
  console.log('Database connected');

  // Step 1: Sync tournament data from blockchain
  syncBlockchainToDB(db)
    .then(async () => {
      console.log("✅ Blockchain sync complete");
      // Step 2: Set user auto-increment start
      await setUserIdAutoIncrementStart(db);
    })
    .catch(err => {
      console.error("❌ Sync failed:", err);
    });
});

// Decorate db to fastify instance
fastify.decorate('db', db);

// Close DB properly when server stops
fastify.addHook('onClose', (instance, done) => {
  db.close(done);
});

// Register plugins
fastify.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET,
});

fastify.register(fastifyMultipart);

// Register routes
fastify.register(require('./routes/signUpBack'));
fastify.register(require('./routes/signInBack'));
fastify.register(require('./routes/profileBack'));
fastify.register(require('./routes/signOutBack'));
fastify.register(require('./routes/userAvatarBack'));
fastify.register(require('./routes/updateUserBack'));
fastify.register(require('./routes/usersListBack'));
fastify.register(require('./routes/friendsBack'));
fastify.register(require('./routes/pong'));
fastify.register(require('./routes/pongStats'));
fastify.register(require('./routes/verify-2fa'));
fastify.register(require('./routes/setup-2fa'));
fastify.register(require('./routes/enable-2fa'));
fastify.register(require('./routes/googleLoginBack'));

// Start server
fastify.listen({ port: 8585, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
