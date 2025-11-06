import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function Quiz() {
  const [user] = useAuthState(auth);
  const { category } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isQuizOver, setIsQuizOver] = useState(false);

  // Fetch questions from API or local storage
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // For demo, using hardcoded questions. Replace with API call
        const demoQuestions = [
          {
            question: "What is the capital of France?",
            options: ["London", "Berlin", "Paris", "Madrid"],
            correctAnswer: 2
          },
          {
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            correctAnswer: 1
          }
        ];
        setQuestions(demoQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [category]);

  // Timer logic
  useEffect(() => {
    if (!isQuizOver && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft, isQuizOver]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = async () => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      setIsQuizOver(true);
      // Save score to Firebase
      if (user) {
        try {
          await setDoc(doc(db, 'scores', `${user.uid}_${Date.now()}`), {
            userId: user.uid,
            category,
            score,
            totalQuestions: questions.length,
            timestamp: serverTimestamp()
          });
        } catch (error) {
          console.error("Error saving score:", error);
        }
      }
    }
  };

  if (questions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (isQuizOver) {
    return (
      <div className="max-w-2xl mx-auto bg-white/10 rounded-xl p-8 backdrop-blur-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Quiz Complete!</h2>
        <p className="text-xl text-center">
          Your score: {score} out of {questions.length}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white/10 rounded-xl p-8 backdrop-blur-lg">
      <div className="flex justify-between items-center mb-8">
        <span className="text-lg">
          Question {currentQuestion + 1}/{questions.length}
        </span>
        <span className="text-lg">Time left: {timeLeft}s</span>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">
          {questions[currentQuestion].question}
        </h2>

        <div className="space-y-4">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              className={`w-full p-4 text-left rounded-lg transition-colors ${
                selectedAnswer === index
                  ? 'bg-primary text-white'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              onClick={() => handleAnswerSelect(index)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <button
        className="w-full py-3 bg-primary hover:bg-primary-dark rounded-lg transition-colors disabled:opacity-50"
        onClick={handleNextQuestion}
        disabled={selectedAnswer === null}
      >
        {currentQuestion + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
      </button>
    </div>
  );
}
