<script lang="ts">
    import { playList } from '../audioSys.svelte'
    export let image = "default.png";
    export let name = "Unknown Song"; // Domyślny tytuł utworu
    export let album = "Album"
    export let artist = "Unknown Artist"
</script>

<div id="container">
    <div id="img-container" onclick={(()=>{
    playList.set([])

        playList.set([
            {type: 'musicFolder', src: 'Tame Impala - Intro [Lonerism 2015 Tour] (Oddities II) {Demos｜B-Sides｜Remixes}.mp3'},
            {type: 'musicFolder', src: 'Tame Impala - Intro [Lonerism 2015 Tour] (Oddities II) {Demos｜B-Sides｜Remixes}.mp3'},
            {type: 'musicFolder', src: "Don't Talk To Strangers.mp3"},
            {type: 'musicFolder', src: 'I Want It All.mp3'},
            {type: 'musicFolder', src: 'Tame Impala - Intro [Lonerism 2015 Tour] (Oddities II) {Demos｜B-Sides｜Remixes}.mp3'},
            {type: 'musicFolder', src: 'Tame Impala - Intro [Lonerism 2015 Tour] (Oddities II) {Demos｜B-Sides｜Remixes}.mp3'},
            {type: 'musicFolder', src: "Don't Talk To Strangers.mp3"},
            {type: 'musicFolder', src: 'I Want It All.mp3'},
            {type: 'musicFolder', src: 'Tame Impala - Intro [Lonerism 2015 Tour] (Oddities II) {Demos｜B-Sides｜Remixes}.mp3'},
            {type: 'musicFolder', src: 'Tame Impala - Intro [Lonerism 2015 Tour] (Oddities II) {Demos｜B-Sides｜Remixes}.mp3'},
            {type: 'musicFolder', src: "Don't Talk To Strangers.mp3"},
            {type: 'musicFolder', src: 'I Want It All.mp3'},
            {type: 'musicFolder', src: 'Tame Impala - Intro [Lonerism 2015 Tour] (Oddities II) {Demos｜B-Sides｜Remixes}.mp3'},
            {type: 'musicFolder', src: 'Tame Impala - Intro [Lonerism 2015 Tour] (Oddities II) {Demos｜B-Sides｜Remixes}.mp3'},
            {type: 'musicFolder', src: "Don't Talk To Strangers.mp3"},
            {type: 'musicFolder', src: 'I Want It All.mp3'},
            {type: 'musicFolder', src: 'Tame Impala - Intro [Lonerism 2015 Tour] (Oddities II) {Demos｜B-Sides｜Remixes}.mp3'},
            {type: 'musicFolder', src: 'Tame Impala - Intro [Lonerism 2015 Tour] (Oddities II) {Demos｜B-Sides｜Remixes}.mp3'},
            {type: 'musicFolder', src: "Don't Talk To Strangers.mp3"},
            {type: 'musicFolder', src: 'I Want It All.mp3'},
        ])

    })} tabindex="0" role="button" onkeydown={(e) => { if (e.key === 'Enter') console.log('OK')}} >
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
    #container{
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