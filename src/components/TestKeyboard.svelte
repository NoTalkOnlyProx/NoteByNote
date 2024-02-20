<script lang="ts">
    import Keyboard from "./Keyboard.svelte";
    let sess;
    export {sess as session};
    let keysPressed = [];

    async function onNoteDown(event) {
        await sess.activate();
        await sess.playgroundVoice.startNote(event.detail - 60);
        //await sess.playgroundVoice.startMany([event.detail - 60, event.detail - 60 + 14, event.detail - 60 + 14*2, event.detail - 60 + 14*3, event.detail - 60 + 14*4]);
    }
    async function onNoteOff(event) {
        await sess.playgroundVoice.stopNote(event.detail - 60);
    }
</script>

<div>
    <Keyboard octaves={4} on:noteon={onNoteDown} on:noteoff={onNoteOff} {keysPressed} />
</div>

<style>

</style>