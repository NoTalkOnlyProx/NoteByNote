<script lang="ts">
    import Keyboard from "./Keyboard.svelte";
    let sess;
    export {sess as session};
    let keysPressed = [];
    export let chord = [];
    let chord_internal = [];
    export let revealed;
    let volume : number = 50;
    $: onVolumeChange(volume);

    async function onNoteOn(event) {
        /* Allow interaction as an alternative playground keyboard */
        await sess.activate();
        await sess.playgroundVoice.startNote(event.detail - 60);
    }
    async function onNoteOff(event) {
        /* Allow interaction as an alternative playground keyboard */
        await sess.playgroundVoice.stopNote(event.detail - 60);
    }
    async function onVolumeChange(volume) {
        await sess.challengeVoice.setVolume(volume);
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
        <div class="hflow">
            <input class="volume" type="range" min="0" max="100" bind:value={volume}/>
            <button on:click={()=>{playChord();}} class="play">Play Challenge</button>
        </div>
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