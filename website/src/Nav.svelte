<script lang="ts">
  import { link, location } from 'svelte-spa-router'
  import { signOut } from './db'

  import { user } from './sessionStore'
</script>

<nav>
  {#if $location !== '/'}
    <a use:link href="/">עמוד הבית</a>
  {/if}
  <a use:link={{ disabled: $location === '/what' }} href="/what">מה</a>
  <a use:link={{ disabled: $location === '/now' }} href="/now">כעת</a>
  {#if $user}
    <a use:link={{ disabled: $location === '/manage' }} href="/manage">ניהול</a>
    <button on:click={() => signOut()}>התנתקות</button>
  {/if}
</nav>

<style scoped>
  nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    margin: 1rem 0 2rem;
  }
</style>
