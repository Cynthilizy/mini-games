import "./AnimatedTitle.css";

function AnimatedTitle({ text }) {
  return (
    <h1 className="game-title">
      {text.split("").map((char, i) => (
        <span key={i} className="game-letter" style={{ "--i": i }}>
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h1>
  );
}

export default AnimatedTitle;
