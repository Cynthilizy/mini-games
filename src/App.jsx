import { useState } from "react";
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
import { useCSV } from "./UseCSV";
import { useLocation } from "react-router-dom";

function App() {
  const [mode, setMode] = useState("dark");
  const [showCapital, setShowCapital] = useState(false);
  const [showFlag, setShowFlag] = useState(false);
  const [showRps, setShowRps] = useState(false);
  const [showSnake, setShowSnake] = useState(false);

  const theme = colors[mode];

  const location = useLocation();

  const routes = [
    { path: "/", title: "Mini Games and Quizzes" },
    { path: "/play-capitals", title: "World Capitals" },
    { path: "/play-flags", title: "World Flags" },
    { path: "/play-snake", title: "Snake Master" },
    { path: "/play-rps", title: "Rock Paper Scissors" },
  ];

  const title =
    routes.find((r) => r.path === location.pathname)?.title || "Mini Games";

  const capitals = useCSV(
    "/local-db/capitals.csv",
    ([id, country, capital]) => ({
      id,
      country,
      capital,
    }),
  );

  const flags = useCSV("/local-db/flags.csv", ([id, country, flag]) => ({
    id,
    country,
    flag,
  }));

  const handleReset = () => {
    setShowCapital(false);
    setShowFlag(false);
    setShowRps(false);
    setShowSnake(false);
  };

  return (
    <div className="app" style={{ backgroundImage: `url(${theme.wall})` }}>
      <Header theme={theme} mode={mode} setMode={setMode} title={title} />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                theme={theme}
                flags={flags}
                capitals={capitals}
                handleReset={handleReset}
              />
            }
          ></Route>
          <Route
            path="/play-capitals"
            element={
              <PlayCapitals
                capitals={capitals}
                theme={theme}
                showCapital={showCapital}
                setShowCapital={setShowCapital}
              />
            }
          ></Route>
          <Route
            path="/play-flags"
            element={
              <PlayFlags
                flags={flags}
                theme={theme}
                showFlag={showFlag}
                setShowFlag={setShowFlag}
              />
            }
          ></Route>
          <Route
            path="/play-rps"
            element={
              <PlayRPS
                theme={theme}
                showRps={showRps}
                setShowRps={setShowRps}
              />
            }
          ></Route>
          <Route
            path="/play-snake"
            element={
              <PlaySnake
                theme={theme}
                showSnake={showSnake}
                setShowSnake={setShowSnake}
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
