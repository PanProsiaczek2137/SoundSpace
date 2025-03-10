<script lang="ts">
    import { get } from 'svelte/store';
    import DropDownButton from '../components/dropDownButton.svelte';
    import LibrarySong from '../components/librarySong.svelte';
    import {} from '../style/library.css';
    import { getContentOfMusicFolder, readSongsMetaDataFile } from '../ts/saveSongData.svelte'
    import { selectedFilter, selectedValue, currentPlatform } from '../ts/store.svelte';
    import { printSelectedData } from '../ts/audioSys.svelte'
    import { onMount } from 'svelte';

    let songs:any = [];
    let metadate:any = [];
    let ready = false;

    onMount(()=>{
        addDesktopStyles()
        document.querySelectorAll("button, input, a, textarea, select").forEach(el => {
            el.setAttribute("tabindex", "-1");
        });
    })

    selectedValue.subscribe((value2)=>{

            (async ()=>{

                if(get(selectedFilter) == "all"){
                    ready = false;
                    songs = await getContentOfMusicFolder();
                    metadate = await readSongsMetaDataFile()

                    ready = true;
                }
                if(get(selectedFilter) == "artist"){
                    ready = false;
                    metadate = await readSongsMetaDataFile()
                    songs = printSelectedData("artist", value2, metadate);

                    ready = true;
                }
                if(get(selectedFilter) == "album"){
                    ready = false;
                    metadate = await readSongsMetaDataFile()
                    songs = printSelectedData("album", value2, metadate);

                    ready = true;
                }
                if(get(selectedFilter) == "genre"){
                    ready = false;
                    metadate = await readSongsMetaDataFile()
                    songs = printSelectedData("genre", value2, metadate);

                    ready = true;
                }
                if(get(selectedFilter) == "duration"){
                    ready = false;
                    metadate = await readSongsMetaDataFile()
                    songs = printSelectedData("duration", value2, metadate);

                    ready = true;
                }
                if(get(selectedFilter) == "year"){
                    ready = false;
                    metadate = await readSongsMetaDataFile()
                    songs = printSelectedData("year", value2, metadate);

                    ready = true;
                }

            })();

    })

    const platform = get(currentPlatform);
    function addDesktopStyles() {
        if (platform() === "android" || platform() === "ios") { // Sprawdza, czy użytkownik jest na desktopie
            const style = document.createElement("style");
            style.innerHTML = `
                #playlist-button-container { min-width: 33%; }
                #artist-button-container { min-width: 33%; }
                #genre-button-container { min-width: 33%; }
                #year-button-container { min-width: 33%; }
                #album-button-container { min-width: 33%; }
                #duration-button-container { min-width: 33%; }
                #top-library{ width: 100%; overflow-x: scroll; }
            `;
            document.head.appendChild(style);
        }else{
            const style = document.createElement("style");
            style.innerHTML = `

                #top-library{
                    width: calc(100% - 10px);
                    justify-content: space-between;
                    align-items: center;
                }

                @media (width <= 1120px) {
                    #genre-button-container { display: none; }
                    #year-button-container { display: none; }
                    #artist-button-container { width: 25%; }
                    #album-button-container { width: 20%; }
                    #playlist-button-container { width: 50%; }
                }

                @media (width <= 650px) {
                    #album-button-container { display: none; }
                    #duration-button-container { display: none; }
                    #artist-button-container { width: 35%; }
                    #playlist-button-container { width: 65%; }
                }

                @media (width <= 500px) {
                    #artist-button-container { display: none; }
                    #playlist-button-container { width: 100%; }
                    #add-playlist-button-library { display: none; }
                }
            `;
            document.head.appendChild(style);
        }
}


</script>

<div id="container-library">
    <div id="top-library">
        {#if ready}
            
            <div id="playlist-button-container">
                <DropDownButton type="playlist"></DropDownButton>
                <button class="button" id="add-playlist-button-library">+</button>
            </div>
            <div id="artist-button-container">
                <DropDownButton type="artist" data={metadate}></DropDownButton>
            </div>
            <div id="album-button-container">
                <DropDownButton type="album" data={metadate}></DropDownButton>
            </div>
            <div id="year-button-container">
                <DropDownButton type="year" data={metadate}></DropDownButton>
            </div>
            <div id="genre-button-container">
                <DropDownButton type="genre" data={metadate}></DropDownButton>
            </div>
            <div id="duration-button-container">
                <DropDownButton type="duration" data={metadate}></DropDownButton>
            </div>
        
        {/if}
        
        <!--
        <DropDownButton type="playlist"></DropDownButton>
        <DropDownButton type="artist"></DropDownButton>
        <DropDownButton type="album"></DropDownButton>
        <DropDownButton type="year"></DropDownButton>
        <DropDownButton type="genre"></DropDownButton>
        <DropDownButton type="duration"></DropDownButton>
        -->

    </div>
    <div id="bottom-library" class="scrollY">
        {#if ready}
            {#if get(selectedFilter) == "all"}

                {#each songs as song, index}
                    <LibrarySong songFile={song} index={index} data={metadate[song.name]}></LibrarySong>
                {/each}

            {:else}

                {#each songs as song, index}
                    <LibrarySong songFile={song} index={index} data={metadate[song.fileName]}></LibrarySong>
                {/each}

            {/if}
        {/if}
        
    </div>
</div>