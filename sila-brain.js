
const fs = require("fs");
const path = require("path");

const MODEL_FILE = path.join(__dirname, "sila-model.json");
const DATA_FILE = path.join(__dirname, "sila-extra-data.json");

const knowledge = [
  {
    intent: "greeting",
    examples: [
      "hi", "hello", "hey", "habari", "habari yako",
      "habari za leo", "mambo", "vipi", "niaje",
      "za asubuhi", "habari za asubuhi", "za mchana",
      "habari za mchana", "za jioni", "habari za jioni",
      "za usiku", "salama", "uko aje", "how are you",
      "good morning", "good afternoon", "good evening"
    ],
    responses: [
      "Habari! Karibu kwenye mazungumzo na SILA AI.",
      "Hi! Mimi ni SILA AI. Nikusaidie nini leo?",
      "Mambo! Niko tayari kuzungumza nawe.",
      "Habari yako! Siku yako inaendeleaje?",
      "Hello! Karibu sana. Una swali gani leo?"
    ]
  },
  {
    intent: "identity",
    examples: [
      "wewe ni nani", "unaitwa nani", "jina lako nani",
      "what is your name", "who are you", "wewe ni ai gani",
      "niambie kuhusu wewe", "unaitwaje", "jina lako",
      "nani amekutengeneza", "nani amekuumba",
      "umeundwa na nani", "developer wako ni nani"
    ],
    responses: [
      "Mimi ni SILA AI, msaidizi wa mazungumzo unaotengenezwa na SILA TECH.",
      "Naitwa SILA AI. Mradi wangu unajengwa kwa JavaScript na teknolojia za SILA TECH.",
      "Mimi ni SILA AI. Nimeundwa kusaidia mazungumzo na kujibu maswali kulingana na maarifa yaliyowekwa kwenye model yangu."
    ]
  },
  {
    intent: "wellbeing",
    examples: [
      "upo poa", "uko poa", "habari yako wewe",
      "unaendeleaje", "una hali gani", "how are you",
      "uko vizuri", "vipi hali yako", "unaendeleaje leo"
    ],
    responses: [
      "Niko vizuri, asante! Wewe unaendeleaje?",
      "Nipo hapa tayari kukusaidia. Wewe hali yako ikoje?",
      "Asante kwa kuniuliza! Mazungumzo yetu yanaendeleaje?"
    ]
  },
  {
    intent: "thanks",
    examples: [
      "asante", "ahsante", "shukrani", "asante sana",
      "thank you", "thanks", "nashukuru", "umenisaidia",
      "shukran"
    ],
    responses: [
      "Karibu sana!",
      "Usijali, niko hapa kusaidia.",
      "Asante pia kwa kuzungumza nami!",
      "Karibu! Una jambo lingine unalotaka kujua?"
    ]
  },
  {
    intent: "goodbye",
    examples: [
      "kwa heri", "tutaonana", "baadaye", "bye",
      "goodbye", "good night", "lala salama",
      "naondoka", "tuonane tena", "nakuaga"
    ],
    responses: [
      "Kwa heri! Tutazungumza tena.",
      "Sawa, tutaonana baadaye!",
      "Kwaheri, uwe na siku njema.",
      "Lala salama! Tutaongea tena."
    ]
  },
  {
    intent: "apology",
    examples: [
      "samahani", "sorry", "nisamehe", "naomba msamaha",
      "pole kwa hilo", "samahani kwa kuchelewa"
    ],
    responses: [
      "Usijali, hakuna shida.",
      "Ni sawa. Tuendelee na mazungumzo yetu.",
      "Hakuna tatizo. Unaweza kuniambia unachohitaji."
    ]
  },
  {
    intent: "age",
    examples: [
      "una umri gani", "una miaka mingapi", "how old are you",
      "umri wako ni upi"
    ],
    responses: [
      "Mimi ni programu ya AI, kwa hiyo sina umri kama binadamu.",
      "Sina umri wa kibinadamu. Mimi ni SILA AI, programu inayotengenezwa na SILA TECH."
    ]
  },
  {
    intent: "location",
    examples: [
      "unaishi wapi", "upo wapi", "where do you live",
      "nchi yako ni ipi", "unatoka wapi"
    ],
    responses: [
      "Mimi ni programu, kwa hiyo sina makazi kama binadamu.",
      "Ninaendesha mazungumzo kupitia programu ya SILA AI; sina mji ninaoishi kama mtu."
    ]
  },
  {
    intent: "creator",
    examples: [
      "nani amekutengeneza", "nani alikutengeneza",
      "muundaji wako", "creator wako", "nani alikuumba",
      "who created you", "who made you"
    ],
    responses: [
      "SILA AI ni mradi unaotengenezwa na SILA TECH.",
      "Muundaji wa mradi huu ni SILA TECH."
    ]
  },
  {
    intent: "capabilities",
    examples: [
      "unaweza kufanya nini", "una uwezo gani",
      "what can you do", "naweza kukuuliza nini",
      "unaweza kunisaidia nini", "kazi yako ni nini",
      "unafanya kazi gani"
    ],
    responses: [
      "Naweza kuzungumza, kujibu salamu na maswali ya kawaida, na kusaidia mada za teknolojia kulingana na maarifa yaliyowekwa kwenye model yangu.",
      "Unaweza kuniuliza kuhusu SILA AI, JavaScript, kompyuta, teknolojia na mazungumzo ya kawaida. Maarifa yangu bado yanaendelea kujengwa."
    ]
  },
  {
    intent: "love",
    examples: [
      "nakupenda", "i love you", "unakupenda",
      "unanipenda", "do you love me"
    ],
    responses: [
      "Asante kwa maneno mazuri! Mimi ni AI, lakini niko hapa kuzungumza nawe kwa heshima.",
      "Nashukuru! Naweza kuwa msaidizi wako wa mazungumzo."
    ]
  },
  {
    intent: "joke",
    examples: [
      "nipe utani", "niambie utani", "tell me a joke",
      "nipe kichekesho", "utani mmoja"
    ],
    responses: [
      "Kwa nini kompyuta ilienda kwa daktari? Kwa sababu ilikuwa na virusi!",
      "Kwa nini programu haikupenda mvua? Iliogopa kupata bugs!",
      "Mwalimu aliuliza: kompyuta inakula nini? Mwanafunzi akasema: data!"
    ]
  },
  {
    intent: "thanks_help",
    examples: [
      "naomba msaada", "nisaidie", "help me",
      "nahitaji msaada", "unaweza kunisaidia"
    ],
    responses: [
      "Ndiyo, nitajaribu kukusaidia. Niambie unahitaji msaada kuhusu nini.",
      "Nipo tayari kusaidia. Eleza tatizo lako kwa maelezo kidogo."
    ]
  },
  {
    intent: "technology",
    examples: [
      "teknolojia ni nini", "what is technology",
      "kompyuta ni nini", "internet ni nini",
      "javascript ni nini", "programming ni nini",
      "api ni nini", "ai ni nini", "artificial intelligence ni nini",
      "machine learning ni nini", "model ni nini",
      "server ni nini", "website ni nini"
    ],
    responses: [
      "Teknolojia ni matumizi ya maarifa na zana kutatua matatizo au kufanya kazi kwa ufanisi zaidi.",
      "JavaScript ni lugha ya programu inayotumika kutengeneza tovuti na programu za server, kwa mfano kwa kutumia Node.js.",
      "API ni njia inayowezesha programu tofauti kuwasiliana na kubadilishana data.",
      "AI ni teknolojia inayowezesha kompyuta kufanya kazi kama kuchambua lugha, kutambua mifumo na kutengeneza majibu.",
      "Kompyuta ni kifaa kinachopokea data, kuichakata na kutoa matokeo kulingana na programu."
    ]
  },
  {
    intent: "weather",
    examples: [
      "hali ya hewa ikoje", "weather today", "mvua itanyesha",
      "joto likoje", "hali ya hewa"
    ],
    responses: [
      "Sina taarifa za moja kwa moja za hali ya hewa katika model hii. Angalia huduma ya utabiri wa hali ya hewa kwa eneo lako.",
      "Ili kupata hali ya hewa ya sasa, unahitaji taarifa za moja kwa moja za eneo lako. Maarifa yangu ya ndani hayaonyeshi utabiri wa sasa."
    ]
  },
  {
    intent: "unknown",
    examples: [],
    responses: [
      "Sijaelewa vizuri swali hilo. Unaweza kulieleza kwa maneno mengine?",
      "Bado sina jibu la uhakika kwa hilo. Jaribu kuniuliza kwa namna nyingine.",
      "Ninaendelea kujengwa. Tafadhali nipe maelezo zaidi ili nijaribu kukusaidia."
    ]
  }
];

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text) {
  return normalize(text)
    .split(" ")
    .filter(word => word.length > 0);
}

