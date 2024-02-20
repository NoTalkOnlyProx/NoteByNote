export type Tuning =  {
    neutral : number;
    /* Standard convention we are going to use is that semitone 0 is middle C / 261.625 hz */
    values : number[];
}

export const ED2_12_TUNING = {
    neutral : 100,
    values : Array.from({ length: 200 }, (value, index) => index - 100)
}

export const ED2_24_TUNING = {
    neutral : 100,
    values : Array.from({ length: 200 }, (value, index) => (index - 100.0)/2.0)
}
