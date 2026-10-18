
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "20kb" }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/health", (req, res) => {
  res.json({
    name: "SILA AI",
    status: "online",
    version: "1.0.0"
  });
});

app.post("/api/chat", (req, res) => {
  const message = req.body?.message;

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      error: "Tafadhali andika ujumbe."
    });
  }

  res.json({
    reply: `SILA AI imepokea ujumbe wako: ${message.trim()}`,
    mode: "test"
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SILA AI running on port ${PORT}`);
});
