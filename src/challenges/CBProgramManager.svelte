<script lang="ts">
    import { untrack } from 'svelte';
    import { GlobalSettings } from "src/engine/GlobalSettings";
    import { CHALLENGE_B_PROGRAMS, type CBPairing } from "./ChallengeBProgramData";
    import { ChallengeBPrograms, type PairingMap } from "./ChallengeBPrograms";
    import { onMount, onDestroy } from 'svelte';
    import ChallengeB from "./ChallengeB.svelte";

    let {
        cvoice = "",
        gvoice = "",
        numnotes = 0,
        ontrial,
        onstop
    } = $props();

    const dimensions = 7;
    let instrumentsShown : string[] = $state([]);
    let pmap : PairingMap = $state(new Map());
    let totalNeeded : number =  $state(0);
    let completed : number =  $state(0);
    let visibleChallenges : CBPairing[] = $state(undefined);
    let program_selection = $state(0);
    let update_key = $state(0);
    let running = $state(false);

    /* cell values are temporarily held here while the user is editing them
     * we also compute colors from this table, so it must be updated when something external
     * changes the proficiency values.
     */
    let dummies : number[] =  $state([]);

    
    let cb : ()=>void;
    onMount(() => {
        cb = GlobalSettings.onUpdateSettings(()=>{
            recomputeProgramData();
        });
	});

    onDestroy(() => {
        GlobalSettings.clearListener(cb);
	});

    const colors = ["#940000", "#ff3e00", "#f37d00", "#f49c00", "#f6c000", "#f7dc00", "#16ff00", "#0ff151", "#00d4ff"];

    $effect(() => {
        program_selection;

        // Bastardized Svelte 4 -> Svelte 5 adaptation
        untrack(()=>{recomputeProgramData()});
    });

    function recomputeProgramData() {
        let pairData = ChallengeBPrograms.computePairs(CHALLENGE_B_PROGRAMS[program_selection])!;
        pmap = pairData.pairingMap;
        let {totalMastery, totalActual} = ChallengeBPrograms.computeProgress(pairData.pairings);
        totalNeeded = totalMastery;
        completed = totalActual;

        instrumentsShown = ChallengeBPrograms.rankInstruments(pairData.pairings, dimensions)!;
        visibleChallenges = ChallengeBPrograms.computeVisiblePairs(pairData.pairings, dimensions)!;

        refresh_dummies();
        update_key+=1;
    }
    recomputeProgramData();

    function refresh_dummies() {
        dummies = [];
        for (let r = 0; r < dimensions; r++) {
            for (let c = 0; c < dimensions; c++) {
                dummies[r + c * dimensions] = getProf(r, c) ?? 0;
            }
        }
    }

    function getShortName(index : number) {
        if (index == undefined) {
            return "??";
        }
        const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return alpha[index%alpha.length] + alpha[Math.floor(index/alpha.length)%alpha.length];
    }

    function getName(index : number) {
        return instrumentsShown?.[index];
    }

    function getcolor(row : number, col : number, dummies : number[]) {
        if (row >= instrumentsShown.length || col >= instrumentsShown.length) {
            return "#444444";
        }

        let prof = dummies[row + col * dimensions];
        let expectedProf = getExpectedProf(row, col);
        if (prof === undefined || prof === null || expectedProf == 0) {
            return "#444444";
        }

        let rprof = colors.length - (expectedProf - prof) - 1;
        return colors[Math.max(0, Math.min(colors.length-1, rprof))];
    }

    function getExpectedProf(row : number, col : number) {
        let challenge = getName(row);
        let guess = getName(col);
        if (challenge && guess) {
            let pair = pmap.get(challenge)?.get(guess);
            if (pair) {
                return pair.mastery;
            }
        }
        return 0;
    }

    function isActive(index : number, inst : string) {
        return getName(index) == inst
    }

    function selectChallenge(index : number) {
        cvoice=getName(index)??cvoice;
    }

    function selectGuess(index : number) {
        gvoice=getName(index)??gvoice;
    }

    function getProf(row : number, col : number) : number | undefined {
        let challenge = getName(row);
        let guess = getName(col);
        if (challenge && guess) {
            return ChallengeBPrograms.getProficiency(challenge, guess);
        }
        return undefined;
    }

    function setProf(row : number, col : number, prof : number | undefined) {
        prof = prof ?? 0;
        let challenge = getName(row);
        let guess = getName(col);
        if (challenge && guess) {
            ChallengeBPrograms.setProficiency(challenge, guess, prof);
        } else {
            /* We were editing an invalid dummy, so refresh these to reset to sane value */
            refresh_dummies();
        }
    }

    let successCounter =  $state(0);
    export async function completeChallenge(success : boolean) {
        console.log("Completed challenge", success);
        if (!running) {
            return;
        }

        await new Promise(r => setTimeout(r, 2000));

        if (success) {
            successCounter += 1;
        } else {
            successCounter -= 1;
        }
        
        let delta = 0;
        if (successCounter < -20) {
            delta = -1;
        }
        else if (successCounter > 5) {
            delta = 1;
        }

        if (delta != 0) {
            successCounter = 0;
            ChallengeBPrograms.setProficiency(cvoice, gvoice,
                ChallengeBPrograms.getProficiency(cvoice, gvoice) + delta
            );
            startChallenge(true);
        } else {
            startChallenge(false);
        }
        
    }

    function onStartStop() {
        if (running) {
            stopTrial();
            return;
        }
        startChallenge();
    }
    function onReroll(){
        startChallenge(true);
    }

    function startChallenge(reroll=false) {
        running = true;
        /* If we are not using a shown voice pair, pick a new pair */
        if (!instrumentsShown.includes(cvoice) || !instrumentsShown.includes(gvoice) || reroll) {
            recomputeProgramData();
            pickPair();
        }
        ontrial?.();
    }

    function stopTrial() {     
        running = false;
        onstop?.();
    }

    function pickPair() {
        /* Pick randomly from top 10, favoring 0 */
        let candidates = visibleChallenges.filter(pair => pair.actual < pair.mastery);
        if (candidates.length == 0) {
            stopTrial();
            return;
        }
        let available = Math.min(candidates.length, 10);
        let selection = Math.floor(Math.min(Math.random() * available, Math.random() * available));
        cvoice = candidates[selection].challenge;
        gvoice = candidates[selection].guess;
        numnotes = candidates[selection].actual + 1;
    }

    function toInt(raw : string) {
        let val = parseInt(raw, 10);
        if (isNaN(val)) {
            return undefined;
        }
        return val;
    }
