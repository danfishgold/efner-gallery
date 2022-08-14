<script lang="ts">
  import ArtItem from './ArtItem.svelte'
  import { fetchAllArt, fetchCurrentArt } from './db'
  import Error from './Error.svelte'
</script>

<div>
  <h1>ניהול</h1>
  <h2>מוצג כעת</h2>
  {#await fetchCurrentArt()}
    <div>טוען</div>
  {:then art}
    {#if art}
      <ArtItem {art} />
    {/if}
  {:catch error}
    <Error {error} />
  {/await}
  <h2>כל האמנויות (מהחדש לישן)</h2>
  {#await fetchAllArt()}
    <div>טוען</div>
  {:then allArts}
    {#each allArts as art}
      <ArtItem {art} />
    {/each}
  {:catch error}
    <Error {error} />
  {/await}
</div>
