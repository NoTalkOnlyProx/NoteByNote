<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
    import { GlobalSettings } from "src/engine/GlobalSettings";
    import { ALL_TUNINGS, GenerateTuning, GenerateTuningCents, getTuning, packTuning, unpackTuning, type Tuning } from 'src/engine/Tuning';
    let load_selection : string = "current";
    let EDN = 2;
    let notes = 12;
    let cents = 0;
    let current_tuning = "idk";
    let editing_name = "unnamed";
    let usingCents = false;
    $: cents = Number((Math.log2(EDN)/notes * 1200).toFixed(2));
    $: onChangeSelection(load_selection);

    let cb : ()=>void;
    onMount(() => {
        cb = GlobalSettings.onUpdateSettings(()=>{
            load_selection = "current";
        });
	});

    onDestroy(() => {
        GlobalSettings.clearListener(cb);
	});

    function autoGenerate() {
        let notesTuning = packTuning(GenerateTuning(`${notes}ED${EDN}`, notes, EDN));
        let centsTuning = packTuning(GenerateTuningCents(`${cents}_CENTS`, cents));
        tuning_raw = usingCents ? centsTuning : notesTuning;
        onChange();
    }

    function onChange() {
        load_selection="unsaved";
        editing_name="unnamed";
        let tuning = unpackTuning(tuning_raw);
        if (tuning) {
            editing_name = tuning.name;
        }
    }

    function onChangeSelection(nsel : string) {
        if (nsel == "unsaved") {
            return;
        }
        if (nsel == "current") {
            let profile = GlobalSettings.getActiveProfile();
            current_tuning = profile?.tuning?.name ?? "none";
            tuning_raw = packTuning(profile.tuning);
            return;
        }
        load_selection = "unsaved";
        editing_name = nsel;
        tuning_raw = packTuning(getTuning(nsel) ?? GenerateTuning("12ED2", 12, 2));
    }

    function saveTuning() {
        if (load_selection == "current") {
            return;
        }
        let profile = GlobalSettings.getActiveProfile();
        profile.tuning = unpackTuning(tuning_raw) ?? profile.tuning;
        load_selection = "current";
        GlobalSettings.updateSettings();
    }

    function useNotes() {
        usingCents = false;
    }

    function useCents() {
        usingCents = true;
    }

    let tuning_raw : string = "";
</script>
<div>Choose, design, or import tuning</div>
<div class="buttons">
    <select bind:value={load_selection}>
        <option value="current">current: {current_tuning}</option>
        {#if load_selection=="unsaved"}
            <option value="unsaved">unsaved: {editing_name}</option>
        {/if}
        {#each ALL_TUNINGS as tuning}
            <option value="{tuning.name}">{tuning.name}</option>
        {/each}
    </select>
    <button on:click={saveTuning}>Save</button>
</div>
<textarea class="widetext" bind:value={tuning_raw} on:input={onChange} on:change={onChange}></textarea>
<div class="buttons"  style="padding:2px;">
    <div class="buttons" class:selected={!usingCents} style="flex:1;">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div on:click={useNotes}>Notes:</div>
        <input type="number" bind:value={notes} on:focus={useNotes} style="width:50px"/>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div on:click={useNotes}>ED:</div>
        <input type="number" bind:value={EDN} on:focus={useNotes} style="width:50px"/>
    </div>
    <div class="buttons" class:selected={usingCents} style="flex:1;">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div on:click={useCents}>Cents:</div>
        <input type="number" bind:value={cents}  on:focus={useCents} style="width:100px"/>
    </div>
</div>
<div class="buttons">
    <button on:click={autoGenerate}>Generate</button>
</div>
<style>
    .widetext {
        box-sizing: border-box; 
        width:400px;
        height:100%;
    }
    .buttons {
        display: flex;
    }
    .buttons > button {
        flex: 1;
    }
    .buttons > div {
        padding-left:2px;
    }
    .selected {
        outline-width: 2px;
        outline-color: seagreen;
        outline-style: solid;
    }
</style>