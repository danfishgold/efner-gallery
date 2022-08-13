import { bool, envsafe, str } from 'envsafe'

export const env = envsafe(
  {
    VITE_SUPABASE_URL: str(),
    VITE_SUPABASE_ANON_KEY: str(),
    DEV: bool(),
  },
  {
    env: import.meta.env,
  },
)
