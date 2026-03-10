<script lang="ts">
    import { untrack } from 'svelte';
    import type { TrainingSession } from "src/engine/TraningSession";
    import Keyboard from "./Keyboard.svelte";

    let {
        onchange,
        session: sess
    } = $props();

    let chord = $state(new Set());
    let keyboard : Keyboard;
    
    let volume : number = $state(50);
    
    $effect(() => {
        volume;
        // Bastardized Svelte 4 -> Svelte 5 adaptation
        untrack(()=>{onVolumeChange(volume)});
	});

    let note_offset : number = $state(0);

    export async function reset() {
        keyboard.reset();
    }

    function onNoteOn(note : number) {
        console.log("onNoteOn");
        chord.add(note - 60 - note_offset);
        onChordChange();
    }
    function onNoteOff(note : number) {
        console.log("onNoteOff");
        chord.delete(note - 60 - note_offset);
        onChordChange();
    }
    async function onChordChange() {
        await playChord();
        onchange?.(Array.from(chord).sort((a, b) => (a as number) - (b as number)));
    }
    async function onVolumeChange(volume : number) {
        console.log("ovc", sess);
        sess?.guessVoice.setVolume(volume);
        sess?.playgroundVoice.setVolume(volume);
    }

    export async function playChord() {
        console.log("playChord?", chord);
        await sess.activate();
        await sess.guessVoice.stopAll();
        await sess.guessVoice.startMany(Array.from(chord), 500);
    }

    export function setOffset(offset : number) {
        note_offset = offset;
    }
</script>

<div>
    <Keyboard bind:this={keyboard} toggle="true" octaves={4} onnoteon={onNoteOn} onnoteoff={onNoteOff} />
    <div class="bflow">
        <div class="hflow">
            <input class="volume" type="range" min="0" max="100" bind:value={volume}/>
            <button onclick={()=>{playChord();}} class="play">Play Guess</button>
        </div>
    </div>
</div>

<style>
    .play {
        width: 1568px;
        height: 100px;
    }
    .bflow {
        width: 100%;
        display:flex;
        flex-direction:column;
        align-items: center;
    }
    .hflow {
        height: 100%;
        display:flex;
        flex-direction:row;
        align-items: center;
    }
    .volume {
        writing-mode: vertical-rl;
        direction: rtl;
        height:100px;
    }
</style>