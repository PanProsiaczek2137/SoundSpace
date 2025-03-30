<script lang="ts">
    import { currentPlatform, selectedFilter, selectedValue } from '../ts/store.svelte'
    import { get } from 'svelte/store';
    import { formatDuration, printSelectedData, playList, playedSong } from '../ts/audioSys.svelte'
    import { readTheImgFile } from '../ts/saveSongData.svelte'
    import { readSongsMetaDataFile } from '../ts/saveSongData.svelte'
    import { onMount } from 'svelte';
    import { canShowContextMenu, ContextMenuOn, visibleContextMenu, canWePlaySong } from '../ts/store.svelte'
    import { isDropDownOpen } from '../ts/store.svelte'
    import InformationPage from './settingsPage/informationPage.svelte';


    export let songFile:string | null = null;
    export let index: number;
    export let data: any;

    let thisElement: HTMLElement;
    let loading = false;

    /*
    (async ()=>{
        const test = await readSongsMetaDataFile();
        const test2 = await printSelectedData("artist", 'tame impala', test);
    })
    */

    //console.log(data);
    //console.log('---------');
    let SongCover:any
    (async () => {
        const songImg = await readTheImgFile(data.picture)
        if(songImg == null){
            SongCover = "default.png";
        }else
        SongCover = songImg;
    })();
    // @ts-ignore
    let songTitle = data ? data.title : (songFile == null ? "Unkown" : songFile.name);
    let songArtist = data ? data.artist : "Unkown";
    let album = data ? data.album : "Unkown";
    let year = data ? data.year : "Unkown";
    let genre = data ? data.genre : "Unkown";
    let duration = data ? formatDuration(data.duration) : "Unkown";

    const platform = get(currentPlatform)

    /*
    onMount(()=>{
        const containers = Array.from(document.getElementsByClassName("librarySong")) as HTMLElement[];

        containers.forEach( element =>{

        })

    })
    */

</script>


