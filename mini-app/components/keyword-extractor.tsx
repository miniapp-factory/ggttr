"use client";

import { useState } from "react";

/**
 * A simple keyword extractor component.
 *
 * Features:
 *   - Accepts text input from the user or a file.
 *   - Extracts the most frequent words (ignoring common stop‑words).
 *   - Highlights the extracted keywords in the original text by surrounding them with **.
 *   - Allows the user to adjust how many keywords to extract.
 *
 * This implementation uses a very lightweight frequency‑based approach
 * rather than a full TF‑IDF pipeline, which keeps the code short
 * and easy to understand while still producing useful results.
 */
export default function KeywordExtractor() {
  const [text, setText] = useState<string>("");
  const [keywordsCount, setKeywordsCount] = useState<number>(5);
  const [highlighted, setHighlighted] = useState<string>("");

  // A small list of common English stop‑words to ignore.
  const stopWords = new Set([
    "the", "and", "a", "to", "of", "in", "that", "it", "is", "was",
    "for", "on", "with", "as", "by", "at", "from", "or", "an", "be",
    "this", "which", "but", "not", "are", "have", "has", "had",
  ]);

  /**
   * Extracts the top N keywords from the given text.
   * @param input The raw text.
   * @param n Number of keywords to return.
   * @returns Array of keyword strings.
   */
  function extractKeywords(input: string, n: number): string[] {
    const freq: Record<string, number> = {};

    // Normalize to lowercase and split on non‑word characters.
    const words = input
      .toLowerCase()
      .split(/[^a-zA-Z0-9]+/)
      .filter(Boolean);

    for (const w of words) {
      if (!stopWords.has(w)) {
        freq[w] = (freq[w] || 0) + 1;
      }
    }

    // Sort words by frequency descending.
    const sorted = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .map(([word]) => word);

    return sorted.slice(0, n);
  }

  /**
   * Highlights the extracted keywords in the original text.
   * @param input Original text.
   * @param keywords Array of keywords to highlight.
   * @returns Text with keywords wrapped in **.
   */
  function highlight(input: string, keywords: string[]): string {
    // Escape regex special characters in keywords.
    const escaped = keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const regex = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");

    return input.replace(regex, "**$1**");
  }

  /**
   * Handles the form submission.
   */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) {
      setHighlighted("");
      return;
    }
    const kws = extractKeywords(text, keywordsCount);
    setHighlighted(highlight(text, kws));
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Keyword Extractor</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          className="w-full h-32 p-2 border rounded"
          placeholder="Enter or paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <label htmlFor="count">Number of keywords:</label>
          <input
            id="count"
            type="number"
            min={1}
            max={20}
            value={keywordsCount}
            onChange={(e) => setKeywordsCount(Number(e.target.value))}
            className="w-16 p-1 border rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Extract
        </button>
      </form>
      {highlighted && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h2 className="font-semibold mb-2">Highlighted Text</h2>
          <pre className="whitespace-pre-wrap">{highlighted}</pre>
        </div>
      )}
    </div>
  );
}
