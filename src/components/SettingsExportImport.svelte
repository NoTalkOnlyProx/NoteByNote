<script lang="ts">
    import { GlobalSettings } from "src/engine/GlobalSettings";
    let text_raw : string = "";
    let autosave = GlobalSettings.enableAutosave;

    /* Auto-save whether auto-save is enabled */
    $: GlobalSettings.setAutosave(autosave);

    function saveSettings() {
        GlobalSettings.importSettings(text_raw);
    }

    function showSettings() {
        text_raw = GlobalSettings.exportSettings();
    }

    function loadSettings() {
        GlobalSettings.loadSettings();
        showSettings();
    }

    function resetSettings() {
        GlobalSettings.resetSettings();
        showSettings();
    }

    function onBlur() {
        if (text_raw==""){
            showSettings();
        }
    }

    showSettings();
</script>
<div>
    Click show, then copy the text to a text file. Later, paste it back in, and hit save to load them.
</div>
<textarea class="widetext" bind:value={text_raw} on:blur={onBlur}></textarea>
<div>
    {GlobalSettings.lastStatus};
</div>
<div class="buttons">
    <button on:click={saveSettings}>Save</button>
    <button on:click={showSettings}>Show</button>
    <button on:click={resetSettings}>Reset</button>
    <button on:click={loadSettings}>Load</button>
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