</script>

<div style="padding-bottom:5px;">Challenge Programs</div>
<select bind:value={program_selection}>
    {#each CHALLENGE_B_PROGRAMS as challenge, sel}
        <option value={sel}>{challenge.name}</option>
    {/each}
</select>
<div class="profgrid" style="--col: {dimensions + 1}; --row {dimensions + 1};">
    {#key update_key}
        {#each {length: dimensions+1} as _, r}
            {#each {length: dimensions+1} as _, c}
                {#if c == 0 && r==0}
                        <div class="cell"></div>
                {:else if r == 0}
                    <button
                        class="cell"
                        class:bsel={isActive(c-1, gvoice)}
                        title="Guess: {getName(c-1)??"N/A"}"
                        onclick={()=>selectGuess(c-1)}
                    >
                        {getShortName(c-1)}
                    </button>
                {:else if c == 0}
                    <div class="rcol"><span class="rcoltitle">{getName(r-1)??"N/A"}:</span>
                        <button
                            class:bsel={isActive(r-1, cvoice)}
                            title="Challenge: {getName(r-1)}"
                            onclick={()=>selectChallenge(r-1)}
                        >
                            {getShortName(r-1)}?
                        </button>
                    </div>
                {:else}
                    <input
                        class="prof cell" type="number"
                        bind:value={dummies[(r-1) + (c-1)*dimensions]}
                        onblur={e => setProf(r-1, c-1, toInt(e?.target?.value))}
                        style="background-color:{getcolor(r-1, c-1, dummies)}"
                    />
                {/if}
            {/each}
        {/each}
    {/key}
</div>
<div style="display:flex;flex-direction:row;">
    <button class="ssbutton" onclick={onStartStop}>{running?"STOP":"START"}</button>
    <button class="ssbutton" onclick={onReroll}>{"Reroll"}</button>
</div>
<div>
    Progress: {`${completed}/${totalNeeded} (${(completed/totalNeeded * 100).toFixed(1)}%)`} Subprogress: {successCounter}
</div>

<style>
    .profgrid {
        display: grid;
        grid-template-columns: repeat(var(--col), auto);
        grid-template-rows: repeat(var(--row), auto);
    }
    .cell {
        box-sizing:content-box;
        padding-left: 2px;
        padding-right: 2px;
        padding-top: 1px;
        padding-top: 1px;
        width: 18px;
    }
    .prof {
        -moz-appearance: textfield;
    }
    .rcol {
        display: flex;
        justify-content: right;
    }
    .rcoltitle {
        padding-right:10px;
        min-width:20ch;
    }
    .bsel {
        background-color: palevioletred;
    }
    .ssbutton {
        flex: 1
    }
    .prof::-webkit-outer-spin-button,
    .prof::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
    }
</style>