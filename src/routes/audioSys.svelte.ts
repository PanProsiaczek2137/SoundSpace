import { songChanged } from './+layout.svelte';
import { platform } from '@tauri-apps/plugin-os';
import { BaseDirectory, readFile } from '@tauri-apps/plugin-fs';
import * as path from '@tauri-apps/api/path';
import * as mm from 'music-metadata';
export let playList = $state([
    {type: 'musicFolder', src: 'I Want It All.mp3'},
    {type: 'musicFolder', src: 'Gossip.mp3'},
    {type: 'musicFolder', src: 'youtube_sBEfo73lOvk_audio.mp3'},
    

]);
export let playedSong = 0;
export let song = new Audio();
export let songMetaData = {};
export let isPlaying = false;
const currentPlatform = platform();

export function play(play: boolean) {
    if (play) {
        song.play();
        isPlaying = true;
    } else {
        song.pause();
        isPlaying = false;
    }
}

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


setPlayedSong(0)

export async function setPlayedSong(to: number) {
    if (to < 0 || to >= playList.length) {
        console.error('Nieprawidłowy indeks utworu');
        return 'Nieprawidłowy indeks utworu';
    }
    song.pause();
    playedSong = to;
    song = new Audio();
    
    if (playList[playedSong].type === 'musicFolder') {
        const filePath = await readTheFile(playList[playedSong].src);
        
        if (filePath) {
            song = new Audio(filePath);
            await loadSongMetadata(filePath);
        } else {
            console.error('Plik nie jest poprawny');
        }
    } else {
        console.error('Nieznany typ pliku muzycznego');
    }
    console.log('ready!');
    return 'ready!';
}

export function setPlayList() {
    // Funkcjonalność listy odtwarzania
}

async function readTheFile(named: string) {
    try {
        let filePath = "";

        // For mobile (Android/iOS)
        if (currentPlatform === "android" || currentPlatform === "ios") {
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
        songChanged(); // Wywołujemy funkcję songChanged
    } catch (error) {
        console.error('Błąd podczas ładowania metadanych:', error);
    }
}

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
