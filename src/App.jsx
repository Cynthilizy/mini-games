import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { colors } from "./colors";
import Home from "./Home";
import Header from "./Header";
import Footer from "./Footer";
import PlayCapitals from "./capitals-quiz/PlayCapitals";
import PlayFlags from "./flag-quiz/PlayFlags";
import PlayRPS from "./rock-paper-scissors/PlayRPS";
import PlaySnake from "./snake-master/PlaySnake";
import { useLocation } from "react-router-dom";
import axios from "axios";

function App() {
  const [mode, setMode] = useState("dark");
  const [showCapital, setShowCapital] = useState(false);
  const [showFlag, setShowFlag] = useState(false);
  const [showRps, setShowRps] = useState(false);
  const [showSnake, setShowSnake] = useState(false);

  const [capitals, setCapitals] = useState([]);
  const [flags, setFlags] = useState([]);
  const [username, setUsername] = useState("");
  const [authLoading, setAuthLoading] = useState(true);

  const [gameType, setGameType] = useState("");
  const [bestGame, setBestGame] = useState(0);
  const [bestGameTime, setBestGameTime] = useState("");
  const [lastGame, setLastGame] = useState(0);
  const [lastGameTime, setLastGameTime] = useState("");
  const [scoreRefreshKey, setScoreRefreshKey] = useState(0);

  const theme = colors[mode];

  const location = useLocation();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const task = async () => {
      try {
        const [flagsResult, capitalsResult] = await Promise.all([
          axios.get(`${API_URL}/flags`, {
            withCredentials: true,
          }),
          axios.get(`${API_URL}/capitals`, {
            withCredentials: true,
          }),
        ]);

        setFlags(flagsResult.data);
        setCapitals(capitalsResult.data);
      } catch (err) {
        console.error(err);
      }
    };

    task();
  }, []);

  const routes = [
    { path: "/", title: "Mini Games and Quizzes" },
    { path: "/play-capitals", title: "World Capitals" },
    { path: "/play-flags", title: "World Flags" },
    { path: "/play-snake", title: "Snake Master" },
    { path: "/play-rps", title: "Rock Paper Scissors" },
  ];

  const title =
    routes.find((r) => r.path === location.pathname)?.title || "Mini Games";

  const handleReset = () => {
    setShowCapital(false);
    setShowFlag(false);
    setShowRps(false);
    setShowSnake(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_URL}/me`, {
          withCredentials: true,
        });

        setUsername(res.data.username);
      } catch {
        setUsername("");
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  const formatStatDate = (val) =>
    val ? new Date(val).toLocaleString("fi-FI") : "---";

  useEffect(() => {
    if (username === "" || gameType === "") return;

    const getScore = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/game-stats/${gameType}`, {
          withCredentials: true,
        });

        if (!data) {
          setLastGame(0);
          setLastGameTime("---");
          setBestGame(0);
          setBestGameTime("---");
          return;
        }

        setLastGame(data.last_score || 0);
        setLastGameTime(formatStatDate(data.last_played_at));

        setBestGame(data.best_score || 0);
        setBestGameTime(formatStatDate(data.best_score_time));
      } catch (err) {
        console.error(err);

        setLastGame(0);
        setLastGameTime("---");
        setBestGame(0);
        setBestGameTime("---");
      }
    };

    getScore();
  }, [username, gameType, scoreRefreshKey]);

  return (
    <div className="app" style={{ backgroundImage: `url(${theme.wall})` }}>
      <Header theme={theme} mode={mode} setMode={setMode} title={title} />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                username={username}
                setUsername={setUsername}
                API_URL={API_URL}
                theme={theme}
                flags={flags}
                capitals={capitals}
                handleReset={handleReset}
                authLoading={authLoading}
                username={username}
                APÄI_URL={API_URL}
                setUsername={setUsername}
              />
            }
          ></Route>
          <Route
            path="/play-capitals"
            element={
              <PlayCapitals
                capitals={capitals}
                username={username}
                setUsername={setUsername}
                theme={theme}
                showCapital={showCapital}
                setShowCapital={setShowCapital}
                API_URL={API_URL}
                gameType={gameType}
                setGameType={setGameType}
                bestGame={bestGame}
                bestGameTime={bestGameTime}
                lastGame={lastGame}
                lastGameTime={lastGameTime}
                setScoreRefreshKey={setScoreRefreshKey}
              />
            }
          ></Route>
          <Route
            path="/play-flags"
            element={
              <PlayFlags
                flags={flags}
                username={username}
                setUsername={setUsername}
                theme={theme}
                showFlag={showFlag}
                setShowFlag={setShowFlag}
                API_URL={API_URL}
                gameType={gameType}
                setGameType={setGameType}
                bestGame={bestGame}
                bestGameTime={bestGameTime}
                lastGame={lastGame}
                lastGameTime={lastGameTime}
                setScoreRefreshKey={setScoreRefreshKey}
              />
            }
          ></Route>
          <Route
            path="/play-rps"
            element={
              <PlayRPS
                theme={theme}
                username={username}
                setUsername={setUsername}
                showRps={showRps}
                setShowRps={setShowRps}
                API_URL={API_URL}
                gameType={gameType}
                setGameType={setGameType}
                bestGame={bestGame}
                bestGameTime={bestGameTime}
                lastGame={lastGame}
                lastGameTime={lastGameTime}
                setScoreRefreshKey={setScoreRefreshKey}
              />
            }
          ></Route>
          <Route
            path="/play-snake"
            element={
              <PlaySnake
                theme={theme}
                username={username}
                setUsername={setUsername}
                showSnake={showSnake}
                setShowSnake={setShowSnake}
                API_URL={API_URL}
                gameType={gameType}
                setGameType={setGameType}
                bestGame={bestGame}
                bestGameTime={bestGameTime}
                lastGame={lastGame}
                lastGameTime={lastGameTime}
                setScoreRefreshKey={setScoreRefreshKey}
              />
            }
          ></Route>
        </Routes>
      </main>
      <Footer theme={theme} />
    </div>
  );
}

export default App;
