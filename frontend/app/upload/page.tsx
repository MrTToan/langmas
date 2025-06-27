"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Word {
  id: string
  word: string
  definition: string
  learned: boolean
  attempts: number
  correct: number
}

export default function UploadPage() {
  const [words, setWords] = useState<Word[]>([])
  const [newWord, setNewWord] = useState("")
  const [newDefinition, setNewDefinition] = useState("")
  const [csvContent, setCsvContent] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/csv") {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setCsvContent(content)
        parseCsvContent(content)
      }
      reader.readAsText(file)
    }
  }

  const parseCsvContent = (content: string) => {
    const lines = content.split("\n").filter((line) => line.trim())
    const parsedWords: Word[] = []

    lines.forEach((line, index) => {
      // Skip header row if it exists
      if (index === 0 && (line.toLowerCase().includes("word") || line.toLowerCase().includes("definition"))) {
        return
      }

      const [word, definition] = line.split(",").map((item) => item.trim().replace(/"/g, ""))
      if (word && definition) {
        parsedWords.push({
          id: Date.now().toString() + index,
          word,
          definition,
          learned: false,
          attempts: 0,
          correct: 0,
        })
      }
    })

    setWords(parsedWords)
  }

  const handleManualCsvParse = () => {
    if (csvContent.trim()) {
      parseCsvContent(csvContent)
    }
  }

  const addSingleWord = () => {
    if (newWord.trim() && newDefinition.trim()) {
      const word: Word = {
        id: Date.now().toString(),
        word: newWord.trim(),
        definition: newDefinition.trim(),
        learned: false,
        attempts: 0,
        correct: 0,
      }
      setWords([...words, word])
      setNewWord("")
      setNewDefinition("")
    }
  }

  const removeWord = (id: string) => {
    setWords(words.filter((w) => w.id !== id))
  }

  const saveWords = () => {
    if (words.length > 0) {
      // Get existing words from localStorage
      const existingWords = localStorage.getItem("vocabulary-words")
      const allWords = existingWords ? JSON.parse(existingWords) : []

      // Add new words
      const updatedWords = [...allWords, ...words]
      localStorage.setItem("vocabulary-words", JSON.stringify(updatedWords))

      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Import Vocabulary</h1>
          <p className="text-gray-600">Add words to your vocabulary collection</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* CSV Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload CSV File
              </CardTitle>
              <CardDescription>Upload a CSV file with words and definitions (word,definition format)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="csv-file">Choose CSV File</Label>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="mt-1"
                />
              </div>
              <div className="text-sm text-gray-500">Expected format: word,definition (one pair per line)</div>
            </CardContent>
          </Card>

          {/* Manual CSV Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Paste CSV Content
              </CardTitle>
              <CardDescription>Paste CSV content directly or connect with Google Sheets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="csv-content">CSV Content</Label>
                <Textarea
                  id="csv-content"
                  placeholder="word1,definition1&#10;word2,definition2&#10;..."
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  className="mt-1 h-24"
                />
              </div>
              <Button onClick={handleManualCsvParse} className="w-full">
                Parse CSV Content
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Add Single Word */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Single Word
            </CardTitle>
            <CardDescription>Add individual words and definitions manually</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="word">Word</Label>
                <Input
                  id="word"
                  placeholder="Enter word"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="definition">Definition</Label>
                <Input
                  id="definition"
                  placeholder="Enter definition"
                  value={newDefinition}
                  onChange={(e) => setNewDefinition(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={addSingleWord} disabled={!newWord.trim() || !newDefinition.trim()}>
              Add Word
            </Button>
          </CardContent>
        </Card>

        {/* Preview Words */}
        {words.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Preview ({words.length} words)</CardTitle>
              <CardDescription>Review your words before saving</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {words.map((word) => (
                  <div key={word.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium">{word.word}</span>
                      <span className="text-gray-600 ml-2">- {word.definition}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => removeWord(word.id)}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={saveWords} className="flex-1">
                  Save {words.length} Words
                </Button>
                <Button variant="outline" onClick={() => setWords([])}>
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
