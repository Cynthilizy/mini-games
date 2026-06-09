import "./Loader.css";

export default function Loader({ text = "Loading", variant = "dots" }) {
  return (
    <div className="loader-wrapper">
      <div className={`loader loader-${variant}`}>
        {variant === "spinner" && <div className="spinner" />}

        {variant === "dots" && (
          <>
            <span></span>
            <span></span>
            <span></span>
          </>
        )}
      </div>

      <p className="loader-text">{text}</p>
    </div>
  );
}
