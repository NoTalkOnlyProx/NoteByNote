<script lang="ts">
    import type { TrainingSession } from "src/engine/TraningSession";
    import Keyboard from "./Keyboard.svelte";
    import {createEventDispatcher} from "svelte";
    let sess : TrainingSession;
    export {sess as session};
    let chord = new Set();
    let keyboard;
    const dispatch = createEventDispatcher();
    let volume : number = 50;
    $: onVolumeChange(volume);

    let note_offset : number = 0;

    export async function reset() {
        keyboard.reset();
    }

    async function onNoteOn(event) {
        chord.add(event.detail - 60 - note_offset);
        await onChordChange();
    }
    async function onNoteOff(event) {
        chord.delete(event.detail - 60 - note_offset);
        await onChordChange();
    }
    async function onChordChange() {
        await playChord();
        dispatch("change",  Array.from(chord).sort((a, b) => a - b));
    }
    async function onVolumeChange(volume) {
        sess.guessVoice.setVolume(volume);
        sess.playgroundVoice.setVolume(volume);
    }

    export async function playChord() {
        await sess.activate();
        await sess.guessVoice.stopAll();
        await sess.guessVoice.startMany(Array.from(chord), 500);
    }

    export function setOffset(offset : number) {
        note_offset = offset;
    }
</script>

<div>
    <Keyboard bind:this={keyboard} toggle="true" octaves={4} on:noteon={onNoteOn} on:noteoff={onNoteOff} />
    <div class="bflow">
        <div class="hflow">
            <input class="volume" type="range" min="0" max="100" bind:value={volume}/>
            <button on:click={()=>{playChord();}} class="play">Play Guess</button>
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