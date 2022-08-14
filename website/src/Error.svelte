<script lang="ts">
  import type { ApiError } from '@supabase/supabase-js'

  import { user } from './sessionStore'
  export let error: ApiError
</script>

<div>אירעה שגיאה. מה חבל</div>
{#if $user}
  <div>{JSON.stringify(error)}</div>
{/if}
