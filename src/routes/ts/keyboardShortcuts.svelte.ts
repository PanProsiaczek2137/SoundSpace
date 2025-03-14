import { onMount } from 'svelte';
import { isPlaying, playedSong, playList } from './audioSys.svelte';
import { readSongsMetaDataFile, readTheImgFile } from './saveSongData.svelte'
import { get } from 'svelte/store';





// Funkcja aktualizacji metadanych
export async function updateMediaSessionMetadata(songData: any) {
    const imgData = await readTheImgFile(songData.picture);
    
    if (!imgData) {
        console.error('Błąd: Obrazek nie został załadowany.');
        return;
    }

    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: songData.title,
            artist: songData.artist,
            album: songData.album,
            artwork: [
                { src: imgData, sizes: "512x512", type: "image/jpeg" }
            ]
        });
    }
}







export function spectialButtons() {
    const nextSongButton = document.getElementById("play-next") as HTMLButtonElement;
    const playPrevius = document.getElementById("play-previus") as HTMLButtonElement;

    if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', () => {
            console.log("PLAY!")
            isPlaying.set(true);
        });

        navigator.mediaSession.setActionHandler('pause', () => {
            console.log("pause!")
            isPlaying.set(false);
        });

        navigator.mediaSession.setActionHandler('nexttrack', async () => {
            nextSongButton.click();

            // Pobierz nowe metadane po zmianie utworu
            await new Promise(resolve => setTimeout(resolve, 100)); // Czekaj chwilę na aktualizację stanu
            const data = await readSongsMetaDataFile();
            const songData = data[get(playList)[get(playedSong)].src];
            updateMediaSessionMetadata(songData);
        });

        navigator.mediaSession.setActionHandler('previoustrack', () => {
            playPrevius.click();
        });
    }

    // Ustaw metadane dla pierwszej piosenki
    (async () => {
        const data = await readSongsMetaDataFile();
        const songData = data[get(playList)[get(playedSong)].src];
        updateMediaSessionMetadata(songData);
    })();
}





export function keyboardShortcuts() {

    const blockedShortcuts = new Set([
        "F12", "F5", "F3", "F7",
        "Ctrl+U", "Ctrl+R", "Ctrl+F", "Ctrl+G", "Ctrl+P", "Ctrl+J",
        "Ctrl+Shift+I", "Ctrl+Shift+P", "Ctrl+Shift+G", "Ctrl+Shift+C", "Ctrl+Shift+S"
    ]);

    window.addEventListener("keydown", (event) => {
        const keys: string[] = [];

        if (event.ctrlKey) keys.push("Ctrl");
        if (event.shiftKey) keys.push("Shift");
        keys.push(event.key.toUpperCase());

        const combination = keys.join("+");

        if (blockedShortcuts.has(combination)) {
            event.preventDefault();
            console.log(`${combination} jest zablokowane!`);
        }
    });




    const keyboardShortcuts = new KeyboardShortcuts();



    //! DOMYŚLNE SKRÓTY
    keyboardShortcuts.addShortcut([" "], () => {
        isPlaying.set(!get(isPlaying));
    });
    
    keyboardShortcuts.addShortcut(["Ctrl", "Shift", "N"], () => {
        console.log("Nowy dokument!");
    });

    
}




type KeyCombination = string[];
type ShortcutAction = () => void;

class KeyboardShortcuts {
    private shortcuts: Map<string, ShortcutAction> = new Map();
    private blockedShortcuts: Set<string> = new Set([
        "F12", "F5", "F3", "F7",
        "Ctrl+U", "Ctrl+R", "Ctrl+F", "Ctrl+G", "Ctrl+P", "Ctrl+J",
        "Ctrl+Shift+I", "Ctrl+Shift+P", "Ctrl+Shift+G", "Ctrl+Shift+C", "Ctrl+Shift+S"
    ]);

    constructor() {
        window.addEventListener("keydown", this.handleKeyDown.bind(this));
    }

    private normalizeCombination(keys: KeyCombination): string {
        return keys.map(k => k.toLowerCase()).sort().join("+");
    }

    private handleKeyDown(event: KeyboardEvent) {
        const keys: string[] = [];
        if (event.ctrlKey) keys.push("Ctrl");
        if (event.shiftKey) keys.push("Shift");
        if (event.altKey) keys.push("Alt");
        if (event.metaKey) keys.push("Meta");
        keys.push(event.key);

        const combination = this.normalizeCombination(keys);

        if (this.blockedShortcuts.has(combination)) {
            event.preventDefault();
            console.log(`${combination} jest zablokowane!`);
            return;
        }

        const action = this.shortcuts.get(combination);
        if (action) {
            event.preventDefault();
            action();
        }
    }

    public addShortcut(keys: KeyCombination, action: ShortcutAction) {
        const combination = this.normalizeCombination(keys);
        this.shortcuts.set(combination, action);
    }

    public removeShortcut(keys: KeyCombination) {
        const combination = this.normalizeCombination(keys);
        this.shortcuts.delete(combination);
    }
}
