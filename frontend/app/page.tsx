"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Upload, Brain, TrendingUp } from "lucide-react"
import Link from "next/link"

interface Word {
  id: string
  word: string
  definition: string
  learned: boolean
  attempts: number
  correct: number
}

export default function Dashboard() {
  const [words, setWords] = useState<Word[]>([])
  const [stats, setStats] = useState({
    total: 0,
    learned: 0,
    inProgress: 0,
    accuracy: 0,
  })

  useEffect(() => {
    // Load words from localStorage
    const savedWords = localStorage.getItem("vocabulary-words")
    if (savedWords) {
      const parsedWords = JSON.parse(savedWords)
      setWords(parsedWords)

      // Calculate stats
      const total = parsedWords.length
      const learned = parsedWords.filter((w: Word) => w.learned).length
      const inProgress = total - learned
      const totalAttempts = parsedWords.reduce((sum: number, w: Word) => sum + w.attempts, 0)
      const totalCorrect = parsedWords.reduce((sum: number, w: Word) => sum + w.correct, 0)
      const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0

      setStats({ total, learned, inProgress, accuracy })
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Vocabulary Master</h1>
          <p className="text-gray-600">Master English vocabulary with interactive learning</p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Words</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learned</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.learned}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.accuracy}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        {stats.total > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>
                {stats.learned} of {stats.total} words learned
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={(stats.learned / stats.total) * 100} className="w-full" />
            </CardContent>
          </Card>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Import Vocabulary
              </CardTitle>
              <CardDescription>
                Upload a CSV file or connect with Google Sheets to import your vocabulary list
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/upload">
                <Button className="w-full">Import Words</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Start Learning
              </CardTitle>
              <CardDescription>Practice with flashcards and test your knowledge of word definitions</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/learn">
                <Button className="w-full" disabled={stats.total === 0}>
                  {stats.total === 0 ? "Import words first" : "Start Learning"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Words */}
        {words.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Recent Words</CardTitle>
              <CardDescription>Your latest vocabulary additions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {words.slice(0, 5).map((word) => (
                  <div key={word.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium">{word.word}</span>
                      <span className="text-gray-600 ml-2">- {word.definition}</span>
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-xs ${
                        word.learned ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {word.learned ? "Learned" : "Learning"}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
