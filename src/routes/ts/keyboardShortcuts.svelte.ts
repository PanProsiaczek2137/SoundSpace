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
    onMount(()=>{
        const info = 'mediaSession' in navigator;
        const test = document.getElementById("testtt") as HTMLParagraphElement;
        test.innerText = String(info);
    })

    console.log("MediaSession API dostępne:", 'mediaSession' in navigator);

    const nextSongButton = document.getElementById("play-next") as HTMLButtonElement;
    const playPrevius = document.getElementById("play-previus") as HTMLButtonElement;

    if ('mediaSession' in navigator) {
        try {
            navigator.mediaSession.setActionHandler('play', () => {
                console.log("PLAY!");
                isPlaying.set(true);
            });
        } catch (e) {
            console.error("Błąd Media Session (play):", e);
        }
        

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


    
}






// keyboardShortcuts.svelte.ts
type KeyCombination = string[];
type ShortcutAction = () => void;

class KeyboardShortcuts {
    private shortcuts: Map<string, ShortcutAction> = new Map();
    private blockedShortcuts: Set<string> = new Set([
        "F12", "F5", "F3", "F7",
        "Ctrl+U", "Ctrl+R", "Ctrl+F", "Ctrl+G", "Ctrl+P", "Ctrl+J",
        "Ctrl+Shift+I", "Ctrl+Shift+P", "Ctrl+Shift+G", "Ctrl+Shift+C", "Ctrl+Shift+S"
    ]);

    private activeKeys: Set<string> = new Set(); // Zmienna do przechowywania aktywnych klawiszy

    constructor() {
        window.addEventListener("keydown", this.handleKeyDown.bind(this));
        window.addEventListener("keyup", this.handleKeyUp.bind(this)); // Nasłuchujemy również na 'keyup'
    }

    private normalizeKey(key: string): string {
        return key.toLowerCase(); // Normalizujemy klawisze, by ignorować wielkość liter
    }

    private handleKeyDown(event: KeyboardEvent) {
        if (this.activeKeys.has(event.key)) {
            return; // Ignorujemy, jeśli klawisz jest już aktywny
        }

        this.activeKeys.add(event.key);

        // Normalizujemy naciśnięty klawisz
        const normalizedKey = this.normalizeKey(event.key);

        // Sprawdzamy, czy dla tego klawisza jest przypisana akcja
        const action = this.shortcuts.get(normalizedKey);
        if (action) {
            event.preventDefault();
            action();
            this.clearActiveKeys(); // Resetujemy aktywne klawisze po wywołaniu akcji
        }
    }

    private handleKeyUp(event: KeyboardEvent) {
        this.activeKeys.delete(event.key); // Usuwamy klawisz z aktywnych, gdy użytkownik go puści
    }

    public addShortcut(key: string, action: ShortcutAction) {
        const normalizedKey = this.normalizeKey(key);
        
        // Jeśli klawisz już istnieje, usuwamy poprzednią akcję
        this.removeShortcut(normalizedKey);

        this.shortcuts.set(normalizedKey, action); // Przypisujemy akcję do klawisza
    }

    public removeShortcut(key: string) {
        const normalizedKey = this.normalizeKey(key);
        this.shortcuts.delete(normalizedKey); // Usuwamy akcję dla danego klawisza
    }

    private clearActiveKeys() {
        this.activeKeys.clear(); // Resetujemy aktywne klawisze
    }
}

// Tworzymy instancję klasy KeyboardShortcuts
const keyboardShortcutsInstance = new KeyboardShortcuts();

// Eksportujemy instancję, by była dostępna w innych plikach
export default keyboardShortcutsInstance;
