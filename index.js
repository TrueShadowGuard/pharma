const fs = require("fs")

const text = fs.readFileSync("test.txt").toString();

const wrongIndexes = fs.readFileSync("wrong.txt").toString().split(" ").map(Number);

const answers = text.split(/\n{2,}/gi);
const questions = answers.map(aw => aw.replace(/{.*?}/g, "").replace(/[+-]/gi, "? "));
let questionsAnswers = answers.map((answer, id) => ({answer, question: questions[id], id}));
questionsAnswers = questionsAnswers.slice(0, 122); // from {index}
//questionsAnswers = questionsAnswers.filter(qa => wrongIndexes.includes(qa.id)); //wrong

questionsAnswers.forEach((qa, index) => qa.index = index);

let currentQuestion = questionsAnswers[0];
setText(currentQuestion.question)

// console.log(currentQuestion);
// process.exit();

fs.writeFileSync("test.json", JSON.stringify(questions.map((q, i) => i + "=" + q), null, 2));


function setText(text) {
  console.clear();
  console.log(text);
}

process.stdin.on("data", data => {
  data = data.toString().toLowerCase().replace(/\s/, "");

  let prefix;

  const getPrefix = qa => "id: " + currentQuestion.id + " all: " + questionsAnswers.length + "\n";

  switch (data) {
    // random
    case "r":
      currentQuestion = getRandom(questionsAnswers);
      setText(getPrefix() + currentQuestion.question)
      break;
    //answer
    case "a":
      setText(getPrefix() + currentQuestion.answer);
      break;
    // next
    case "n":
      currentQuestion = questionsAnswers.find(q => q.index === currentQuestion.index + 1);
      setText(getPrefix() + currentQuestion.question)
      break;
    // previous
    case "p":
      currentQuestion = questionsAnswers.find(q => q.index === currentQuestion.index - 1);
      setText(getPrefix() + currentQuestion.question)
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

