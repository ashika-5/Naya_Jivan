const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { initializeDatabase } = require("./config/init");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/api/auth", require("./route/auth"));
app.use("/api/hospitals", require("./route/hospitals"));
app.use("/api/doctors", require("./route/doctors"));
app.use("/api/appointments", require("./route/appointment"));
app.use("/api/admin", require("./route/admin"));
app.use("/api/payment", require("./route/payment"));

const PORT = process.env.PORT || 5000;

// Initialize database and start server
initializeDatabase()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`),
    );
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });
