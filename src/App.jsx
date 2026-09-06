import { useState, useEffect } from "react";
import Logo from "./components/svgs.jsx";
import "./App.css";
import bgdeco from "./assets/bgdeco.png";

import ttIcon from "./components/tt.svg";
import instaIcon from "./components/insta.svg";
import streetIcon from "./components/street.svg";
import friendsIcon from "./components/friends.svg";
import mapsIcon from "./components/maps.svg";

import charm1 from "./assets/pragCharm.png";
import charm2 from "./assets/bierCharm.png";

function App() {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const [shop, setShop] = useState(null);

  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbx5_9Dm6niqvpPvbWOoz1vEg-Mb2olke-x_KF8Vj-uYQe8DpYZ4oH5pHwuSM8Mxw1VZ/exec";

  const answers = [
    {
      label: "Lost on the street",
      icon: streetIcon,
    },
    {
      label: "Instagram",
      icon: instaIcon,
    },
    {
      label: "Google Maps",
      icon: mapsIcon,
    },
    {
      label: "Friend's advice",
      icon: friendsIcon,
    },
    {
      label: "TikTok",
      icon: ttIcon,
    },
  ];

  useEffect(() => {
    const savedShop = localStorage.getItem("surveyShop");

    if (savedShop) {
      setShop(savedShop);
    }
  }, []);

  function chooseShop(shopName) {
    localStorage.setItem("surveyShop", shopName);
    setShop(shopName);
  }
  async function handleAnswer(answer) {
    if (sending) return;

    setSending(true);
    setSelectedAnswer(answer);

    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        answer,
        shop,
      }),
    }).catch((error) => {
      console.error("Error sending answer:", error);
    });

    await new Promise((resolve) => setTimeout(resolve, 650));

    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setSelectedAnswer(null);
      setSending(false);
    }, 2000);
  }

  if (!shop) {
    return (
      <main className="shopSetup">
        <div className="shopSetupCard">
          <Logo className="setupLogo" />

          <p className="setupLabel">STAFF SETUP</p>

          <h1>Hi employee! which shop are we in?</h1>

          <div className="shopButtons">
            <button onClick={() => chooseShop("Vaclavske namesti")}>
              Vaclavske namesti
            </button>

            <button onClick={() => chooseShop("Charm Bar Havelska")}>
              Charm Bar Havelska
            </button>

            <button onClick={() => chooseShop("Crystal")}>Crystal</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="app">
      <section className="imageSide">
        <img src={bgdeco} alt="" />
      </section>

      <section className="contentSide">
        <img src={charm1} className="decoCharm decoCharmOne" alt="" />

        <img src={charm2} className="decoCharm decoCharmTwo" alt="" />
        <Logo className="mainLogo" />
        {!submitted ? (
          <div className="survey">
            <h1>Where did you find us?</h1>

            <p className="surveySubtitle">Tap one option below</p>

            <div className="answers">
              {answers.map((answer) => (
                <button
                  key={answer.label}
                  className={selectedAnswer === answer.label ? "selected" : ""}
                  onClick={() => handleAnswer(answer.label)}
                >
                  <img src={answer.icon} alt="" className="answerIcon" />

                  <span className="buttonText">{answer.label}</span>

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
