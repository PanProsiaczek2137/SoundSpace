<script lang="ts">
    import { get } from 'svelte/store';
    import { playList } from '../ts/audioSys.svelte.ts'
    export let image = "default.png";
    export let name = "Unknown Song"; // Domyślny tytuł utworu
    export let album = "Album"
    export let artist = "Unknown Artist"
    import { getContentOfMusicFolder } from '../ts/saveSongData.svelte'
    import { canShowContextMenu, visibleContextMenu } from '../ts/store.svelte.ts'
    import { onMount, onDestroy } from 'svelte';
    
    let containers: HTMLElement[] = [];

    onMount(()=>{
        containers = Array.from(document.getElementsByClassName("container-song")) as HTMLElement[];

        containers.forEach( element =>{
            element.addEventListener("pointerenter", () => {
                canShowContextMenu.set(true);
                console.log("enter");
            });

            element.addEventListener("pointerleave", () => {
                canShowContextMenu.set(false);
                console.log("leave");
            });
        });
    });

    onDestroy(() => {
        // Usuwamy nasłuchiwacze z wszystkich kontenerów
        containers.forEach(element => {
            element.removeEventListener("pointerenter", () => {
                canShowContextMenu.set(true);
                console.log("enter");
            });
            element.removeEventListener("pointerleave", () => {
                canShowContextMenu.set(false);
                console.log("leave");
            });
        });
    });

</script>




<div class="container-song">
    <div id="img-container" onclick={(()=>{
        //console.log('aiopsdfujioasdju')
        // playList.set([])
        if(get(visibleContextMenu) == false){
            (async ()=>{
                playList.set([])
                const songs = await getContentOfMusicFolder();
                let setTo = [];
                if(songs)
                for(let song of songs){
                    setTo.push({type: 'musicFolder', src: song.name})
                }
                playList.set(setTo)
            })()
        }

        //playList.set([
            //{type: 'musicFolder', src: 'Tame Impala - Intro [Lonerism 2015 Tour] (Oddities II) {Demos｜B-Sides｜Remixes}.mp3'}
        //])

    })} tabindex="-1" role="button" onkeydown={(e) => { if (e.key === 'Enter') console.log('OK')}} >
        <img src={image} alt="Album Cover" draggable="false" >
    </div>
    <p id="name">{name}</p>
    <p id="album-artist">{album} • {artist}</p>  
</div>

<style>
    #img-container{
        aspect-ratio: 1;
        overflow: hidden;
        display: flex;
    }
    .container-song{
        margin: 5px;
        margin-left: 7px;
        margin-right: 7px;
        width: 175px;
        height: 230px;

    }   
    img{
        aspect-ratio: 1;
        object-fit: cover;


    }
    #name{
        font-family: var(--font);
        color: var(--white);
        font-size: 1.25rem;
        white-space: nowrap;
        overflow: hidden;
        margin-top: 5px;
        margin-bottom: 4px;

    }
    #album-artist{
        color: var(--dark-white);
        font-family: var(--font);
        font-size: .75rem;
        overflow: hidden;

    }
</style>