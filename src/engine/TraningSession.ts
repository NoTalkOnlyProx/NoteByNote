import {getSoundfontNames} from "smplr";
import type {Tuning} from "./Tuning";
import {ED2_12_TUNING, ED2_24_TUNING} from "./Tuning";
import {TrainingVoice} from "src/engine/TrainingVoice";

/* Tracks important session data, contains important common helpers for challenge impls. */
export class TrainingSession {
    /* Voices */
    playgroundVoice : TrainingVoice;
    guessVoice : TrainingVoice;
    challengeVoice : TrainingVoice;
    ctx : AudioContext | null;


    /* Floating point semitones */
    tuning : Tuning;

    offset_sound : number = 0;
    constructor() {
        this.ctx = null;
        this.playgroundVoice = new TrainingVoice(this);
        this.guessVoice = new TrainingVoice(this);
        this.challengeVoice = new TrainingVoice(this);

        /* For now, 12EDO is the only supported tuning */
        this.tuning = ED2_12_TUNING;

        console.log(this, getSoundfontNames());
    }
    async activate() {
        if (this.ctx) {
            return;
        }
        this.ctx = new AudioContext();
        await this.setUserInstrument("oboe");
        await this.setChallengeInstrument("marimba");
    }

    async setUserInstrument(instrument : string) {
        await this.guessVoice.setInstrument(instrument);
        await this.playgroundVoice.setInstrument(instrument);
    }

    async setChallengeInstrument(instrument : string) {
        await this.challengeVoice.setInstrument(instrument);
    }

    getRandomInstrument() {

    }
    getRandomChord() {

    }
    randomizeOffset()
    {
    }

    /* Maps note index to semitone value */
    mapNote(note : number) {
        return this.tuning.values[note + this.tuning.neutral] + this.offset_sound + 60;
    }
}