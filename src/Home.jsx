import { useState } from "react";
import Card from "./Card";
import "./Home.css";
import Loader from "./Loader";
import ReactModal from "react-modal";
import { IoClose } from "react-icons/io5";
import Gmail from "./assets/gmail.svg?react";
import Facebook from "./assets/facebook.svg?react";
import axios from "axios";

ReactModal.setAppElement("#root");

function Home({
  theme,
  flags,
  capitals,
  handleReset,
  authhomeLoading,
  username,
  API_URL,
  setUsername,
}) {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [homeLoading, setHomeLoading] = useState(false);
  const [homeLoadingText, setHomeLoadingText] = useState("");
  const [homeLoadingVariant, setHomeLoadingVariant] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("email and Password must be provided");
      return;
    }
    setHomeLoadingText("Logging in...");
    setHomeLoadingVariant("spinner");
    setHomeLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/login`,
        { email, password },
        { withCredentials: true },
      );

      setUsername(res.data.user.username);
      setError("");
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
    setHomeLoading(false);
    setHomeLoadingText("");
    setHomeLoadingVariant("");
  };

  const handleSignup = async () => {
    if (!email || !password) {
      setError("email and Password must be provided");
      return;
    }
    setHomeLoadingText("Signing up...");
    setHomeLoadingVariant("spinner");
    setHomeLoading(true);
    try {
      await axios.post(`${API_URL}/register`, { email, password });

      handleLogin(email, password);
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
    setHomeLoading(false);
    setHomeLoadingText("");
    setHomeLoadingVariant("");
  };

  return (
    <div className="home-container">
      <div className="home-container-inner">
        {flags.length == 0 || capitals.length == 0 || authhomeLoading ? (
          <Loader text="Loading Data" variant="dots" />
        ) : (
          <div className="home-content">
            <div className="home-header">
              {username !== "" ? (
                <h2
                  className="home-username"
                  style={{ color: theme.textPrimary }}
                >
                  Hello, {username}
                </h2>
              ) : (
                <button
                  onClick={() => {
                    setShowModal(true);
                  }}
                  style={{ color: theme.textPrimary }}
                >
                  Login
                </button>
              )}
            </div>
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
          </div>
        )}
      </div>

      <ReactModal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        shouldCloseOnOverlayClick={false}
        className="home-modal"
        overlayClassName="home-modal-overlay"
      >
        <div className="home-login-section">
          {homeLoading && (
            <Loader
              text={homeLoadingText}
              variant={homeLoadingVariant}
              style={{ position: "absolute", top: "50%", left: "50%" }}
            />
          )}
          <IoClose
            className="home-close-login-btn"
            onClick={() => {
              setShowModal(false);
            }}
            aria-label="Close"
          />
          <div
            className="home-login-header"
            style={{ color: theme.textPrimary }}
          >
            <h2 style={{ color: theme.textPrimary }}>Player Login</h2>
            <p>Save scores, track records and compete globally.</p>
          </div>
          <div className="home-login-form">
            <div className="home-login-input-fields">
              <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <h3 className="home-error-login">{error}</h3>}

            <div className="home-login-submit-btns">
              <button onClick={handleLogin}>Login</button>

              <button onClick={handleSignup}>Create Account</button>
            </div>
          </div>

          <div>
            <h3
              className="home-login-divider"
              style={{ color: theme.textPrimary }}
            >
              Or Login Via
            </h3>

            <div className="home-login-icons">
              <button
                onClick={() =>
                  (window.location.href = `${API_URL}/auth/google`)
                }
              >
                <Gmail />
              </button>
            </div>
          </div>
        </div>
      </ReactModal>
    </div>
  );
}

export default Home;
