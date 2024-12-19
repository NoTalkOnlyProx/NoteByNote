<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
    import {TrainingVoices} from "src/engine/TrainingVoices";
    export let value : string;
    let voices = TrainingVoices.getAllGoodVoices();

    let cb : ()=>void;
    onMount(() => {
        cb = TrainingVoices.onVoicesUpdated(()=>{
            voices = TrainingVoices.getAllGoodVoices();
        });
	});

    onDestroy(() => {
        TrainingVoices.clearListener(cb);
	});
</script>

<span class="hidden">{value}</span>
<input list="voices" bind:value={value} on:blur on:change/>
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