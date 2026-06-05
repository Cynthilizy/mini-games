import Card from "./Card";
import "./Home.css";

function Home({ theme, flags, capitals, handleReset }) {
  return (
    <div className="home-container">
      <div className="home-container-inner">
        {flags.length == 0 || capitals.length == 0 ? (
          <h3>Loading...</h3>
        ) : (
          <div className="game-choices">
            <Card
              image="/rock-paper-scissors.jpg"
              alt="Rock Paper Scissors"
              title="R.P.S"
              link="/play-rps"
              theme={theme}
              handleReset={handleReset}
              className="card-option"
            />
            <Card
              image="/capitals.jpg"
              alt="World Capitals"
              title="World Capitals"
              link="/play-capitals"
              theme={theme}
              handleReset={handleReset}
              className="card-option"
            />
            <Card
              image="/flag.jpeg"
              alt="World Flags"
              title="World Flags"
              link="/play-flags"
              theme={theme}
              handleReset={handleReset}
              className="card-option"
            />
            <Card
              image="/snake.jpg"
              alt="Snake Master"
              title="Snake Master"
              link="/play-snake"
              theme={theme}
              handleReset={handleReset}
              className="card-option"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
