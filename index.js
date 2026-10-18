
const express = require("express");
const path = require("path");
const brain = require("./sila-brain");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "20kb" }));

// Homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// System status
app.get("/api/health", (req, res) => {
  res.json({
    name: "SILA AI",
    status: "online",
    version: "1.0.0",
    model: "SILA Brain V1"
  });
});

// Model status
app.get("/api/model", (req, res) => {
  try {
    const model = brain.loadModel();

    res.json({
      available: Boolean(model),
      name: "SILA Brain V1",
      type: "word-transition-model",
      vocabularySize: model
        ? model.vocabulary.length
        : 0
    });
  } catch (error) {
    console.error("Model status error:", error.message);

    res.status(500).json({
      available: false,
      error: "Imeshindikana kusoma model."
    });
  }
});

// Chat with SILA AI
app.post("/api/chat", (req, res) => {
  const message = req.body?.message;

  if (
    typeof message !== "string" ||
    !message.trim()
  ) {
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
    let model = brain.loadModel();

    // Build the initial model if it does not exist.
    if (!model) {
      brain.trainModel();
      model = brain.loadModel();
    }

    if (!model) {
      throw new Error("Model haikupatikana baada ya mafunzo.");
    }

    const reply = brain.generate(model, message);

    res.json({
      reply:
        reply ||
        "Bado sijajifunza kutengeneza jibu la ujumbe huu.",
      model: "SILA Brain V1",
      mode: "local-model"
    });
  } catch (error) {
    console.error("SILA AI chat error:", error.message);

    res.status(500).json({
      error: "SILA AI imepata hitilafu wakati wa kujibu."
    });
  }
});

// Unknown routes
app.use((req, res) => {
  res.status(404).json({
    error: "Njia uliyoomba haijapatikana."
  });
});

// Handle invalid JSON
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({
      error: "JSON ya ujumbe si sahihi."
    });
  }

  console.error("Server error:", error.message);

  res.status(500).json({
    error: "Hitilafu ya ndani ya server."
  });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`SILA AI running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
