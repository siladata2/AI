
const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "sila-data.json");
const MODEL_FILE = path.join(__dirname, "sila-model.json");

const trainingData = [
  "habari yako",
  "habari yangu ni nzuri",
  "jina langu ni sila ai",
  "mimi ni sila ai",
  "ninaweza kujifunza maneno",
  "kiswahili ni lugha nzuri",
  "habari za leo",
  "leo ni siku nzuri",
  "asante kwa kuniuliza",
  "karibu sana rafiki",
  "ninaendelea kujifunza",
  "kujifunza kunahitaji mazoezi",
  "kompyuta inaweza kufundisha model",
  "model hujifunza mifumo ya data",
  "sila tech inajenga teknolojia"
];

function tokenize(text) {
  return text
    .toLowerCase()
    .normalize("NFC")
    .match(/[\p{L}\p{N}]+|[^\s\p{L}\p{N}]/gu) || [];
}

function train(sentences) {
  const nextWords = {};

  for (const sentence of sentences) {
    const words = ["<start>", ...tokenize(sentence), "<end>"];

    for (let i = 0; i < words.length - 1; i++) {
      const current = words[i];
      const next = words[i + 1];

      if (!nextWords[current]) {
        nextWords[current] = {};
      }

      nextWords[current][next] =
        (nextWords[current][next] || 0) + 1;
    }
  }

  return {
    version: 1,
    type: "word-transition-model",
    vocabulary: [
      ...new Set(
        sentences.flatMap(tokenize)
      )
    ],
    nextWords
  };
}

function generate(model, prompt, maxWords = 15) {
  const input = tokenize(prompt);
  let current = input[input.length - 1] || "<start>";
  const output = [];

  for (let i = 0; i < maxWords; i++) {
    const choices = model.nextWords[current];

    if (!choices) break;

    const ranked = Object.entries(choices)
      .filter(([word]) => word !== "<start>")
      .sort((a, b) => b[1] - a[1]);

    if (ranked.length === 0) break;

    const next = ranked[0][0];

    if (next === "<end>") break;

    output.push(next);
    current = next;
  }

  return output.join(" ");
}

function saveJSON(file, value) {
  fs.writeFileSync(
    file,
    JSON.stringify(value, null, 2),
    "utf8"
  );
}

function loadModel() {
  if (!fs.existsSync(MODEL_FILE)) {
    return null;
  }

  return JSON.parse(
    fs.readFileSync(MODEL_FILE, "utf8")
  );
}

function trainModel(extraSentences = []) {
  const sentences = [
    ...trainingData,
    ...extraSentences
  ];

  const model = train(sentences);

  saveJSON(DATA_FILE, sentences);
  saveJSON(MODEL_FILE, model);

  return {
    vocabularySize: model.vocabulary.length,
    trainingSentences: sentences.length
  };
}

module.exports = {
  trainModel,
  loadModel,
  generate
};
