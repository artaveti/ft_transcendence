const { ethers } = require("ethers");
const contractABI = require("../contractABI.json");

async function syncBlockchainToDB(db) {
  const provider = new ethers.JsonRpcProvider(process.env.AVALANCHE_RPC);
  const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    contractABI,
    provider
  );

  const matches = await contract.getAllMatches();
  console.log(`🔄 Found ${matches.length} matches on-chain`);

  for (const match of matches) {
    // Destructure by position from tuple
    const [
      id,
      player_one,
      player_two,
      player_three,
      player_four,
      winner,
      duration,
      date,
      user_id
    ] = match;

    // Safely cast all types
    const matchObj = {
      id: Number(id),
      player_one: player_one.toString(),
      player_two: player_two.toString(),
      player_three: player_three.toString(),
      player_four: player_four.toString(),
      winner: winner.toString(),
      duration: Number(duration),
      date: date.toString(),
      user_id: Number(user_id)
    };

    const exists = await new Promise((resolve, reject) => {
      db.get(
        `SELECT id FROM pong_tournaments WHERE id = ?`,
        [matchObj.id],
        (err, row) => {
          if (err) reject(err);
          else resolve(!!row);
        }
      );
    });

    if (!exists) {
      console.log(`📥 Syncing match ID ${matchObj.id} from blockchain`);
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO pong_tournaments (id, player_one, player_two, player_three, player_four, winner, duration, date, user_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            matchObj.id,
            matchObj.player_one,
            matchObj.player_two,
            matchObj.player_three,
            matchObj.player_four,
            matchObj.winner,
            matchObj.duration,
            matchObj.date,
            matchObj.user_id
          ],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }
  }

  console.log(`✅ DB sync complete`);
}

module.exports = { syncBlockchainToDB };
