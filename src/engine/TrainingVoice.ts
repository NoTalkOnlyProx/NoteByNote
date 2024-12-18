/*

bad:
agogo, applause, bird_tweet, brass_section, choir_aahs, church_organ, fx_*,
guitar_fret_noise, guitar_harmonics,  gunshot, helicopter, lead_5_charang,
lead_6_voice, lead_7_fifths, melodic_tom, orchestra_hit, pad_1_new_age,
pad_2_warm, pad_4_choir, pad_6_metallic, pad_7_halo, pad_8_sweep,
pizzicato_strings, reed_organ, reverse_cymbal, seashore, string_ensemble_1,
synth_choir, synth_drum, taiko_drum, telephone_ring, timpani, tubular_bells,
woodblock

-2 oct: glockenspiel
1 oct: rock_organ
fx_*,
 */
import {getSoundfontNames, Soundfont} from "smplr";
import {TrainingSession} from "src/engine/TraningSession";


const bad_voices = ["agogo", "applause", "bird_tweet", "brass_section", "choir_aahs", "church_organ",
    "guitar_fret_noise", "guitar_harmonics",  "gunshot", "helicopter", "lead_5_charang",
    "lead_6_voice", "lead_7_fifths", "melodic_tom", "orchestra_hit", "pad_1_new_age",
    "pad_2_warm", "pad_4_choir", "pad_6_metallic", "pad_7_halo", "pad_8_sweep",
    "pizzicato_strings", "reed_organ", "reverse_cymbal", "seashore", "string_ensemble_1",
    "synth_choir", "synth_drum", "taiko_drum", "telephone_ring", "timpani", "tubular_bells",
    "woodblock", "glockenspiel", "rock_organ"];

const good_voices = getSoundfontNames().filter(instrument => {
    return !bad_voices.includes(instrument) && !instrument.startsWith("fx");
});


type VoiceNote = {
    timer? : ReturnType<typeof setTimeout>;
}

export class TrainingVoice {
    session : TrainingSession;
    activeNotes : Map<number, VoiceNote>;
    sfz : Soundfont | null;
    instrument : string;
    volume : number;
    volumeAdjustment : number;
    constructor(session : TrainingSession) {
        this.session = session;
        this.activeNotes = new Map<number, VoiceNote>();
        this.sfz = null;
        this.instrument = "";
        this.volume = 50;
        this.volumeAdjustment = 1.0;
    }

    static getRandomGoodVoice() {
        return good_voices[Math.floor(Math.random() * good_voices.length)];
    }


    async startMany(notes : number[], expire : number = 0) {
        for (let note of notes) {
            await this.startNote(note, expire);
        }
        /* Stop any notes that aren't part of the requested chord */
        let stopPlaying = Array.from(this.activeNotes.keys()).filter(note => !notes.includes(note));
        for (let note of stopPlaying) {
            await this.stopNote(note);
        }
    }
    async stopAll() {
        for (let [note, activeNote] of this.activeNotes) {
            await this.stopNote(note);
        }
    }
    async startNote(note : number, expire : number = 0) {
        console.log("Starting note...", note);
        let activeNote = this.activeNotes.get(note);
        /* Start playing note if the note isn't already playing */
        if (!activeNote) {
            await this.startSound(note);
            activeNote = {};
            this.activeNotes.set(note, activeNote);
        }
        /* Clear previous expiry if one exists */
        if (activeNote.timer) {
            clearTimeout(activeNote.timer);
        }
        /* Set new expiry if desired */
        if (expire > 0) {
            activeNote.timer = setTimeout(() => {
                this.stopNote(note);
            }, expire);
        }
    }
    async stopNote(note : number) {
        if (!this.activeNotes.has(note)) {
            return;
        }
        /* Note is currently active, so stop playing sound */
        await this.stopSound(note);
        let activeNote = this.activeNotes.get(note)!;

        /* Cancel expiry if exists */
        if (activeNote.timer) {
            clearTimeout(activeNote.timer);
        }

        this.activeNotes.delete(note);
    }

    async startSound(note : number) {
        if (!this.sfz) {
            return;
        }
        /* Regrettably, we are forced to hack...
         * smplr doesn't support non-integer notes.
         * So we will floor to integer note. Then hack into the subplayer to briefly apply
         * tuning correction.
         */
        let trueNote = this.session.mapNote(note);
        let baseNote = Math.floor(trueNote);

        /* First, gain access to the subplayer */
        /* We must ts-ignore to access private property */
        //@ts-ignore
        let subplayer = this.sfz!.player.player.player;//Soundfont.Defaultplayer.QueuedPlayer.Sampleplayer

        /* Store copy of original start routine, then inject a hijacked version which adjusts detune */
        let oldstart = subplayer.start;
        subplayer.start = (sample : any) => {
            sample.detune += 100 * (trueNote-baseNote);
            return oldstart.call(subplayer, sample);
        };

        /* Play note */
        console.log("Start", note, trueNote, baseNote);
        await this.sfz?.start({note: baseNote, velocity:100});

        /* Undo hijacking */
        subplayer.start = oldstart;
    }

    async stopSound(note : number) {
        let trueNote = this.session.mapNote(note);
        let baseNote = Math.floor(trueNote);
        console.log("Stop", note, trueNote, baseNote);
        await this.sfz?.stop(baseNote);
    }

    async setInstrument(instrument : string) {
        this.instrument = instrument;
        await this.stopAll();
        if (this.session.ctx) {
            this.sfz = await new Soundfont(this.session.ctx, {instrument}).load;
        }
    }

    setVolume(volume : number) {
        this.volume = volume;
        this.updateOutputVolume();
    }

    setVolumeAdjustment(adjust : number) {
        this.volumeAdjustment = adjust;
        this.updateOutputVolume();
    }

    updateOutputVolume() {
        console.log(this.volume/50 * this.volumeAdjustment * 127);
        this.sfz?.output.setVolume(this.volume/50 * this.volumeAdjustment * 127);
    }
}