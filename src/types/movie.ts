export type MovieMood = "fun" | "serious" | "action" | "surprise"
export type MovieLength = "short" | "medium" | "long" | "no preference"
export type MovieGenre =
  | "fantasy"
  | "drama"
  | "adventure"
  | "comedy"
  | "history"
  | "animation"
  | "thriller"
  | "no preference"
  
export type Movie = {
  title: string
  releaseYear: string
  content: string
  mood: MovieMood
  length: MovieLength
  genre: MovieGenre
}


export type MatchedMovie = {
  id: number
  title: string
  content: string
  similarity: number
}