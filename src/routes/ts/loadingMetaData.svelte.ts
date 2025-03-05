import { writable } from 'svelte/store';
import { getContentOfMusicFolder, readSongsMetaDataFile, addSongMetadata } from './saveSongData.svelte';

export let progres = writable(0);
export let toLoad = writable(0);

export async function loadAllMetaData() {
    const allSongsList = await getContentOfMusicFolder();
    let allReadySongs = await readSongsMetaDataFile() || {}; 
    let allSongsToLoad: any = [];

    console.log('|||||||||||||||||||||||||||||||||||');
    console.log('allSongsList:', allSongsList);
    console.log('allReadySongs:', allReadySongs);
    console.log('|||||||||||||||||||||||||||||||||||');

    if (typeof allReadySongs !== "object" || allReadySongs === null) {
        console.error("BŁĄD: allReadySongs NIE jest obiektem!", allReadySongs);
        allReadySongs = {};
    }

    if (allSongsList) {
        for (let i = 0; i < allSongsList.length; i++) {
            const songName = allSongsList[i].name;

            if (songName in allReadySongs) {
                console.log("już zawiera: " + songName);
            } else {
                console.log("Dodajemy: " + songName);
                allSongsToLoad.push(songName);
            }
        }
    }

    // Ustawiamy wartość max progressu
    toLoad.set(allSongsToLoad.length);
    progres.set(0);  // Resetujemy pasek

    if (allSongsToLoad.length > 0) {
        await load();
    } else {
        progres.set(-1); // Brak nowych plików do dodania
    }

    async function load() {
        for (let index = 0; index < allSongsToLoad.length; index++) {
            console.log("Przesyłamy:", allSongsToLoad[index]);
            await addSongMetadata(allSongsToLoad[index]);  // Czekamy na zakończenie dodawania
            progres.set(index + 1);  // Zwiększamy progres
        }
        console.log("Koniec!");
        progres.set(allSongsToLoad.length);  // Ustawiamy pełny pasek po zakończeniu
        progres.set(-1);
    }
}
