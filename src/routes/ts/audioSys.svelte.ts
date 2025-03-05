import { BaseDirectory, readFile } from '@tauri-apps/plugin-fs';
import { writable, get } from "svelte/store";
import { currentPlatform } from "./store.svelte"
import * as path from '@tauri-apps/api/path';
import * as mm from 'music-metadata';
import {readyToLoadMetaData, playlistMetaData} from './store.svelte'
import {readSongsMetaDataFile, readTheImgFile} from './saveSongData.svelte'
export let playList = writable([
    {type: 'musicFolder', src: "Tame Impala - Track 9 (Lonerism 10th Anniversary) [Extended Mix].mp3"},
]);
export let playedSong = writable(0);
export let isPlaying = writable(false);
export let visible = writable(false);
let song = new Audio();
let songMetaData = {};
let platfrom = get(currentPlatform)

playList.subscribe(()=>{
    readyToLoadMetaData.set(false);
    (async ()=>{
        const metaData = await readSongsMetaDataFile()
        playlistMetaData.set(metaData)
        setTimeout(() => {
            readyToLoadMetaData.set(true);
        }, 100);
    })()
})
/*
onMount( ()=>{
    
})
*/

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
                const albumPuctureOnBar = document.getElementById('album-pucture-on-bar') as HTMLImageElement;
                const pictureAndInfoSongName = document.getElementById('picture-and-info-song-name') as HTMLElement;
                const pictureAndInfoArtistAlbum = document.getElementById('picture-and-info-artist-album') as HTMLElement;

                const allSongsMetaData = await readSongsMetaDataFile()
                
                pictureAndInfoSongName.innerText = allSongsMetaData[get(playList)[value].src].title
                pictureAndInfoArtistAlbum.innerText = `${allSongsMetaData[get(playList)[value].src].artist} • ${allSongsMetaData[get(playList)[value].src].album}`
                const img = await readTheImgFile(allSongsMetaData[get(playList)[value].src].picture)
                //@ts-ignore
                albumPuctureOnBar.src = img;
                updateFullImgs()

                if(!(platfrom() === "android" || platfrom() === "ios")){
                    //@ts-ignore
                    fullPictureBlure.src = img;
                    //@ts-ignore
                    fullPicture.src = img;
                }
                //song.play();       // Automatycznie odtwórz nowy utwór
                //isPlaying.set(true);
            }
        }
    }, 0);
});

visible.subscribe(()=>{
    setTimeout(() => {
        updateFullImgs();
    }, 0);
})

async function updateFullImgs(){
    const albumPuctureOnBar = document.getElementById('album-pucture-on-bar') as HTMLImageElement;
    const fullPicture = document.getElementById('full-picture') as HTMLImageElement;
    const fullPictureBlure = document.getElementById('full-picture-blure') as HTMLImageElement;

    if(!(platfrom() === "android" || platfrom() === "ios")){
        //@ts-ignore
        fullPictureBlure.src = albumPuctureOnBar.src;
        //@ts-ignore
        fullPicture.src = albumPuctureOnBar.src;
    }
}

        
    


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


export function printSelectedData(searchField: string, searchValue: string, data: any) {
        
   
    if (data && typeof data === "object") {

        let list = [];



        const songs:any = Object.values(data);
        console.log("-----=-=-=-----------=====-=-")
        console.log(songs);
        console.log("-----=-=-=-----------=====-=-")

        for(let i = 0; i < songs.length; i++) {

            if(searchField == "artist") {
                if(songs[i].artist == searchValue) {
                    list.push(songs[i]);
                }
            }

            if(searchField == "album") {
                if(songs[i].album == searchValue) {
                    list.push(songs[i]);
                }
            }

            if(searchField == "genre") {
                if(songs[i].genre == searchValue) {
                    list.push(songs[i]);
                }
            }

            if(searchField == "duration") {
                if(searchValue == "1min" && songs[i].duration < 60) {
                    list.push(songs[i]);
                }
                if(searchValue == "2min" && songs[i].duration >= 60 && songs[i].duration <= 120) {
                    list.push(songs[i]);
                }
                if(searchValue == "3min" && songs[i].duration >= 120 && songs[i].duration <= 180) {
                    list.push(songs[i]);
                }
                if(searchValue == "4min" && songs[i].duration >= 180 && songs[i].duration <= 240) {
                    list.push(songs[i]);
                }
                if(searchValue == "5min" && songs[i].duration >= 240 && songs[i].duration <= 300) {
                    list.push(songs[i]);
                }
                if(searchValue == "10min" && songs[i].duration >= 300 && songs[i].duration <= 600) {
                    list.push(songs[i]);
                }
                if(searchValue == "20min" && songs[i].duration >= 600 && songs[i].duration <= 1200) {
                    list.push(songs[i]);
                }
                
            }



            if (searchField == "year") {
                const year = parseInt(searchValue); // Konwersja "2020s", "1800" na liczbę

                for (let i = 0; i < songs.length; i++) {
                    const songYear = songs[i].year;
                    let shouldAddSong = false;

                    if (searchValue.endsWith("s")) {
                        // Jeśli to dekada (np. "2020s"), sprawdzamy czy rok mieści się w zakresie
                        if (songYear >= year && songYear < year + 10) {
                            shouldAddSong = true;
                        }
                    } else {
                        // Jeśli to setka (np. "1800"), sprawdzamy czy rok mieści się w przedziale
                        if (songYear >= year && songYear < year + 100) {
                            shouldAddSong = true;
                        }
                    }

                    // Dodajemy piosenkę, jeśli spełnia warunki i nie ma jej jeszcze w liście
                    if (shouldAddSong && !list.includes(songs[i])) {
                        list.push(songs[i]);
                    }
                }
            }




        };

        return list;
    
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