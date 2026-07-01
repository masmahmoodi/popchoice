import express from "express"
import cors from "cors"

import "dotenv/config"
import OpenAI from "openai"
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions"
import { createClient } from "@supabase/supabase-js"

const app = express()
const PORT = 3001
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const openaiApiKey = process.env.OPENAI_API_KEY

app.use(cors())
app.use(express.json())

if (!supabaseUrl) {
  throw new Error("Missing SUPABASE_URL")
}

if (!supabaseServiceRoleKey) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY")
}

if (!openaiApiKey) {
  throw new Error("Missing OPENAI_API_KEY")
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

const openai = new OpenAI({
  apiKey: openaiApiKey,
})



app.get("/", (_req, res) => {
  res.json({ message: "PopChoice server is running" })
})

app.post("/api/recommend", async (req, res) => {
  try {
    const { mood, length, genre, preferenceText } = req.body

    const query = `I am looking for a ${length} ${mood} ${genre} movie. ${preferenceText}`
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    })
    const embedding = embeddingResponse.data[0].embedding

    const { data, error } = await supabase.rpc("match_movies", {
      query_embedding: embedding,
      match_count: 5,
    })

    if (error) {
      throw error
    }
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content:
          "You are a movie recommendation assistant. Recommend only one movie from the provided list and explain why it fits the query in one sentence.",
      },
      {
        role: "user",
        content: `Query: ${query}\nMatches: ${JSON.stringify(data)}`,
      },
    ]
    const movie = data?.[0] ?? null
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages,
    })
    console.log("Recommendation query:", query)
    console.log("Top match:", movie)
    const explanation = gptResponse.choices[0].message.content
    res.json({
      query,
      movie,
      matches: data ?? [],
      explanation,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: "Failed to get recommendation",
      details: error instanceof Error ? error.message : String(error),
      movie: null,
      query: "",
    })
  }
})



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
