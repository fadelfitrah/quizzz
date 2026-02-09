import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const [answers, setAnswers] = useState([]);

  /* =====================
     LOAD DATA
  ====================== */
  useEffect(() => {
    // Data dari navigate state
    if (location.state?.answers) {
      setAnswers(location.state.answers);
      localStorage.setItem(
        "quiz-result",
        JSON.stringify(location.state.answers),
      );
    } else {
      // Fallback jika user refresh halaman
      const savedResult = localStorage.getItem("quiz-result");
      if (savedResult) {
        setAnswers(JSON.parse(savedResult));
      }
    }
  }, [location.state]);

  /* =====================
     CALCULATE RESULT
  ====================== */
  const totalAnswered = answers.length;
  const correct = answers.filter((a) => a.userAnswer === a.correct).length;
  const wrong = totalAnswered - correct;
  const score = totalAnswered ? Math.round((correct / totalAnswered) * 100) : 0;

  /* =====================
     HANDLERS
  ====================== */
  const handleRetry = () => {
    localStorage.removeItem("quiz-result");
    navigate("/quiz");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="container result-container">
      <div className="result-summary">
        <h2>
          <i className="ri-award-fill" /> Hasil Quiz Anda
        </h2>

        <div className="result-score-card">
          <div className="result-score-display">{score}%</div>
          <p className="result-message">
            {score >= 80
              ? "Sempurna! 🎉"
              : score >= 60
                ? "Bagus! 👏"
                : "Coba lagi! 💪"}
          </p>
        </div>

        <div className="result-stats">
          <div className="stat-item">
            <div className="stat-value">{totalAnswered}</div>
            <div className="stat-label">
              <i className="ri-bar-chart-2-fill" /> Total Soal
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-value correct-stat">{correct}</div>
            <div className="stat-label">
              <i className="ri-file-check-fill" /> Benar
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-value wrong-stat">{wrong}</div>
            <div className="stat-label">
              <i className="ri-file-close-fill" /> Salah
            </div>
          </div>
        </div>
      </div>

      <div className="buttons result-buttons">
        <button onClick={handleRetry} className="primary-btn">
          <i className="ri-loop-left-line" /> Ulangi Quiz
        </button>
        <button onClick={handleLogout} className="secondary-btn">
          <i className="ri-logout-box-r-line" /> Logout
        </button>
      </div>

      {/* DETAIL JAWABAN */}
      {answers.length > 0 && (
        <div className="review-section">
          <h3>
            <i className="ri-checkbox-multiple-line" /> Review Jawaban
          </h3>
          <div className="review-items">
            {answers.map((item, index) => (
              <div
                key={index}
                className={`review-item ${
                  item.userAnswer === item.correct ? "correct" : "incorrect"
                }`}
              >
                <div className="review-question-number">Soal {index + 1}</div>
                <div
                  className="review-question"
                  dangerouslySetInnerHTML={{
                    __html: item.question,
                  }}
                />
                <div className="review-answers">
                  <div className="answer-row your-answer">
                    <span className="answer-label">Jawaban Anda:</span>
                    <span
                      className="answer-value"
                      dangerouslySetInnerHTML={{
                        __html: item.userAnswer,
                      }}
                    />
                  </div>
                  {item.userAnswer !== item.correct && (
                    <div className="answer-row correct-answer">
                      <span className="answer-label">Jawaban Benar:</span>
                      <span
                        className="answer-value"
                        dangerouslySetInnerHTML={{
                          __html: item.correct,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