<button bind:this={thisElement} data-index={index} class="button librarySong" id="librarySong" tabindex="-1" onpointerenter={(e)=>{
        canShowContextMenu.set(true)
        if(get(visibleContextMenu) == false){
            if(get(selectedFilter) == "all"){
                ContextMenuOn.set(songFile)
            }else{
                //@ts-ignore
                ContextMenuOn.set({name: songFile.fileName});
            }
        }

    }}

    onpointerleave={()=>{
        canShowContextMenu.set(false)
        //ContextMenuOn.set(null)
        
    }}
    
    onclick={async ()=>
    {
        console.log(get(isDropDownOpen), get(visibleContextMenu))
        if(get(isDropDownOpen) == false && get(visibleContextMenu) == false){

            if(get(selectedFilter) == "all"){
                playedSong.set(-1);
                canWePlaySong.set(true);
                playList.set([{type: 'musicFolder', src: data.fileName}]);
                playedSong.set(0);
                setTimeout(() => {
                    localStorage.setItem('playList', JSON.stringify(get(playList)));
                }, 500);
            }else{
                playedSong.set(-1)
                canWePlaySong.set(true);
                playList.set([]);
                const matadata = await readSongsMetaDataFile(); 
                const songs = await printSelectedData(get(selectedFilter), get(selectedValue), matadata);
                let list = [];
                if(songs)
                for(let song of songs){
                    list.push({type: 'musicFolder', src: song.fileName})
                }
                playedSong.set(index)
                console.log('--- ustawiamy na ----');
                console.log(list);
                console.log('--------')
                playList.set(list)
                setTimeout(() => {
                    localStorage.setItem('playList', JSON.stringify(get(playList)));
                }, 500);
            }

        }
    }
}>
    {#if loading}
        <p>loading...</p>
    {:else}
        <div id="playList-container-library">
            <div id="img-container">
                <img src={SongCover} alt="" draggable="false">
            </div>
            <div id="song-name-container">
                <p>{songTitle}</p>
            </div>
        </div>

        <div id="name-artists-container">
            <p>{songArtist}</p>
        </div>
        <div id="album-container">
            <p>{album}</p>
        </div>
        <div id="year-container">
            <p>{year}</p>
        </div>
        <div id="genre-container">
            <p>{genre}</p>
        </div>
        <div id="duration-container">
            <p>{duration}</p>
        </div>
    {/if}
</button>

<style>

    #playList-container-library{
        display: flex;
        width: 40%;
        min-width: 40%;
    }

    #librarySong {
        min-width: 250px;
        width: 100%;
        height: 60px;
        background-color: var(--black);
        display: flex;   
        border-bottom: solid 1px var(--black);
        z-index: 3;
        display: flex;
        justify-content: space-around;
    }

    #img-container{
        width: 50px;
        height: 50px;
        background-color: var(--black);
        aspect-ratio: 1;
        overflow: hidden;
        display: flex;
        margin: 5px;
    }

    #song-name-container {
        display: flex;
        align-items: center;
        width: calc(100% - 60px);
        background-color: var(--black);
    }

    #name-artists-container {
        display: flex;
        justify-content: center;  
        align-items: center;      
        text-align: center;
        width: 20%;
        min-width: 20%;
        background-color: var(--black);
    }

    #album-container {
        display: flex;
        justify-content: center;  
        align-items: center;      
        text-align: center;
        width: 20%;
        min-width: 20%;
        background-color: var(--black);
    }

    #year-container {
        display: flex;
        justify-content: center;  
        align-items: center;      
        text-align: center;
        width: 5%;
        min-width: 5%;
        background-color: var(--black);
    }

    #genre-container{
        display: flex;
        justify-content: center;  
        align-items: center;      
        text-align: center;
        width: 10%;
        min-width: 10%;
        background-color: var(--black);
    }

    #duration-container {
        display: flex;
        justify-content: center;  
        align-items: center;      
        text-align: center;
        width: 5%;
        min-width: 5%;
        background-color: var(--black);
        min-width: 60px;
    }


    img {
        aspect-ratio: 1;
        object-fit: cover;
    }

    #song-name-container p{
        color: var(--white);
        font-family: var(--font);
    }

    #name-artists-container p{
        color: var(--white);
        font-family: var(--font);
    }

    #album-container p{
        color: var(--white);
        font-family: var(--font);
    }

    #year-container p{
        color: var(--white);
        font-family: var(--font);
    }
    
    #genre-container p{
        color: var(--white);
        font-family: var(--font);
    }

    #duration-container p{
        color: var(--white);
        font-family: var(--font);
    }

    @media (width <= 1120px) {
        #genre-container{ display: none; }
        #year-container{ display: none; }
        #name-artists-container{ width: 25%; min-width: 25%; }
        #playList-container-library{ width: 50%; min-width: 50%;}
    }

    @media (width <= 650px) {
        #duration-container{ display: none; }
        #album-container{ display: none; }
        #playList-container-library{ width: 65%; min-width: 65%;}
        #name-artists-container{ width: 35%; }
    }

    @media (width <= 500px) {
        #name-artists-container{ display: none; }
        #playList-container-library{ width: 100%; min-width: 100%;}
    }

    


    /*
    #img-container {
        aspect-ratio: 1;
        overflow: hidden;
        display: flex;
        height: 50px;
        margin-left: 5px;
        margin-top: 5px;
    }

    img {
        aspect-ratio: 1;
        object-fit: cover;
    }

    p {
        font-family: var(--font);
        color: var(--white);
        margin: 0;
        white-space: nowrap;
    }

    #name-artists {
        margin-left: 10px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
    }

    #name {
        margin-bottom: 2px;
        font-size: 1.2rem;
        white-space: nowrap;
        overflow: hidden;

    }

    #artist {
        color: var(--dark-white);
    }

    #duration {
        display: flex;
        align-items: center;
        position: relative;
        background-color: var(--black);
        padding: 20px;
    }
    */
</style>