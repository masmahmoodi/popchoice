import { useState, type ChangeEvent, type ReactNode } from "react"
import type { MovieMood, MovieLength, MovieGenre, MatchedMovie } from "./types/movie"
import { OptionGroup } from "./components/OptionGroup"
import { fetchRecommendation } from "./services/fetchRecommendation"

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

function AppShell({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <section className="relative w-full max-w-[390px] overflow-hidden rounded-[2.5rem] border border-slate-600/70 bg-slate-950 p-5 shadow-2xl shadow-black/50">
        <div className="absolute left-1/2 top-0 h-7 w-32 -translate-x-1/2 rounded-b-3xl bg-black" />
        <div className="min-h-[720px] rounded-[2rem] bg-[#06123a] px-6 py-12">
          {children}
        </div>
      </section>
    </main>
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("start")
  const [mood, setMood] = useState<MovieMood | null>(null)
  const [length, setLength] = useState<MovieLength>("no preference")
  const [recommendedMovie, setRecommendedMovie] = useState<MatchedMovie | null>(null)
  const [genre, setGenre] = useState<MovieGenre>("no preference")
  const [preferenceText, setPreferenceText] = useState("")
  const [recommendationQuery, setRecommendationQuery] = useState("")
  const [matches, setMatches] = useState<MatchedMovie[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  function start() {
    setScreen("questions")
  }

  async function getMovie() {
    if (!mood) {
      return
    }

    setIsLoading(true)
    setErrorMessage("")

    try {
      const recommendation = await fetchRecommendation({
        mood,
        length,
        genre,
        preferenceText,
      })

      setRecommendedMovie(recommendation.movie)
      setMatches(recommendation.matches)
      setRecommendationQuery(recommendation.query)
      setScreen("result")
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to get recommendation")
    } finally {
      setIsLoading(false)
    }
  }

  function tryAgain() {
    setRecommendedMovie(null)
    setMood(null)
    setLength("no preference")
    setGenre("no preference")
    setScreen("questions")
    setPreferenceText("")
    setRecommendationQuery("")
    setMatches([])
    setErrorMessage("")
  }

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setPreferenceText(e.target.value)
  }

  function nextMovie() {
    if (matches.length === 0) {
      return
    }

    const randomIndex = Math.floor(Math.random() * matches.length)
    setRecommendedMovie(matches[randomIndex])
  }

  if (screen === "start") {
    return (
      <AppShell>
        <div className="flex min-h-[620px] flex-col items-center justify-center text-center">
          <p className="mb-4 text-6xl font-black leading-none">Pop</p>
          <h1 className="text-5xl font-black text-white">PopChoice</h1>
          <p className="mt-4 max-w-64 text-sm leading-6 text-slate-300">
            Find a movie from your saved collection using mood, genre, and AI-powered search.
          </p>
          <button
            type="button"
            onClick={start}
            className="mt-10 w-full rounded-lg bg-emerald-400 px-6 py-4 text-xl font-black text-slate-950 shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-300"
          >
            Start
          </button>
        </div>
      </AppShell>
    )
  }

  if (screen === "questions") {
    return (
      <AppShell>
        <div className="space-y-7">
          <header className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
              PopChoice
            </p>
            <h1 className="mt-2 text-3xl font-black text-white">Build your movie vibe</h1>
          </header>

          <OptionGroup
            title="What mood are you in?"
            options={moodOptions}
            value={mood}
            onSelect={(option) => setMood(option as MovieMood)}
          />

          <OptionGroup
            title="How long do you want the movie to be?"
            options={lengthOptions}
            value={length}
            onSelect={(option) => setLength(option as MovieLength)}
          />

          <OptionGroup
            title="What genre are you in the mood for?"
            options={genreOptions}
            value={genre}
            onSelect={(option) => setGenre(option as MovieGenre)}
          />

          <label className="block space-y-3">
            <span className="text-base font-bold text-slate-100">Anything specific?</span>
            <textarea
              value={preferenceText}
              onChange={handleChange}
              placeholder="make me laugh"
              className="min-h-28 w-full resize-none rounded-lg border border-slate-600 bg-slate-800/90 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/30"
            />
          </label>

          <div className="space-y-1 text-sm text-slate-300">
            {mood && <p>Mood: {mood}</p>}
            {length !== "no preference" && <p>Length: {length}</p>}
            {genre !== "no preference" && <p>Genre: {genre}</p>}
          </div>

          {errorMessage && (
            <p className="rounded-lg border border-red-400/40 bg-red-500/10 p-3 text-sm font-semibold text-red-200">
              {errorMessage}
            </p>
          )}

          <button
            type="button"
            disabled={!mood || isLoading}
            onClick={getMovie}
            className="w-full rounded-lg bg-emerald-400 px-6 py-4 text-xl font-black text-slate-950 shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
          >
            {isLoading ? "Finding..." : "Get Movie"}
          </button>
        </div>
      </AppShell>
    )
  }

  if (!recommendedMovie) {
    return (
      <AppShell>
        <div className="flex min-h-[620px] flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-black text-white">No movie found</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Try a broader mood or genre and search again.
          </p>
          <button
            type="button"
            onClick={tryAgain}
            className="mt-8 w-full rounded-lg bg-emerald-400 px-6 py-4 text-xl font-black text-slate-950 transition hover:bg-emerald-300"
          >
            Try Again
          </button>
        </div>
      </AppShell>
    )
  }

  const matchesToDisplay = matches.map((match) => (
    <li
      key={match.id}
      className={`rounded-md px-3 py-2 text-sm ${
        match.id === recommendedMovie.id
          ? "bg-emerald-400 text-slate-950"
          : "bg-slate-800 text-slate-200"
      }`}
    >
      {match.title}
    </li>
  ))

  return (
    <AppShell>
      <div className="space-y-6">
        <header className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Your match
          </p>
          <h1 className="mt-2 text-3xl font-black leading-tight text-white">
            {recommendedMovie.title}
          </h1>
        </header>

        <section className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Query</p>
          <p className="rounded-lg bg-slate-800/80 p-3 text-sm leading-6 text-slate-200">
            {recommendationQuery}
          </p>
        </section>

        <section className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Movie</p>
          <p className="text-base leading-7 text-slate-100">{recommendedMovie.content}</p>
          <p className="text-sm font-semibold text-emerald-300">
            Similarity: {recommendedMovie.similarity.toFixed(3)}
          </p>
        </section>

        <section className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
            Top matches
          </p>
          <ul className="space-y-2">{matchesToDisplay}</ul>
        </section>

        <div className="grid gap-3">
          <button
            type="button"
            onClick={nextMovie}
            className="rounded-lg bg-emerald-400 px-6 py-4 text-xl font-black text-slate-950 transition hover:bg-emerald-300"
          >
            Next Movie
          </button>
          <button
            type="button"
            onClick={tryAgain}
            className="rounded-lg border border-slate-600 px-6 py-3 text-sm font-bold text-slate-100 transition hover:bg-slate-800"
          >
            Try Again
          </button>
        </div>
      </div>
    </AppShell>
  )
}