function similarity(input, example) {
  const a = tokenize(input);
  const b = tokenize(example);

  if (!a.length || !b.length) return 0;

  const inputText = a.join(" ");
  const exampleText = b.join(" ");

  if (inputText === exampleText) return 1;
  if (inputText.includes(exampleText) || exampleText.includes(inputText)) {
    return 0.9;
  }

  const setA = new Set(a);
  const setB = new Set(b);
  let overlap = 0;

  for (const word of setA) {
    if (setB.has(word)) overlap++;
  }

  const precision = overlap / setA.size;
  const recall = overlap / setB.size;
  const f1 = precision + recall === 0
    ? 0
    : (2 * precision * recall) / (precision + recall);

  return f1;
}

function getExtraData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
      return Array.isArray(data) ? data : [];
    }
  } catch (error) {
    console.error("Extra data error:", error.message);
  }
  return [];
}

function trainModel() {
  const extra = getExtraData();
  const model = {
    name: "SILA Brain",
    version: "2.0.0",
    type: "intent-matching-model",
    trainedAt: new Date().toISOString(),
    intents: [...knowledge, ...extra]
  };

  fs.writeFileSync(MODEL_FILE, JSON.stringify(model, null, 2), "utf8");
  return model;
}

function loadModel() {
  try {
    if (!fs.existsSync(MODEL_FILE)) return trainModel();

    const model = JSON.parse(fs.readFileSync(MODEL_FILE, "utf8"));
    if (!model || !Array.isArray(model.intents)) return trainModel();

    return model;
  } catch (error) {
    console.error("Model load error:", error.message);
    return trainModel();
  }
}

