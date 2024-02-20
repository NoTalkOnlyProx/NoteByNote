<!-- This is a modified version of https://github.com/danferns/svelte-piano by Daniel Fernandes (MIT license) -->
<script>
   export let octaves = 2;
   export let middleC = 60;
   export let keysPressed = [];
   export let highlight = [];
   export let toggle = false;


   $: console.log(highlight);

   import Key from "./Key.svelte";
   let keys;
   let keyelements = [];

   export function reset() {
       for (let key of keyelements) {
           key.reset();
       }
   }

   $: keys = [...Array(octaves * 12 + 1).keys()].map(
       (i) => i + (middleC - Math.floor(octaves / 2) * 12)
   );
</script>

<div class="keyboard">
   <div>
       {#each keys as note, i}
           <Key bind:this={keyelements[i]} noteNum={note} {toggle} on:noteon on:noteoff highlighted={highlight.includes(note)} pressed={keysPressed.includes(note)}/>
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