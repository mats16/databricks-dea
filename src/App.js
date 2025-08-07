import React, { useState } from 'react';
import './App.css';
import questionsData from './databricks_practice_questions.json';

const App = () => {
  const [questions] = useState(questionsData.questions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const formatSQL = (sql) => {
    return sql
      .replace(/\s+/g, ' ')
      .replace(/\s*;\s*$/, ';')
      .replace(/\b(CREATE|SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|DROP|ALTER|IF NOT EXISTS|LOCATION|DELTA)\b/gi, '\n$1')
      .replace(/\n\s*\n/g, '\n')
      .trim()
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
  };

  const detectLanguage = (code) => {
    const trimmedCode = code.trim();
    
    // Check for SQL keywords
    const sqlKeywords = /^\s*(CREATE|SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|WITH|MERGE|GRANT|REVOKE|SHOW|DESCRIBE|EXPLAIN)\b/i;
    if (sqlKeywords.test(trimmedCode)) {
      return 'sql';
    }
    
    return null;
  };

  const renderMarkdown = (text) => {
    const parts = text.split(/(```[^`]*```|`[^`]+`)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```') && part.length > 6) {
        const code = part.slice(3, -3);
        const language = detectLanguage(code);
        const formattedCode = language === 'sql' ? formatSQL(code) : code;
        
        return (
          <React.Fragment key={index}>
            <br />
            <code style={{ display: 'block' }}>{formattedCode}</code>
            <br />
          </React.Fragment>
        );
      } else if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        const code = part.slice(1, -1);
        const language = detectLanguage(code);
        const formattedCode = language === 'sql' ? formatSQL(code) : code;
        return <code key={index}>{formattedCode}</code>;
      }
      return part;
    });
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    const newAnsweredQuestion = {
      ...currentQuestion,
      userAnswer: selectedAnswer,
      isCorrect
    };

    setAnsweredQuestions(prev => [...prev, newAnsweredQuestion]);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      setIsQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions([]);
    setIsQuizFinished(false);
  };

  if (isQuizFinished) {
    return (
      <div className="app">
        <div className="quiz-container">
          <h1>クイズ完了！</h1>
          <div className="final-score">
            <h2>最終スコア: {score} / {questions.length}</h2>
            <p>正答率: {Math.round((score / questions.length) * 100)}%</p>
          </div>
          
          <div className="results-summary">
            <h3>解答結果一覧</h3>
            {answeredQuestions.map((q, index) => (
              <div key={q.question_number} className={`result-item ${q.isCorrect ? 'correct' : 'incorrect'}`}>
                <h4>問題 {q.question_number}: {q.isCorrect ? '正解' : '不正解'}</h4>
                <p><strong>問題:</strong> {renderMarkdown(q.question_text)}</p>
                <p><strong>あなたの回答:</strong> {q.userAnswer} - {renderMarkdown(q.options[q.userAnswer])}</p>
                <p><strong>正解:</strong> {q.correct_answer} - {renderMarkdown(q.options[q.correct_answer])}</p>
                <p><strong>解説:</strong> {renderMarkdown(q.explanation)}</p>
              </div>
            ))}
          </div>
          
          <button className="restart-btn" onClick={handleRestart}>
            もう一度チャレンジ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="quiz-container">
        <header className="quiz-header">
          <h1>{questionsData.title}</h1>
          <div className="progress">
            問題 {currentQuestionIndex + 1} / {questions.length}
          </div>
          <div className="score">
            現在のスコア: {score} / {currentQuestionIndex + (showResult ? 1 : 0)}
          </div>
        </header>

        <div className="question-section">
          <h2>問題 {currentQuestion.question_number}</h2>
          <p className="question-text">{renderMarkdown(currentQuestion.question_text)}</p>

          <div className="options">
            {Object.entries(currentQuestion.options).map(([key, value]) => (
              <label key={key} className={`option ${selectedAnswer === key ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="answer"
                  value={key}
                  checked={selectedAnswer === key}
                  onChange={() => handleAnswerSelect(key)}
                  disabled={showResult}
                />
                <span className="option-letter">{key}</span>
                <span className="option-text">
                  {renderMarkdown(value)}
                </span>
              </label>
            ))}
          </div>

          {!showResult ? (
            <button 
              className="submit-btn" 
              onClick={handleSubmit}
              disabled={!selectedAnswer}
            >
              回答を確定
            </button>
          ) : (
            <div className="result-section">
              <div className={`result ${selectedAnswer === currentQuestion.correct_answer ? 'correct' : 'incorrect'}`}>
                {selectedAnswer === currentQuestion.correct_answer ? (
                  <h3 className="result-title">🎉 正解です！</h3>
                ) : (
                  <div>
                    <h3 className="result-title">❌ 不正解です</h3>
                    <p>正解は: <strong>{currentQuestion.correct_answer} - {renderMarkdown(currentQuestion.options[currentQuestion.correct_answer])}</strong></p>
                  </div>
                )}
                <div className="explanation">
                  <h4>解説:</h4>
                  <p>{renderMarkdown(currentQuestion.explanation)}</p>
                </div>
              </div>
              <button className="next-btn" onClick={handleNext}>
                {currentQuestionIndex < questions.length - 1 ? '次の問題' : '結果を見る'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;