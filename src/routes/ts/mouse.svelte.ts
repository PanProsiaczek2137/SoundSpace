import { onMount } from 'svelte'
//export let mouseY:any
onMount(()=>{
    document.addEventListener('mousemove', (event)=>{
        //mouseY = event
    })
})