import { Link } from "react-router-dom";
import "./Header.css";
import Sun from "./assets/sun.svg?react";
import Moon from "./assets/moon.svg?react";
import { typography } from "./typography";
import { spacing } from "./spacing";
import AnimatedTitle from "./AnimatedTitle";

function Header({ theme, setMode, mode, title }) {
  const toggle = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  return (
    <div
      style={{
        backgroundImage: `url(${theme.wall})`,
        color: theme.text,
        padding: spacing.md,
      }}
      className="header-container"
    >
      <div className="header-container-inner">
        <Link
          to="/"
          className="link"
          style={{
            color: theme.textPrimary,
            fontSize: typography.size.md,
            fontWeight: typography.weight.bold,
            background: theme.elevated,
          }}
        >
          Home
        </Link>
        <AnimatedTitle text={title} />
        <button
          className="toggle-btn"
          onClick={toggle}
          aria-label="Toggle dark mode"
        >
          {mode === "dark" ? (
            <Sun className="icon" />
          ) : (
            <Moon className="icon" />
          )}
        </button>
      </div>
    </div>
  );
}
export default Header;
