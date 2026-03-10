<!-- This is a modified version of https://github.com/danferns/svelte-piano by Daniel Fernandes (MIT license) -->
<script>
     let {
        noteNum = undefined,
        keyWidth = 56,
        pressed = false,
        highlighted = false,
        toggle = false,
        onnoteon,
        onnoteoff
    } = $props();

    let isNatural = $derived(![1, 3, 6, 8, 10].includes(noteNum % 12));
    let bias = $state(0);

    $effect(()=>{
        // the accidental keys are not perfectly in center
        if (!isNatural) {
            if ([1, 6].includes(noteNum % 12)) bias = -keyWidth / 12;
            else if ([3, 10].includes(noteNum % 12)) bias = keyWidth / 12;
        }
    })

    export function reset() {
        noteOff();
    }

    function keyPressed(event) {
        event?.preventDefault();
        if (!toggle) {
            noteOn();
        }
        else {
            if (!pressed){
                noteOn();
            } else {
                noteOff();
            }
        }
    }

    function keyReleased(event) {
        event?.preventDefault();
        if (!toggle) {
            noteOff();
        }
    }

    function noteOn() {
        console.log("noteOn", onnoteon);
        if (pressed) return;
        onnoteon?.(noteNum);
        pressed = true;
    }

    function noteOff() {
        if (!pressed) return;
        onnoteoff?.(noteNum);
        pressed = false;
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
        class:highlighted
        class:accidental={!isNatural}
        class:natural={isNatural}
        class:pressed
        style="--width: {keyWidth - keyWidth * 0.47 * !isNatural}px; transform: translate({bias}px);"
        draggable="false"
        onmousedown={keyPressed}
        onmouseup={keyReleased}
        onmouseenter={(e) => {
        if (e.buttons) keyPressed();
    }}
        onmouseleave={(e) => {
        if (e.buttons) keyReleased();
    }}
        ontouchstart={keyPressed}
        ontouchend={keyReleased}
></div>

<style>
    div {
        flex-shrink: 0;
        width: var(--width);
        min-width: min-content;

        border-radius: 0px 0px calc(var(--width) / 8) calc(var(--width) / 8);
        -webkit-user-drag: none;
    }

    .accidental {
        margin: 0px calc(var(--width) / -2) 0px calc(var(--width) / -2);
        z-index: 2;

        height: 60%;

        box-shadow: inset white 0px 0px 2px 0px;
    }

    .accidental:not(.highlighted) {
        background: black;
    }

    .highlighted {
        background: #00aaaa;
    }
    .highlighted .accidental {
        background: #006666;
    }

    .natural {
        height: 100%;
        box-shadow: inset black 0px 0px 2px 0px;
    }

    .accidental.pressed {
        background: hsl(0 0% 30%);
    }

    .natural.pressed {
        background: hsl(0 0% 90%);
    }
</style>
