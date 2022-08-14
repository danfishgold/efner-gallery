<script lang="ts">
  import { onMount } from 'svelte'
  import { decodeImageData } from './coding'

  import { deleteArt, type DBArt } from './db'
  import { user } from './sessionStore'

  export let art: DBArt
  let canvas: HTMLCanvasElement | undefined
  let deleted = false

  onMount(() => {
    if (!canvas) {
      return
    }

    const imageData = decodeImageData(art.pixels, canvas.width, canvas.height)
    const ctx = canvas.getContext('2d')!
    ctx.putImageData(imageData, 0, 0)
  })

  const formatter = Intl.DateTimeFormat('he-IL', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  async function onDelete() {
    if (confirm('בטוח בטוח?')) {
      try {
        await deleteArt(art.id)
        deleted = true
      } catch (error) {
        console.log(error)
      }
    }
  }
</script>

<div class="art-item {deleted && 'art-item--deleted'}">
  <canvas bind:this={canvas} width="212" height="104" />
  <div class="metadata">
    <div class="artist">{art.artist || 'אמן לא ידוע'}</div>
    <div class="name-and-date">
      <strong>{art.name || 'ללא שם'}</strong>, {formatter.format(
        new Date(art.created_at),
      )}
    </div>
    {#if $user}
      <button disabled={deleted} on:click={onDelete}>מחיקה</button>
    {/if}
  </div>
</div>

<style scoped>
  .art-item {
    padding: 1rem;
    display: flex;
    flex-direction: row;
    align-items: start;
    gap: 1rem;
  }

  .art-item--deleted {
    opacity: 0.5;
  }

  @media (max-width: 600px) {
    .art-item {
      flex-direction: column;
    }
  }

  .metadata {
    align-items: start;
    text-align: start;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .artist {
    font-size: 1.1rem;
    font-weight: bold;
  }
</style>
