<script lang="ts">
  import ArtItem from './ArtItem.svelte'
  import { fetchCurrentArt } from './db'
  import Error from './Error.svelte'
  import Nav from './Nav.svelte'
</script>

<Nav />
<main>
  <h1>כעת</h1>
  {#await fetchCurrentArt()}
    <div>טוען</div>
  {:then art}
    {#if art}
      <ArtItem {art} />
    {:else}
      <div>כלום.</div>
    {/if}
  {:catch error}
    <Error {error} />
  {/await}
</main>
