import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Award, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { quizService, Quiz as QuizType, QuizQuestion } from '../services/quizService';
import { progressService } from '../services/progressService';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export function Quiz() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<QuizType[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizType | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const data = await quizService.getQuizzes();
      setQuizzes(data);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async (quiz: QuizType) => {
    try {
      setSelectedQuiz(quiz);
      const quizQuestions = await quizService.getQuizQuestions(quiz.id);
      setQuestions(quizQuestions);
      setCurrentQuestion(0);
      setAnswers({});
      setShowResults(false);
      setStartTime(Date.now());
    } catch (error) {
      console.error('Error starting quiz:', error);
    }
  };

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitQuiz();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = async () => {
    let correctAnswers = 0;
    let totalPoints = 0;

    questions.forEach((q, idx) => {
      totalPoints += q.points;
      if (answers[idx] === q.correct_answer) {
        correctAnswers += q.points;
      }
    });

    const percentage = (correctAnswers / totalPoints) * 100;
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    setScore(percentage);
    setShowResults(true);

    if (user && selectedQuiz) {
      try {
        await quizService.submitQuizAttempt({
          user_id: user.id,
          quiz_id: selectedQuiz.id,
          score: correctAnswers,
          total_points: totalPoints,
          percentage,
          time_spent_seconds: timeSpent,
          answers: Object.entries(answers).map(([qIdx, answer]) => ({
            question_id: questions[parseInt(qIdx)].id,
            answer,
          })),
        });

        await progressService.updateProgress(
          user.id,
          selectedQuiz.category,
          selectedQuiz.language,
          percentage,
          timeSpent
        );
      } catch (error) {
        console.error('Error submitting quiz:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading quizzes...</div>
      </div>
    );
  }

  if (showResults && selectedQuiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Quiz Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-4">
                  {Math.round(score)}%
                </div>
                <p className="text-xl text-muted-foreground">
                  {score >= 80 ? 'Excellent work!' : score >= 60 ? 'Good job!' : 'Keep practicing!'}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{Math.round(score)}%</div>
                  <div className="text-sm text-muted-foreground">Score</div>
                </div>
                <div className="text-center">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{questions.length}</div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">
                    {Math.floor((Date.now() - startTime) / 60000)}m
                  </div>
                  <div className="text-sm text-muted-foreground">Time</div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button onClick={() => startQuiz(selectedQuiz)} className="flex-1">
                  Retry Quiz
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedQuiz(null);
                    setShowResults(false);
                  }}
                  className="flex-1"
                >
                  Back to Quizzes
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (selectedQuiz && questions.length > 0) {
    const question = questions[currentQuestion];
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{selectedQuiz.title}</h2>
              <p className="text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{Math.floor((Date.now() - startTime) / 1000)}s</span>
            </div>
          </div>

          <div className="mb-4 bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-6">{question.question_text}</h3>

              <div className="space-y-3">
                {question.options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(option)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      answers[currentQuestion] === option
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className="flex-1"
            >
              Previous
            </Button>
            <Button
              onClick={nextQuestion}
              disabled={!answers[currentQuestion]}
              className="flex-1"
            >
              {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Interactive Quizzes</h1>
        <p className="text-muted-foreground text-lg">
          Test your knowledge and track your progress
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-xl">{quiz.title}</CardTitle>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      quiz.difficulty === 'beginner'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : quiz.difficulty === 'intermediate'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {quiz.difficulty}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{quiz.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {quiz.category}
                  </span>
                  <span className="px-2 py-1 bg-secondary rounded text-xs font-medium">
                    {quiz.language}
                  </span>
                </div>
                <Button onClick={() => startQuiz(quiz)} className="w-full">
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {quizzes.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No quizzes available</h3>
            <p className="text-muted-foreground">Check back later for new content</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
