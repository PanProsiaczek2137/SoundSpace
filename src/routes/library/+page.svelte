<script lang="ts">
    import { get, writable } from 'svelte/store';
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
            style.innerHTML = /*`
                #playlist-button-container { width: 100px; }
                #artist-button-container { width: 100px; }
                #genre-button-container { width: 100px; }
                #year-button-container { width: 100px; }
                #album-button-container { width: 100px; }
                #duration-button-container { width: 100px; }
                #top-library{ width: 100%; overflow-x: scroll; }






                #playlist-button-container { width: 100%; }
                #artist-button-container { width: 100%; }
                #genre-button-container { width: 100%; }
            `;*/
                `
                #top-library{
                    width: 100%;
                    overflow-x: scroll;
                    overflow-y: hidden;
                }

                #artist-button-container { width: 100px; }
                #genre-button-container { width: 100px; }
                #year-button-container { width: 100px; }
                #album-button-container { width: 100px; }
                #duration-button-container { width: 100px; }
                

                    #local-playlist{
                        width: 100%;
                        background-color: red;
                    }

                    #local-artist{
                        min-width: 50%;
                        width: 50%;
                    }

                    #local-album{
                        min-width: 50%;
                        width: 50%;
                    }

                    #local-year{
                        min-width: 50%;
                        width: 50%;
                    }

                    #local-genre{
                        min-width: 50%;
                        width: 50%;
                    }

                    #local-duration{
                        min-width: 50%;
                        width: 50%;
                    }

                    #playlist-button-container{
                        width: 50%;
                        min-width: 50%;
                    }

                    .dropdown-content{
                        width: 200%;
                    }

                    #local-dropDown-playlist{
                        max-width: 100%
                    }

                `
            document.head.appendChild(style);
        }else{
            const style = document.createElement("style");
            style.innerHTML = `

                #local-playlist{
                    width: calc( 100% - 50px );
                    background-color: red;
                }

                #local-artist{
                    width: 20%;
                }

                #local-album{
                    width: 20%;
                }

                #local-year{
                    width: 5%;
                }

                #local-genre{
                    width: 10%;
                }

                #local-duration{
                    width: 5%;
                }

                #top-library{
                    width: calc(100% - 10px);
                    justify-content: space-between;

                }

                #playlist-button-container{
                    width: 40%;
                }

                @media (width <= 1120px) {
                    #local-genre { display: none; }
                    #local-year { display: none; }
                    #local-artist { width: 25%; }
                    #local-album { width: 20%; }
                    #local-playlist { width: calc( 100% - 50px); }
                    #playlist-button-container { width: 50%; min-width: 50% }
                }

                @media (width <= 650px) {
                    #local-album { display: none; }
                    #local-duration { display: none; }
                    #local-artist { width: 35%; }
                    #local-playlist { width: calc( 100% - 50px); }
                    #playlist-button-container { width: 65% }
                }

                @media (width <= 500px) {
                    #local-artist { display: none; }
                    #local-playlist { width: 100%; }
                    #local-add-playlist-button-library { display: none; }
                    #playlist-button-container{ width: 100%;  }
                }

                .dropdown-content{
                     width: 100%;
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
                {#if !(platform() === "android" || platform() === "ios")}
                    <button class="button" id="add-playlist-button-library">+</button>
                {/if}
            </div>

            <!--<div id="artist-button-container">
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
            </div>-->

            <DropDownButton type="artist" data={metadate}></DropDownButton>
            <DropDownButton type="album" data={metadate}></DropDownButton>
            <DropDownButton type="year" data={metadate}></DropDownButton>
            <DropDownButton type="genre" data={metadate}></DropDownButton>
            <DropDownButton type="duration" data={metadate}></DropDownButton>

        
        {/if}


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