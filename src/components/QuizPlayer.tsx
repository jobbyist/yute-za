import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizPlayerProps {
  title: string;
  questions?: QuizQuestion[];
  onComplete?: (score: number) => void;
}

// Default sample questions if none provided
const defaultQuestions: QuizQuestion[] = [
  {
    id: "1",
    question: "What is the recommended percentage of your income to save each month?",
    options: ["5-10%", "10-20%", "20-30%", "30-40%"],
    correctAnswer: 1,
    explanation: "Financial experts recommend saving 10-20% of your income for a healthy financial future.",
  },
  {
    id: "2",
    question: "What is an emergency fund?",
    options: [
      "Money for vacation",
      "3-6 months of expenses saved for unexpected costs",
      "Investment portfolio",
      "Retirement savings",
    ],
    correctAnswer: 1,
    explanation: "An emergency fund should cover 3-6 months of living expenses to protect against unexpected financial challenges.",
  },
  {
    id: "3",
    question: "Which is generally considered a good debt?",
    options: ["Credit card debt", "Student loans", "Payday loans", "Store credit"],
    correctAnswer: 1,
    explanation: "Student loans are considered 'good debt' because they're an investment in your future earning potential.",
  },
];

export const QuizPlayer = ({ title, questions = defaultQuestions, onComplete }: QuizPlayerProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [isComplete, setIsComplete] = useState(false);

  const question = questions[currentQuestion];
  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleAnswerSelect = (index: number) => {
    if (!showExplanation) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz complete
      const score = answers.reduce((acc, answer, index) => {
        return acc + (answer === questions[index].correctAnswer ? 1 : 0);
      }, 0);
      const percentage = (score / totalQuestions) * 100;
      setIsComplete(true);
      onComplete?.(percentage);
    }
  };

  const isCorrect = selectedAnswer === question.correctAnswer;

  if (isComplete) {
    const score = answers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
    const percentage = (score / totalQuestions) * 100;

    return (
      <Card className="p-8">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Award className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-2">Quiz Complete! 🎉</h2>
            <p className="text-lg text-muted-foreground">
              You scored {score} out of {totalQuestions}
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <div className="mb-2 flex justify-between text-sm">
              <span>Your Score</span>
              <span className="font-semibold">{percentage.toFixed(0)}%</span>
            </div>
            <Progress value={percentage} className="h-3" />
          </div>
          <div className="pt-4">
            {percentage === 100 && (
              <p className="text-green-600 font-semibold mb-4">
                Perfect score! You've mastered this topic! 🌟
              </p>
            )}
            {percentage >= 70 && percentage < 100 && (
              <p className="text-blue-600 font-semibold mb-4">
                Great job! You have a solid understanding! 👏
              </p>
            )}
            {percentage >= 50 && percentage < 70 && (
              <p className="text-amber-600 font-semibold mb-4">
                Good effort! Review the material to improve further. 📚
              </p>
            )}
            {percentage < 50 && (
              <p className="text-red-600 font-semibold mb-4">
                Keep learning! Review the course content and try again. 💪
              </p>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold">{title}</h3>
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">{question.question}</h4>

          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
            disabled={showExplanation}
          >
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                    showExplanation
                      ? index === question.correctAnswer
                        ? "border-green-500 bg-green-50 dark:bg-green-950"
                        : selectedAnswer === index
                        ? "border-red-500 bg-red-50 dark:bg-red-950"
                        : "border-border"
                      : selectedAnswer === index
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer"
                  >
                    {option}
                  </Label>
                  {showExplanation && index === question.correctAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                  {showExplanation && selectedAnswer === index && index !== question.correctAnswer && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Explanation */}
        {showExplanation && question.explanation && (
          <Card className={`p-4 ${isCorrect ? "bg-green-50 dark:bg-green-950" : "bg-amber-50 dark:bg-amber-950"}`}>
            <div className="flex gap-3">
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold mb-1">
                  {isCorrect ? "Correct!" : "Not quite right"}
                </p>
                <p className="text-sm text-muted-foreground">{question.explanation}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-4">
          <div>
            {currentQuestion > 0 && !showExplanation && (
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentQuestion(currentQuestion - 1);
                  setSelectedAnswer(answers[currentQuestion - 1]);
                  setShowExplanation(false);
                }}
              >
                Previous
              </Button>
            )}
          </div>
          <div>
            {!showExplanation ? (
              <Button onClick={handleSubmitAnswer} disabled={selectedAnswer === null}>
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNext}>
                {currentQuestion < totalQuestions - 1 ? "Next Question" : "Finish Quiz"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
