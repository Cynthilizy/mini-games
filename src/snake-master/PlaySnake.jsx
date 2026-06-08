import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import "./PlaySnake.css";
import LoginForm from "../LoginForm";

function PlaySnake({
  theme,
  showSnake,
  setShowSnake,
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
  const [snake, setSnake] = useState([[7, 7]]);
  const [direction, setDirection] = useState("RIGHT");
  const [apple, setApple] = useState([10, 8]);
  const [userScore, setUserScore] = useState(0);
  const [running, setRunning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [snakeFlash, setSnakeFlash] = useState(false);
  const [snakeShake, setSnakeShake] = useState(false);
  const [scorePop, setScorePop] = useState(false);
  const [speed, setSpeed] = useState(500);

  const gameName = "snake";

  const directionRef = useRef("RIGHT");
  const nextDirectionRef = useRef("RIGHT");
  const appleRef = useRef([10, 8]);
  const snakeRef = useRef([[7, 7]]);

  const GRID_SIZE = 20;

  const shiftUp = (shape, amount = 1) => shape.map(([x, y]) => [x, y - amount]);

  const shiftDown = (shape, amount = 1) =>
    shape.map(([x, y]) => [x, y + amount]);

  const shiftLeft = (shape, amount = 1) =>
    shape.map(([x, y]) => [x - amount, y]);

  const shiftRight = (shape, amount = 1) =>
    shape.map(([x, y]) => [x + amount, y]);

  const TShape = (x, y) => [
    [x - 2, y],
    [x - 1, y],
    [x, y],
    [x + 1, y],
    [x + 2, y],

    [x, y + 1],
    [x, y + 2],
    [x, y + 3],
  ];
  const TUpsideDown = (x, y) => [
    [x - 2, y],
    [x - 1, y],
    [x, y],
    [x + 1, y],
    [x + 2, y],

    [x, y - 1],
    [x, y - 2],
    [x, y - 3],
  ];

  const LShape = (x, y) => [
    [x, y],
    [x, y + 1],
    [x, y + 2],
    [x, y + 3],
    [x, y + 4],

    [x + 1, y + 4],
    [x + 2, y + 4],
  ];

  const LUpsideDown = (x, y) => [
    [x, y],
    [x, y - 1],
    [x, y - 2],
    [x, y - 3],
    [x, y - 4],

    [x - 1, y - 4],
    [x - 2, y - 4],
  ];

  const VerticalLeft = (x, y, len = 6) =>
    Array.from({ length: len }, (_, i) => [x - 2, y + i]);

  const HorizontalLine = (x, y, len = 5) =>
    Array.from({ length: len }, (_, i) => [x + i, y]);

  const createWalls = () => [
    ...shiftUp(TShape(6, 4), 2),
    ...TUpsideDown(14, 6),

    ...LShape(7, 14),
    ...LUpsideDown(14, 16),

    ...VerticalLeft(5, 8, 6),
    ...shiftUp(HorizontalLine(10, 10, 5), 1),
  ];

  const inBounds = ([x, y]) =>
    x > 0 && y > 0 && x < GRID_SIZE - 1 && y < GRID_SIZE - 1;

  const walls = useMemo(() => createWalls().filter(inBounds), []);

  const isWall = (x, y) => walls.some(([wx, wy]) => wx === x && wy === y);

  const resetGame = () => {
    setRunning(false); // STOP LOOP FIRST

    const INITIAL_SNAKE = [[7, 7]];
    const INITIAL_DIR = "RIGHT";
    const INITIAL_APPLE = [10, 8];

    snakeRef.current = INITIAL_SNAKE;
    directionRef.current = INITIAL_DIR;
    appleRef.current = INITIAL_APPLE;

    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIR);
    setApple(INITIAL_APPLE);

    setUserScore(0);
    setIsPaused(false);
    setSnakeFlash(false);
    setSpeed(500);

    setTimeout(() => {
      setRunning(true);
    }, 0);
  };

  const spawnApple = (snake) => {
    let newApple;

    do {
      newApple = [
        Math.floor(Math.random() * GRID_SIZE),
        Math.floor(Math.random() * GRID_SIZE),
      ];
    } while (
      snake.some((seg) => seg[0] === newApple[0] && seg[1] === newApple[1]) ||
      walls.some((w) => w[0] === newApple[0] && w[1] === newApple[1])
    );

    return newApple;
  };

  const handleDirection = (newDir) => {
    nextDirectionRef.current = newDir;
    setDirection(newDir);
  };

  const syncSnake = (newSnake) => {
    snakeRef.current = newSnake;
    setSnake(newSnake);
  };

  const moveSnake = () => {
    directionRef.current = nextDirectionRef.current;
    setDirection(directionRef.current);

    const prevSnake = snakeRef.current;
    const head = prevSnake[0];

    let newX = head[0];
    let newY = head[1];

    if (directionRef.current === "RIGHT") newX++;
    if (directionRef.current === "LEFT") newX--;
    if (directionRef.current === "UP") newY--;
    if (directionRef.current === "DOWN") newY++;

    if (newX >= GRID_SIZE) newX = 0;
    if (newX < 0) newX = GRID_SIZE - 1;
    if (newY >= GRID_SIZE) newY = 0;
    if (newY < 0) newY = GRID_SIZE - 1;

    const newHead = [newX, newY];

    if (isWall(newX, newY)) {
      setRunning(false);
      setSnakeFlash(true);
      setSnakeShake(true);
      sendScore(userScore);
      setTimeout(() => {
        setSnakeShake(false);
      }, 300);

      return;
    }

    const [appleX, appleY] = appleRef.current;
    const ateApple = newX === appleX && newY === appleY;

    let nextSnake = [newHead, ...prevSnake];

    if (!ateApple) {
      nextSnake = nextSnake.slice(0, -1);
    }

    const hitSelf = nextSnake.some(
      (seg, i) => i !== 0 && seg[0] === newX && seg[1] === newY,
    );

    if (hitSelf) {
      setRunning(false);
      setSnakeFlash(true);
      setSnakeShake(true);
      sendScore(score);
      setTimeout(() => setSnakeShake(false), 300);
      return;
    }

    if (ateApple) {
      setUserScore((s) => {
        const newScore = s + 1;
        const newSpeed = Math.max(100, 500 - newScore * 20);
        setSpeed(newSpeed);
        return newScore;
      });
      setScorePop(true);
      setTimeout(() => setScorePop(false), 200);

      const nextApple = spawnApple(nextSnake);
      appleRef.current = nextApple;
      setApple(nextApple);
    }

    syncSnake(nextSnake);
  };

  useEffect(() => {
    appleRef.current = apple;
  }, [apple]);

  const handleKey = useCallback(
    (e) => {
      if (snakeFlash) return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsPaused((p) => !p);
        return;
      }

      const keyMap = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
      };

      const newDir = keyMap[e.key];
      if (!newDir) return;

      const opposite = {
        UP: "DOWN",
        DOWN: "UP",
        LEFT: "RIGHT",
        RIGHT: "LEFT",
      };

      if (directionRef.current === opposite[newDir]) return;

      handleDirection(newDir);
    },
    [snakeFlash],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey, { passive: false });
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  useEffect(() => {
    if (!running || isPaused || snakeFlash) return;

    const interval = setInterval(moveSnake, speed);

    return () => clearInterval(interval);
  }, [running, isPaused, snakeFlash]);

  const getDirection = (i) => {
    const prev = snake[i - 1] || snake[i];
    const curr = snake[i];
    return [curr[0] - prev[0], curr[1] - prev[1]];
  };

  const getAngleFromDirection = (dir) => {
    const map = {
      RIGHT: 0,
      DOWN: 90,
      LEFT: 180,
      UP: -90,
    };

    return map[dir] || 0;
  };

  return (
    <div className="snake-container">
      <div
        className="snake-container-inner"
        style={{ color: theme.textPrimary }}
      >
        {showSnake ? (
          <div className="play-snake-wrapper">
            <div
              className={`${snakeFlash ? "play-snake snake-flash" : "play-snake"}`}
            >
              <div
                className="play-snake-score-container"
                style={{
                  background: theme.elevated,
                  border: `2px solid ${theme.border}`,
                }}
              >
                <div className="play-snake-choices">
                  <button
                    className="play-snake-pause-btn"
                    style={{
                      background: snakeFlash ? theme.muted : theme.elevated,
                      border: `2px solid ${theme.border}`,
                      cursor: snakeFlash ? "not-allowed" : "pointer",
                    }}
                    onClick={() => {
                      if (snakeFlash) return;
                      setIsPaused((prev) => !prev);
                    }}
                  >
                    {isPaused ? "Resume" : "Pause"}
                  </button>
                  <button
                    className="play-snake-reset-btn"
                    style={{
                      background: theme.elevated,
                      border: `2px solid ${theme.border}`,
                    }}
                    onClick={() => {
                      resetGame();
                    }}
                  >
                    Restart
                  </button>
                  {username !== "" && (
                    <div>
                      <button
                        className="play-snake-user-stats"
                        style={{
                          background: theme.elevated,
                          border: `2px solid ${theme.border}`,
                        }}
                        onClick={() => {
                          setGameType(gameName);
                          setShowSnake(false);
                          setShowStats(true);
                          setIsPaused(true);
                        }}
                      >
                        See Stats
                      </button>
                    </div>
                  )}{" "}
                  {username === "" && (
                    <div>
                      <button
                        className="play-snake-user-login"
                        style={{
                          background: theme.elevated,
                          border: `2px solid ${theme.border}`,
                        }}
                        onClick={() => {
                          setGameType(gameName);
                          setShowSnake(false);
                          setShowStats(true);
                          setIsPaused(true);
                        }}
                      >
                        Login
                      </button>
                    </div>
                  )}
                </div>
                <div className={`play-snake-score ${scorePop ? "pop" : ""}`}>
                  <img
                    src="/apple.png"
                    alt="apple"
                    className="play-snake-score-img"
                  />
                  <h3>{userScore}</h3>
                </div>
              </div>
              <div
                className={`${snakeShake ? "play-snake-arena-container snake-shake" : "play-snake-arena-container"}`}
                style={{
                  border: `2px solid ${theme.border}`,
                  background: theme.elevated,
                }}
              >
                {snake.map(([x, y], i) => {
                  const isHead = i === 0;
                  const isTail = i === snake.length - 1;

                  const [dx, dy] = getDirection(i);
                  const angle = Math.atan2(dy, dx);

                  const headAngle = getAngleFromDirection(direction);

                  return (
                    <div
                      key={i}
                      className={`snake-segment ${isHead ? "head" : ""} ${
                        isTail ? "tail" : ""
                      }`}
                      style={{
                        gridColumn: x + 1,
                        gridRow: y + 1,
                        transform: `rotate(${
                          isHead ? headAngle : angle * (180 / Math.PI)
                        }deg)`,
                      }}
                    >
                      {isHead && (
                        <>
                          <div className="eye left-eye" />
                          <div className="eye right-eye" />
                          <div className="tongue" />
                        </>
                      )}
                    </div>
                  );
                })}
                {isPaused && <h3 className="snake-paused">Paused</h3>}
                {snakeFlash && <h3 className="snake-gameover">Game Over</h3>}
                {walls.map(([x, y], i) => (
                  <img
                    key={`wall-${i}`}
                    src="/wall.jpg"
                    className="wall"
                    style={{
                      gridColumn: x + 1,
                      gridRow: y + 1,
                    }}
                  />
                ))}
                <img
                  src="/apple.png"
                  alt="apple"
                  className={`apple ${running && !isPaused ? "apple-running" : ""}`}
                  style={{
                    gridColumn: apple[0] + 1,
                    gridRow: apple[1] + 1,
                  }}
                />
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
          <div className="snake-stats-container">
            <LoginForm
              API_URL={API_URL}
              username={username}
              setUsername={setUsername}
              gametype={gameType}
              bestGame={bestGame}
              bestGameTime={bestGameTime}
              lastGame={lastGame}
              lastGameTime={lastGameTime}
              setShowGame={setShowSnake}
              setShowStats={setShowStats}
              theme={theme}
            />
          </div>
        ) : (
          <div
            className="start-snake"
            style={{
              backgroundImage: "url(/grass-land.gif)",
            }}
          >
            <button
              className="start-snake-btn"
              onClick={() => {
                setShowSnake(true);
                setGameType(gameName);
              }}
            >
              Play
            </button>
            <button
              className="start-snake-btn"
              onClick={() => {
                setShowSnake(false);
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
export default PlaySnake;
