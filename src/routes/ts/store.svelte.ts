import { platform } from '@tauri-apps/plugin-os';
import { writable } from "svelte/store";

export const currentPlatform = writable(platform);
export let areWeMoveingTheSong = writable(false)
export let playlistMetaData:any = writable({})