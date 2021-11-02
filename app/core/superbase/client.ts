import { createClient } from "@supabase/supabase-js"
import { assert } from "../utils/common"

assert(
  process.env.BLITZ_PUBLIC_SUPERBASE_PUBLIC_KEY,
  "You must provide the BLITZ_PUBLIC_SUPERBASE_PUBLIC_KEY env variable"
)
assert(
  process.env.BLITZ_PUBLIC_SUPERBASE_URL,
  "You must provide the BLITZ_PUBLIC_SUPERBASE_URL env variable"
)

const superbaseClient = createClient(
  process.env.BLITZ_PUBLIC_SUPERBASE_URL as string,
  process.env.BLITZ_PUBLIC_SUPERBASE_PUBLIC_KEY as string
)

export default superbaseClient
