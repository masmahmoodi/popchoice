import "dotenv/config"
import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"


const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const openaiApiKey = process.env.OPENAI_API_KEY

if (!supabaseUrl) {
  throw new Error("Missing SUPABASE_URL")
}

if (!supabaseServiceRoleKey) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY")
}

if (!openaiApiKey) {
  throw new Error("Missing OPENAI_API_KEY")
}

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

export const openai = new OpenAI({
  apiKey: openaiApiKey,
})


async function getMoviesWithoutEmbeddings() {
  const { data, error } = await supabase
    .from("movies")
    .select("id, title, content")
    .is("embedding", null)

  if (error) {
    throw error
  }

  return data
}

const movies = await getMoviesWithoutEmbeddings()


if (movies.length === 0) {
  console.log("No movies without embeddings found")
  process.exit(0) 
}


for (const movie of movies){
  
  const embeddingResponse = await openai.embeddings.create({
    model:"text-embedding-3-small",
    input:movie.content
  })
  const embedding = embeddingResponse.data[0].embedding
  
  
  const {error} = await supabase.from("movies").update({embedding}).eq("id", movie.id)
  
  if(error){
    throw error
  
  }
  
  console.log("every thing works just fine")
  console.log(embedding.length)
}

console.log("embedding done")