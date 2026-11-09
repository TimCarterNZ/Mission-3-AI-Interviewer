**AI Mock Interviewer – Frontend Ready**

I've pushed the initial React frontend to `main`.

**Implemented:**
- Job title input and Start/Stop Interview functionality
- Job title locked while an interview is active
- Chat interface and response submission
- Connection status with animated loading spinner
- Conversation message state

**Backend integration requirements:**

The frontend will need to:
1. Send the selected `jobTitle` when starting an interview.
2. Receive the AI's opening question.
3. Send subsequent user responses to the AI.
4. Receive and display AI replies.
5. Support multiple consecutive user messages.

Messages currently use this structure:

```js
{
    role: "user",
    content: "Example response"
}
```

AI replies should use `role: "assistant"`.

**Still to agree on:**
- API endpoint names and HTTP methods
- Request and response JSON structure
- How conversation history or interview sessions will be managed
- Error handling and connection status

Repo: https://github.com/TimCarterNZ/Mission-3-AI-Interviewer
