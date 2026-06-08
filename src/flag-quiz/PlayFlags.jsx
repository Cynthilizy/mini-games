import { useState, useEffect } from "react";
import "./PlayFlags.css";
import { typography } from "../typography";
import Clock from "../assets/clock.svg?react";
import { code } from "country-emoji";
import confetti from "canvas-confetti";
import LoginForm from "../LoginForm";

function PlayFlags({
  flags,
  theme,
  showFlag,
  setShowFlag,
  API_URL,
  username,
  setUsername,
  gameType,
  setGameType,
  bestGame,
  bestGameTime,
  lastGame,
  lastGameTime,
  sendScore,
}) {
  const [showStats, setShowStats] = useState(false);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [random, setRandom] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [showFail, setShowFail] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerRunning, setTimerRunning] = useState(true);
  const [flash, setFlash] = useState(false);

  const gameName = "flags";

  const shuffle = () => {
    const randomNum = Math.random();
    const randomIndex = Math.floor(randomNum * flags.length);
    const selected = flags[randomIndex];
    return {
      ...selected,
      flag: code(selected.flag).toLowerCase(),
    };
  };

  const handleAnswerChange = (event) => {
    setAnswer(event.target.value);
  };

  const checkSubmit = () => {
    const randomCountry = random.name.trim().toLowerCase();
    const userAnswer = answer.trim().toLowerCase();

    if (randomCountry === userAnswer) {
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
    <div className="flag-container">
      <div
        className="flag-container-inner"
        style={{ color: theme.textPrimary }}
      >
        {showFlag && (
          <div className="flag-top">
            <div className="flag-timer">
              <h3
                className={`play-flag-timer ${
                  timeLeft <= 10 ? "timer-danger" : ""
                }`}
              >
                <Clock /> {timeLeft}s
              </h3>
            </div>
            {!showCorrect && !showFail && (
              <h3 className="play-flag-question-top">Guess the country </h3>
            )}
            {showCorrect && (
              <h3 className="play-flag-question-top">
                <img src="/check.gif" alt="Correct" className="flag-pass-img" />{" "}
                Correct
                <img src="/check.gif" alt="Correct" className="flag-pass-img" />
              </h3>
            )}
            {showFail && (
              <h3 className="play-flag-question-top">
                <img src="/fail.gif" className="flag-fail-img" />{" "}
                <span
                  style={{
                    color: "red",
                    fontWeight: typography.weight.bold,
                  }}
                >
                  Wrong,{" "}
                </span>
                Correct Country is {random.name}{" "}
                <img src="/fail.gif" className="flag-pass-img" />
              </h3>
            )}
          </div>
        )}

        {showFlag ? (
          <div className="play-flag-wrapper">
            <div className={`${flash ? "play-flag flash-flag" : "play-flag"}`}>
              <div
                className="play-flag-score-container"
                style={{
                  background: theme.elevated,
                  border: `2px solid ${theme.border}`,
                }}
              >
                <h3 className="play-flag-score-title">Score</h3>
                <p className="play-flag-score">{score}</p>
              </div>
              <div className="play-flag-question-container">
                <div className="flag-img">
                  <img
                    src={`https://flagcdn.com/w320/${random.flag}.png`}
                    alt={`Flag of ${random.name}`}
                  />
                </div>

                <div className="play-flag-choices">
                  <button
                    className="play-flag-reset-btn"
                    style={{
                      background: theme.elevated,
                      border: `2px solid ${theme.border}`,
                    }}
                    onClick={() => {
                      sendScore(score);
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
                  <input
                    className="play-flag-answer"
                    type="text"
                    value={answer}
                    onChange={handleAnswerChange}
                    placeholder="Type here..."
                    style={{
                      background: theme.elevated,
                      border: `2px solid ${theme.border}`,
                    }}
                  />
                  <button
                    className="play-flag-submit-btn"
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
                className="play-flag-user-board"
                style={{
                  background: theme.elevated,
                  border: `2px solid ${theme.border}`,
                }}
              >
                {username !== "" && (
                  <div>
                    <div>
                      <p style={{ fontSize: typography.size.xs }}>
                        Welcome Back
                      </p>
                      <p className="play-flag-username">{username}</p>
                    </div>
                    <button
                      className="play-flag-user-stats"
                      style={{
                        background: theme.elevated,
                        border: `2px solid ${theme.border}`,
                      }}
                      onClick={() => {
                        setGameType(gameName);
                        setShowFlag(false);
                        setShowStats(true);
                      }}
                    >
                      See Stats
                    </button>
                  </div>
                )}{" "}
                {username === "" && (
                  <div>
                    <div>
                      <p style={{ fontSize: typography.size.xs }}>
                        To see stats and
                        <br />
                        save progress
                      </p>
                    </div>
                    <button
                      className="play-flag-user-login"
                      style={{
                        background: theme.elevated,
                        border: `2px solid ${theme.border}`,
                      }}
                      onClick={() => {
                        setGameType(gameName);
                        setShowFlag(false);
                        setShowStats(true);
                      }}
                    >
                      Login
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="screen-error-flag">
              <h3 className="screen-error-flag-title">
                This Game Requires More Space
              </h3>
              <img src="/fail.gif" className="screen-error-flag-icon" />
              <h3 className="screen-error-flag-text">Screen Size Too Small</h3>
            </div>
          </div>
        ) : showStats ? (
          <div className="flag-stats-container">
            <LoginForm
              API_URL={API_URL}
              username={username}
              setUsername={setUsername}
              gametype={gameType}
              bestGame={bestGame}
              bestGameTime={bestGameTime}
              lastGame={lastGame}
              lastGameTime={lastGameTime}
              setShowGame={setShowFlag}
              setShowStats={setShowStats}
              theme={theme}
            />
          </div>
        ) : (
          <div
            className="start-flag"
            style={{
              backgroundImage: "url(/grass-land.gif)",
            }}
          >
            <button
              className="start-flag-btn"
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
                setShowFlag(true);
                setScore(0);
                setTimeLeft(60);
                setTimerRunning(true);
                setGameType(gameName);
              }}
            >
              Play
            </button>
            <button
              className="start-flag-btn"
              onClick={() => {
                setShowFlag(false);
                setShowStats(true);
                setGameType(gameName);
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
export default PlayFlags;
