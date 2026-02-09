export default function QuestionCard({ question, options, onAnswer }) {
  return (
    <div className="question">
      <h3 dangerouslySetInnerHTML={{ __html: question }} />
      <i className="ri-question-line" />{" "}
      <div className="options">
        {options.map((opt, i) => (
          <button
            key={i}
            className="option-btn"
            onClick={() => onAnswer(opt)}
            dangerouslySetInnerHTML={{ __html: opt }}
          />
        ))}
      </div>
    </div>
  );
}
