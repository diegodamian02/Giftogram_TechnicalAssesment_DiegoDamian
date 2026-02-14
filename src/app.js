// Testing database connectivity if it works, initial set up for the app
require("dotenv").config();

const express = require("express");
const { pool } = require("./db");
const authRoutes = require("./routes/auth");

const app = express();
app.use(express.json());

// routes
app.use("/", authRoutes);

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, db: "connected" });
  } catch (err) {
    res.status(500).json({ ok: false, db: "disconnected" });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));

