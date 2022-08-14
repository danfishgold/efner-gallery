<script lang="ts">
  import { link, location } from 'svelte-spa-router'
  import { signOut } from './db'

  import { user } from './sessionStore'
</script>

<nav>
  <div class="logo">
    <span>{'{'}</span>
    <span class="spacer" />
    <span>{'א'}</span>
    <span class="spacer" />
    <span>{'}'}</span>
  </div>
  <a use:link={{ disabled: $location === '/' }} href="/">הגשה</a>
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
    flex-wrap: wrap;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    margin: 1rem 0 2rem;
  }

  .logo {
    font-weight: bold;
    font-size: 1.3rem;
    width: 4ch;
    display: flex;
    justify-content: center;
    text-align: center;
    cursor: default;
  }

  .logo .spacer {
    transition: width 0.2s;
    width: 0;
  }
  .logo:hover .spacer {
    width: 0.5ch;
  }
</style>
