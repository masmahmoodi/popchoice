import { useState } from "react"
import { movies } from "./data/movies"
import type {Movie, MovieMood, MovieLength, MovieGenre} from "./types/movie"

type Screen = "start" | "questions" | "result"

export default function App() {
  const [screen, setScreen] = useState<Screen>("start")
  const [mood, setMood] = useState<MovieMood | null>(null)
  const [length, setLength] = useState<MovieLength>("no preference")
  const [recommendedMovie, setRecommendedMovie] = useState<Movie | null>(null)
  const [genre, setGenre] = useState<MovieGenre>("no preference")
  const matchedMovies = movies.filter((movie) => {
  const moodMatches = movie.mood === mood
  const lengthMatches = length === "no preference" || movie.length === length
  const genreMatches = genre === "no preference" || movie.genre === genre

  return moodMatches && lengthMatches && genreMatches
})

  

  function start() {
    setScreen("questions")
  }

 function getRandomMovie(movieList: Movie[]) {
  return movieList[Math.floor(Math.random() * movieList.length)]
}

  function getMovie() {
    if (!mood) {
      return
    }
    if (matchedMovies.length === 0) {
        setRecommendedMovie(null)
        setScreen("result")
        return
    }

    const randomMovie = getRandomMovie(matchedMovies)
    setRecommendedMovie(randomMovie)
    setScreen("result")
  }

  function tryAgain(){
    setRecommendedMovie(null)
    setMood(null)
    setLength("no preference")
    setGenre("no preference")
    setScreen("questions")
  }
  

  if (screen === "start") {
    return (
      <button type="button" onClick={start}>
        Start
      </button>
    )
  }

  if (screen === "questions") {
    return (
      <div>
        <p>What mood are you in?</p>

        <button type="button" onClick={() => setMood("fun")}>
          Fun
        </button>

        <button type="button" onClick={() => setMood("serious")}>
          Serious
        </button>

        <button type="button" onClick={() => setMood("action")}>
          Action
        </button>

        <button type="button" onClick={() => setMood("surprise")}>
          Surprise
        </button>
        <p>Durations</p>
        <button type="button" onClick={() => setLength("short")}>
          Short
        </button>
        <button type="button" onClick={() => setLength("medium")}>
          Medium
        </button>
        <button type="button" onClick={() => setLength("long")}>
          Long
        </button>
        <button type="button" onClick={() => setLength("no preference")}>
          No Preference
        </button>

        <button type="button" onClick={() => setGenre("fantasy")}>
          Fantasy
        </button>
        <button type="button" onClick={() => setGenre("drama")}>
          Drama
        </button>
        <button type="button" onClick={() => setGenre("adventure")}>
          Adventure
        </button>
        <button type="button" onClick={() => setGenre("comedy")}>
          Comedy
        </button>
        <button type="button" onClick={() => setGenre("history")}>
          History
        </button>
        <button type="button" onClick={() => setGenre("animation")}>
          Animation
        </button>
        <button type="button" onClick={() => setGenre("thriller")}>
          Thriller
        </button>
        <button type="button" onClick={() => setGenre("no preference")}>
          No Preference
        </button>

        {mood && <p>You selected: {mood}</p>}
        {length === "no preference" ? null : <p>You selected: {length}</p>}
        {genre === "no preference" ? null : <p>You selected: {genre}</p>}

        <button type="button" disabled={!mood} onClick={getMovie}>
          Get Movie
        </button>
      </div>
    )
  }

  if (!recommendedMovie) {
  return (
    <div>
      <p>No movie found.</p>
      <button type="button" onClick={tryAgain}>
        Try again
      </button>
    </div>
  )
}

  return (
  <div>
    <h2>{recommendedMovie.title}</h2>
    <p>Released: {recommendedMovie.releaseYear}</p>
    <p>{recommendedMovie.content}</p>

    <button type="button" onClick={tryAgain}>
      Try again
    </button>
  </div>
)
}