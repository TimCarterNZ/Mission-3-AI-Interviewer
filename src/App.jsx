import styles from "./App.module.css";
import { useState } from "react";

function App() {
    // Interview Functionality
    const [jobTitle, setJobTitle] = useState("");
    const [interviewStarted, setInterviewStarted] = useState(false);
    const [userMessage, setUserMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [sessionId, setSessionId] = useState(null);

    // ----------------------------------------------------------//

    async function handleInterviewToggle() {
        if (loading) return;

        if (interviewStarted) {

            try{
                setLoading(true);
                setError("");

                const response = await fetch(`http://localhost:3001/api/interview/${sessionId}`, {
                    method: "DELETE",
                });

                if (!response.ok && response.status !== 404) {
                    throw new Error("Failed to stop interview");
                }

                setInterviewStarted(false);
                setSessionId(null);
                setMessages([]);
                setUserMessage("");

            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }

            return;
        }

        if (!jobTitle.trim()) {
            setError("Please enter a job title.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await fetch(`http://localhost:3001/api/interview/start`, {
                method: "POST",
                headers: { ContentType: "application/json" },
                body: JSON.stringify({
                    jobTitle: jobTitle.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to start interview");
            }

            setSessionId(data.sessionId);
            setInterviewStarted(true);
            setUserMessage("");

            setMessages([
                {
                    role: "ai",
                    content: data.question,
                },
            ]);

        } catch (error){
            setError(error);
        }
        finally {
            setLoading(false);
        }
    }

    // ----------------------------------------------------------//

    async function handleSubmit(e) {
        e.preventDefault();

        if (!userMessage.trim() || !interviewStarted || loading || !sessionId) {
            return;
        }

        const answer = userMessage.trim();

        setMessages((previousMessage) => [...previousMessage,
            {
                role: "ai",
                content: answer,
            },
        ]);

        setUserMessage("");

        try {
            setLoading(true);
            setError("");

            const response = await fetch(`http://localhost:3001/api/interview/answer`, {
                    method: "POST",
                    headers: { ContentType: "application/json", },
                    body: JSON.stringify({
                        sessionId,
                        answer,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to submit answer.");
            }

            if (data.completed){

                setMessages((previousMessages) => [
                    ...previousMessages,
                    {
                        role: "ai",
                        content: data.feedback,
                    },
                ]);

                setInterviewStarted(false);
                setSessionId(null);
            } else {

                setMessages((previousMessages) => [
                    ...previousMessages,
                    {
                        role: "ai",
                        content: data.question,
                    },
                ]);
            }
        } catch (error) {

            setUserMessage(answer);

            setMessages((previousMessages) =>
                previousMessages.slice(0,-1)
            );

            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    // ----------------------------------------------------------//

    return (
        <div>
            <header className={styles["site-header"]}>
                {/* -------------------------------------------------------------------------- */}

                <nav
                    className={styles["header-top-menu"]}
                    aria-label="Site categories"
                >
                    <a href="https://www.turners.co.nz/Cars/">Cars</a>
                    <a href="https://www.turners.co.nz/Trucks-Machinery/">
                        Trucks &amp; Machinery
                    </a>
                    <a href="https://www.turners.co.nz/Damaged-Vehicles/">
                        Damaged &amp; End of Life
                    </a>
                    <a href="https://www.turners.co.nz/Motorcycles/">
                        Motorcycles
                    </a>
                    <a href="https://www.turners.co.nz/General-Goods/">
                        General Goods
                    </a>
                    <a href="https://www.turners.co.nz/Buses-Caravans/">
                        Buses, Caravans &amp; Motorhomes
                    </a>
                    <a href="https://www.turners.co.nz/Boats-Marine/">
                        Boats &amp; Marine
                    </a>
                </nav>

                {/* -------------------------------------------------------------------------- */}
                <div className={styles["header-container"]}>
                    <a
                        href="https://www.turners.co.nz/Cars/"
                        className={styles["logo"]}
                    >
                        <img
                            src="https://content.tgstatic.co.nz/webassets/contentassets/3e15c8546917474ca0a150b18e9fd64e/turnerscars_logo_1line_horz_true-rgb-desktop.png"
                            alt="Turners Cars"
                        />
                    </a>

                    {/* -------------------------------------------------------------------------- */}

                    <nav
                        className={styles["header-actions"]}
                        aria-label="Account and contact"
                    >
                        <a
                            href="https://www.turners.co.nz/"
                            className={styles["login-link"]}
                        >
                            <span
                                className={styles["header-icon"]}
                                aria-hidden="true"
                            >
                                ♟
                            </span>
                            <strong>LOGIN</strong> OR <strong>REGISTER</strong>
                        </a>

                        <a
                            href="tel:0800887637"
                            className={styles["phone-link"]}
                        >
                            <span
                                className={styles["header-icon"]}
                                aria-hidden="true"
                            >
                                ☎
                            </span>
                            0800 887 637
                        </a>

                        <a
                            href="https://www.turners.co.nz/"
                            className={styles["find-us-link"]}
                        >
                            <span
                                className={styles["header-icon"]}
                                aria-hidden="true"
                            >
                                ●
                            </span>
                            Find Us
                        </a>

                        <a
                            href="https://www.turners.co.nz/"
                            className={styles["language-link"]}
                        >
                            中文
                        </a>
                    </nav>
                </div>
            </header>

            {/* -------------------------------------------------------------------------- */}

            <nav
                className={styles["main-nav"]}
                aria-label="Main site navigation"
            >
                <div className={styles["main-nav-container"]}>
                    <div className={styles["main-nav-left"]}>
                        <a href="https://www.turners.co.nz/Cars/">
                            <span aria-hidden="true">🔍︎</span> Find a Car
                        </a>

                        <a href="https://www.turners.co.nz/Cars/">
                            How to Buy
                            <span
                                className={styles["nav-arrow"]}
                                aria-hidden="true"
                            ></span>
                        </a>

                        <a href="https://www.turners.co.nz/Cars/">
                            Sell your Car
                            <span
                                className={styles["nav-arrow"]}
                                aria-hidden="true"
                            ></span>
                        </a>

                        <a href="https://www.turners.co.nz/Cars/finance-insurance/car-insurance/">
                            Finance &amp; Insurance
                            <span
                                className={styles["nav-arrow"]}
                                aria-hidden="true"
                            ></span>
                        </a>

                        <a href="https://www.turners.co.nz/Cars/">
                            Mobile Servicing
                            <span
                                className={styles["nav-arrow"]}
                                aria-hidden="true"
                            ></span>
                        </a>
                    </div>

                    <div className={styles["main-nav-right"]}>
                        <a href="https://www.turners.co.nz/Cars/">
                            Auctions
                            <span
                                className={styles["nav-arrow"]}
                                aria-hidden="true"
                            ></span>
                        </a>

                        <a href="https://www.turners.co.nz/Cars/">
                            More Info
                            <span
                                className={styles["nav-arrow"]}
                                aria-hidden="true"
                            ></span>
                        </a>
                    </div>
                </div>
            </nav>
            {/* -------------------------------------------------------------------------- */}

            <main className={styles["main-container"]}>
                <div className={styles["breadcrumb"]}>
                    Staff Training / Mock Interview
                </div>

                <section className={styles["intro"]}>
                    <p className={styles["section-label"]}>
                        TURNERS STAFF TRAINING
                    </p>

                    <h1>AI Mock Interviewer</h1>

                    <p>
                        Practise your interview skills here with an AI
                        interviewer! Enter a job title and respond to the
                        interviewer's questions to simulate an interview for the
                        role you wish to pursue.
                    </p>
                </section>

                {/* Mock Interview */}

                <section className={styles["card"]}>
                    <div className={styles["section-heading"]}>
                        <span className={styles["step-number"]}>1</span>
                        <h2>Interview Practice</h2>
                    </div>

                    {/* Job Title */}

                    <div className={styles["job-title-container"]}>
                        <label htmlFor="job-title">Job Title:</label>
                        {/* The "Interview Start Button" */}
                        <input
                            type="text"
                            id="job-title"
                            className={styles["job-title-input"]}
                            placeholder="Enter the job role you are practicing for here."
                            value={jobTitle}
                            disabled={interviewStarted}
                            onChange={(e) => setJobTitle(e.target.value)}
                        />
                        <button
                            type="button"
                            className={`${styles["primary-button"]} ${
                                interviewStarted ? styles["stop-button"] : ""
                            }`}
                            disabled={!jobTitle.trim() || loading}
                            onClick={handleInterviewToggle}
                        >
                            {interviewStarted
                                ? "Stop Interview"
                                : "Start Mock Interview"}
                        </button>
                    </div>

                    {/* Conversation Window */}

                    <div className={styles["chat-container"]}>
                        {error && (
                            <p role="alert" className={styles["error-message"]}>
                                {error}
                            </p>
                        )}

                        {messages.map((message, index) => (
                            <div key={index} className={styles["chat-message"]}>
                                <p>{message.content}</p>
                            </div>
                        ))}

                        {loading && (
                            <div className={styles["chat-message"]}>
                                <span className={styles["loading-spinner"]}></span>
                                <p>AI interviewer is thinking...</p>
                            </div>
                        )}
                    </div>

                    {/* User Input */}

                    <form
                        className={`${styles["chat-form"]} ${
                            !interviewStarted ? styles["chat-hidden"] : ""
                        }`}
                        onSubmit={handleSubmit}
                    >
                        <input
                            type="text"
                            id="chat-input"
                            className={styles["chat-input"]}
                            placeholder="Type your response here..."
                            value={userMessage}
                            disabled={loading}
                            onChange={(e) => setUserMessage(e.target.value)}
                        />

                        <button
                            type="submit"
                            className={styles["primary-button"]}
                            disabled={loading || !userMessage.trim()}
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    </form>
                </section>
            </main>

            {/* -------------------------------------------------------------------------- */}

            <footer className={styles["site-footer"]}>
                <p>
                    This is a prototype built for an assignment for
                    demonstration purposes only.
                </p>
                <p>Not affiliated with or endorsed by Turners.</p>
            </footer>
        </div>
    );
}

export default App;
