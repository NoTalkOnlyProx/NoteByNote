import { INST_CORE_0, INST_CORE_1, INST_DIRTY, INST_CORE_2, INST_CLEAN_NONCORE } from "src/engine/VoiceData";

export interface PriorityGroup {
    /* Instruments in the group */
    names: string[];
    
    /* Priority factor for members of this group. The priority of any pair is
     * the product of the priorities of the members of the pair.
     */
    priority: number;

    /* Required mastery for members of this group.
     * For any pair, the lowest mastery is selected between the two.
     */
    mastery: number;
    /* Members of mono groups are only ever paired with themselves.
     * Members of core groups pair with each other, or with ext.
     * Members of int groups only pair with ext.
     * Members of ext groups only pair with members of core groups.
     */
    mode: "mono" | "core" | "ext" | "int";
}

export interface CBPairing {
    challenge: string;
    guess: string;
    priority: number;
    mastery: number;
    urgency:number;
    actual: number;
}

export interface CB_PROGRAM {
    name: string;
    groups: PriorityGroup[];
}

const PROG_LEVEL_0 : CB_PROGRAM = {
    name: "Level 0: Matched voices, simple chords",
    groups: [{
        names: [...INST_CORE_0],
        priority: 100,
        mastery: 3,
        mode: "mono"
    }]
};

const PROG_LEVEL_1 : CB_PROGRAM = {
    name: "Level 1: Matched voices, harder chords, more sounds",
    groups: [{
        names: [...INST_CORE_0],
        priority: 100,
        mastery: 5,
        mode: "mono"
    },{
        names: [...INST_CORE_1],
        priority: 50,
        mastery: 4,
        mode: "mono"
    }]
};

const PROG_LEVEL_2 : CB_PROGRAM = {
    name: "Level 2: Differing voices, simple chords",
    groups: [{
        names: [...INST_CORE_0],
        priority: 100,
        mastery: 3,
        mode: "core"
    }]
};

const PROG_LEVEL_3 : CB_PROGRAM = {
    name: "Level 3: Differing voices, harder chords, more sounds",
    groups: [{
        names: [...INST_CORE_0],
        priority: 100,
        mastery: 5,
        mode: "core"
    },{
        names: [...INST_CORE_1],
        priority: 50,
        mastery: 4,
        mode: "ext"
    }]
};

const PROG_LEVEL_4 : CB_PROGRAM = {
    name: "Level 4: Dirty Voices",
    groups: [{
        names: [...INST_CORE_0, ...INST_CORE_1],
        priority: 100,
        mastery: 3,
        mode: "int"
    },{
        names: [...INST_DIRTY],
        priority: 100,
        mastery: 3,
        mode: "ext"
    }]
};

const PROG_LEVEL_5 : CB_PROGRAM = {
    name: "Level 5: Clean Mastery",
    groups: [{
        names: [...INST_CORE_0, ...INST_CORE_1],
        priority: 100,
        mastery: 6,
        mode: "core"
    },{
        names: [...INST_CORE_2, ...INST_CLEAN_NONCORE],
        priority: 50,
        mastery: 5,
        mode: "ext"
    }]
};

const PROG_LEVEL_6 : CB_PROGRAM = {
    name: "Level 6: Broad Mastery",
    groups: [{
        names: [...INST_CORE_0, ...INST_CORE_1, ...INST_DIRTY],
        priority: 100,
        mastery: 6,
        mode: "core"
    },{
        names: [...INST_CORE_2, ...INST_CLEAN_NONCORE],
        priority: 50,
        mastery: 5,
        mode: "ext"
    }]
};

const PROG_LEVEL_7 : CB_PROGRAM = {
    name: "Level 7: Total Mastery",
    groups: [{
        names: [
            ...INST_CORE_0, ...INST_CORE_1, ...INST_DIRTY,
            ...INST_CORE_2, ...INST_CLEAN_NONCORE
        ],
        priority: 100,
        mastery: 6,
        mode: "core"
    }]
};

export const CHALLENGE_B_PROGRAMS : CB_PROGRAM[] = [
    PROG_LEVEL_0,
    PROG_LEVEL_1,
    PROG_LEVEL_2,
    PROG_LEVEL_3,
    PROG_LEVEL_4,
    PROG_LEVEL_5,
    PROG_LEVEL_6,
    PROG_LEVEL_7
]