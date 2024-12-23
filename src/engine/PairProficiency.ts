export type PairProficiencyData = Map<string, Map<string, number>>;
export interface PackedPairProficiencyData {
    keymap: string[],
    digest: string
};

export function packPairProficiencies(pdata : PairProficiencyData) : PackedPairProficiencyData {
    /* Collect all keys */
    let keys = new Set();
    for (let [challenge, cpdata] of pdata.entries()) {
        keys.add(challenge);
        for (let guess of cpdata.keys()) {
            keys.add(guess);
        }
    }
    let keymap = [...keys] as string[];
    let digest = [...pdata.entries()].map(([challenge, cpdata])=>{
        return `${keymap.indexOf(challenge)} ` + [...cpdata.entries()].map(([guess, prof])=>{
            return `${keymap.indexOf(guess)}_${prof}`;
        }).join(" ")
    }).join("\n");
    return {
        keymap, digest
    }
}

export function unpackPairProficiencies(packed : PackedPairProficiencyData) : PairProficiencyData {
    let npdata = new Map();
    let lines = packed.digest.split("\n");
    for (let line of lines) {
        let entries = line.split(" ");
        let challenge = packed.keymap[parseInt(entries.shift() as string)];
        for (let entry of entries) {
            let [guessid, prof] = entry.split("_").map(v => parseInt(v, 10));
            setPairProficiency(challenge, packed.keymap[guessid], prof, npdata);
        }
    }
    return npdata;
}

export function setPairProficiency(challenge : string, guess : string, p : number, pdata : PairProficiencyData) {
    if (!pdata.has(challenge)) {
        pdata.set(challenge, new Map());
    }
    pdata.get(challenge)?.set(guess, p);
}