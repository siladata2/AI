
const fs = require("fs");
const path = require("path");
const brain = require("./sila-brain");

const DATA_FILE = path.join(__dirname, "sila-data.json");

function readTrainingData() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }

  const data = JSON.parse(
    fs.readFileSync(DATA_FILE, "utf8")
  );

  if (!Array.isArray(data)) {
    throw new Error("Training data lazima iwe array.");
  }

  return data.filter(
    item => typeof item === "string" && item.trim()
  );
}

function addTrainingSentence(sentence) {
  const data = readTrainingData();
  const cleaned = sentence.trim();

  if (cleaned.length < 2) {
    throw new Error("Sentensi ni fupi sana.");
  }

  data.push(cleaned);

  const result = brain.trainModel(data);

  console.log("SILA AI imefundishwa upya.");
  console.log("Sentensi zote:", result.trainingSentences);
  console.log("Msamiati:", result.vocabularySize);
}

const sentence = process.argv.slice(2).join(" ");

if (!sentence) {
  console.log(
    'Matumizi: node train.js "SILA AI inajifunza Kiswahili"'
  );
  process.exit(1);
}

try {
  addTrainingSentence(sentence);
} catch (error) {
  console.error("Imeshindikana:", error.message);
  process.exitCode = 1;
}
