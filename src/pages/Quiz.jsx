import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuestions } from "../services/quizService";
import QuestionCard from "../components/QuestionCard";
import Progress from "../components/Progress";

const QUIZ_TIME = 300;
const TOTAL_QUESTIONS = 10;

export default function Quiz() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME);
  const [loading, setLoading] = useState(true);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  /* =====================
     HELPER: SHUFFLE
  ====================== */
  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  /* =====================
     RESUME QUIZ (LOAD)
  ====================== */
  useEffect(() => {
    const savedQuiz = localStorage.getItem("quiz-progress");

    if (savedQuiz) {
      const data = JSON.parse(savedQuiz);
      setQuestions(data.questions);
      setCurrentIndex(data.currentIndex);
      setAnswers(data.answers);
      setTimeLeft(data.timeLeft);
      setLoading(false);
    } else {
      fetchQuestions();
    }
  }, []);

  /* =====================
     FETCH QUESTIONS
  ====================== */
  const fetchQuestions = async () => {
    setLoading(true);
    const data = await getQuestions(TOTAL_QUESTIONS);
    setQuestions(data);
    setLoading(false);
  };

  /* =====================
     SET SHUFFLED OPTIONS
     (RUN ONLY WHEN SOAL BERUBAH)
  ====================== */
  useEffect(() => {
    if (questions.length > 0) {
      const currentQuestion = questions[currentIndex];
      const options = shuffleArray([
        currentQuestion.correct_answer,
        ...currentQuestion.incorrect_answers,
      ]);
      setShuffledOptions(options);
    }
  }, [currentIndex, questions]);

  /* =====================
     TIMER
  ====================== */
  useEffect(() => {
    if (loading) return;

    if (timeLeft <= 0) {
      finishQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading]);

  /* =====================
     SAVE PROGRESS
  ====================== */
  useEffect(() => {
    if (!loading && questions.length > 0) {
      localStorage.setItem(
        "quiz-progress",
        JSON.stringify({
          questions,
          currentIndex,
          answers,
          timeLeft,
        }),
      );
    }
  }, [currentIndex, answers, timeLeft, loading, questions]);

  /* =====================
     HANDLE ANSWER
  ====================== */
  const handleAnswer = (selected) => {
    const currentQuestion = questions[currentIndex];

    const newAnswer = {
      question: currentQuestion.question,
      correct: currentQuestion.correct_answer,
      userAnswer: selected,
    };

    setAnswers((prev) => [...prev, newAnswer]);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  /* =====================
     FINISH QUIZ
  ====================== */
  const finishQuiz = () => {
    localStorage.removeItem("quiz-progress");
    navigate("/result", {
      state: {
        answers,
        total: questions.length,
      },
    });
  };

  /* =====================
     LOADING STATE
  ====================== */
  if (loading) {
    return <p>Memuat soal...</p>;
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="container">
      <h2>
        <i className="ri-question-line" /> Quiz App
      </h2>

      <p className="timer">
        <i className="ri-timer-line" /> Waktu tersisa:{" "}
        {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
      </p>

      <Progress current={currentIndex + 1} total={questions.length} />

      <QuestionCard
        question={currentQuestion.question}
        options={shuffledOptions}
        onAnswer={handleAnswer}
      />
    </div>
  );
}
