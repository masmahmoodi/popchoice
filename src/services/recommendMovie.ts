import { movies } from "../data/movies"
import type { Movie, MovieMood, MovieLength, MovieGenre, } from "../types/movie"

type RecommendMovieOptions = {
  mood: MovieMood
  length: MovieLength
  genre: MovieGenre 
  preferenceText: string
}


function getRandomMovie(movieList: Movie[]): Movie {
  return movieList[Math.floor(Math.random() * movieList.length)]
}



function buildRecommendationQuery(
    mood: MovieMood,
    length: MovieLength,
    genre: MovieGenre,
    preferenceText: string): string {

      const query = `I am looking for a ${length} ${mood} ${genre} movie. ${preferenceText}`
      return query
  }

export function recommendMovie({
  mood,
  length,
  genre,
  preferenceText
}: RecommendMovieOptions): Movie | null {
  const matchedMovies = movies.filter((movie) => {
    const moodMatches = movie.mood === mood
    const lengthMatches = length === "no preference" || movie.length === length
    const genreMatches = genre === "no preference" || movie.genre === genre

    return moodMatches && lengthMatches && genreMatches
  })

  void buildRecommendationQuery(mood, length, genre, preferenceText)

  if (matchedMovies.length === 0) {
    return null
  }


  return getRandomMovie(matchedMovies)
}
