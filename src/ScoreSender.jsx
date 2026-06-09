import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const sendScore = async ({ username, gameType, score, onSuccess }) => {
  console.log("sendScore called:", { username, gameType, score });
  if (!username || !gameType || score == null || score <= 0) return;

  try {
    const res = await axios.post(
      `${API_URL}/submit-score`,
      { gameType, score },
      { withCredentials: true },
    );
    onSuccess?.(res.data);
  } catch (err) {
    console.error("Score submit failed:", err.response?.data || err.message);
  }
};

export default sendScore;
