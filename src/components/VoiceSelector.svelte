<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
    import {TrainingVoices} from "src/engine/TrainingVoices";

    let { value = undefined, onblur, onchange } = $props();
    let voices = $state(TrainingVoices.getAllGoodVoices());

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
<input list="voices" bind:value={value} onblur={onblur} onchange={onchange} />
<datalist id="voices">
    {#each voices as voice}
        <option value="{voice}"></option>
    {/each}
</datalist>

<style>
.hidden {
    font-size: 0;
}
</style>