import {getSoundfontNames} from "smplr";
import type {Tuning} from "./Tuning";
import {getTuning} from "./Tuning";
import {TrainingVoice} from "src/engine/TrainingVoice";
import { TrainingVoices } from "./TrainingVoices";
import { GlobalSettings } from "./GlobalSettings";

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
        this.playgroundVoice =  new TrainingVoice(this, 0);
        this.guessVoice =       new TrainingVoice(this, 1);
        this.challengeVoice =   new TrainingVoice(this, 2);

        /* For now, 12EDO is the only supported tuning */
        this.tuning = GlobalSettings.getActiveProfile().tuning;
        GlobalSettings.onUpdateSettings(()=>{
            this.tuning = GlobalSettings.getActiveProfile().tuning;
        });

        this.setUserInstrument("oboe");
        this.setChallengeInstrument("marimba");
    }
    async activate() {
        if (this.ctx) {
            return;
        }
        this.ctx = new AudioContext();
        /* Called asyncrounously so that awaiters can continue
         * Realistically, we could make activate() non-async, but there is not a lot of point,
         * and I'd rather not make that refactor and risk having to undo it later.
         */
        this.loadAll();
    }
    async loadAll() {
        if (this.ctx) {
            await TrainingVoices.loadDeferred(this.ctx);
            await TrainingVoices.loadRecommended(this.ctx);
        }
    }

    async setUserInstrument(instrument : string) {
        await this.guessVoice.setInstrument(instrument);
        await this.playgroundVoice.setInstrument(instrument);
    }

    async setChallengeInstrument(instrument : string) {
        await this.challengeVoice.setInstrument(instrument);
    }

    randomizeOffset()
    {
    }

    /* Maps note index to semitone value */
    mapNote(note : number) {
        let res = this.tuning.values[note + this.tuning.neutral] + this.offset_sound + 60;
        return res;
    }
}