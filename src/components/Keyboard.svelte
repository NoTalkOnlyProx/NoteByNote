<!-- This is a modified version of https://github.com/danferns/svelte-piano by Daniel Fernandes (MIT license) -->
<script>
    let {
        octaves = 2,
        middleC = 60,
        keysPressed = [],
        highlight = [],
        toggle = false,
        onnoteon,
        onnoteoff
    } = $props();

   import Key from "./Key.svelte";
   let keyelements = $state([]);

   let keys = $derived([...Array(octaves * 12 + 1).keys()].map(
      (i) => i + (middleC - Math.floor(octaves / 2) * 12)
   ));

   export function reset() {
       for (let key of keyelements) {
           key.reset();
       }
   }
</script>

<div class="keyboard">
   <div>
       {#each keys as note, i}
           <Key bind:this={keyelements[i]} noteNum={note} {toggle} highlighted={highlight.includes(note)} pressed={keysPressed.includes(note)} onnoteon={onnoteon} onnoteoff={onnoteoff}/>
       {/each}
   </div>
</div>

<style>
   .keyboard {
       display: flex;
       justify-content: center;
   }

   .keyboard > div {
       display: flex;
       overflow: auto;
       padding: 8px;
       height: 192px;
   }
</style>