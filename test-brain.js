
const brain = require("./sila-brain");

const result = brain.trainModel();

console.log("SILA AI imejifunza data za mwanzo.");
console.log("Sentensi:", result.trainingSentences);
console.log("Msamiati:", result.vocabularySize);

const model = brain.loadModel();

console.log(
  "Jaribio:",
  brain.generate(model, "habari")
);
