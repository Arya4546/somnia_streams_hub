const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // <-- Thêm dòng này
const streamRoutes = require("./routes/streams");

dotenv.config();

const app = express();

// ✅ Bật CORS trước khi dùng route
app.use(cors({
  origin: "*", // Cho phép tất cả origin (dev/test)
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Mount routes
app.use("/api", streamRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Express backend running on port ${PORT}`)
);
