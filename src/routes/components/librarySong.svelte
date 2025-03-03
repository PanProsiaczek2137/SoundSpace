<script lang="ts">
    import { currentPlatform, selectedFilter, selectedValue } from '../ts/store.svelte'
    import { get } from 'svelte/store';
    import { formatDuration, printSelectedData, playList } from '../ts/audioSys.svelte'
    import { readTheImgFile } from '../ts/saveSongData.svelte'
    import { readSongsMetaDataFile } from '../ts/saveSongData.svelte'


    export let songFile:string | null = null;
    export let index: number;
    export let data: any;

    let thisElement: HTMLElement;
    let loading = false;

    (async ()=>{
        const test = await readSongsMetaDataFile();
        const test2 = await printSelectedData("artist", 'tame impala', test);
    })


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

</script>


<button bind:this={thisElement} data-index={index} class="button" id="librarySong" tabindex="-1" onclick={async ()=>
    {
        playList.set([]);
        const matadata = await readSongsMetaDataFile(); 
        const songs = await printSelectedData(get(selectedFilter), get(selectedValue), matadata);
        let list = [];
        if(songs)
        for(let song of songs){
            list.push({type: 'musicFolder', src: song.fileName})
        }
        console.log('--- ustawiamy na ----');
        console.log(list);
        console.log('--------')
        playList.set(list)
    }
}>
    {#if loading}
        <p>loading...</p>
    {:else}
        <div id="img-container">
            <img src={SongCover} alt="" draggable="false">
        </div>
        <div id="song-name-container">
            <p>{songTitle}</p>
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
        width: 60px;
        height: 60px;
        background-color: var(--black);
    }

    #song-name-container {
        display: flex;
        align-items: center;
        width: calc(40% - 60px);
        background-color: var(--black);
    }

    #name-artists-container {
        display: flex;
        justify-content: center;  
        align-items: center;      
        text-align: center;
        width: 20%;
        background-color: var(--black);
    }

    #album-container {
        display: flex;
        justify-content: center;  
        align-items: center;      
        text-align: center;
        width: 20%;
        background-color: var(--black);
    }

    #year-container {
        display: flex;
        justify-content: center;  
        align-items: center;      
        text-align: center;
        width: 5%;
        background-color: var(--black);
    }

    #genre-container{
        display: flex;
        justify-content: center;  
        align-items: center;      
        text-align: center;
        width: 10%;
        background-color: var(--black);
    }

    #duration-container {
        display: flex;
        justify-content: center;  
        align-items: center;      
        text-align: center;
        width: 5%;
        background-color: var(--black);
        min-width: 60px;
    }



    #img-container {
        aspect-ratio: 1;
        overflow: hidden;
        display: flex;
        height: 50px;
        margin: 5px;
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
        #name-artists-container{ width: 25%; }
        #song-name-container{ width: calc(50% - 60px);}
    }

    @media (width <= 650px) {
        #duration-container{ display: none; }
        #album-container{ display: none; }
        #song-name-container{ width: calc(65% - 60px);}
        #name-artists-container{ width: 35%; }
    }

    @media (width <= 500px) {
        #name-artists-container{ display: none; }
        #song-name-container{ width: calc(100% - 60px);}
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