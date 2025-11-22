const express = require("express");
const router = express.Router();
const { SDK, SchemaEncoder, zeroBytes32 } = require("@somnia-chain/streams");
const { createPublicClient, createWalletClient, http, toHex } = require("viem");
const { privateKeyToAccount } = require("viem/accounts");
const { waitForTransactionReceipt } = require("viem/actions");
const { dreamChain } = require("../dream-chain");
require("dotenv").config();

// Create SDK clients
const publicClient = createPublicClient({
  chain: dreamChain,
  transport: http(),
});

const walletClient = createWalletClient({
  account: privateKeyToAccount(process.env.PRIVATE_KEY),
  chain: dreamChain,
  transport: http(),
});

const sdk = new SDK({ public: publicClient, wallet: walletClient });

// Define schema
const playerSchema = `address player, uint256 score, uint256 playTime`;
const encoder = new SchemaEncoder(playerSchema);

// Compute schema ID immediately (synchronous)
let schemaId;
let initPromise;

// ✅ Compute + register schema once on startup
(async () => {
  try {
    schemaId = await sdk.streams.computeSchemaId(playerSchema);
    console.log("📘 Schema ID:", schemaId);

    try {
      const txHash = await sdk.streams.registerDataSchemas(
        [
          {
            id: "player_score",
            schema: playerSchema,
            parentSchemaId: zeroBytes32,
          },
        ],
        true
      );

      if (txHash && typeof txHash === 'string' && txHash.startsWith('0x')) {
        await waitForTransactionReceipt(publicClient, { hash: txHash });
        console.log(`✅ Schema registered with transaction: ${txHash}`);
      } else {
        console.log("ℹ️ Schema already registered — no action required.");
      }
    } catch (err) {
      if (err.message.includes("Nothing to register") || err.message.includes("SchemaAlreadyRegistered")) {
        console.log("ℹ️ Schema already exists on blockchain — ready to use.");
      } else {
        console.warn("⚠️ Schema registration warning:", err.message);
      }
    }
  } catch (err) {
    console.error("❌ Failed to initialize schema:", err.message);
  }
})();

/**
 * 📍 GET /api/schema
 * Trả về schemaId hiện tại
 */
router.get("/schema", async (req, res) => {
  try {
    if (!schemaId) {
      schemaId = await sdk.streams.computeSchemaId(playerSchema);
    }
    res.json({ schemaId });
  } catch (err) {
    res.status(500).json({ error: "Failed to compute schema ID", message: err.message });
  }
});

/**
 * 📍 POST /api/publish
 * Gửi dữ liệu lên Somnia Streams
 * Body: { player, score, playTime }
 */
router.post("/publish", async (req, res) => {
  try {
    const { player, score, playTime } = req.body;

    if (!player || score == null || playTime == null) {
      return res
        .status(400)
        .json({ error: "Missing player, score, or playTime" });
    }

    const data = encoder.encodeData([
      { name: "player", value: player, type: "address" },
      { name: "score", value: BigInt(score), type: "uint256" },
      { name: "playTime", value: BigInt(playTime), type: "uint256" },
    ]);

    const dataStreams = [
      { id: toHex(`player-${Date.now()}`, { size: 32 }), schemaId, data },
    ];

    const tx = await sdk.streams.set(dataStreams);

    console.log(
      `✅ Published: ${player} | Score ${score} | PlayTime ${playTime}s | Tx ${tx}`
    );

    res.json({ success: true, txHash: tx });
  } catch (err) {
    console.error("❌ Publish error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * 📍 GET /api/data
 * Truy xuất toàn bộ dữ liệu từ publisher
 */
router.get("/data", async (req, res) => {
  try {
    // Ensure schemaId is computed
    if (!schemaId) {
      schemaId = await sdk.streams.computeSchemaId(playerSchema);
    }

    const publisher = process.env.PUBLISHER_WALLET;
    const allData = await sdk.streams.getAllPublisherDataForSchema(
      schemaId,
      publisher
    );

    // Handle null or empty response
    if (!allData || !Array.isArray(allData) || allData.length === 0) {
      return res.json({
        totalPlayers: 0,
        leaderboard: []
      });
    }

    const formatted = allData.map((item) => {
      let player = "",
        score = "",
        playTime = "";
      for (const field of item) {
        const val = field.value?.value ?? field.value;
        if (field.name === "player") player = val;
        if (field.name === "score") score = Number(val);
        if (field.name === "playTime") playTime = Number(val);
      }
      return { player, score, playTime };
    });

    // Bước 2️⃣ - Lọc trùng player, chỉ giữ score cao nhất
    const bestScores = {};
    for (const entry of formatted) {
      if (!entry.player) continue;
      const current = bestScores[entry.player];
      if (!current || entry.score > current.score) {
        bestScores[entry.player] = entry;
      }
    }

    // Bước 3️⃣ - Chuyển về mảng và sắp xếp giảm dần theo score
    const leaderboard = Object.values(bestScores)
      .sort((a,b) => b.score - a.score)
      .map((e, index) => ({
        rank: index + 1,
        player: e.player,
        score: e.score.toString(),
        playTime: e.playTime.toString(),
      }));

    res.json({
      totalPlayers: leaderboard.length,
      leaderboard,
    });
  } catch (err) {
    console.error("❌ Fetch error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
