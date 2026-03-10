<script lang="ts">
    import type { TrainingSession } from "src/engine/TrainingSession";
    import Keyboard from "./Keyboard.svelte";
    let {session: sess} = $props();
    let keysPressed = $state([]);
    let note_offset = $state(0);

    async function onNoteDown(note) {
        await sess.activate();
        await sess.playgroundVoice.startNote(note - 60 - note_offset);
    }
    async function onNoteOff(note) {
        await sess.playgroundVoice.stopNote(note - 60 - note_offset);
    }
</script>

<div>
    <Keyboard octaves={4} onnoteon={onNoteDown} onnoteoff={onNoteOff} {keysPressed} />
</div>

<style>

</style>