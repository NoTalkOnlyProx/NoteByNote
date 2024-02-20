<script lang="ts">
    import GuessKeyboard from "src/components/GuessKeyboard.svelte";
    import ChallengeKeyboard from "src/components/ChallengeKeyboard.svelte";
    import {TrainingSession} from "src/engine/TraningSession";
    import {ChordGen} from "src/engine/ChordGen";
    import 'segmented-control-svelte/lightMode.css' // Optional, alternatively use darkMode.css or a custom stylesheet
    import { SegmentedControl, Segment } from 'segmented-control-svelte'
    import {TrainingVoice} from "src/engine/TrainingVoice";

    let challenge_board;
    let guess_board;
    let challenge_n = 0;
    let auto_mode = 0;
    let chord = [];
    let guess_chord_relative = [];
    let guess_chord = [];
    let revealed = false;
    let validated = false;
    let num_notes;
    const sess = new TrainingSession();


    let guess_inst = "";
    let challenge_inst = "";

    async function generateChallenge() {
        await sess.activate();
        chord = ChordGen.generateChord(num_notes);

        /* The generated chord always has initial note 0. Pick a random keyboard offset that keeps the chord in view. */
        let maxOffset = 23 - chord[chord.length-1];
        let minOffset = -23;
        let offset = Math.floor(Math.random() * (maxOffset - minOffset)) + minOffset;
        chord = chord.map(n => n + offset);

        /* Randomize session parameters */
        sess.offset_sound = Math.random() * 24 - 12;

        /* Update Keyboards */
        guess_board.reset();
        await challenge_board.setChord(chord);

        /* Challenge State */
        challenge_n += 1;
        validated = false;
        revealed = false;

        challenge_inst = sess.challengeVoice.instrument;
        guess_inst = sess.guessVoice.instrument;
    }

    async function randomizeVoices() {
        await sess.activate();
        challenge_inst = TrainingVoice.getRandomGoodVoice();
        guess_inst = TrainingVoice.getRandomGoodVoice();
        await sess.setChallengeInstrument(challenge_inst);
        await sess.setUserInstrument(guess_inst);
    }

    async function sameVoices() {
        guess_inst = challenge_inst;
        await sess.setUserInstrument(guess_inst);
    }

    function onGuessChange(event) {
        guess_chord = event.detail;
        guess_chord_relative = guess_chord.map(n => n - guess_chord[0]);
    }

    function checkAnswer() {
        console.log("Check answer", chord, guess_chord);
        if (chord.length != guess_chord.length) {
            validated = false;
            return;
        }
        for (let i = 0; i < chord.length; i++) {
            if (chord[i] != guess_chord[i]) {
                validated = false;
                return;
            }
        }
        validated = true;
        revealed = true;
    }

    function revealAnswer() {
        revealed = true;
    }

    function hideAnswer() {
        revealed = false;
    }



    let count = 0;
    setInterval(()=>{
        count++;
        if (auto_mode == 0) {
            return;
        }
        if (auto_mode == 1) {
            challenge_board.playChord();
            return;
        }
        if (auto_mode == 2) {
            if (count%4 == 0) {
                challenge_board.playChord();
            }
            return;
        }
        if (auto_mode == 3) {
            if (count%4 == 0) {
                challenge_board.playChord();
            }
            if (count%4 == 2) {
                guess_board.playChord();
            }
            return;
        }
        if (auto_mode == 4) {
            challenge_board.playChord();
            guess_board.playChord();
            return;
        }
    }, 250);
    //<button on:click={()=>{dispatch("confirm");}} class="confirm">Confirm</button>
</script>


<div class="mainflow">
    <div class="challenge">
        <ChallengeKeyboard bind:this={challenge_board} session={sess} {revealed}></ChallengeKeyboard>
        <GuessKeyboard
                on:change={onGuessChange}
                bind:this={guess_board}
                session={sess}>
        </GuessKeyboard>
    </div>
    <div class="foot">
        <div class="section" id="info">
            <div>Challenge {challenge_n}</div>
            <div>{validated?"Correct!":"Wrong"}</div>
            <div>Challenge Voice: {challenge_inst}</div>
            <div>User Voice: {guess_inst}</div>
            {#if revealed}
                <div>Answer: {chord}</div>
                <div>Yours: {guess_chord}</div>
            {:else}
                <div>Yours: {guess_chord_relative}</div>
            {/if}
        </div>
        <div class="section"  id="controls">
            <div>
                <div>Auto-play</div>
                <SegmentedControl bind:selectedIndex={auto_mode}>
                    <Segment>Off</Segment>
                    <Segment>Const</Segment>
                    <Segment>Beat</Segment>
                    <Segment>Alt</Segment>
                    <Segment>Both</Segment>
                </SegmentedControl>
            </div>
            <div>
                <button on:click={()=>{generateChallenge()}}>New Challenge</button>
                <button on:click={()=>{randomizeVoices()}}>New Voices</button>
                <button on:click={()=>{sameVoices()}}>Same Voices</button>
                <button on:click={async ()=>{await randomizeVoices(); await generateChallenge()}}>New Everything</button>
            </div>
            <div>
                <button class="bigbutton" on:click={()=>{checkAnswer()}}>Validate</button>
            </div>
            <div>
                <button on:click={()=>{revealAnswer();}}>Reveal</button>
                <button on:click={()=>{hideAnswer();}}>Hide</button>
            </div>
            <div>
                <input type="number" bind:value={num_notes} min="0" max="10" />
                <input type="range" bind:value={num_notes} min="0" max="10" />
            </div>
        </div>
    </div>
</div>

<style>
    :root {
        --segmented-control-color-accent: rgb(255, 255, 255);
        --segmented-control-color-primary: rgb(255, 255, 255);
        --segmented-control-color-background-accent: rgb(20, 20, 20);
        --segmented-control-color-background: rgba(225, 225, 225, 75%);
        --segmented-control-color-text-primary: rgb(0, 0, 0);
        --segmented-control-color-text-disabled: rgba(0, 0, 0, 30%);
    }
    .mainflow {
        display: flex;
        flex-direction: column;
        height:100%;
    }
    .challenge {
        flex-grow: 0;
    }
    .foot {
        flex-grow: 1;
        display: flex;
    }
    .bigbutton {
        width: 100%;
        height: 50px;
    }
    .section {
        border: 1px double black;
        margin-right: 10px;
        background-color:#fefefe;
        padding: 20px;
    }
    .section > div {
        margin-bottom:10px;
    }
    #info {
        width: 400px;
    }
</style>