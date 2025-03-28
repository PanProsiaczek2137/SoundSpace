<script lang="ts">
    import { get } from 'svelte/store';
    import { playList } from '../ts/audioSys.svelte.ts'
    export let image = "default.png";
    export let name = "Unknown Song"; // Domyślny tytuł utworu
    export let album = "Album"
    export let fileName = ""
    export let artist = "Unknown Artist"
    import { getContentOfMusicFolder } from '../ts/saveSongData.svelte'
    import { canShowContextMenu, visibleContextMenu, ContextMenuOn, playPlaylistFormStart } from '../ts/store.svelte.ts'
    import { onMount, onDestroy } from 'svelte';
    
    let thisElement: HTMLElement

    onMount(()=>{

        thisElement.addEventListener("pointerenter", () => {
            canShowContextMenu.set(true);
            console.log("enter");
            console.log(fileName)
            ContextMenuOn.set({name: fileName})
        });

        thisElement.addEventListener("pointerleave", () => {
           canShowContextMenu.set(false);
            console.log("leave");
        });

    });

    onDestroy(() => {
        // Usuwamy nasłuchiwacze z wszystkich kontenerów
        thisElement.removeEventListener("pointerenter", () => {
            canShowContextMenu.set(true);
            console.log("enter");
        });
        thisElement.removeEventListener("pointerleave", () => {
            canShowContextMenu.set(false);
            console.log("leave");
        });

    });

</script>




<div class="container-song" bind:this={thisElement}>
    <div id="img-container" onclick={(()=>{
        //console.log('aiopsdfujioasdju')
        // playList.set([])
        if(get(visibleContextMenu) == false){
            (async ()=>{
                playPlaylistFormStart.set(true);
                playList.set([])
                playList.set([{type: 'musicFolder', src: fileName}])
                playPlaylistFormStart.set(false);
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