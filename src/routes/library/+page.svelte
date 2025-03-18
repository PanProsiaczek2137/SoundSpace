<script lang="ts">
    import { get, writable } from 'svelte/store';
    import DropDownButton from '../components/dropDownButton.svelte';
    import LibrarySong from '../components/librarySong.svelte';
    import {} from '../style/library.css';
    import { getContentOfMusicFolder, readSongsMetaDataFile } from '../ts/saveSongData.svelte'
    import { selectedFilter, selectedValue, currentPlatform } from '../ts/store.svelte';
    import { printSelectedData } from '../ts/audioSys.svelte'
    import { onDestroy, onMount } from 'svelte';

    let songs: any = [];
    let metadate: any = [];
    let ready = false;
    let loadedSongsCount = 0;
    const loadAmount = 50;

    // Funkcja do wczytania piosenek
    async function loadSongs() {
        ready = false;
        metadate = await readSongsMetaDataFile();
        const filter = get(selectedFilter);
        const value = get(selectedValue);

        if (filter === "all") {
            songs = await getContentOfMusicFolder();
        } else {
            songs = printSelectedData(filter, value, metadate);
        }
        ready = true;
        loadedSongsCount = Math.min(loadAmount, songs.length); // Wczytujemy tylko część piosenek na początek
    }

    // Funkcja do załadowania kolejnej partii piosenek
    function loadMoreSongs() {
        if (loadedSongsCount < songs.length) {
            loadedSongsCount = Math.min(loadedSongsCount + loadAmount, songs.length);
        }
    }

    // Funkcja obsługująca scrollowanie
    function handleScroll(event: Event) {
        const container = event.target as HTMLElement;
        if (container.scrollHeight - container.scrollTop === container.clientHeight) {
            loadMoreSongs();
        }
    }

    onMount(() => {
        addDesktopStyles();
        document.querySelectorAll("button, input, a, textarea, select").forEach(el => {
            el.setAttribute("tabindex", "-1");
        });
        loadSongs();
    });

    const unsubscribeFilter = selectedFilter.subscribe(loadSongs);
    const unsubscribeValue = selectedValue.subscribe(loadSongs);

    onDestroy(() => {
        unsubscribeFilter();
        unsubscribeValue();
    });

    const platform = get(currentPlatform);
    function addDesktopStyles() {
        const style = document.createElement("style");
        style.innerHTML = platform() === "android" || platform() === "ios" ? `
            #top-library { width: 100%; overflow-x: scroll; overflow-y: hidden; }
            #artist-button-container, #genre-button-container, #year-button-container,
            #album-button-container, #duration-button-container { width: 100px; }
            #local-playlist { width: 100%; background-color: red; }
            #local-artist, #local-album, #local-year, #local-genre, #local-duration { min-width: 50%; width: 50%; }
            #playlist-button-container { width: 50%; min-width: 50%; }
            .dropdown-content { width: 200%; }
            #local-dropDown-playlist { max-width: 100%; }
        ` : `
            #local-playlist { width: calc(100% - 50px); background-color: red; }
            #local-artist { width: 20%; }
            #local-album { width: 20%; }
            #local-year { width: 5%; }
            #local-genre { width: 10%; }
            #local-duration { width: 5%; }
            #top-library { width: calc(100% - 10px); justify-content: space-between; }
            #playlist-button-container { width: 40%; }
            @media (width <= 1120px) {
                #local-genre, #local-year { display: none; }
                #local-artist { width: 25%; }
                #local-album { width: 20%; }
                #playlist-button-container { width: 50%; min-width: 50%; }
            }
            @media (width <= 650px) {
                #local-album, #local-duration { display: none; }
                #local-artist { width: 35%; }
                #playlist-button-container { width: 65%; }
            }
            @media (width <= 500px) {
                #local-artist { display: none; }
                #playlist-button-container { width: 100%; }
            }
            .dropdown-content { width: 100%; }
        `;
        document.head.appendChild(style);
    }
</script>

<div id="container-library">
    <div id="top-library">
        {#if ready}
            <div id="playlist-button-container">
                <DropDownButton type="playlist"></DropDownButton>
                {#if !(platform() === "android" || platform() === "ios")}
                    <button class="button" id="add-playlist-button-library">+</button>
                {/if}
            </div>
            <DropDownButton type="artist" data={metadate}></DropDownButton>
            <DropDownButton type="album" data={metadate}></DropDownButton>
            <DropDownButton type="year" data={metadate}></DropDownButton>
            <DropDownButton type="genre" data={metadate}></DropDownButton>
            <DropDownButton type="duration" data={metadate}></DropDownButton>
        {/if}
    </div>
    <div id="bottom-library" class="scrollY" on:scroll={handleScroll}>
        {#if ready}
            {#each songs.slice(0, loadedSongsCount) as song, index}
                <LibrarySong songFile={song} index={index} data={metadate[song.name] || metadate[song.fileName]}></LibrarySong>
            {/each}
        {/if}
    </div>
</div>
