import { writable } from 'svelte/store';

export let reload = writable(false)
export let areWeMoveingTheSong = writable(false)
export let oblongSongLoading = writable(0)

export let songsToLoad = writable(5);

export let mousePosY = writable(0);
document.addEventListener('pointermove', (event)=>{
    mousePosY.set(event.clientY)
});