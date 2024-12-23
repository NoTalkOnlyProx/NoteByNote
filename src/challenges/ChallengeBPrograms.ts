import { GlobalSettings } from "src/engine/GlobalSettings";
import { setPairProficiency, type PairProficiencyData } from "src/engine/PairProficiency";
import type { CB_PROGRAM, CBPairing } from "./ChallengeBProgramData";
import { toInt } from "src/engine/utils";

export type PairingMap = Map<string, Map<string, CBPairing>>;

export class ChallengeBPrograms {
    static random_cache : Map<string, number> = new Map();
    static current_pdata : PairProficiencyData = new Map();

    static {
        GlobalSettings.onUpdateSettings(() => {
            this.loadProficiency();
        });
        this.loadProficiency();
    }

    static loadProficiency() {
        let prof = GlobalSettings.getActiveProfile();
        this.current_pdata = prof.cb_proficiency ?? new Map();
    }

    static getProficiency(challenge : string, guess : string, pdata=this.current_pdata) : number {
        return toInt(pdata.get(challenge)?.get(guess) ?? "0") ?? 0;
    }

    static setProficiency(challenge : string, guess : string, p : number) {
        setPairProficiency(challenge, guess, p, this.current_pdata);
        this.saveProficiencies();
    }

    static saveProficiencies() {
        let prof = GlobalSettings.getActiveProfile();
        prof.cb_proficiency = this.current_pdata;
        GlobalSettings.updateSettings(true);
    }

    static getRandom(name : string) {
        if (!this.random_cache.has(name)) {
            this.random_cache.set(name, Math.random());
        }
        return this.random_cache.get(name) ?? 0;
    }

    /* Considers the current program, and the current proficiency data,
     * generates valid pairs, and ranks them by priority.
     */
    static computePairs(program : CB_PROGRAM | undefined) {
        if (!program) {
            return undefined;
        }

        /* First, generate prioritized pairings, abject of any proficiency data
         * Use of map structure allows us to make sure all generated pairings are unique,
         * We always keep the highest possible priority for a given pairing.
         */
        let pairingMap : PairingMap = new Map();
        for (let challengeGroup of program.groups) {
            for (let guessGroup of program.groups) {
                /* Skip invalid group combinations */
                let modes = [challengeGroup.mode, guessGroup.mode];

                /* Mono can only pair with itself */
                if (modes.includes("mono") && challengeGroup != guessGroup) {
                    continue;
                }

                /* int can only pair with ext */
                if (modes.includes("int") && !modes.includes("ext")) {
                    continue;
                }

                /* ext can only pair with int and core */
                if (modes.includes("ext") && !modes.includes("int") && !modes.includes("core")) {
                    continue;
                }
                for (let challenge of challengeGroup.names) {
                    for (let guess of guessGroup.names) {
                        /* Skip invalid pair modifications */
                        if (modes.includes("mono") && guess != challenge) {
                            continue;
                        }
                        
                        /* This will double-cover for mono groups, but I don't care */
                        let priority = challengeGroup.priority * guessGroup.priority;
                        let mastery = Math.min(challengeGroup.mastery, guessGroup.mastery);
                        let actual = this.getProficiency(challenge, guess);
                        let urgency = Math.log(priority) * (mastery - actual);
                        let pairing : CBPairing = {
                            challenge, guess, priority, mastery, urgency, actual
                        };
                        if (!pairingMap.has(challenge)) {
                            pairingMap.set(challenge, new Map());
                        }
                        let existing = pairingMap.get(challenge)?.get(guess);
                        if (existing && existing.priority >= pairing.priority) {
                            continue;
                        }
                        pairingMap.get(challenge)?.set(guess, pairing);
                    }
                }
            }
        }

        /* Flatten generated pairings, then sort by urgency */
        let pairings = [];
        for (let guessMap of pairingMap.values()) {
            for (let pairing of guessMap.values()) {
                pairings.push(pairing);
            }
        }

        /* Randomize before sorting so that items with same priority are in random order
         * Use randomization cache so that subsequent calls yield similar results 
         */
        pairings.sort((a, b) => {
            return this.getRandom(a.challenge + a.guess) - this.getRandom(b.challenge + b.guess);
        });
        pairings.sort((a, b) => {
            return b.urgency - a.urgency;//Descending order
        })
        console.log(pairings);
        return {pairings, pairingMap};
    }

    static rankInstruments(pairings : CBPairing[] | undefined, count = 10) : string[] | undefined {
        if (!pairings) {
            return undefined;
        }

        /* Find the top N instruments as sorted by the first pairing they appear in */
        let instruments : string[] = [];
        for (let pairing of pairings) {
            if (!instruments.includes(pairing.challenge)) {
                instruments.push(pairing.challenge);
                if (instruments.length >= count) {
                    return instruments;
                }
            }
            if (!instruments.includes(pairing.guess)) {
                instruments.push(pairing.guess);
                if (instruments.length >= count) {
                    return instruments;
                }
            }
        }

        return instruments;
    }

    /* Get a list of pairings for N visible instruments */
    static computeVisiblePairs(pairings : CBPairing[] | undefined, count = 10) : CBPairing[] | undefined {
        if (!pairings) {
            return undefined;
        }
        let inst = new Set();
        let list : CBPairing[] = [];
        for (let pairing of pairings) {
            inst.add(pairing.challenge);
            inst.add(pairing.challenge);
            if (inst.size > count) {
                return list;
            }
            list.push(pairing);
        }
        return list;
    }

    static computeProgress(pairings : CBPairing[]) {
        let totalMastery = 0;
        let totalActual = 0;
        for (let pairing of pairings) {
            totalMastery += pairing.mastery;
            totalActual += Math.min(pairing.mastery, pairing.actual);
        }
        return {totalMastery, totalActual};
    }
}

