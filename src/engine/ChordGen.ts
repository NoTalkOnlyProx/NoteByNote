import { Chord, ChordType} from "tonal";
import { getLastSmallerIntervalFrom, getTuningSpan } from "./Tuning";
import type { Tuning } from "./Tuning";

export class ChordGen {
    static chords = ChordType.all();

    /* Generates a random chord -- a list of indices into the provided tuning, centered on
     * the tuning neutral.
     */
    static generateChord(notes : number, tuning : Tuning) {
        if (Math.random() < 0.25) {
            return this.generateHeuristicChord(notes, tuning);
        }
        return this.generateClassicalChord(notes, tuning);
    }

    static generateClassicalChord(notes : number, tuning : Tuning) : number[] {
        /* We start by generating a 12EDO chord, with first note always 0 */

        /* Filter chords by whether they can reach the needed number of notes within 3 octaves
         * (We can form an arbitrary expression out of the one-octave set of notes specified
         *  by chord.intervals, so multiplying this by 3 gives how many notes are achievable
         *  over 3 octaves).
         */
        let elligible = this.chords.filter(chord => chord.intervals.length * 3 >= notes);
        if (elligible.length == 0) {
            return this.generateHeuristicChord(notes, tuning);
        }

        /* Choose a random elligible chord */
        let chosen = elligible[Math.floor(Math.random() * elligible.length)];

        /* Expand into N notes */

        /* Start from a randomly chosen note in the chord */
        let offset = Math.floor(Math.random() * 12);
        while (chosen.chroma[offset] == '0') {
            offset -= 1;
        }

        let idx = offset;
        let generated = [];
        while(generated.length < notes) {
            if (chosen.chroma[idx%12] == '1') {
                generated.push(idx - offset);
            }
            idx += 1;
        }

        /* Now, retune the generated chord into the tuning */
        let result = this.retuneChord(generated, tuning);
        console.log("classical generated", result, generated);
        return result;
    }

    static retuneChord(original : number[], tuning : Tuning) : number[] {
        const octave_span = getTuningSpan(tuning, 12);

        let bestError = Infinity;
        let bestResult = original;
        for (let offset = 0; offset < octave_span; offset++) {
            let attempt = [...original];

            /* Start by picking the offset as first note */
            attempt[0] = offset;
            let totalError = 0;
            for (let i = 1; i < attempt.length; i++) {
                let interval = original[i] - original[i-1];
                let previousCents = tuning.values[attempt[i-1] + tuning.neutral];

                /* find the highest note with interval less than target, relative to last note chosen */
                let lastSmaller = getLastSmallerIntervalFrom(tuning, attempt[i-1] + tuning.neutral, interval);

                /* Pick either that note, or the next one -- whichever has least error */
                let candidateA = lastSmaller;
                let candidateB = Math.min(lastSmaller+1, tuning.values.length-1);
                let intervalA = tuning.values[candidateA] - previousCents;
                let intervalB = tuning.values[candidateB] - previousCents;
                let errorA = Math.abs(intervalA - interval);
                let errorB = Math.abs(intervalB - interval);
                if (errorA < errorB) {
                    attempt[i] = candidateA - tuning.neutral;
                    totalError += errorA;
                }
                else {
                    attempt[i] = candidateB - tuning.neutral;
                    totalError += errorB;
                }
            }

            if (totalError < bestError) {
                bestError = totalError;
                bestResult = attempt;
            }
        }

        return bestResult;
    }

    /* Designs a random chord as notes ***in the active tuning***
     * by successively adding a random note to a smaller chord.
     */
    static generateHeuristicChord(notes : number, tuning : Tuning) : number[] {
        if (notes === 0) {
            return [];
        }
        const tuning_span = getTuningSpan(tuning, 36);
        let subchord = this.generateHeuristicChord(notes-1, tuning);
        let last = subchord?.[subchord.length-1] ?? 0;
        let next = last + Math.floor(Math.random() * 12);
        do {
            next = (next + 1) % tuning_span;
        } while (subchord.includes(next));
        let result = [...subchord, next].sort((a, b) => a - b);
        console.log("Heuristic Gen", result);
        return result;
    }
}