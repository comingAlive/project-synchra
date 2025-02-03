import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Radio,
  RadioGroup,
} from "@heroui/react";
import { useState } from "react";

import DefaultLayout from "@/layouts/default";

const AssessmentPage = () => {
  const questions = [
    {
      id: 1,
      text: "How often do you exercise?",
      options: ["Daily", "2-3 times a week", "Once a week", "Rarely"],
    },
    {
      id: 2,
      text: "What's your preferred learning style?",
      options: ["Visual", "Auditory", "Reading/Writing", "Kinesthetic"],
    },
    {
      id: 3,
      text: "How many hours do you sleep on average?",
      options: ["Less than 6", "6-7 hours", "7-8 hours", "More than 8"],
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].id]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <h2 className="text-2xl font-bold text-center">Your Answers</h2>
          </CardHeader>
          <CardBody>
            {questions.map((question) => (
              <div key={question.id} className="mb-4">
                <p className="font-medium">{question.text}</p>
                <p className="text-gray-600">
                  Your answer: {answers[question.id] || "Not answered"}
                </p>
              </div>
            ))}
            <Button
              className="w-full mt-4"
              onClick={() => {
                setShowResults(false);
                setCurrentQuestion(0);
                setAnswers({});
              }}
            >
              Start Over
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <div className="flex justify-between items-center w-full">
              <h2 className="text-2xl font-bold">
                Question {currentQuestion + 1}/{questions.length}
              </h2>
              <span className="text-sm text-gray-500">
                Progress:{" "}
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
              </span>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              <h3 className="text-lg font-medium">
                {questions[currentQuestion].text}
              </h3>

              <RadioGroup
                className="space-y-2"
                value={answers[questions[currentQuestion].id]}
                onValueChange={handleAnswer}
              >
                {questions[currentQuestion].options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Radio id={option} value={option}>
                      {option}
                    </Radio>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex justify-between mt-6">
                <Button
                  disabled={currentQuestion === 0}
                  variant="bordered"
                  onClick={handlePrevious}
                >
                  Previous
                </Button>
                <Button
                  disabled={!answers[questions[currentQuestion].id]}
                  onClick={handleNext}
                >
                  {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </DefaultLayout>
  );
};

export default AssessmentPage;
