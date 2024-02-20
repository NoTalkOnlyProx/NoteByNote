<script lang="ts">
    import Keyboard from "./Keyboard.svelte";
    import {createEventDispatcher} from "svelte";
    let sess;
    export {sess as session};
    let chord = new Set();
    let keyboard;
    const dispatch = createEventDispatcher();

    export async function reset() {
        keyboard.reset();
    }

    async function onNoteOn(event) {
        chord.add(event.detail - 60);
        await onChordChange();
    }
    async function onNoteOff(event) {
        chord.delete(event.detail - 60);
        await onChordChange();
    }
    async function onChordChange() {
        await playChord();
        dispatch("change",  Array.from(chord).sort((a, b) => a - b));
    }

    export async function playChord() {
        await sess.activate();
        await sess.guessVoice.stopAll();
        await sess.guessVoice.startMany(Array.from(chord), 500);
    }
</script>

<div>
    <Keyboard bind:this={keyboard} toggle="true" octaves={4} on:noteon={onNoteOn} on:noteoff={onNoteOff} />
    <div class="bflow">
        <button on:click={()=>{playChord();}} class="play">Play Guess</button>
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
</style>