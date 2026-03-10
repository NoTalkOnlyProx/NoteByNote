<script lang="ts">
    import { untrack } from 'svelte';
	import { onMount, onDestroy } from 'svelte';
    import { GlobalSettings } from "src/engine/GlobalSettings";
    import { ALL_TUNINGS, GenerateTuning, GenerateTuningCents, getTuning, packTuning, unpackTuning, type Tuning } from 'src/engine/Tuning';
    
    let load_selection : string = $state("current");
    let EDN = $state(2);
    let notes = $state(12);
    let current_tuning = $state("idk");
    let editing_name = $state("unnamed");
    let usingCents = $state(false);

    let cents = $derived(Number((Math.log2(EDN)/notes * 1200).toFixed(2)));
    
    $effect(() => {
        load_selection;
    	untrack(()=>{onChangeSelection(load_selection)});
	});

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

    let tuning_raw : string = $state("");
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
    <button onclick={saveTuning}>Save</button>
</div>
<textarea class="widetext" bind:value={tuning_raw} oninput={onChange} onchange={onChange}></textarea>
<div class="buttons"  style="padding:2px;">
    <div class="buttons" class:selected={!usingCents} style="flex:1;">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div onclick={useNotes}>Notes:</div>
        <input type="number" bind:value={notes} onfocus={useNotes} style="width:50px"/>
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div onclick={useNotes}>ED:</div>
        <input type="number" bind:value={EDN} onfocus={useNotes} style="width:50px"/>
    </div>
    <div class="buttons" class:selected={usingCents} style="flex:1;">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div onclick={useCents}>Cents:</div>
        <input type="number" bind:value={cents}  onfocus={useCents} style="width:100px"/>
    </div>
</div>
<div class="buttons">
    <button onclick={autoGenerate}>Generate</button>
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