function generate(model, prompt) {
  const message = normalize(prompt);
  if (!message) return "Tafadhali andika ujumbe wako.";

  const intents = model?.intents || knowledge;
  let bestIntent = null;
  let bestScore = 0;

  for (const intent of intents) {
    for (const example of intent.examples || []) {
      const score = similarity(message, example);
      if (score > bestScore) {
        bestScore = score;
        bestIntent = intent;
      }
    }
  }

  // Ulinganisho wa moja kwa moja wa baadhi ya maswali ya kawaida.
  if (/^(hi|hello|hey|habari|mambo|niaje|salama)$/.test(message)) {
    bestIntent = intents.find(item => item.intent === "greeting") || bestIntent;
    bestScore = 1;
  }

  if (
    message.includes("wewe ni nani") ||
    message.includes("jina lako nani") ||
    message.includes("who are you")
  ) {
    bestIntent = intents.find(item => item.intent === "identity") || bestIntent;
    bestScore = 1;
  }

  if (
    message.includes("nani amekutengeneza") ||
    message.includes("muundaji wako") ||
    message.includes("who created you")
  ) {
    bestIntent = intents.find(item => item.intent === "creator") || bestIntent;
    bestScore = 1;
  }

  if (!bestIntent || bestScore < 0.38) {
    bestIntent = intents.find(item => item.intent === "unknown") || knowledge[knowledge.length - 1];
  }

  const responses = bestIntent.responses || [];
  if (!responses.length) {
    return "Sijaweza kupata jibu kwa sasa. Jaribu tena kwa maneno mengine.";
  }

  return responses[Math.floor(Math.random() * responses.length)];
}

function addTrainingExample(intentName, example, response) {
  const cleanIntent = normalize(intentName).replace(/\s+/g, "_");
  const cleanExample = String(example || "").trim();
  const cleanResponse = String(response || "").trim();

  if (!cleanIntent || !cleanExample || !cleanResponse) {
    throw new Error("Intent, mfano wa swali na jibu vinahitajika.");
  }

  const extra = getExtraData();
  let intent = extra.find(item => item.intent === cleanIntent);

  if (!intent) {
    intent = {
      intent: cleanIntent,
      examples: [],
      responses: []
    };
    extra.push(intent);
  }

  if (!intent.examples.includes(cleanExample)) {
    intent.examples.push(cleanExample);
  }

  if (!intent.responses.includes(cleanResponse)) {
    intent.responses.push(cleanResponse);
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(extra, null, 2), "utf8");
  trainModel();

  return { intent: cleanIntent, examples: intent.examples.length };
}

module.exports = {
  trainModel,
  loadModel,
  generate,
  addTrainingExample
};
