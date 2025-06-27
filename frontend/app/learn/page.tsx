"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, Eye } from "lucide-react"
import Link from "next/link"

interface Word {
  id: string
  word: string
  definition: string
  learned: boolean
  attempts: number
  correct: number
}

export default function LearnPage() {
  const [words, setWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [showAnswer, setShowAnswer] = useState(false)
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null)
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 })
  const [mode, setMode] = useState<"definition-to-word" | "word-to-definition">("word-to-definition")

  useEffect(() => {
    const savedWords = localStorage.getItem("vocabulary-words")
    if (savedWords) {
      const parsedWords = JSON.parse(savedWords)
      // Filter out learned words or include them based on user preference
      setWords(parsedWords)
    }
  }, [])

  const currentWord = words[currentIndex]

  const checkAnswer = () => {
    if (!currentWord || !userAnswer.trim()) return

    const isCorrect =
      mode === "word-to-definition"
        ? userAnswer.toLowerCase().trim().includes(currentWord.definition.toLowerCase().trim()) ||
          currentWord.definition.toLowerCase().trim().includes(userAnswer.toLowerCase().trim())
        : userAnswer.toLowerCase().trim() === currentWord.word.toLowerCase().trim()

    setFeedback(isCorrect ? "correct" : "incorrect")
    setShowAnswer(true)

    // Update stats
    const updatedWords = [...words]
    updatedWords[currentIndex] = {
      ...currentWord,
      attempts: currentWord.attempts + 1,
      correct: currentWord.correct + (isCorrect ? 1 : 0),
      learned: isCorrect && currentWord.correct + 1 >= 3, // Mark as learned after 3 correct answers
    }
    setWords(updatedWords)

    // Update session stats
    setSessionStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }))

    // Save to localStorage
    localStorage.setItem("vocabulary-words", JSON.stringify(updatedWords))
  }

  const nextWord = () => {
    setCurrentIndex((prev) => (prev + 1) % words.length)
    setUserAnswer("")
    setShowAnswer(false)
    setFeedback(null)
  }

  const toggleMode = () => {
    setMode((prev) => (prev === "word-to-definition" ? "definition-to-word" : "word-to-definition"))
    setUserAnswer("")
    setShowAnswer(false)
    setFeedback(null)
  }

  const resetSession = () => {
    setCurrentIndex(0)
    setUserAnswer("")
    setShowAnswer(false)
    setFeedback(null)
    setSessionStats({ correct: 0, total: 0 })
  }

  if (words.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <Card>
            <CardHeader>
              <CardTitle>No Words Available</CardTitle>
              <CardDescription>You need to import some vocabulary words before you can start learning.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/upload">
                <Button>Import Words</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Session</h1>
              <p className="text-gray-600">
                Word {currentIndex + 1} of {words.length}
              </p>
            </div>
            <Button variant="outline" onClick={resetSession}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </header>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(((currentIndex + 1) / words.length) * 100)}%</span>
            </div>
            <Progress value={((currentIndex + 1) / words.length) * 100} className="mb-4" />

            <div className="flex justify-between text-sm">
              <span>
                Session: {sessionStats.correct}/{sessionStats.total} correct
              </span>
              <span>
                Accuracy: {sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Mode Toggle */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Learning Mode:</span>
              <Button variant="outline" onClick={toggleMode}>
                {mode === "word-to-definition" ? "Word → Definition" : "Definition → Word"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Flashcard */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              {mode === "word-to-definition" ? currentWord?.word : "What word matches this definition?"}
            </CardTitle>
            {mode === "definition-to-word" && (
              <CardDescription className="text-center text-lg">{currentWord?.definition}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                placeholder={mode === "word-to-definition" ? "Enter the definition..." : "Enter the word..."}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !showAnswer && checkAnswer()}
                disabled={showAnswer}
                className="text-lg"
              />
            </div>

            {!showAnswer ? (
              <div className="flex gap-2">
                <Button onClick={checkAnswer} disabled={!userAnswer.trim()} className="flex-1">
                  Check Answer
                </Button>
                <Button variant="outline" onClick={() => setShowAnswer(true)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Reveal
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Feedback */}
                <div
                  className={`p-4 rounded-lg flex items-center gap-2 ${
                    feedback === "correct" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {feedback === "correct" ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                  <span className="font-medium">{feedback === "correct" ? "Correct!" : "Incorrect"}</span>
                </div>

                {/* Correct Answer */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium mb-1">Correct Answer:</div>
                  <div className="text-lg">
                    {mode === "word-to-definition" ? currentWord?.definition : currentWord?.word}
                  </div>
                </div>

                <Button onClick={nextWord} className="w-full">
                  Next Word
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Word Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Word Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{currentWord?.attempts || 0}</div>
                <div className="text-sm text-gray-600">Attempts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{currentWord?.correct || 0}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {currentWord?.attempts > 0 ? Math.round((currentWord.correct / currentWord.attempts) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
