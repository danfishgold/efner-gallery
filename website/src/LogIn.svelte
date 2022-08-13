<script lang="ts">
  import type { ApiError } from '@supabase/supabase-js'

  import { signIn } from './db'

  let state:
    | { type: 'notSubmitted' }
    | { type: 'loading' }
    | { type: 'failure'; error: ApiError } = { type: 'notSubmitted' }
  let email = ''
  let password = ''

  const onSubmit = async () => {
    if (!email || !password) {
      return
    }
    try {
      state = { type: 'loading' }
      await signIn(email, password)
    } catch (error) {
      state = { type: 'failure', error: error as ApiError }
    }
  }
</script>

<form
  on:submit|preventDefault={onSubmit}
  disabled={state.type !== 'notSubmitted'}
>
  <div>
    <h1>לוגין וכו׳</h1>
    <div class="fields">
      <label for="email">אימייל</label>
      <input dir="ltr" type="email" id="email" bind:value={email} />
      <label for="password">סיסמה</label>
      <input dir="ltr" type="password" id="password" bind:value={password} />
    </div>
    <div>
      <button type="submit"
        >{state.type === 'loading' ? 'טוען' : 'התחברות'}</button
      >
    </div>
    {#if state.type === 'failure'}
      <div>{state.error.message}</div>
    {/if}
  </div>
</form>

<style scoped>
  .fields {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 1rem;
    row-gap: 0.5rem;
    margin-bottom: 1rem;
  }
</style>
