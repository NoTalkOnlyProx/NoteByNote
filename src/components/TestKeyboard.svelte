<script lang="ts">
    import type { TrainingSession } from "src/engine/TrainingSession";
    import Keyboard from "./Keyboard.svelte";
    let sess : TrainingSession;
    export {sess as session};
    let keysPressed = [];
    let note_offset = 0

    async function onNoteDown(event) {
        await sess.activate();
        await sess.playgroundVoice.startNote(event.detail - 60 - note_offset);
    }
    async function onNoteOff(event) {
        await sess.playgroundVoice.stopNote(event.detail - 60 - note_offset) ;
    }
</script>

<div>
    <Keyboard octaves={4} on:noteon={onNoteDown} on:noteoff={onNoteOff} {keysPressed} />
</div>

<style>

</style>