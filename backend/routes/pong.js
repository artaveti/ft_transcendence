require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider(process.env.AVALANCHE_RPC);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractABI = require('../contractABI.json');
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, wallet);

async function pongRoutes(fastify, options) {
  const db = fastify.db;

  // Util to sanitize and ensure valid ISO date
  const sanitizeDate = (inputDate) => {
    const date = new Date(inputDate);
    return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
  };

  fastify.post('/api/record_AIpong_match', async (request, reply) => {
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
    const { player_one, ai_level, winner, match_score, match_duration, match_date } = request.body;

    if (!player_one || !ai_level || !winner || !match_score || !match_duration) {
      return reply.code(400).send({ error: 'Missing fields' });
    }

    const matchDate = sanitizeDate(match_date);

    try {
      await db.run(
        `INSERT INTO ai_pong_matches (player_one, ai_level, winner, match_score, match_duration, match_date, user_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [player_one, ai_level, winner, match_score, match_duration, matchDate, userId]
      );

      await db.run(
        `UPDATE users
         SET total_pong_matches = total_pong_matches + 1,
             total_pong_ai_matches = total_pong_ai_matches + 1,
             total_pong_time = total_pong_time + ?
         WHERE id = ?`,
        [match_duration, userId]
      );

      return reply.code(201).send({ success: true });
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: 'Database error' });
    }
  });

  fastify.post('/api/record_PvPong_match', async (request, reply) => {
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
    const { player_one, player_two, winner, match_score, match_duration, match_date } = request.body;

    if (!player_one || !player_two || !winner || !match_score || !match_duration) {
      return reply.code(400).send({ error: 'Missing fields' });
    }

    const matchDate = sanitizeDate(match_date);

    try {
      await db.run(
        `INSERT INTO pvp_pong_matches (player_one, player_two, winner, match_score, match_duration, match_date, user_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [player_one, player_two, winner, match_score, match_duration, matchDate, userId]
      );

      await db.run(
        `UPDATE users
         SET total_pong_matches = total_pong_matches + 1,
             total_pong_pvp_matches = total_pong_pvp_matches + 1,
             total_pong_time = total_pong_time + ?
         WHERE id = ?`,
        [match_duration, userId]
      );

      return reply.code(201).send({ success: true });
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: 'Database error' });
    }
  });

  fastify.post('/api/record_tournament', async (request, reply) => {
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
    const { player_one, player_two, player_three, player_four, winner, duration, date } = request.body;

    if (!player_one || !player_two || !player_three || !player_four || !winner || !duration) {
      return reply.code(400).send({ error: 'Missing fields' });
    }

    const tournamentDate = sanitizeDate(date);

    try {
      const insertedId = await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO pong_tournaments (player_one, player_two, player_three, player_four, winner, duration, date, user_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [player_one, player_two, player_three, player_four, winner, duration, tournamentDate, userId],
          function (err) {
            if (err) reject(err);
            else resolve(this.lastID);
          }
        );
      });

      await db.run(
        `UPDATE users
         SET total_pong_matches = total_pong_matches + 3,
             total_tournament_played = total_tournament_played + 1,
             total_pong_time = total_pong_time + ?
         WHERE id = ?`,
        [duration, userId]
      );

      const tx = await contract.recordMatch(
        insertedId,
        player_one,
        player_two,
        player_three,
        player_four,
        winner,
        duration,
        tournamentDate,
        userId
      );
      await tx.wait();

      console.log("📝 Blockchain TX Hash:", tx.hash);

      return reply.code(201).send({ success: true, txHash: tx.hash });
    } catch (err) {
      console.error("❌ Error:", err);
      return reply.code(500).send({ error: 'Database or blockchain error' });
    }
  });
}

module.exports = pongRoutes;
