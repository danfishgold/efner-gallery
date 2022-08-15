<script lang="ts">
  import Router, { querystring } from 'svelte-spa-router'
  import { supabase } from './db'
  import About from './pages/About.svelte'
  import Home from './pages/Home.svelte'
  import Manage from './pages/Manage.svelte'
  import Now from './pages/Now.svelte'
  import { openedThroughQRCode, user } from './sessionStore'

  user.set(supabase.auth.user())
  openedThroughQRCode.set($querystring === 'qr')
  supabase.auth.onAuthStateChange((state, session) => {
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
