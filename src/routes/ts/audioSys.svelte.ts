//import { songChanged } from './+layout.svelte';
import { BaseDirectory, readFile } from '@tauri-apps/plugin-fs';
import { writable, get } from "svelte/store";
import { currentPlatform } from "./store.svelte"
import * as path from '@tauri-apps/api/path';
import * as mm from 'music-metadata';
export let playList = writable([
    {type: 'musicFolder', src: 'I Want It All.mp3'},
    {type: 'musicFolder', src: "Tame Impala - Track 9 (Lonerism 10th Anniversary) [Extended Mix].mp3"},
    {type: 'musicFolder', src: 'Tame Impala - Intro [Lonerism 2015 Tour] (Oddities II) {Demos｜B-Sides｜Remixes}.mp3'},
    {type: 'musicFolder', src: "Don't Talk To Strangers.mp3"},
]);
export let playedSong = writable(0);
export let isPlaying = writable(false);
let song = new Audio();
let songMetaData = {};
let platfrom = get(currentPlatform)


isPlaying.subscribe( value =>{
    if (value) {
        song.play();
        isPlaying.set(true);
    } else {
        song.pause();
        isPlaying.set(false);
    }
})


export function formatDuration(seconds: number): string {
    const wholeSeconds = Math.floor(seconds);

    const hrs = Math.floor(wholeSeconds / 3600);
    const mins = Math.floor((wholeSeconds % 3600) / 60);
    const secs = wholeSeconds % 60;

    if (hrs > 0) {
        return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else if (mins > 0) {
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    } else {
        return `0:${secs.toString().padStart(2, '0')}`;
    }
}

playedSong.subscribe(async (value) => {
    isPlaying.set(false);

    setTimeout(async () => {
        if (get(playList)[value].type === 'musicFolder') {
            const filePath = await readTheFile(get(playList)[value].src);
            if (filePath) {
                song.pause();      // Zatrzymaj obecną piosenkę
                song.src = "";     // Wyczyść poprzedni utwór, by uniknąć nakładania się dźwięków
                song = new Audio(filePath); // Załaduj nową piosenkę
                //song.play();       // Automatycznie odtwórz nowy utwór
                //isPlaying.set(true);
            }
        }
    }, 0);
});



async function readTheFile(named: string) {
    try {
        let filePath = "";

        // For mobile (Android/iOS)
        if (platfrom() === "android" || platfrom() === "ios") {
            filePath = '/storage/emulated/0/Music/' + named; // Mobile device storage
        } else {
            // For desktop (adjust as necessary)
            const audio = await path.audioDir();
            filePath = await path.join(audio, named);  // Adjust this path to where you store assets on desktop
        }

        // Ensure that the file exists and can be read
        const content = await readFile(filePath, { baseDir: BaseDirectory.Audio });
        const blob = new Blob([content], { type: 'audio/mpeg' });

        return URL.createObjectURL(blob); // Return a valid URL for the audio source
    } catch (error) {
        console.error('Error reading file:', error);
        return null;
    }
}




// Nowa funkcja do ładowania metadanych
async function loadSongMetadata(filePath: string) {
    try {
        // Wczytanie pliku jako ArrayBuffer
        const fileBuffer = await fetch(filePath).then(res => res.arrayBuffer());
        
        // Przekształcenie ArrayBuffer na Uint8Array
        const uint8Array = new Uint8Array(fileBuffer);
        
        // Parsowanie metadanych z Uint8Array
        const metadata = await mm.parseBuffer(uint8Array); // parseBuffer oczekuje Uint8Array
        
        songMetaData = metadata; // Przechowujemy metadane w zmiennej globalnej
        console.log('Metadane utworu:', songMetaData); // Wyświetlamy metadane w konsoli
        //songChanged(); // Wywołujemy funkcję songChanged
    } catch (error) {
        console.error('Błąd podczas ładowania metadanych:', error);
    }
}
/*
export async function returnSongMetadata(filePath: string) {
    try {

        let test = await readTheFile(filePath)

        // Wczytanie pliku jako ArrayBuffer
        if(test){
            const fileBuffer = await fetch(test).then(res => res.arrayBuffer());
            
            // Przekształcenie ArrayBuffer na Uint8Array
            const uint8Array = new Uint8Array(fileBuffer);
            
            // Parsowanie metadanych z Uint8Array
            const metadata = await mm.parseBuffer(uint8Array); // parseBuffer oczekuje Uint8Array
            
            return metadata
        }
    } catch (error) {
        console.error('Błąd podczas ładowania metadanych:', error);
        return null
    }
}
*/
