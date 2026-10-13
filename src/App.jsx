
import { useState, useEffect } from "react";
import Logo from "./components/svgs.jsx";
import "./App.css";
import bgdeco from "./assets/bgdeco.png";

import ttIcon from "./components/tt.png";
import instaIcon from "./components/insta.png";
import streetIcon from "./components/street.png";
import friendsIcon from "./components/friends.png";
import mapsIcon from "./components/maps.png";

import charm1 from "./assets/pragCharm.png";
import charm2 from "./assets/bierCharm.png";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx5_9Dm6niqvpPvbWOoz1vEg-Mb2olke-x_KF8Vj-uYQe8DpYZ4oH5pHwuSM8Mxw1VZ/exec";

const FIRST_RELEASE = "2026-10-14";
const INITIAL_CODE_COUNT = 2;
const CODES_PER_RELEASE = 2;

const answers = [
  { label: "Lost on the street", icon: streetIcon },
  { label: "Instagram", icon: instaIcon },
  { label: "Google Maps", icon: mapsIcon },
  { label: "Friend's advice", icon: friendsIcon },
  { label: "TikTok", icon: ttIcon },
];

function getPragueDate() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Prague",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function getCodeCount() {
  const today = getPragueDate();

  const start = new Date(`${FIRST_RELEASE}T00:00:00Z`);
  const end = new Date(`${today}T00:00:00Z`);

  let releases = 0;

  for (
    let date = new Date(start);
    date <= end;
    date.setUTCDate(date.getUTCDate() + 1)
  ) {
    const day = date.getUTCDay();

    if (day === 3 || day === 5) {
      releases++;
    }
  }

  return INITIAL_CODE_COUNT + releases * CODES_PER_RELEASE;
}

function generateCodes(prefix, count) {
  return Array.from({ length: count }, (_, index) => {
    const number = count - index;

    return `${prefix}${String(number).padStart(3, "0")}`;
  });
}

function App() {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [showCodes, setShowCodes] = useState(false);

  const [shop, setShop] = useState(null);
  const [codeCount, setCodeCount] = useState(getCodeCount);

  useEffect(() => {
    const savedShop = localStorage.getItem("surveyShop");

    if (savedShop) {
      setShop(savedShop);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCodeCount(getCodeCount());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const ttCodes = generateCodes("TT", codeCount);
  const igCodes = generateCodes("IG", codeCount);

  function chooseShop(shopName) {
    localStorage.setItem("surveyShop", shopName);
    setShop(shopName);
  }

  function submitAnswer(answer, videoCode = "") {
    if (sending) return;

    setSending(true);
    setSelectedAnswer(videoCode || answer);

    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({
        answer,
        shop,
        videoCode,
      }),
    }).catch((error) => {
      console.error("Error sending answer:", error);
    });

    setTimeout(() => {
      setSubmitted(true);
      setShowCodes(false);
    }, 650);

    setTimeout(() => {
      setSubmitted(false);
      setSelectedAnswer(null);
      setSending(false);
      setShowCodes(false);
    }, 2650);
  }

  function handleAnswer(answer) {
    if (sending) return;

    if (answer === "Instagram" || answer === "TikTok") {
      setSelectedAnswer(answer);
      setCodeCount(getCodeCount());
      setShowCodes(true);
      return;
    }

    submitAnswer(answer);
  }

  function handleCodeSelection(code) {
    const platform = code.startsWith("TT")
      ? "TikTok"
      : "Instagram";

    submitAnswer(platform, code);
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

            <button onClick={() => chooseShop("Crystal")}>
              Crystal
            </button>
          </div>
        </div>
      </main>
    );
  }

  
  return (
    <main className={`app ${showCodes && !submitted ? "appCodeMode" : ""}`}>

      {showCodes && !submitted ? (

        /* FULL-SCREEN VIDEO CODE SELECTION */
        <div className="codeScreen">

          <header className="codeScreenHeader">
            <div>
              <p className="codeEyebrow">CHARM BAR PRAGUE</p>

              <h1>Which video brought you here?</h1>

              <p className="codeInstruction">
                TAP THE CODE OF THE VIDEO YOU SAW
              </p>
            </div>

            <button
              className="codeBackButton"
              disabled={sending}
              onClick={() => {
                setShowCodes(false);
                setSelectedAnswer(null);
              }}
            >
              ← Back
            </button>
          </header>

          <div className="codePanels">

            {/* TIKTOK */}
            <section className="codePanel">
              <div className="codePanelHeader">
                <img src={ttIcon} alt="" />
                <h2>TikTok</h2>
              </div>

              <div className="codePanelList">
                {ttCodes.map((code) => (
                  <button
                    key={code}
                    className={`codeOption ${
                      selectedAnswer === code ? "selected" : ""
                    }`}
                    disabled={sending}
                    onClick={() => handleCodeSelection(code)}
                  >
                    <span>{code}</span>
                    <span className="shine"></span>
                  </button>
                ))}
              </div>
            </section>

            {/* INSTAGRAM */}
            <section className="codePanel">
              <div className="codePanelHeader">
                <img src={instaIcon} alt="" />
                <h2>Instagram</h2>
              </div>

              <div className="codePanelList">
                {igCodes.map((code) => (
                  <button
                    key={code}
                    className={`codeOption ${
                      selectedAnswer === code ? "selected" : ""
                    }`}
                    disabled={sending}
                    onClick={() => handleCodeSelection(code)}
                  >
                    <span>{code}</span>
                    <span className="shine"></span>
                  </button>
                ))}
              </div>
            </section>

          </div>
        </div>

      ) : (

        /* ORIGINAL SURVEY LAYOUT */
        <>
          <section className="imageSide">
            <img src={bgdeco} alt="" />
          </section>

          <section className="contentSide">

            <img
              src={charm1}
              className="decoCharm decoCharmOne"
              alt=""
            />

            <img
              src={charm2}
              className="decoCharm decoCharmTwo"
              alt=""
            />

            <Logo className="mainLogo" />

            {submitted ? (

              <div className="survey">
                <h1>Thank you!</h1>
              </div>

            ) : (

              <div className="survey">
                <h1>Where did you find us?</h1>

                <p className="surveySubtitle">
                  Tap one option below
                </p>

                <div className="answers">
                  {answers.map((answer) => (
                    <button
                      key={answer.label}
                      className={
                        selectedAnswer === answer.label
                          ? "selected"
                          : ""
                      }
                      disabled={sending}
                      onClick={() => handleAnswer(answer.label)}
                    >
                      <img
                        src={answer.icon}
                        alt=""
                        className="answerIcon"
                      />

                      <span className="buttonText">
                        {answer.label}
                      </span>

                      <span className="shine"></span>
                    </button>
                  ))}
                </div>
              </div>

            )}

          </section>
        </>

      )}

    </main>
  );
}

export default App;