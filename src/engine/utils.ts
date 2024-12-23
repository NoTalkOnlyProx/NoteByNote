/* I used this in a prototype, but the usage got removed, but I am tired of re-implementing it
 * so it stays, for the next time I need it.
 */
export function fisherYates(array : any) {
    for (let i = array.length; i > 0; i--) {
        let rand = Math.floor(Math.random() * i);
        [array[0], array[rand]] = [array[rand], array[0]];
    }
}

export function toInt(raw : string | number) {
    if (typeof raw === 'number') {
        return raw;
    }
    let val = parseInt(raw, 10);
    if (isNaN(val)) {
        return undefined;
    }
    return val;
}