"use client";
import { useState } from "react";
import type { QuizQuestion } from "@/lib/course-data";

interface Props {
  moduleId: number;
  moduleName: string;
  questions: QuizQuestion[];
  onComplete: (score: number, passed: boolean) => void;
  onBack: () => void;
}

export default function QuizSystem({ moduleId, moduleName, questions, onComplete, onBack }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const question = questions[currentQ];
  const answeredCount = answers.filter(a => a !== null).length;
  const allAnswered = answeredCount === questions.length;

  function selectAnswer(optionIndex: number) {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[currentQ] = optionIndex;
    setAnswers(newAnswers);
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  if (submitted) {
    const correct = answers.reduce((acc: number, ans, i) => acc + (ans === questions[i].correct ? 1 : 0), 0);
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= 70;

    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full text-center">
          <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl ${passed ? "bg-sage/20" : "bg-red-50"}`}>
            {passed ? "🎉" : "📝"}
          </div>
          <h2 className="text-2xl font-display font-bold text-navy mb-2">
            {passed ? "Module Complete!" : "Keep Practicing"}
          </h2>
          <p className="text-gray-600 mb-6">
            You scored <strong className="text-navy">{score}%</strong> ({correct}/{questions.length} correct).
            {passed ? " Great job!" : " You need 70% to pass. Review the lessons and try again."}
          </p>

          {/* Answer review */}
          <div className="text-left space-y-3 mb-6 max-h-60 overflow-y-auto">
            {questions.map((q, i) => (
              <div key={i} className={`p-3 rounded-lg text-sm ${answers[i] === q.correct ? "bg-green-50" : "bg-red-50"}`}>
                <div className="font-semibold text-gray-700 mb-1">Q{i + 1}: {q.question}</div>
                {answers[i] !== q.correct && (
                  <div className="text-red-600">Your answer: {q.options[answers[i]!]}</div>
                )}
                <div className="text-green-700">Correct: {q.options[q.correct]}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            {passed ? (
              <button onClick={() => onComplete(score, true)} className="flex-1 bg-navy text-white py-3 rounded-xl font-semibold hover:bg-navy-dark">
                Continue →
              </button>
            ) : (
              <>
                <button onClick={onBack} className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50">
                  Review Lessons
                </button>
                <button onClick={() => { setSubmitted(false); setCurrentQ(0); setAnswers(new Array(questions.length).fill(null)); }} className="flex-1 bg-accent text-white py-3 rounded-xl font-semibold hover:bg-accent-dark">
                  Try Again
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={onBack} className="text-accent hover:underline">← Back</button>
          <span className="text-sm text-gray-500">Module {moduleId} Quiz</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Progress dots */}
        <div className="flex gap-1.5 mb-8">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQ(i)}
              className={`flex-1 h-2 rounded-full transition-colors ${
                i === currentQ ? "bg-accent" : answers[i] !== null ? "bg-sage" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="text-sm text-gray-400 mb-2">Question {currentQ + 1} of {questions.length}</div>
          <h2 className="text-xl font-display font-bold text-navy mb-6">{question.question}</h2>

          <div className="space-y-3 mb-8">
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => selectAnswer(i)}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
                  answers[currentQ] === i
                    ? "border-accent bg-accent/5 text-navy font-semibold"
                    : "border-gray-100 hover:border-gray-300 text-gray-700"
                }`}
              >
                <span className="inline-block w-7 h-7 rounded-full border-2 mr-3 text-center text-sm leading-6 font-semibold
                  {answers[currentQ] === i ? 'border-accent bg-accent text-white' : 'border-gray-300 text-gray-400'}">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
              disabled={currentQ === 0}
              className="text-accent hover:underline disabled:opacity-30 disabled:no-underline"
            >
              ← Previous
            </button>

            {currentQ < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQ(currentQ + 1)}
                className="bg-navy text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-navy-dark"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="bg-terra text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-terra-dark disabled:opacity-40"
              >
                Submit Quiz ({answeredCount}/{questions.length} answered)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
