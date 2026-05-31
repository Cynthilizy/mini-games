import { Link } from "react-router-dom";
import "./Card.css";

function Card({ image, alt, title, link, theme, handleReset }) {
  return (
    <Link
      className="card"
      onClick={() => {
        handleReset();
      }}
      to={link}
      aria-label={`Play: ${title}`}
      style={{
        color: theme.textPrimary,
        border: `2px solid ${theme.border}`,
        background: theme.elevated,
      }}
    >
      <div className="card-head">
        <img src={image} alt={alt} className="card-img" />
      </div>

      <div className="card-body">
        <h2
          className="card-title"
          style={{ color: theme.textPrimary, textAlign: "center" }}
        >
          {title}
        </h2>
      </div>
    </Link>
  );
}

export default Card;
