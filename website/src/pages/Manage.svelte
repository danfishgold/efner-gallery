<script lang="ts">
  import LogIn from '../LogIn.svelte'
  import Nav from '../Nav.svelte'
  import { user } from '../sessionStore'
  import Uploads from '../Uploads.svelte'
</script>

<Nav />
<main>
  {#if $user}
    <Uploads />
  {:else}
    <LogIn />
  {/if}
</main>
