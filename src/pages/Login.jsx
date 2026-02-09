import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!username) return alert("Username wajib diisi");

    localStorage.setItem("user", username);
    navigate("/quiz");
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) navigate("/quiz");
  }, []);

  return (
    <div className="container login">
      <h2>
        <i className="ri-user-3-line" /> Login Quiz
      </h2>
      <input
        placeholder="Masukkan username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button className="primary-btn" onClick={handleLogin}>
        <i className="ri-play-circle-line" /> Mulai Quiz
      </button>
    </div>
  );
}
