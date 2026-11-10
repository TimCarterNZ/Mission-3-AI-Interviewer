
import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";

import {
  startInterview,
  respondToInterview
} from "./aiInterviewer.mjs";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const sessions = new Map();

// Start a new interview
app.post("/api/interview/start", (req, res) => {
  try {
    const { jobTitle } = req.body || {};

    const result = startInterview(jobTitle);
    const sessionId = randomUUID();

    sessions.set(sessionId, {
      jobTitle,
      history: [],
      currentQuestion: result.question,
      completed: false,
      busy: false
    });

    res.json({ sessionId, ...result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Submit an answer
app.post("/api/interview/answer", async (req, res) => {
  const { sessionId, answer } = req.body || {};
  const session = sessions.get(sessionId);

  if (!session) {
    return res.status(404).json({
      error: "Interview not found"
    });
  }

  if (session.completed || session.busy) {
    return res.status(409).json({
      error: "Interview is completed or processing"
    });
  }

  if (typeof answer !== "string" || !answer.trim()) {
    return res.status(400).json({
      error: "Answer is required"
    });
  }

  session.busy = true;

  try {
    const history = [
      ...session.history,
      {
        question: session.currentQuestion,
        answer: answer.trim()
      }
    ];

    const result = await respondToInterview({
      jobTitle: session.jobTitle,
      history
    });

    session.history = history;
    session.currentQuestion = result.question;
    session.completed = result.completed;

    if (result.completed) {
      sessions.delete(sessionId);
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(502).json({
      error: "Failed to generate AI response"
    });
  } finally {
    session.busy = false;
  }
});

//Deletes session
app.delete("/api/interview/delete", async (req, res) => {
    const { sessionId } = req.params;

    const session = sessions.get(sessionId);

    if (!session) {
      return res.status(404).json({
        error: "Interview not found"
      })
    }

    if (session.busy) {
      return res.status(409).json({
        error: "Interview is processing"
      })
    }

    session.delete(sessionId);

    res.json({
      message: "Interview stopped successfully"
    })
})

app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001");
});
