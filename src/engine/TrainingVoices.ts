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
import {NBN_CUSTOM_FONTS} from "src/engine/FontCustomizations";
import {getSoundfontNames as getSmplrFonts} from "smplr";
import { GlobalSettings } from "src/engine/GlobalSettings";

const bad_voices = ["agogo", "applause", "bird_tweet", "brass_section", "choir_aahs", "church_organ",
    "guitar_fret_noise", "guitar_harmonics",  "gunshot", "helicopter", "lead_5_charang",
    "lead_6_voice", "lead_7_fifths", "melodic_tom", "orchestra_hit", "pad_1_new_age",
    "pad_2_warm", "pad_4_choir", "pad_6_metallic", "pad_7_halo", "pad_8_sweep",
    "pizzicato_strings", "reed_organ", "reverse_cymbal", "seashore", "string_ensemble_1",
    "synth_choir", "synth_drum", "taiko_drum", "telephone_ring", "timpani", "tubular_bells",
    "woodblock", "glockenspiel", "rock_organ"];

const smplr_voices = getSmplrFonts();
const good_voices = smplr_voices.filter(instrument => {
    return !bad_voices.includes(instrument) && !instrument.startsWith("fx");
}); 

export class TrainingVoices {
    static voiceListeners : Set<()=>void> = new Set();

    static {
        GlobalSettings.onUpdateSettings(()=>{
            for (let listener of this.voiceListeners) {
                listener();
            }
        });
    }

    static getAllGoodVoices() {
        return [...good_voices, ...Object.keys(NBN_CUSTOM_FONTS), ...Object.keys(GlobalSettings.customURLsList)];
    }

    static getAllVoices() {
        return [...smplr_voices, ...Object.keys(NBN_CUSTOM_FONTS), ...Object.keys(GlobalSettings.customURLsList)];
    }

    static getRandomGoodVoice() {
        let good = this.getAllGoodVoices();
        return good[Math.floor(Math.random() * good.length)];
    }

    static supports(voice : string) {
        let all = this.getAllVoices();
        return all.includes(voice);
    }

    static onVoicesUpdated(callback : ()=>void) : ()=>void {
        this.voiceListeners.add(callback);
        return callback;
    }

    static clearListener(callback : ()=>void) {
        this.voiceListeners.delete(callback);
    }

    static getInstrumentConfig(instrumentName : string) {
        if (instrumentName in GlobalSettings.customURLsList) {
            return {
                instrumentUrl: GlobalSettings.customURLsList[instrumentName]
            }
        }

        if (instrumentName in NBN_CUSTOM_FONTS) {
            return {
                instrumentUrl: NBN_CUSTOM_FONTS[instrumentName]
            }
        }

        return {
            instrument: instrumentName
        }
    }
}