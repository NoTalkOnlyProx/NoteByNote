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
import {getSoundfontNames as getSmplrFonts} from "smplr";

export const bad_voices = ["agogo", "applause", "bird_tweet", "brass_section", "choir_aahs", "church_organ",
    "guitar_fret_noise", "guitar_harmonics",  "gunshot", "helicopter", "lead_5_charang",
    "lead_6_voice", "lead_7_fifths", "melodic_tom", "orchestra_hit", "pad_1_new_age",
    "pad_2_warm", "pad_4_choir", "pad_6_metallic", "pad_7_halo", "pad_8_sweep",
    "pizzicato_strings", "reed_organ", "reverse_cymbal", "seashore", "string_ensemble_1",
    "synth_choir", "synth_drum", "taiko_drum", "telephone_ring", "timpani", "tubular_bells",
    "woodblock", "glockenspiel", "rock_organ"];

export const smplr_voices = getSmplrFonts();
export const good_voices = smplr_voices.filter(instrument => {
    return !bad_voices.includes(instrument) && !instrument.startsWith("fx");
}); 

export const NBN_CUSTOM_FONTS : {[key: string]: string} = {
    "ntop_vainotron":       "https://notalkonlyprox.github.io/NBNVoices/fonts/vainotron_mp3.js",
    "ntop_bitcrush_sine":   "https://notalkonlyprox.github.io/NBNVoices/fonts/bitcrush_sine_mp3.js",
    "ntop_lush_saw":        "https://notalkonlyprox.github.io/NBNVoices/fonts/lush_saw_mp3.js",
    "ntop_ott_gate_piano":  "https://notalkonlyprox.github.io/NBNVoices/fonts/ott_gate_piano_mp3.js",
    "ntop_sat_sine":        "https://notalkonlyprox.github.io/NBNVoices/fonts/sat_sine_mp3.js",
    "ntop_simple_saw":      "https://notalkonlyprox.github.io/NBNVoices/fonts/simple_saw_mp3.js",
    "ntop_square_pluck":    "https://notalkonlyprox.github.io/NBNVoices/fonts/square_pluck_mp3.js"
}

// Useful: https://sengpielaudio.com/calculator-FactorRatioLevelDecibel.htm
export const NBN_VOLUME_ADJUSTMENTS : {[key: string]: number} = {
    "ntop_vainotron":       0.32,
    "ntop_bitcrush_sine":   0.31,
    "ntop_lush_saw":        0.21,
    "ntop_ott_gate_piano":  0.48,
    "ntop_sat_sine":        0.25,
    "ntop_simple_saw":      0.21,
    "ntop_square_pluck":    0.46
}

export const INST_CLEAN_NTOP = [
    "ntop_vainotron",
    "ntop_lush_saw",
    "ntop_ott_gate_piano",
    "ntop_sat_sine",
    "ntop_simple_saw",
    "ntop_square_pluck",
];

export const INST_CORE_0 = [
    "ntop_vainotron",
    "ntop_sat_sine",
    "ntop_simple_saw",
    "electric_grand_piano",
];

export const INST_CORE_1 = [
    "electric_bass_pick",
    "electric_piano_1",
    "lead_1_square",
    "ntop_lush_saw",
    "marimba",
    "tenor_sax",
    "vibraphone",
    "viola",
    "voice_oohs",//I can't be sure, but my intuition and spectral examination suggest that this contains two notes an octave apart.
];

export const INST_CORE_2 = [
    "banjo",
    "acoustic_bass",
    "bright_acoustic_piano",
    "koto",
    "lead_8_bass__lead",
    "shanai",
    "sitar",
    "slap_bass_2",
    "synth_bass_2",
    "whistle",
    "xylophone",
    "ntop_ott_gate_piano",
    "honkytonk_piano",
    "ntop_square_pluck",
    "clavinet",
    "acoustic_grand_piano",
    "acoustic_guitar_steel",
    "electric_guitar_clean",
];

export const INST_CLEAN_NONCORE = [
    "slap_bass_1",
    "recorder",
    "overdriven_guitar",
    "ocarina",
    "acoustic_guitar_nylon",
    "baritone_sax",
    "blown_bottle",
    "cello",
    "clarinet",
    "dulcimer",
    "electric_guitar_jazz",
    "fretless_bass",
    "kalimba",
    "lead_2_sawtooth",
    "lead_4_chiff",
    "oboe",
    "piccolo",
    "synth_bass_1",
    "synth_strings_2",
    "tremolo_strings",
    "trumpet",
    "tuba",
    "violin",
]

export const INST_DIRTY = [
    "shamisen",//Missing fundamental makes it hard to tell which octave it is in
    "percussive_organ",//Extra bass fundamental makes it possibly confusing
    "distortion_guitar",//Extra bass fundamental makes it possibly confusing
    "accordion",
    "alto_sax",
    "bagpipe",
    "celesta",
    "drawbar_organ",
    "electric_bass_fingere",
    "electric_guitar_muted",
    "electric_piano_2",
    "fiddle",
    "flute",
    "french_horn",
    "harmonica",
    "harpsichord",
    "music_box",
    "muted_trumpet",
    "pad_3_polysynth",
    "shakuhachi",
    "soprano_sax",
    "steel_drums",
    "synth_brass_1",
    "synth_brass_2",
    "tango_accordion",
    "tinkle_bell",
    "ntop_bitcrush_sine",
];

export const INST_REJECTED = [
    "breath_noise",
    "pad_5_bowed",
    "synth_strings_1",
    "string_ensemble_2",
];
