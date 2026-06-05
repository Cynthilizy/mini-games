import { useState, useEffect, useRef } from "react";
import "./PlayRPS.css";
import { typography } from "../typography";
import Clock from "../assets/clock.svg?react";
import confetti from "canvas-confetti";

function PlayRPS({ theme, showRps, setShowRps }) {
  const [showStats, setShowStats] = useState(false);
  const [userChoice, setUserChoice] = useState("");
  const [computerChoice, setComputerChoice] = useState("");
  const [userScore, setUserScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [username, SetUsername] = useState("");
  const [showCorrect, setShowCorrect] = useState(false);
  const [showFail, setShowFail] = useState(false);
  const [showTie, setShowTie] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [shake, setShake] = useState(false);

  const roundEnded = showCorrect || showFail || showTie;

  const hasResolvedRef = useRef(false);
  const userRef = useRef("");
  const compRef = useRef("");

  const options = ["R", "P", "S"];
  const rules = {
    R: { beats: "S" },
    P: { beats: "R" },
    S: { beats: "P" },
  };

  const shuffle = () => {
    const randomNum = Math.random();
    const randomIndex = Math.floor(randomNum * options.length);
    const newRandom = options[randomIndex];
    return newRandom;
  };

  const resetRound = () => {
    hasResolvedRef.current = false;

    const compChoice = shuffle();

    setComputerChoice(compChoice);
    compRef.current = compChoice;
    setUserChoice("");
    userRef.current = "";

    setShowCorrect(false);
    setShowFail(false);
    setShowTie(false);
    setShowStats(false);

    setTimeLeft(5);
    setTimerRunning(true);
  };

  const endRound = (result) => {
    if (hasResolvedRef.current) return;
    hasResolvedRef.current = true;

    setTimerRunning(false);

    if (result === "win") {
      setUserScore((p) => p + 1);
      requestAnimationFrame(() => {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
        });
      });
    }
    if (result === "lose") {
      setComputerScore((p) => p + 1);
      setShake(true);
      setTimeout(() => setShake(false), 300);
    }
    if (result === "tie") setShowTie(true);

    setShowCorrect(result === "win");
    setShowFail(result === "lose");
    setShowTie(result === "tie");

    setTimeout(() => {
      resetRound();
    }, 2000);
  };

  const checkSubmit = () => {
    const user = userRef.current;
    const comp = compRef.current;

    if (!user) return endRound("lose");

    if (user === comp) return endRound("tie");

    if (rules[user]?.beats === comp) {
      endRound("win");
    } else {
      endRound("lose");
    }
  };

  useEffect(() => {
    if (!timerRunning || isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerRunning(false);

          checkSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, isPaused]);

  return (
    <div className="rps-container">
      <div
        className={`${shake ? "rps-container-inner shake-rps" : "rps-container-inner"}`}
        style={{ color: theme.textPrimary }}
      >
        {showRps && (
          <div className="rps-timer-wrapper">
            <h3 className="play-rps-timer">
              <Clock /> {timeLeft}
            </h3>
            {!showCorrect && !showFail && !showTie && (
              <h3 className="play-rps-question">
                Choose before Timer Runs Out
              </h3>
            )}
            {showCorrect && (
              <h3
                className="play-rps-question"
                style={{
                  color: "green",
                  fontWeight: typography.weight.bold,
                  background: theme.elevated,
                }}
              >
                YOU WIN
              </h3>
            )}
            {showFail && (
              <h3
                className="play-rps-question"
                style={{
                  color: "red",
                  fontWeight: typography.weight.bold,
                  background: theme.elevated,
                }}
              >
                YOU LOSE !!!
              </h3>
            )}
            {showTie && (
              <h3
                className="play-rps-question"
                style={{
                  color: theme.textPrimary,
                  fontWeight: typography.weight.bold,
                  background: theme.elevated,
                }}
              >
                IT'S A TIE
              </h3>
            )}
          </div>
        )}
        {showRps ? (
          <div className="play-rps-wrapper">
            <div className="play-rps">
              <div
                className="play-rps-user-container"
                style={{
                  background: theme.elevated,
                  border: `2px solid ${theme.border}`,
                }}
              >
                <h3 className="play-rps-user-name">
                  {!username ? "You" : username}
                </h3>
                <div className="play-rps-user-choices">
                  <button
                    className={`
                  rps-img-user
                  ${userChoice === "R" ? "selected" : ""}
                `}
                    onClick={() => {
                      setUserChoice("R");
                      userRef.current = "R";
                    }}
                  >
                    <img src="/rock.jpg" alt="rock" />
                  </button>

                  <button
                    className={`
                  rps-img-user
                  ${userChoice === "P" ? "selected" : ""}
                `}
                    onClick={() => {
                      setUserChoice("P");
                      userRef.current = "P";
                    }}
                  >
                    <img src="/paper.jpg" alt="paper" />
                  </button>

                  <button
                    className={`
                  rps-img-user
                  ${userChoice === "S" ? "selected" : ""}
                `}
                    onClick={() => {
                      setUserChoice("S");
                      userRef.current = "S";
                    }}
                  >
                    <img src="/scissors.jpg" alt="scissors" />
                  </button>
                </div>
                <p className="rps-choice-title">
                  {!userChoice
                    ? "Select a choice"
                    : userChoice === "R"
                      ? "Rock"
                      : userChoice === "P"
                        ? "Paper"
                        : "Scissors"}
                </p>
              </div>
              <div className="play-rps-score-container">
                <h3 className="play-rps-score">Score</h3>
                <div className="play-rps-score-result">
                  <h3>{userScore}</h3>
                  <h3>:</h3>
                  <h3>{computerScore}</h3>
                </div>
              </div>
              <div
                className="play-rps-computer-container"
                style={{
                  background: theme.elevated,
                  border: `2px solid ${theme.border}`,
                }}
              >
                <h3 className="play-rps-computer-name">Computer</h3>
                <div className="play-rps-computer-choices">
                  <button
                    className={`
                  rps-img-computer
                  ${roundEnded && computerChoice === "R" ? "selected" : ""}
                `}
                  >
                    <img src="/rock.jpg" alt="rock" />
                  </button>

                  <button
                    className={`
                  rps-img-computer
                  ${roundEnded && computerChoice === "P" ? "selected" : ""}
                `}
                  >
                    <img src="/paper.jpg" alt="paper" />
                  </button>

                  <button
                    className={`
                  rps-img-computer
                  ${roundEnded && computerChoice === "S" ? "selected" : ""}
                `}
                  >
                    <img src="/scissors.jpg" alt="scissors" />
                  </button>
                </div>
                <p className="rps-choice-title">
                  {timeLeft > 0
                    ? "Computer Thinking..."
                    : !computerChoice
                      ? "Select a choice"
                      : computerChoice === "R"
                        ? "Rock"
                        : computerChoice === "P"
                          ? "Paper"
                          : "Scissors"}
                </p>
              </div>
            </div>
            <div className="play-rps-choices">
              <button
                className="play-rps-pause-btn"
                style={{
                  background: theme.elevated,
                  border: `2px solid ${theme.border}`,
                }}
                onClick={() => setIsPaused((prev) => !prev)}
              >
                {isPaused ? "Resume" : "Pause"}
              </button>
              <button
                className="play-rps-reset-btn"
                style={{
                  background: theme.elevated,
                  border: `2px solid ${theme.border}`,
                }}
                onClick={() => {
                  setUserScore(0);
                  setComputerScore(0);
                  resetRound();
                  setIsPaused(false);
                }}
              >
                Restart
              </button>
              {username ? (
                <div>
                  <button
                    className="play-rps-user-stats"
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
                  <button
                    className="play-rps-user-login"
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
        ) : showStats ? (
          <div>Stats Coming Soon</div>
        ) : (
          <div
            className="start-rps"
            style={{
              backgroundImage: "url(/grass-land.gif)",
            }}
          >
            <button
              className="start-rps-btn"
              onClick={() => {
                setShowRps(true);
                resetRound();
              }}
            >
              Play
            </button>
            <button
              className="start-rps-btn"
              onClick={() => {
                setShowRps(false);
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
export default PlayRPS;
