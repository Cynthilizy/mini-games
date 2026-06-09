import { useState } from "react";
import "./LoginForm.css";
import Gmail from "./assets/gmail.svg?react";
import Facebook from "./assets/facebook.svg?react";
import axios from "axios";
import ReactModal from "react-modal";
import { IoClose } from "react-icons/io5";
import Loader from "./Loader";

ReactModal.setAppElement("#root");

export default function LoginForm({
  API_URL,
  username,
  setUsername,
  gametype,
  lastGame,
  lastGameTime,
  bestGame,
  bestGameTime,
  setShowGame,
  setShowStats,
  theme,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showChangeName, setShowChangeName] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [loadingVariant, setLoadingVariant] = useState("");

  const [newUsername, setNewUsername] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPasswordOne, setNewPasswordOne] = useState("");
  const [newPasswordTwo, setNewPasswordTwo] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("email and Password must be provided");
      return;
    }
    setLoadingText("Logging in...");
    setLoadingVariant("spinner");
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/login`,
        { email, password },
        { withCredentials: true },
      );

      setUsername(res.data.user.username);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
    setLoading(false);
    setLoadingText("");
    setLoadingVariant("");
  };

  const handleSignup = async () => {
    if (!email || !password) {
      setError("email and Password must be provided");
      return;
    }
    setLoadingText("Signing up...");
    setLoadingVariant("spinner");
    setLoading(true);
    try {
      await axios.post(`${API_URL}/register`, { email, password });

      handleLogin(email, password);
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
    setLoading(false);
    setLoadingText("");
    setLoadingVariant("");
  };

  const handleChangeName = async () => {
    if (newUsername === "") {
      setError("enter new username");
      return;
    }
    setLoadingText("Updating username...");
    setLoadingVariant("spinner");
    setLoading(true);
    try {
      const res = await axios.put(
        `${API_URL}/change-username`,
        {
          newUsername,
        },
        {
          withCredentials: true,
        },
      );

      setUsername(res.data.username);
      setShowChangeName(false);
      setNewUsername("");
    } catch (err) {
      setError(err.response?.data?.error || "Unable to update username");
    }
    setLoading(false);
    setLoadingText("");
    setLoadingVariant("");
  };

  const handleChangePassword = async () => {
    if (newPasswordOne !== newPasswordTwo) {
      setError("New Passwords do not match");
      return;
    }

    if (newPasswordOne === "" || newPasswordTwo === "" || oldPassword === "") {
      setError("password fields cannot be empty");
      return;
    }

    setLoadingText("Updating password...");
    setLoadingVariant("spinner");
    setLoading(true);

    try {
      await axios.put(
        `${API_URL}/change-password`,
        {
          oldPassword,
          newPassword: newPasswordOne,
        },
        {
          withCredentials: true,
        },
      );

      setShowChangePassword(false);

      setOldPassword("");
      setNewPasswordOne("");
      setNewPasswordTwo("");
    } catch (err) {
      setError(err.response?.data?.error || "Unable to change password");
    }
    setLoading(false);
    setLoadingText("");
    setLoadingVariant("");
  };

  const handleDeleteAccount = async () => {
    setLoadingText("Deleting account...");
    setLoadingVariant("spinner");
    setLoading(true);
    try {
      await axios.put(
        `${API_URL}/delete-account`,
        {},
        {
          withCredentials: true,
        },
      );

      setUsername("");
      setShowDelete(false);
    } catch (err) {
      setError(err.response?.data?.error || "Unable to delete account");
    }
    setLoading(false);
    setLoadingText("");
    setLoadingVariant("");
  };

  const handleLogout = async () => {
    setLoadingText("Logging out...");
    setLoadingVariant("spinner");
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/logout`,
        {},
        {
          withCredentials: true,
        },
      );
      setUsername("");
      setShowGame(true);
      setShowStats(false);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
    setLoadingText("");
    setLoadingVariant("");
  };

  return (
    <div className="user-login-area" style={{ color: theme.textPrimary }}>
      {loading && (
        <Loader
          text={loadingText}
          variant={loadingVariant}
          style={{ position: "absolute", top: "50%", left: "50%" }}
        />
      )}
      <IoClose
        className="close-login-btn"
        onClick={() => {
          setShowStats(false);
          setShowGame(true);
        }}
        aria-label="Close"
      />
      {username === "" ? (
        <div className="login-section">
          <div className="login-form">
            <div className="login-input-fields">
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

            {error && <h3 className="error-login">{error}</h3>}

            <div className="login-submit-btns">
              <button onClick={handleLogin}>Login</button>

              <button onClick={handleSignup}>Create Account</button>
            </div>
          </div>

          <div>
            <h3 className="login-divider">Or Login Via</h3>

            <div className="login-icons">
              <button
                onClick={() =>
                  (window.location.href = `${API_URL}/auth/google`)
                }
              >
                <Gmail />
              </button>

              <button
                onClick={() =>
                  (window.location.href = `${API_URL}/auth/facebook`)
                }
              >
                <Facebook />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="user-view-area">
          <h2 className="welcome-user" style={{ color: theme.textPrimary }}>
            Welcome, <span>{username}</span>
          </h2>

          <div className="user-view-area-bottom">
            <div className="score-trace">
              <h3 className="stats-title">{gametype} Statistics</h3>

              <div className="stat-row">
                <span>Best Score</span>
                <strong>{bestGame}</strong>
              </div>

              <div className="stat-row">
                <span>Achieved</span>
                <strong>{bestGameTime}</strong>
              </div>

              <div className="stat-row">
                <span>Last Score</span>
                <strong>{lastGame}</strong>
              </div>

              <div className="stat-row">
                <span>Last Played</span>
                <strong>{lastGameTime}</strong>
              </div>
            </div>

            <div className="db-actions">
              <div className="modify-btns">
                <button onClick={() => setShowChangeName(true)}>
                  Change Username
                </button>

                <button onClick={() => setShowChangePassword(true)}>
                  Change Password
                </button>
              </div>

              <div className="danger-zone-btns">
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>

                <button
                  className="danger-btn"
                  onClick={() => setShowDelete(true)}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ReactModal
        isOpen={showChangeName}
        onRequestClose={() => setShowChangeName(false)}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={true}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="change-name-container">
          <IoClose
            className="modal-close-btn"
            onClick={() => {
              setNewUsername("");
              setError("");
              setShowChangeName(false);
            }}
          />
          <div className="change-name-contents">
            <h2>Change Username</h2>

            <h4 className="modal-error">{error || "\u00A0"}</h4>

            <input
              type="text"
              placeholder="Enter new username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />

            <button onClick={handleChangeName} className="modal-save-btn">
              Save Changes
            </button>
          </div>
        </div>
      </ReactModal>
      <ReactModal
        isOpen={showChangePassword}
        onRequestClose={() => setShowChangePassword(false)}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={true}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="change-password-container">
          <IoClose
            className="modal-close-btn"
            onClick={() => {
              setOldPassword("");
              setNewPasswordOne("");
              setNewPasswordTwo("");
              setError("");
              setShowChangePassword(false);
            }}
          />
          <div className="change-password-content">
            <h2>Change Password</h2>

            <p className="modal-description">Update your account password.</p>

            <h4 className="modal-error">{error || "\u00A0"}</h4>

            <div className="password-inputs">
              <input
                type="password"
                placeholder="Current Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />

              <input
                type="password"
                placeholder="New Password"
                value={newPasswordOne}
                onChange={(e) => setNewPasswordOne(e.target.value)}
              />

              <input
                type="password"
                placeholder="Confirm New Password"
                value={newPasswordTwo}
                onChange={(e) => setNewPasswordTwo(e.target.value)}
              />
            </div>

            <button className="modal-save-btn" onClick={handleChangePassword}>
              Update Password
            </button>
          </div>
        </div>
      </ReactModal>

      <ReactModal
        isOpen={showDelete}
        onRequestClose={() => setShowDelete(false)}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={true}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="delete-account-container">
          <IoClose
            className="modal-close-btn"
            onClick={() => setShowDelete(false)}
          />
          <h2>Delete Account</h2>

          <p>This action cannot be undone.</p>

          <button className="danger-btn" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>
      </ReactModal>
    </div>
  );
}
