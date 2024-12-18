<script lang="ts">
    import {TrainingVoices} from "src/engine/TrainingVoices";
    export let value : string;
    let voices = TrainingVoices.getAllGoodVoices();
    TrainingVoices.onVoicesUpdated(()=>{
        voices = TrainingVoices.getAllGoodVoices();
    })
</script>

<span class="hidden">{value}</span>
<input list="voices" bind:value={value} on:blur/>
<datalist id="voices">
    {#each voices as voice}
        <option value="{voice}">
    {/each}
</datalist>

<style>
.hidden {
    font-size: 0;
}
</style>