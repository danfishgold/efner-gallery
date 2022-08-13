<script lang="ts">
  import { link } from 'svelte-spa-router'
  import { signOut } from './db'

  import LogIn from './LogIn.svelte'
  import { user } from './sessionStore'
  import Uploads from './Uploads.svelte'
</script>

<nav>
  <a use:link href="/">עמוד הבית</a>
  {#if $user}
    <button on:click={() => signOut()}>התנתקות</button>
  {/if}
</nav>
{#if $user}
  <Uploads />
{:else}
  <LogIn />
{/if}

<style scoped>
  nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    margin: 1rem 0;
  }
</style>
