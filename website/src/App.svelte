<script lang="ts">
  import Router from 'svelte-spa-router'
  import { supabase } from './db'
  import About from './pages/About.svelte'
  import Home from './pages/Home.svelte'
  import Manage from './pages/Manage.svelte'
  import Now from './pages/Now.svelte'
  import { user } from './sessionStore'

  user.set(supabase.auth.user())

  console.log({ user: supabase.auth.user() })
  supabase.auth.onAuthStateChange((state, session) => {
    console.log({ user: session?.user ?? null, session, state })
    user.set(state === 'SIGNED_IN' ? session?.user ?? null : null)
  })

  const routes = {
    '/': Home,
    '/manage': Manage,
    '/now': Now,
    '/what': About,
  }
</script>

<Router {routes} />
