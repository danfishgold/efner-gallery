<script lang="ts">
  import ArtItem from './ArtItem.svelte'

  import { fetchAllArt, fetchCurrentArtId } from './db'

  async function fetchArt() {
    const [allArts, currentArtId] = await Promise.all([
      fetchAllArt(),
      fetchCurrentArtId(),
    ])

    const currentArt = allArts.find((art) => art.id === currentArtId)
    return { allArts, currentArt }
  }

  let art = fetchArt()
</script>

<div>
  {#await art}
    <div>טוען</div>
  {:then { allArts, currentArt }}
    {#if currentArt}
      <h2>מוצג כעת</h2>
      <ArtItem art={currentArt} />
    {/if}
    <h2>כל האמנויות (מהחדש לישן)</h2>
    {#each allArts as art}
      <ArtItem {art} />
    {/each}
  {:catch error}
    <div>שגיאה</div>
    <div>{JSON.stringify(error)}</div>
  {/await}
</div>
