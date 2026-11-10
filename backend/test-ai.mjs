
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import {
  startInterview,
  respondToInterview
} from "./aiInterviewer.mjs";

const rl = readline.createInterface({ input, output });

try {
  const jobTitle = await rl.question("Enter job title: ");

  const start = startInterview(jobTitle);
  const history = [];

  let question = start.question;

  while (question) {
    console.log("\nInterviewer:", question);

    const answer = await rl.question("You: ");

    if (!answer.trim()) {
      console.log("Please enter an answer.");
      continue;
    }

    history.push({ question, answer });

    const result = await respondToInterview({
      jobTitle,
      history
    });

    if (result.completed) {
      console.log("\nFINAL FEEDBACK:");
      console.log(result.feedback);
      break;
    }

    question = result.question;
  }
} catch (error) {
  console.error("Error:", error.message);
} finally {
  rl.close();
}
