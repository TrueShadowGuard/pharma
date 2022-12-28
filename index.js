const fs = require("fs")

const text = fs.readFileSync("test.txt").toString();

//const wrongIndexes = fs.readFileSync("wrong.txt").toString().split(" ").map(Number);

const answers = text.replace(/(\n\*\*.{10,}\*\*)/gi, "===12345===$1").split("===12345===");
let questionsAnswers = answers.map(answer => answer
  .replace(/\n{2,}/gi, "\n")
  .replace(/\*\*/gi, "")
).map(answer => {
  let rows = answer.split("\n");
  let variants = rows.filter((row) => row.match(/([-+])\s*/gi));
  let notVariants = rows.filter((row) => !row.match(/([-+])\s*/gi));
  shuffleArray(variants);
  return notVariants.concat(variants).join("\n");
}).map((answer, index) => ({
  answer,
  id: index,
  question: answer.replace(/([-+])\s*/gi, "? ")
}));

// questionsAnswers = questionsAnswers.slice(0, 1);

questionsAnswers = questionsAnswers.map((questionsAnswer, index) => ({...questionsAnswer, index}));

// console.log(questionsAnswers)
// process.exit();

let currentQuestion = questionsAnswers[0];
showQuestion(currentQuestion);

process.stdin.on("data", data => {
  data = data.toString().toLowerCase().replace(/\s/, "");

  switch (data) {
    // random
    case "r":
      currentQuestion = getRandom(questionsAnswers);
      showQuestion(currentQuestion);
      break;
    //answer
    case "a":
      showAnswer(currentQuestion);
      break;
    // next
    case "n":
      currentQuestion = questionsAnswers.find(q => q.index === currentQuestion.index + 1);
      showQuestion(currentQuestion);
      break;
    // previous
    case "p":
      currentQuestion = questionsAnswers.find(q => q.index === currentQuestion.index - 1);
      showQuestion(currentQuestion);
      break;
    case "q":
      showQuestion(currentQuestion);
      break;
    case "w":
      fs.appendFileSync("wrong.txt", currentQuestion.id + " ")
  }

  if (data.startsWith("i")) {
    console.clear();
    const index = +data.replace(/\D/gi, "")
    global.qa = questionsAnswers[index];
    console.log(global.qa.question)
  }

  if(data.startsWith("r") && data.endsWith("a")) {
    [from, to] = data.split("-").map(x => +x.replace(/\D/gi, ""));
    currentQuestion = getRandom(questionsAnswers.slice(from, to));
    setText(currentQuestion.question)
  }
});

function getRandom(arr) {
  const index = Math.floor(Math.random() * arr.length);
  return arr.splice(index, 1)[0];
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function setText(text) {
  console.clear();
  console.log(text);
}

function getPrefix(questionAnswer) {
  return "id: " + questionAnswer.id + " all: " + questionsAnswers.length + "\n";
}

function showQuestion(questionAnswer) {
  console.clear();
  console.log(getPrefix(questionAnswer) + questionAnswer.question);
}

function showAnswer(questionAnswer) {
  console.clear();
  console.log(getPrefix(questionAnswer) + questionAnswer.answer);
}