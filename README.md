# AI Mock Interviewer

A React-based AI mock interview application developed as part of a Mission Ready full-stack development assignment.

The application allows users to practise job interviews by selecting a job title, answering AI-generated questions, and receiving feedback.

## About the Project

The AI Mock Interviewer provides an interactive interview simulation through a responsive chat interface.

### Features

- AI-generated interview questions based on a chosen job title
- Interactive chat interface
- Interview session management
- AI-generated interview feedback
- Loading indicators and error handling
- Responsive design for desktop and mobile

### Built With

**Frontend**
- React
- JavaScript (JSX)
- Vite
- CSS Modules
- React Markdown

**Backend**
- RESTful API
- AI integration

## Getting Started

### Prerequisites

- Node.js
- npm
- Running backend API

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the frontend directory:

   ```bash
   cd <frontend-directory>
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL provided by Vite.

**Note:** The frontend currently expects the backend to run at `http://localhost:3001`.

## Usage

1. Enter the job title you want to practise interviewing for.
2. Click **Start Mock Interview**.
3. Read the AI interviewer's question.
4. Type and submit your answer.
5. Continue until the interview is complete and feedback is provided.

You can stop an interview at any time using the **Stop Interview** button.

## API Integration

The frontend communicates with the backend through three endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/interview/start` | Start an interview |
| POST | `/api/interview/answer` | Submit an answer |
| DELETE | `/api/interview/:sessionId` | Stop an interview |

## Acknowledgements

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [React Markdown](https://github.com/remarkjs/react-markdown)
- [Best-README-Template](https://github.com/othneildrew/Best-README-Template)

## Disclaimer

This project was developed for educational purposes only and is not affiliated with or endorsed by Turners.
