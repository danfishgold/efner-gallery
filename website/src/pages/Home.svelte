<script lang="ts">
  import { encodeImageData } from '../coding'
  import { user } from '../sessionStore'

  import { submitArt } from '../db'

  import { ditherImageOnCanvas } from '../dither'
  import Nav from '../Nav.svelte'

  let imageData: ImageData | undefined
  let files: FileList | undefined
  let canvas: HTMLCanvasElement | undefined
  let status:
    | 'new'
    | 'pendingSubmission'
    | 'submitting'
    | 'success'
    | 'failure' = 'new'
  let fileInput: HTMLInputElement
  let name = ''
  let artist = ''

  async function onFileUpload(event: Event) {
    const file = files?.[0]
    if (!file || !canvas) {
      imageData = undefined
      return
    }

    imageData = await ditherImageOnCanvas(file, canvas)
    status = 'pendingSubmission'
  }

  async function onSubmit(event: SubmitEvent) {
    if (!imageData) {
      return
    }
    try {
      status = 'submitting'
      const pixels = encodeImageData(imageData)
      const response = await submitArt(pixels, name, artist)
      status = 'success'
      console.log('Submission succeeded')
      console.log({ pixels, name, artist, response })
    } catch (error) {
      console.error('Submission failed')
      console.error(error)
      status = 'failure'
    }
  }
</script>

<Nav />
<main>
  <div class="intro">
    <h1>גלריה אפנר</h1>
    <p>212 על 104 פיקסלים</p>
    <p>(לרוחב)</p>
    <p>שחור לבן בלבד</p>
    <p>גם לא אפור</p>
    <p>שיהיה יפה דיר בלאק</p>
  </div>
  <form on:submit|preventDefault={onSubmit}>
    <canvas
      width="212"
      height="104"
      bind:this={canvas}
      hidden={status !== 'pendingSubmission'}
    />
    {#if status === 'new'}
      <input
        type="file"
        id="file-input"
        accept="image/*"
        bind:files
        bind:this={fileInput}
        on:change={onFileUpload}
      />
      <button type="button" on:click={() => fileInput.click()}
        >תביאו קובץ</button
      >
    {:else if status === 'pendingSubmission'}
      <div>
        <label for="name-input">שם היצירה (לא חייב)</label><input
          id="name-input"
          bind:value={name}
        />
      </div>
      <div>
        <label for="artist-input">שם האמן.ית (לא חייב)</label><input
          id="artist-input"
          bind:value={artist}
        />
      </div>
      <button type="submit">יאללה</button>
    {:else if status === 'submitting'}
      <span>רק רגע אחד</span>
    {:else if status === 'success'}
      <span>האמנות נשלחה בהצלחה. תודה על האמנות.</span>
    {:else if status === 'failure'}
      <span>היתה בעיה עם האמנות. אנא נסו שנית</span>
    {/if}
  </form>
</main>

<style scoped>
  main {
    flex-grow: 1;
    padding-top: 1rem;
  }
  .intro h1,
  .intro p {
    font-size: 5rem;
    line-height: 0.85;
    margin: 0;
  }

  @media (max-width: 700px) {
    .intro h1,
    .intro p {
      font-size: 13vw;
    }
  }
</style>
