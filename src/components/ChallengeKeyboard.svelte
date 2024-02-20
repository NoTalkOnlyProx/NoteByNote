<script lang="ts">
    import Keyboard from "./Keyboard.svelte";
    let sess;
    export {sess as session};
    let keysPressed = [];
    export let chord = [];
    let chord_internal = [];
    export let revealed;

    async function onNoteOn(event) {
        /* Allow interaction as an alternative playground keyboard */
        await sess.activate();
        await sess.playgroundVoice.startNote(event.detail - 60);
    }
    async function onNoteOff(event) {
        /* Allow interaction as an alternative playground keyboard */
        await sess.playgroundVoice.stopNote(event.detail - 60);
    }

    export async function playChord() {
        await sess.activate();
        await sess.challengeVoice.stopAll();
        await sess.challengeVoice.startMany(chord, 500);
    }

    export async function setChord(nchord) {
        chord = nchord;
        chord_internal = chord.map(n => n + 60);
        await playChord();
    }
</script>

<div>
    <div class="bflow">
        <button on:click={()=>{playChord();}} class="play">Play Challenge</button>
    </div>
    <Keyboard highlight={revealed?chord_internal:[]} octaves={4} on:noteon={onNoteOn} on:noteoff={onNoteOff} {keysPressed} />
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