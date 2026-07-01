import type { MovieMood, MovieLength, MovieGenre, MatchedMovie } from "../types/movie"
type FetchRecommendationOptions = {
  mood: MovieMood
  length: MovieLength
  genre: MovieGenre
  preferenceText: string
}

type FetchRecommendationResult = {
  query: string
  movie: MatchedMovie | null
  matches: MatchedMovie[]
}

export async function fetchRecommendation({
  mood,
  length,
  genre,
  preferenceText,
}: FetchRecommendationOptions): Promise<FetchRecommendationResult> {
  const response = await fetch("http://localhost:3001/api/recommend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mood,
      length,
      genre,
      preferenceText,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    throw new Error(errorBody?.details ?? "Failed to fetch recommendation")
  }

  return response.json()
}
