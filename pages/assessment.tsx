import { useEffect, useState } from "react";
import { atom, useAtom } from "jotai";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Radio,
  RadioGroup,
} from "@heroui/react";

import DefaultLayout from "../layouts/default";
import {assessmentResultsAtom} from "@/lib/jotai"; // adjust the import as needed

// Helper function to shuffle an array in-place
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const AssessmentPage = () => {
  // Define the five pairs. In each pair, the first statement is answered normally,
  // while the second statement (the "mirror") is reverse-scored (i.e. score becomes 6 - value).
  const pairsData = [
    {
      pairId: 1,
      questions: [
        { id: 1, text: "I start conversations often." },
        { id: 2, text: "I prefer solitary quiet." },
      ],
    },
    {
      pairId: 2,
      questions: [
        { id: 3, text: "I am imaginative." },
        { id: 4, text: "I navigate spaces with precision and ease." },
      ],
    },
    {
      pairId: 3,
      questions: [
        { id: 5, text: "I am strong in strict logic and analysis." },
        { id: 6, text: "I keenly attuned to subtle social dynamics." },
      ],
    },
    {
      pairId: 4,
      questions: [
        { id: 7, text: "I thrive in spontaneous, unstructured environments." },
        { id: 8, text: "I adhere to organized and structured routines." },
      ],
    },
    {
      pairId: 5,
      questions: [
        { id: 9, text: "I have deep respect for fairness and humanity." },
        { id: 10, text: "I have strategic, power-driven mindset." },
      ],
    },
  ];

  // We'll store the randomized and flattened question list in state.
  const [questionList, setQuestionList] = useState(null);
  // currentQuestion: index in the flattened list.
  const [currentQuestion, setCurrentQuestion] = useState(0);
  // answers keyed by question id (numeric value from 1 to 5)
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useAtom(assessmentResultsAtom);

  // Likert scale options (each option value is a string "1" to "5")
  const likertOptions = [
    { label: "Strongly Disagree", value: "1" },
    { label: "Disagree", value: "2" },
    { label: "Neutral", value: "3" },
    { label: "Agree", value: "4" },
    { label: "Strongly Agree", value: "5" },
  ];

  // Only on the client do we randomize the questions.
  useEffect(() => {
    const shuffledPairs = shuffle([...pairsData]);
    const qs = [];
    shuffledPairs.forEach((pair) => {
      qs.push({ ...pair.questions[0], pairId: pair.pairId, subIndex: 1 });
      qs.push({ ...pair.questions[1], pairId: pair.pairId, subIndex: 2 });
    });
    setQuestionList(qs);
  }, []);

  // If questionList is not set yet, show a loading state.
  if (!questionList) {
    return (
      <DefaultLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <p>Loading assessment...</p>
        </div>
      </DefaultLayout>
    );
  }

  // Called when a user selects an answer.
  const handleAnswer = (value) => {
    const numericValue = parseInt(value, 10);
    setAnswers((prev) => ({
      ...prev,
      [questionList[currentQuestion].id]: numericValue,
    }));

    // Automatically move to the next question after a short delay.
    setTimeout(() => {
      handleNext();
    }, 150);
  };

  const handleNext = () => {
    if (currentQuestion < questionList.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // When finished, compute the five pair averages.
      // Group answers by pairId.
      const pairScores = {};
      questionList.forEach((q) => {
        const ans = answers[q.id] || (q.id === questionList[currentQuestion].id ? answers[q.id] : null);
        if (ans !== undefined && ans !== null) {
          if (!pairScores[q.pairId]) {
            pairScores[q.pairId] = {};
          }
          if (q.subIndex === 1) {
            pairScores[q.pairId].first = ans;
          } else if (q.subIndex === 2) {
            pairScores[q.pairId].second = ans;
          }
        }
      });

      // Calculate average for each pair.
      // For the mirror question, we use reverse scoring: reverseScore = 6 - answer.
      const averages = Object.keys(pairScores).map((pairId) => {
        const { first, second } = pairScores[pairId];
        if (first !== undefined && second !== undefined) {
          const reverseSecond = 6 - second;
          return {
            pairId,
            average: (first + reverseSecond) / 2,
          };
        }
        return { pairId, average: null };
      });

      // Save the results to the Jotai atom and to localStorage.
      setResults(averages);
      if (typeof window !== "undefined") {
        localStorage.setItem("assessmentResults", JSON.stringify(averages));
      }
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
      <DefaultLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <h2 className="text-2xl font-bold text-center">Your Assessment Results</h2>
            </CardHeader>
            <CardBody>
              {results &&
                results.map((pairResult) => (
                  <div key={pairResult.pairId} className="mb-4">
                    <p className="font-medium">Pair {pairResult.pairId}</p>
                    <p className="text-gray-600">
                      Average Score:{" "}
                      {pairResult.average !== null
                        ? pairResult.average.toFixed(2)
                        : "Incomplete"}
                    </p>
                  </div>
                ))}
              <Button
                className="w-full mt-4"
                onClick={() => {
                  setShowResults(false);
                  setCurrentQuestion(0);
                  setAnswers({});
                  // Re-shuffle the questions for a new run.
                  const shuffledPairs = shuffle([...pairsData]);
                  const qs = [];
                  shuffledPairs.forEach((pair) => {
                    qs.push({ ...pair.questions[0], pairId: pair.pairId, subIndex: 1 });
                    qs.push({ ...pair.questions[1], pairId: pair.pairId, subIndex: 2 });
                  });
                  setQuestionList(qs);
                }}
              >
                Start Over
              </Button>
            </CardBody>
          </Card>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className=" bg-blue-50 border rounded-xl flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <div className="flex justify-between items-center w-full">
              <h2 className="text-2xl font-bold">
                Question {currentQuestion + 1}/{questionList.length}
              </h2>
              <span className="text-sm text-gray-500">
                Progress: {Math.round(((currentQuestion + 1) / questionList.length) * 100)}%
              </span>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              <h3 className="text-lg font-medium">
                {questionList[currentQuestion].text}
              </h3>
              <RadioGroup
                className="space-y-2"
                value={
                  answers[questionList[currentQuestion].id]
                    ? answers[questionList[currentQuestion].id].toString()
                    : ""
                }
                onValueChange={handleAnswer}
              >
                {likertOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Radio id={option.value} value={option.value}>
                      {option.label}
                    </Radio>
                  </div>
                ))}
              </RadioGroup>
              <div className="flex justify-start mt-6">
                <Button
                  disabled={currentQuestion === 0}
                  variant="bordered"
                  onClick={handlePrevious}
                >
                  Previous
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
