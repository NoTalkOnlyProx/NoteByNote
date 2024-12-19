<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
    import { GlobalSettings } from "src/engine/GlobalSettings";

    let cb : ()=>void;
    onMount(() => {
        cb = GlobalSettings.onUpdateSettings(()=>{
            let profile = GlobalSettings.getActiveProfile();
            exportURLs(profile.customURLsList);
        });
	});

    onDestroy(() => {
        GlobalSettings.clearListener(cb);
	});
    
    const example = "font_name_example: font_url\nfont_name_example_2: font_url2";

    let text_raw : string = "";
    function sanitize() {
        if (text_raw == "") {
            text_raw = example;
        }
    }
    function exportURLs(urls : {[key: string] : string}) {
        let new_raw = "";
        for (let font in urls ?? {}) {
            new_raw += font + ": " + urls[font] + "\n";
        }
        if (new_raw == "") {
            new_raw = example;
        }
        if (text_raw != new_raw) {
            text_raw = new_raw;
        }
    }
    function saveURLs() {
        let urls : {[key:string]:string} = {};
        for (let line of text_raw.split("\n")) {
            let parts = line.split(": ");
            if (parts.length != 2) {
                continue;
            }
            let [font, url] = parts.map(part => part.trim());
            urls[font] = url;
        }

        if ("font_name_example" in urls) {
            delete urls["font_name_example"];
        }
        if ("font_name_example_2" in urls) {
            delete urls["font_name_example_2"];
        }

        /* Do not count as auto-save; The user requested save manually */
        let profile = GlobalSettings.getActiveProfile();
        profile.customURLsList = urls;
        GlobalSettings.updateSettings(false);
    }
    exportURLs(GlobalSettings.getActiveProfile().customURLsList);
    sanitize();
</script>
<div>Define custom voices below</div>
<textarea class="widetext" bind:value={text_raw} on:blur={sanitize}></textarea>
<div class="buttons">
    <button on:click={saveURLs}>Save</button>
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