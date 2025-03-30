<script lang="ts">
    import Song from "./song.svelte";
    import { playList } from "../ts/audioSys.svelte";
    import { readTheFile, readTheImgFile } from '../ts/saveSongData.svelte'
    import { currentPlatform, playPlaylistFormStart, canWePlaySong } from '../ts/store.svelte.ts'
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    export let type: string;
    export let data: string;

    let songToPrint:any = [];

    let randomPlaylists: HTMLElement | null = null;
    let mouseX = 0, mouseY = 0;
    let imgs:any = [];

    let Xfrom = "";
    const platform = get(currentPlatform);

    function updateGlow(event: MouseEvent) {
        if (!randomPlaylists) return;
        if(platform() === "android" || platform() === "ios"){
            randomPlaylists.style.background = `radial-gradient(circle at 50% 50%, var(--ligth-black), var(--black))`;
        }else{
            const rect = randomPlaylists.getBoundingClientRect();
            mouseX = event.clientX - rect.left;
            mouseY = event.clientY - rect.top;
            randomPlaylists.style.background = `radial-gradient(circle at ${mouseX}px ${mouseY}px, var(--ligth-black), var(--black))`;
        }
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
        playPlaylistFormStart.set(true);
        canWePlaySong.set(true);
        playList.set(tempPlayList);
        playPlaylistFormStart.set(false);
    }


    onMount(async () => {

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



        if (type == "od artysty X") {
            let list: any[] = [];
            for (let i = 0; i < keys.length; i++) {
                if (parsedSongs[keys[i]].artist == data) {
                    list.push(parsedSongs[keys[i]]);
                }
            }

            let tempList = [];
            let count = Math.min(15, list.length); // Jeśli jest mniej niż 15 piosenek, wybierz wszystkie

            console.log(`Znaleziono ${list.length} piosenek dla artysty.`);

            for (let i = 0; i < count; i++) {
                const randomSongIndex = Math.floor(Math.random() * list.length);
                const randomSong = list.splice(randomSongIndex, 1)[0]; // Usuwa i zwraca wybraną piosenkę
                tempList.push(randomSong);
            }

            songToPrint = [...tempList];

            // Pobieranie obrazków dla każdej piosenki
            imgs = await Promise.all(songToPrint.map((song: any) => readTheImgFile(song.picture)));

            console.log("Losowe piosenki:", songToPrint);

        }


        if (type == "z albumu X") {
            let list: any[] = [];
            for (let i = 0; i < keys.length; i++) {
                if (parsedSongs[keys[i]].album == data) {
                    list.push(parsedSongs[keys[i]]);
                }
            }
            imgs[0] = await readTheImgFile(list[0].picture)
            songToPrint = list;
        }


        if (type == "losowe utwory") {
            let list: any[] = [];
            for (let i = 0; i < 15; i++) {
                if (parsedSongs[keys[i]].album == data) {
                    list.push(parsedSongs[keys[i]]);
                }
            }
            //imgs[0] = await readTheImgFile(list[0].picture)
            //songToPrint = list;
        }


        if (type == "losowe utwory") {
            let list: any[] = [];

            // Pobranie wszystkich piosenek
            for (let i = 0; i < keys.length; i++) {
                list.push(parsedSongs[keys[i]]);
            }

            let tempList = [];
            let count = Math.min(15, list.length); // Jeśli jest mniej niż 15 piosenek, wybierz wszystkie

            console.log(`Znaleziono ${list.length} piosenek w bazie.`);

            for (let i = 0; i < count; i++) {
                const randomSongIndex = Math.floor(Math.random() * list.length);
                const randomSong = list.splice(randomSongIndex, 1)[0]; // Usuwa i zwraca wybraną piosenkę
                tempList.push(randomSong);
            }

            songToPrint = [...tempList];

            // Pobieranie obrazków dla każdej piosenki
            imgs = await Promise.all(songToPrint.map((song: any) => readTheImgFile(song.picture)));

            console.log("Losowe piosenki:", songToPrint);
        }



        if (type == "długie utwory") {
            let list: any[] = [];
            for (let i = 0; i < keys.length; i++) {
                if (parsedSongs[keys[i]].duration > 600) {
                    list.push(parsedSongs[keys[i]]);
                }
            }

            let tempList = [];
            let count = Math.min(10, list.length); // Jeśli jest mniej niż 15 piosenek, wybierz wszystkie

            console.log(`Znaleziono ${list.length} piosenek dla artysty.`);

            for (let i = 0; i < count; i++) {
                const randomSongIndex = Math.floor(Math.random() * list.length);
                const randomSong = list.splice(randomSongIndex, 1)[0]; // Usuwa i zwraca wybraną piosenkę
                tempList.push(randomSong);
            }

            songToPrint = [...tempList];

            // Pobieranie obrazków dla każdej piosenki
            imgs = await Promise.all(songToPrint.map((song: any) => readTheImgFile(song.picture)));

            console.log("Losowe piosenki:", songToPrint);

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
            <h1>Losowa playlista</h1>
        </div>
    {/if}



    {#if type == "od artysty X"}
        <h2>Od Artysty {data}</h2>
        <div id="scroll-container">
            {#if songToPrint.length != 0}
                {#each songToPrint as data, index}
                <Song   name={data.title}
                        image={imgs[index]}
                        album={data.album}
                        fileName={data.fileName}
                        artist={data.artist} />
                {/each}
            {/if}
        </div>
    {/if}



    {#if type == "z albumu X"}
        <h2>Z Albumu {data}</h2>
        <div id="scroll-container">
            {#each songToPrint as data, index}
            <Song   name={data.title}
                    image={imgs[0]}
                    album={data.album}
                    fileName={data.fileName}
                    artist={data.artist} />
            {/each}
        </div>
    {/if}



    {#if type == "losowe utwory"}
        <h2>Losowe Utwory</h2>
        <div id="scroll-container">
            {#each songToPrint as data, index}
            <Song   name={data.title}
                    image={imgs[index]}
                    album={data.album}
                    fileName={data.fileName}
                    artist={data.artist} />
            {/each}
        </div>
    {/if}



    {#if type == "długie utwory"}
        <h2>Długie Słuchanie</h2>
        <div id="scroll-container">
            {#each songToPrint as data, index}
            <Song   name={data.title}
                    image={imgs[index]}
                    album={data.album}
                    fileName={data.fileName}
                    artist={data.artist} />
            {/each}
        </div>
    {/if}

</div>

<style>

    #scroll-container{
        display: flex;
        overflow-x: scroll;
        overflow-y: hidden;
    }






    #home-section-container {
        width: 100%;
        height: 300px;
        overflow: hidden;
        overflow-y: hidden !important;
        margin-top: 35px;
        margin-bottom: 10px;
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
        text-wrap: nowrap;
    }

    #random-playlists:hover h1 {
        transform: scale(1.05);
    }
</style>
