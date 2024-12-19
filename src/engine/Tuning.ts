export type Tuning =  {
    name : string;
    neutral : number;
    /* Standard convention we are going to use is that semitone 0 is middle C / 261.625 hz */
    values : number[];
}

export function GenerateTuning(tname: string, notes : number, ED : number,
                               neutral:number=100, total:number=200) {
    return {
        name: tname,
        neutral: neutral,
        values : Array.from({ length: total }, (value, index) =>
            Math.log2(Math.pow(ED, (index - neutral)/notes)) * 12
        ).map(val => Number(val.toFixed(2)))
    }
}

export function GenerateTuningCents(tname: string, cents : number,
    neutral:number=100, total:number=200) {
    return {
        name: tname,
        neutral: neutral,
        values : Array.from({ length: total }, (value, index) =>
            (index - neutral) * cents/100
        ).map(val => Number(val.toFixed(2)))
    }
}

export const ALL_TUNINGS = [
    GenerateTuning("12ED2", 12, 2),
    GenerateTuning("19ED2", 19, 2),
    GenerateTuning("24ED2", 24, 2),
    GenerateTuning("31ED2", 31, 2),
    GenerateTuning("16ED3", 16, 3),
];

export function getTuning(tname : string) {
    for (let tuning of ALL_TUNINGS) {
        if (tuning.name === tname) {
            return tuning;
        }
    }
}

/* Heuristic to calculate the difference in notes required to get a semitone interval */
export function getTuningSpan(tuning : Tuning, semitones : number) {
    return getLastSmallerIntervalFrom(tuning, tuning.neutral, semitones) - tuning.neutral;
}

export function getLastSmallerIntervalFrom(tuning : Tuning, initialNote : number, semitones : number) {
    for (let i = initialNote + 1; i < tuning.values.length; i++) {
        let interval = (tuning.values[i] - tuning.values[initialNote]);
        if (interval > semitones) {
            return i-1;
        }
    }
    return tuning.values.length - initialNote - 1;
}

export function packTuning(tuning : Tuning) {
    let vals = tuning.values.map(val => Number(val.toFixed(2)));
    let name = tuning.name.replace(/[^.a-zA-Z0-9_-]/,"");
    return `${name}|${tuning.neutral}|${vals.join(" ")}`;
}

export function unpackTuning(packed : string | undefined) : Tuning | undefined {
    let sections = (packed ?? "").split("|");
    if (sections.length != 3) {
        return undefined;
    }
    let [name,neutral,vals] = sections;
    return {
        name: name.replace(/[^.a-zA-Z0-9_-]/,""),
        neutral: parseInt(neutral),
        values: vals.split(" ").map(v => parseFloat(v)),
    }
}
