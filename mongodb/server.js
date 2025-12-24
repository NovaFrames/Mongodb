const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/prompts", require("./routes/promptRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

// Database Connection & Server Start
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Database Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected (Mongoose)"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Test Route
app.get("/", (req, res) => res.send("API is running"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
