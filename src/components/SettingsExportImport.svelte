<script lang="ts">
    import { untrack } from 'svelte';
	import { onMount, onDestroy } from 'svelte';
    import { GlobalSettings } from "src/engine/GlobalSettings";
    let text_raw : string = $state("");
    
    let initial_profile = GlobalSettings.getActiveProfile()?.name ?? "default";
    
    let profile_selection : string = $state(initial_profile);
    let autosave = $state(GlobalSettings.enableAutosave);
    let active_prof = $state(initial_profile);
    let pnames : string[] = $state([]);

    $effect(() => {
        // Bastardized Svelte 4 -> Svelte 5 adaptation
        text_raw;
        untrack(()=>{onChangeText(text_raw)});
    });

    $effect(() => {
        profile_selection;
        // Bastardized Svelte 4 -> Svelte 5 adaptation
        untrack(()=>{onChangeSelection(profile_selection)});
    });

    let cb : ()=>void;
    onMount(() => {
        cb = GlobalSettings.onUpdateSettings(()=>{
            pnames = GlobalSettings.listProfiles();
            active_prof = GlobalSettings.getActiveProfile()?.name ?? "default";
        });
	});

    onDestroy(() => {
        GlobalSettings.clearListener(cb);
	});

    /* Auto-save whether auto-save is enabled */
    $effect(() => {
        autosave;

        // Bastardized Svelte 4 -> Svelte 5 adaptation
        untrack(()=>{GlobalSettings.setAutosave(autosave)});
    });

    function useProfile() {
        editSettings();
        GlobalSettings.selectProfile(profile_selection);
    }

    function deleteProfile() {
        GlobalSettings.deleteProfile(profile_selection);
        profile_selection = GlobalSettings.getActiveProfile().name;
        editSettings();
    }

    function saveSettings() {
        GlobalSettings.importSettings(text_raw);
        GlobalSettings.updateSettings();
    }

    function editSettings() {
        GlobalSettings.loadProfiles();
        text_raw = GlobalSettings.exportSettings(profile_selection);
    }

    function onBlur() {
        if (text_raw==""){
            editSettings();
        }
        if (profile_selection==""){
            profile_selection="all";
        }
    }

    function onChangeText(ntext : string) {
        try {
            let parsed = JSON.parse(ntext);
            if (Array.isArray(parsed)) {
                profile_selection = "all";
            } else {
                profile_selection = parsed.name ?? profile_selection;
            }
        } catch (e) {

        }
    }

    function onChangeSelection(ntext : string) {
        try {
            let parsed = JSON.parse(text_raw);
            if (Array.isArray(parsed)) {
                return;
            } else {
                parsed.name = ntext;
                text_raw = JSON.stringify(parsed, null, 2);
            }
        } catch (e) {

        }
    }

    editSettings();
</script>
<div>
    Settings Im/Export. Active Profile: {active_prof}
</div>
<textarea class="widetext" bind:value={text_raw} onblur={onBlur}></textarea>
<div class="buttons">
    <input list="profiles" bind:value={profile_selection} onblur={onBlur}/>
    <datalist id="profiles">
        <option value="all"></option>
        {#each pnames as pname}
            <option value="{pname}"></option>
        {/each}
    </datalist>
    <button onclick={useProfile}>Use</button>
    <button onclick={editSettings}>Edit</button>
    <button onclick={saveSettings}>Save</button>
    <button onclick={deleteProfile}>Delete</button>
</div> 
<div>
    <input type="checkbox"  id="autosave_enabled" bind:checked={autosave}>
    <label for="autosave_enabled">Enable Autosave</label>
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
</style>