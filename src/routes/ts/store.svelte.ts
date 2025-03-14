import { platform } from '@tauri-apps/plugin-os';
import { writable } from "svelte/store";

export const currentPlatform = writable(platform);
export let areWeMoveingTheSong = writable(false)
export let playlistMetaData:any = writable({})
export let selectedPanel = writable('home')
//export let visibleFull = writable(false)
export let canShowContextMenu = writable(false)
export let ContextMenuOn:any = writable({})
export let visibleContextMenu = writable(false);

export let readyToLoadMetaData = writable(false);

export let selectedFilter = writable("all");
export let selectedValue = writable("");

export let isDropDownOpen = writable(false);



/*
import { playList } from './audioSys.svelte';
import { readSongsMetaDataFile } from './saveSongData.svelte';

playList.subscribe(()=>{
    (async ()=>{
        readyToLoadMetaData.set(false);
        const metaData = await readSongsMetaDataFile()
        playlistMetaData.set(metaData)
        setTimeout(() => {
            readyToLoadMetaData.set(true);
        }, 100);
    })()
})
*/