import { useState, type ChangeEvent } from "react"
import type {Movie, MovieMood, MovieLength, MovieGenre} from "./types/movie"
import {recommendMovie} from "./services/recommendMovie"
import {OptionGroup} from "./components/OptionGroup"

type Screen = "start" | "questions" | "result"

const moodOptions: MovieMood[] = ["fun", "serious", "action", "surprise"]
const lengthOptions: MovieLength[] = ["short", "medium", "long", "no preference"]
const genreOptions: MovieGenre[] = [
"fantasy",
"drama",
"adventure",
"comedy",
"history",
"animation",
"thriller",
"no preference",
]
export default function App() {
  const [screen, setScreen] = useState<Screen>("start")
  const [mood, setMood] = useState<MovieMood | null>(null)
  const [length, setLength] = useState<MovieLength>("no preference")
  const [recommendedMovie, setRecommendedMovie] = useState<Movie | null>(null)
  const [genre, setGenre] = useState<MovieGenre>("no preference")
  const [preferenceText, setPreferenceText] = useState<string>("")  
  function start() {
    setScreen("questions")
  }


  function getMovie() {
    if (!mood) {
      return
    }
   

    const randomMovie = recommendMovie({mood, length, genre, preferenceText})
    if (!randomMovie) {
      setRecommendedMovie(null)
      setScreen("result")
      return
    }
    setRecommendedMovie(randomMovie)
    setScreen("result")
  }

  function tryAgain(){
    setRecommendedMovie(null)
    setMood(null)
    setLength("no preference")
    setGenre("no preference")
    setScreen("questions")
    setPreferenceText("")
  }

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setPreferenceText(e.target.value)
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
        <OptionGroup title="What mood are you in?" options={moodOptions} onSelect={(option) => setMood(option as MovieMood)} />
        <OptionGroup title="How long do you want the movie to be?" options={lengthOptions} onSelect={(option)=>setLength(option as MovieLength)} />
        <OptionGroup title="What genre are you in the mood for?" options={genreOptions} onSelect={(option)=>setGenre(option as MovieGenre)} />
        <textarea value={preferenceText} onChange={handleChange}></textarea>

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
    <p>Genre: {recommendedMovie.genre}</p>
    <p>Length: {recommendedMovie.length}</p>
    <p>Released: {recommendedMovie.releaseYear}</p>
    <p>{recommendedMovie.content}</p>

    <button type="button" onClick={tryAgain}>
      Try again
    </button>
  </div>
)
}