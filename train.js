
const brain = require("./sila-brain");

const args = process.argv.slice(2);

if (args.length < 3) {
  console.log("Matumizi:");
  console.log('node train.js "intent" "mfano wa swali" "jibu"');
  console.log("");
  console.log("Mfano:");
  console.log('node train.js "greeting" "niaje bro" "Poa sana! Wewe je?"');
  process.exit(1);
}

const [intent, example, ...responseParts] = args;
const response = responseParts.join(" ");

try {
  const result = brain.addTrainingExample(intent, example, response);

  console.log("SILA AI imeongezewa mfano mpya.");
  console.log("Intent:", result.intent);
  console.log("Mifano ya intent hii:", result.examples);
  console.log("Model imehifadhiwa kwenye sila-model.json");
} catch (error) {
  console.error("Imeshindikana kufundisha model:", error.message);
  process.exitCode = 1;
}
