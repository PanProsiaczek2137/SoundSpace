<script lang="ts">
    import Song from "./song.svelte";
    import { playList } from "../ts/audioSys.svelte";
    import { readTheFile } from '../ts/saveSongData.svelte'
    import { onMount } from "svelte";
    export let type: string;
    export let data: string;

    let songToPrint:any = [];

    let randomPlaylists: HTMLElement | null = null;
    let mouseX = 0, mouseY = 0;

    function updateGlow(event: MouseEvent) {
        if (!randomPlaylists) return;
        const rect = randomPlaylists.getBoundingClientRect();
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;
        randomPlaylists.style.background = `radial-gradient(circle at ${mouseX}px ${mouseY}px, var(--ligth-black), var(--black))`;
    }



    function handleMouseLeave() {
        if (!randomPlaylists) return;
        randomPlaylists.style.background = `radial-gradient(circle at 50% 50%, var(--ligth-black), var(--black))`;
    }



    async function setToRandomSongs() {
        const allSongs = await readTheFile(true, "");

        // Sprawdzenie, czy allSongs jest poprawnym obiektem JSON
        if (!allSongs) return;

        let parsedSongs: Record<string, any>;
        try {
            parsedSongs = JSON.parse(allSongs); // Konwersja z tekstu na obiekt
        } catch (error) {
            console.error("Błąd parsowania JSON:", error);
            return;
        }

        const keys = Object.keys(parsedSongs);
        if (keys.length < 25) {
            console.warn("Za mało piosenek w bazie, aby wylosować 5 unikalnych.");
            return keys.map(key => parsedSongs[key]); // Zwraca wszystkie, jeśli jest ich mniej niż 25
        }

        // Wylosowanie 5 unikalnych indeksów
        const selectedKeys = new Set<string>();
        while (selectedKeys.size < 25) {
            const randomIndex = Math.floor(Math.random() * keys.length);
            selectedKeys.add(keys[randomIndex]);
        }

        // Pobranie piosenek z wylosowanych kluczy
        const randomSongs = Array.from(selectedKeys).map(key => parsedSongs[key]);

        let tempPlayList = [];
        for(let i = 0; i < randomSongs.length; i++){
            tempPlayList.push({type: 'musicFolder', src: randomSongs[i].fileName});
        }
        playList.set(tempPlayList);
    }


    onMount(async () => {
    if (type == "od artysty X") {
        const allSongs = await readTheFile(true, "");
        
        if (!allSongs) {
            console.warn("Plik nie zawiera danych lub nie istnieje.");
            return;
        }

        let parsedSongs: Record<string, any>;
        try {
            parsedSongs = JSON.parse(allSongs);
        } catch (error) {
            console.error("Błąd parsowania JSON:", error);
            return;
        }

        const keys = Object.keys(parsedSongs);

        if (keys.length === 0) {
            console.warn("Brak piosenek w bazie.");
            return;
        }

        let list: any[] = [];
        for (let i = 0; i < keys.length; i++) {
            if (parsedSongs[keys[i]].artist == data) {
                list.push(parsedSongs[keys[i]]);
            }
        }


        if (list.length < 15) {
            console.warn("Za mało piosenek od tego artysty, dodajemy wszystkie.");
            songToPrint = [...list]; // Jeśli mniej niż 15, bierzemy wszystkie
        } else {
            // Losujemy 15 unikalnych indeksów
            const selectedIndexes = new Set<number>();
            while (selectedIndexes.size < 15) {
                const randomIndex = Math.floor(Math.random() * list.length);
                selectedIndexes.add(randomIndex);
            }

            // Pobieramy piosenki według wylosowanych indeksów
            songToPrint = Array.from(selectedIndexes).map(index => list[index]);
        }

        console.log("Losowe 15 piosenek:", songToPrint);
    }
});



</script>

<div id="home-section-container" class="scrollY">
    {#if type == "losowa playlista"}
        <div id="random-playlists" 
            role="presentation"
            bind:this={randomPlaylists} 
            onmousemove={updateGlow} 
            onmouseleave={handleMouseLeave}
            onclick={setToRandomSongs}
        >
            <h1>Losowe playlisty</h1>
        </div>
    {/if}



    {#if type == "od artysty X"}
        <h2>Od Artysty X</h2>
        <div id="scroll-container">
            {#if songToPrint.length != 0}
                {#each songToPrint as data, index}
                <Song name={data.title}
                        image="Lonerism.png" 
                        album={data.album}
                        artist={data.artist} />
                {/each}
            {/if}
        </div>
    {/if}



    {#if type == "od albumu X"}
        <h2>Z Albumu X</h2>
        <div id="scroll-container">
            {#each Array(15) as _}
            <Song name="Nothing That Has Happened So Far Has Been Anything We Could Control" 
                    image="Lonerism.png" 
                    album="Lonerism" 
                    artist="Tame Impala" />
            {/each}
        </div>
    {/if}
</div>

<style>

    #scroll-container{
        display: flex;
        overflow-x: scroll;
    }






    #home-section-container {
        width: 100%;
        height: 300px;
        overflow-y: hidden;
    }

    #random-playlists {
        width: calc(100% - 50px);
        height: 250px;
        margin: 25px;
        background: radial-gradient(circle at 50% 50%, var(--ligth-black), var(--black));
        display: flex;
        justify-content: center;
        align-items: center;
        transition: background 0.2s ease-out;
        border-radius: 5px;
    }

    h1 {
        font-size: 2.5rem;
        font-weight: bold;
        background: linear-gradient(90deg, var(--white), var(--white));
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 2px 2px 8px var(--dark-white);
        transition: transform 0.2s ease-out;
        font-family: var(--font);
        text-align: center;
    }

    h2{
        color: var(--white);
        font-family: var(--font);
        font-size: 2rem;
        padding-top: 5px;
        padding-bottom: 6px;
        margin-left: 25px;
        position: relative;
    }

    #random-playlists:hover h1 {
        transform: scale(1.05);
    }
</style>
