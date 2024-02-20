import { Chord, ChordType} from "tonal";

export class ChordGen {
    static chords = ChordType.all();
    static generateChord(notes : number) {
        if (Math.random() < 0.25) {
            return this.generateHeuristicChord(notes);
        }
        return this.generateClassicalChord(notes);
    }
    static generateClassicalChord(notes : number) : number[] {
        /* Filter chords by whether they can reach the needed number of notes within 3 octaves  */
        let elligible = this.chords.filter(chord => chord.intervals.length * 3 >= notes);
        if (elligible.length == 0) {
            return this.generateHeuristicChord(notes);
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
        return generated;
    }

    static generateHeuristicChord(notes : number) : number[] {
        if (notes === 0) {
            return [];
        }
        if (notes === 1) {
            return [0];
        }
        let subchord = this.generateHeuristicChord(notes-1);
        let last = subchord[subchord.length-1];
        let next = last;
        if (Math.random() < 0.95) {
            next += Math.floor(Math.random() * 12);
        }
        do {
            next = (next + 1)%36;
        } while (subchord.includes(next));
        return [...subchord, next].sort((a, b) => a - b);
    }
}