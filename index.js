
const express = require("express");
const path = require("path");
const brain = require("./sila-brain");

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
    version: "2.0.0",
    model: "SILA Brain V2"
  });
});

app.get("/api/model", (req, res) => {
  try {
    const model = brain.loadModel();
    const examples = model.intents.reduce(
      (total, intent) => total + (intent.examples || []).length,
      0
    );

    res.json({
      available: true,
      name: model.name,
      version: model.version,
      type: model.type,
      intents: model.intents.length,
      examples,
      trainedAt: model.trainedAt
    });
  } catch (error) {
    console.error("Model status error:", error.message);
    res.status(500).json({
      available: false,
      error: "Imeshindikana kusoma model."
    });
  }
});

app.post("/api/chat", (req, res) => {
  const message = req.body?.message;

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      error: "Tafadhali andika ujumbe."
    });
  }

  if (message.length > 5000) {
    return res.status(413).json({
      error: "Ujumbe ni mrefu sana."
    });
  }

  try {
    const model = brain.loadModel();
    const reply = brain.generate(model, message);

    return res.json({
      reply,
      model: "SILA Brain V2",
      mode: "local-model"
    });
  } catch (error) {
    console.error("SILA AI chat error:", error.message);

    return res.status(500).json({
      error: "SILA AI imepata hitilafu wakati wa kujibu."
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    error: "Njia uliyoomba haijapatikana."
  });
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({
      error: "JSON ya ujumbe si sahihi."
    });
  }

  console.error("Server error:", error.message);

  return res.status(500).json({
    error: "Hitilafu ya ndani ya server."
  });
});

app.listen(PORT, "0.0.0.0", () => {
  // Tengeneza model mara server inapowashwa.
  brain.loadModel();

  console.log(`SILA AI running on port ${PORT}`);
  console.log("Model: SILA Brain V2");
});
