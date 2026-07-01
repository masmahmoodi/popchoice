import "dotenv/config"
import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"

const query = "give me an funny, animation 1+ hour movie "

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

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

const openai = new OpenAI({
  apiKey: openaiApiKey,
})

const embeddingResponse  = await openai.embeddings.create({
    model:"text-embedding-3-small",
    input:query
})


const embedding = embeddingResponse.data[0].embedding

const {data, error} = await supabase.rpc("match_movies", {
    query_embedding: embedding,
    match_count:5,
})

if(error){
    throw error
}
console.log("everything is fine")
console.log(data)


