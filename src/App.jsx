import { useState } from "react";
import Logo from "./components/svgs.jsx";
import "./App.css";


function App() {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbx5_9Dm6niqvpPvbWOoz1vEg-Mb2olke-x_KF8Vj-uYQe8DpYZ4oH5pHwuSM8Mxw1VZ/exec";

  const answers = [
    "Lost on the street",
    "TikTok",
    "Instagram",
    "Google Maps",
    "Friend's advice",
  ];

async function handleAnswer(answer) {
  if (sending) return;

  setSending(true);
  setSelectedAnswer(answer);

  // Start sending immediately in the background
  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({
      answer,
    }),
  }).catch((error) => {
    console.error("Error sending answer:", error);
  });

  // Only wait for our visual animation
  await new Promise((resolve) => setTimeout(resolve, 650));

  // Don't wait for Google
  setSubmitted(true);

  setTimeout(() => {
    setSubmitted(false);
    setSelectedAnswer(null);
    setSending(false);
  }, 2000);
}

  return (
    <main className="app">

      <section className="imageSide">
        <img
          src="/your-image.jpg"
          alt=""
        />
      </section>

      <section className="contentSide">

        <Logo className="mainLogo" />

        {!submitted ? (
          <div className="survey">

            <h1>
              Where did you find us?
            </h1>

            <div className="answers">
              {answers.map((answer) => (
                <button
  key={answer}
  className={selectedAnswer === answer ? "selected" : ""}
  onClick={() => handleAnswer(answer)}
>
  <span className="buttonText">{answer}</span>
  <span className="shine"></span>
</button>
              ))}
            </div>

          </div>
        ) : (
          <div className="survey">
            <h1>Thank you!</h1>
          </div>
        )}

      </section>

    </main>
  );
}

export default App;