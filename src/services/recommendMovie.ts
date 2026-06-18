import { movies } from "../data/movies"
import type { Movie, MovieMood, MovieLength, MovieGenre } from "../types/movie"

type RecommendMovieOptions = {
  mood: MovieMood
  length: MovieLength
  genre: MovieGenre
}

function getRandomMovie(movieList: Movie[]): Movie {
  return movieList[Math.floor(Math.random() * movieList.length)]
}

export function recommendMovie({
  mood,
  length,
  genre,
}: RecommendMovieOptions): Movie | null {
  const matchedMovies = movies.filter((movie) => {
    const moodMatches = movie.mood === mood
    const lengthMatches = length === "no preference" || movie.length === length
    const genreMatches = genre === "no preference" || movie.genre === genre

    return moodMatches && lengthMatches && genreMatches
  })

  if (matchedMovies.length === 0) {
    return null
  }

  return getRandomMovie(matchedMovies)
}