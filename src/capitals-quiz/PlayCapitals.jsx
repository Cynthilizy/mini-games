import { useState, useEffect } from "react";
import "./PlayCapitals.css";
import { typography } from "../typography";
import Clock from "../assets/clock.svg?react";
import confetti from "canvas-confetti";

function PlayCapitals({ capitals, theme, showCapital, setShowCapital }) {
  const [showStats, setShowStats] = useState(false);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [username, SetUsername] = useState("");
  const [random, setRandom] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [showFail, setShowFail] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerRunning, setTimerRunning] = useState(true);
  const [flash, setFlash] = useState(false);

  const shuffle = () => {
    const randomNum = Math.random();
    const randomIndex = Math.floor(randomNum * capitals.length);
    const newRandom = capitals[randomIndex];
    return newRandom;
  };

  const handleAnswerChange = (event) => {
    setAnswer(event.target.value);
  };

  const checkSubmit = () => {
    const randomCapital = random.capital.trim().toLowerCase();
    const userAnswer = answer.trim().toLowerCase();

    if (randomCapital === userAnswer) {
      setTimerRunning(false);
      setScore((prev) => prev + 1);
      setShowCorrect(true);
      requestAnimationFrame(() => {
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 },
        });
      });
      setTimeout(() => {
        let result = shuffle();
        if (random === null) {
          setRandom(result);
        } else if (random?.id === result?.id) {
          do {
            result = shuffle();
            setRandom(result);
          } while (result?.id === random?.id);
        } else {
          setRandom(result);
        }
        setAnswer("");
        setShowCorrect(false);
        setTimeLeft(60);
        setTimerRunning(true);
      }, 2000);
    } else {
      setShowFail(true);
      setFlash(true);
      setTimeout(() => setFlash(false), 300);
      setTimerRunning(false);
    }
  };

  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);

          setShowFail(true);
          setTimerRunning(false);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, random]);

  return (
    <div className="capital-container">
      <div
        className={`${flash ? "capital-container-inner flash-capital" : "capital-container-inner"}`}
        style={{ color: theme.textPrimary }}
      >
        {showCapital && (
          <div className="capital-timer">
            <h3
              className={`play-capital-timer ${
                timeLeft <= 10 ? "timer-danger" : ""
              }`}
            >
              <Clock /> {timeLeft}s
            </h3>
          </div>
        )}
        {showCapital ? (
          <div>
            <div className="play-capital">
              <div
                className="play-capital-score-container"
                style={{
                  background: theme.elevated,
                  border: `2px solid ${theme.border}`,
                }}
              >
                <h3 className="play-capital-score-title">Score</h3>
                <p className="play-capital-score">{score}</p>
              </div>
              <div className="play-capital-question-container">
                {!showCorrect && !showFail && (
                  <div className="play-capital-question-wrapper">
                    <h3 className="play-capital-question">
                      What is the capital of {random?.country}
                    </h3>
                    <input
                      className="play-capital-answer"
                      type="text"
                      value={answer}
                      onChange={handleAnswerChange}
                      placeholder="Type here..."
                      style={{
                        background: theme.elevated,
                        border: `2px solid ${theme.border}`,
                      }}
                    />
                  </div>
                )}
                {showCorrect && (
                  <div>
                    <h3 className="play-capital-question">
                      <img
                        src="/check.gif"
                        alt="Correct"
                        className="capital-pass-img"
                      />{" "}
                      Correct{" "}
                      <img
                        src="/check.gif"
                        alt="Correct"
                        className="capital-pass-img"
                      />
                    </h3>
                    <input
                      className="play-capital-answer"
                      type="text"
                      value={answer}
                      onChange={handleAnswerChange}
                      placeholder="Type here..."
                      style={{
                        background: theme.elevated,
                        border: `2px solid ${theme.border}`,
                      }}
                    />
                  </div>
                )}
                {showFail && (
                  <div>
                    <h3 className="play-capital-question">
                      <img
                        src="/fail.gif"
                        alt="Wrong"
                        className="capital-fail-img"
                      />{" "}
                      Capital of <span>{random.country}</span> is{" "}
                      <span>
                        {random.capital}{" "}
                        <img
                          src="/fail.gif"
                          alt="Wrong"
                          className="capital-fail-img"
                        />
                      </span>
                    </h3>
                    <input
                      className="play-capital-answer"
                      type="text"
                      value={answer}
                      onChange={handleAnswerChange}
                      placeholder="Type here..."
                      style={{
                        background: theme.elevated,
                        border: `2px solid ${theme.border}`,
                      }}
                    />
                  </div>
                )}
                <div className="play-capital-choices">
                  <button
                    className="play-capital-reset-btn"
                    style={{
                      background: theme.elevated,
                      border: `2px solid ${theme.border}`,
                    }}
                    onClick={() => {
                      let result = shuffle();
                      if (random === null) {
                        setRandom(result);
                      } else if (random?.id === result?.id) {
                        do {
                          result = shuffle();
                          setRandom(result);
                        } while (result?.id === random?.id);
                      } else {
                        setRandom(result);
                      }
                      setAnswer("");
                      setShowFail(false);
                      setShowStats(false);
                      setScore(0);
                      setTimeLeft(60);
                      setTimerRunning(true);
                    }}
                  >
                    Restart
                  </button>
                  <button
                    className="play-capital-submit-btn"
                    style={{
                      background: theme.elevated,
                      border: `2px solid ${theme.border}`,
                    }}
                    disabled={showCorrect || showFail || !answer}
                    onClick={() => {
                      checkSubmit();
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
              <div
                className="play-capital-user-board"
                style={{
                  background: theme.elevated,
                  border: `2px solid ${theme.border}`,
                }}
              >
                {username ? (
                  <div>
                    <div>
                      <p style={{ fontSize: typography.size.xs }}>
                        Welcome Back
                      </p>
                      <p className="play-capital-username">{username}</p>
                    </div>
                    <button
                      className="play-capital-user-stats"
                      style={{
                        background: theme.elevated,
                        border: `2px solid ${theme.border}`,
                      }}
                    >
                      See Stats
                    </button>
                  </div>
                ) : (
                  <div>
                    <div>
                      <p style={{ fontSize: typography.size.xs }}>
                        To see stats and
                        <br />
                        save progress
                      </p>
                    </div>
                    <button
                      className="play-capital-user-login"
                      style={{
                        background: theme.elevated,
                        border: `2px solid ${theme.border}`,
                      }}
                    >
                      Login
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="screen-error-capital">
              <h3 className="screen-error-capital-title">
                This Game Requires More Space
              </h3>
              <img src="/fail.gif" className="screen-error-capital-icon" />
              <h3 className="screen-error-capital-text">
                Screen Size Too Small
              </h3>
            </div>
          </div>
        ) : showStats ? (
          <div>Stats Coming Soon</div>
        ) : (
          <div
            className="start-capital"
            style={{
              backgroundImage: "url(/grass-land.gif)",
            }}
          >
            <button
              className="start-capital-btn"
              onClick={() => {
                let result = shuffle();
                if (random === null) {
                  setRandom(result);
                } else if (random?.id === result?.id) {
                  do {
                    result = shuffle();
                    setRandom(result);
                  } while (result?.id === random?.id);
                } else {
                  setRandom(result);
                }
                setShowStats(false);
                setShowCapital(true);
                setScore(0);
                setTimeLeft(60);
                setTimerRunning(true);
              }}
            >
              Play
            </button>
            <button
              className="start-capital-btn"
              onClick={() => {
                setShowCapital(false);
                setShowStats(true);
              }}
            >
              Stats
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export default PlayCapitals;
