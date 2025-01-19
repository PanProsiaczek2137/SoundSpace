<script lang="ts">
    
    let { children } = $props();

    let fullScreen = false;
    function changeFullScreen(){
        const full = document.getElementById("full") as HTMLElement;
        console.log('fullScreen: '+fullScreen)
        if (fullScreen){
            fullScreen = false;
            full.style.animation = "down 0.4s forwards";
            setTimeout(() => {
                full.style.display = "none";
            }, 399);
        }else{
            full.style.display = "flex";
            fullScreen = true;
            full.style.animation = "down 0.4s reverse";
        }
        setTimeout(() => {
            full.style.animation = "";
        }, 400);
    }

    import {} from './style/audio-player-top.css';
    import {} from './style/audio-player-bottom.css';
    import {} from './style/audio-player-full.css';
    import {} from './style/left-bar.css';
    import { play, isPlaying, song, playList, playedSong, setPlayedSong, songMetaData } from './audioSys.svelte.ts'
    import { onMount } from 'svelte';
    import { platform } from '@tauri-apps/plugin-os';
    import { BaseDirectory, readFile, create } from '@tauri-apps/plugin-fs';    
    import OblongSong from './components/oblongSong.svelte';
    import { writable } from 'svelte/store';
    import {} from './saveSongData.svelte.ts'
    import { songsProgress, songsToProcess } from './saveSongData.svelte.ts';
    import {} from './style/next-settings-content.css';
    //import { playlistContainerPosition } from './ts/store.svelte.ts'


    
   
    /*
    $effect(()=>{
        localPlayList = [...playList];
        console.log('wykonako: ')
    })
    */
    

    //let songsProgressLocal = $state(0);
    //let songsToProcessLocal = $state(0);



    //setInterval(() => {
    //    console.log('----------------');
    //    console.log(songsProgress, songsToProcess);
    //    console.log(songsProgressLocal, songsToProcessLocal);
    //    console.log('----------------');
    //}, 1000);

    //import { invoke } from '@tauri-apps/api/core';


    async function createFile(named: any, content: any, ){
        try {
            if(currentPlatform == "android" || currentPlatform == "ios"){
                const customPath = '/storage/emulated/0/Music/'+named; // Określona ścieżka  
                const file = await create(customPath); // Przekaż pełną ścieżkę
                
                await file.write(new TextEncoder().encode(content));
                await file.close();

                console.log('Plik utworzony pomyślnie!!!');
                alert('plik utworzony pomyślnie!!!')
            }else{
                const file = await create(named, { baseDir: BaseDirectory.Audio });
                await file.write(new TextEncoder().encode(content));
                await file.close();
            }
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }
    
    async function readTheFile(named: any){
        try {
            if(currentPlatform == "android" || currentPlatform == "ios"){
                const customPath = '/storage/emulated/0/Music/'+named; // Określona ścieżka  
                
                // Odczytanie pliku z pełną ścieżką
                const file = await readFile(customPath); // Przekaż pełną ścieżkę
                
                // Dekodowanie zawartości pliku na tekst
                const content = new TextDecoder().decode(file);
                
                console.log('Zawartość pliku:', content); // Wyświetl zawartość pliku

                alert(content)
            }else{
                const content = await readFile(named, {
                    baseDir: BaseDirectory.Audio,
                });
                alert(String.fromCharCode(...content))
            }
        } catch (error) {
            console.error('Błąd przy odczycie pliku:', error);  
            alert(error)
        }
    }
    setPlayedSong(0).then(()=>{songChanged()})

    const currentPlatform = platform();
    
    let currentTimee = $state(song.currentTime)
    let duration = $state(song.duration)


    if (song) {
        song.ontimeupdate = () => {
            currentTimee = song.currentTime
        };
    }

    function timeChange(){
        //console.log('!!!!!!!!!!!!')
    }


   onMount(()=> {

        const bottom = document.getElementById("bottom") as HTMLElement;
        const full = document.getElementById("full") as HTMLElement;
        const songPlayer = document.getElementById("song-player") as HTMLElement;
        const htmlElement = document.documentElement;
        /*
        document.addEventListener('click', (event) => {   
            if (event.target && (event.target as HTMLElement).id === 'others-settings' || 
                (event.target as HTMLElement).id === 'picture-and-name' || 
                (event.target as HTMLElement).id === 'control-buttons') {
                if(currentPlatform !== 'android' && currentPlatform !== 'ios'){
                    changeFullScreen();
                }else{
                    document.body.scrollBy({ top: 10, behavior: 'smooth' });
                }
            }
        });
        */

        document.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;

            if (currentPlatform !== 'android' && currentPlatform !== 'ios') {
                if (
                    target.id === 'others-settings' || 
                    target.id === 'picture-and-name' || 
                    target.id === 'control-buttons'
                ) {
                    changeFullScreen();
                }
            } else {
                // Obsługa Android/iOS
                const topElement = target.closest('#top'); // Sprawdzamy czy kliknięcie w "top"
                const isPlayPause = target.id === 'play-pause'; // Ignorujemy kliknięcia w "play-pause"

                if (topElement && !isPlayPause) {
                    document.body.scrollBy({ top: 10, behavior: 'smooth' });
                }
            }
        });

        if (currentPlatform !== 'android' && currentPlatform !== 'ios') {
            if(bottom && songPlayer){
                bottom.style.display = "none";
                songPlayer.style.height = '75px'
                songPlayer.style.position = 'absolute'
                htmlElement.style.overflowY = 'hidden';
                const nextSettingsContent = document.getElementById("next-settings-content") as HTMLElement;
                nextSettingsContent.style.display = "none";
                document.body.style.overflowX = 'hidden';
                htmlElement.style.overflowX = 'hidden';

            }
        }else{
            if(full && songPlayer){
                full.style.display = "none";
            }
        }


        
        const d1List = document.querySelectorAll('.album-picture');
        const d2List = document.querySelectorAll('.tests');

        d1List.forEach((d1Element, index) => {
            const d1 = d1Element as HTMLElement; // Rzutowanie na HTMLElement
            const d2 = d2List[index] as HTMLElement; // Rzutowanie na HTMLElement

            if (d1 && d2) {
                const resizeObserver = new ResizeObserver(() => {
                    const d1Width = parseInt(window.getComputedStyle(d1).width, 10);
                    const d1Height = parseInt(window.getComputedStyle(d1).height, 10);

                    if (d1Width > d1Height) {
                        d2.style.width = d1Height + 'px';
                        d2.style.height = d1Height + 'px';
                        console.log('d1Width > d1Height');
                    } else {
                        d2.style.width = d1Width + 'px';
                        d2.style.height = d1Width + 'px';
                        console.log('d1Width < d1Height');
                    }
                });

                // Rozpocznij nasłuchiwanie na zmiany rozmiaru dla elementu d1
                resizeObserver.observe(d1);

                // Opcjonalnie: zniszcz obserwator, kiedy komponent zostanie zniszczony
                return () => resizeObserver.disconnect();
            }
        });


   });
   /*
   let localPlayList = $state([...playList]);
    onMount(() => {
        setTimeout(() => {
        // Aktualizacja lokalnej zmiennej wymusza ponowne renderowanie
        console.log('MHM')
        //localPlayList.push({type: 'musicFolder', src: 'youtube_sBEfo73lOvk_audio.mp3'})
        localPlayList = [...localPlayList];
        }, 5000);
    });
   */
    onMount(()=>{
        document.addEventListener('mousemove', (event)=>{
            test = event;
        })
    })

</script>

<script lang="ts" module>
     
    export let test:any;


    let playPasueButtonCircleSrc = $state('pause_circle.svg')
    let playPasueButtonSrc = $state('play.svg')

    export function playLocal(is: boolean){
        if (is){
            play(true);
            playPasueButtonCircleSrc = 'pause_circle.svg';
            playPasueButtonSrc = 'pause.svg';
        }else{
            play(false);
            playPasueButtonCircleSrc = 'play_circle.svg';
            playPasueButtonSrc = 'play.svg';
        }
    } 

    export function showLoadingFiles(show: boolean){
        const loadingFiles = document.getElementById('loadingFiles') as HTMLElement;
        const popups = document.getElementById('popups') as HTMLElement;

        if(show){
            loadingFiles.style.display = 'flex';
            popups.style.display = 'flex';
        }else{
            loadingFiles.style.display = 'none';
            popups.style.display = 'none';
        }
    }

    let songName = $state('Song');
    let imageUrl = $state('default.png');
    let artistAndAlbum = $state('Artist • Album');
    let songDuration = $state('0:00');
    let songCurrentTime = $state(song.currentTime);

    

    export function songChanged(){
            let picture;

            // @ts-ignore
            if (songMetaData.common.picture?.[0]?.data) {
                // @ts-ignore
                picture = songMetaData.common.picture[0].data
                const uint8Array: Uint8Array = new Uint8Array(picture);
                const blob = new Blob([uint8Array], { type: 'image/jpeg' });
                imageUrl = URL.createObjectURL(blob);
            } else {
                imageUrl = 'default.png';
            }

            // @ts-ignore
            let name = songMetaData.common.title;

            // @ts-ignore
            let artist = songMetaData.common.artist;
            // @ts-ignore
            if (songMetaData.native.ID3v1?.[1]?.value !== undefined) {
                // @ts-ignore
                artist = songMetaData.native.ID3v1[1].value;
            }

            let album = '';
            // @ts-ignore
            if(songMetaData.common.album === undefined){
                // @ts-ignore
                album = 'album unknown';
            }else{
                // @ts-ignore
                album = songMetaData.common.album;
            }

            // @ts-ignore
            let duration = songMetaData.format.duration;

            songName = name;
            artistAndAlbum = artist + ' • ' + album;
            songDuration = duration;
    }
</script>
  

<div id="left-bar">
    <button style="width: 100px; height: 100px; background-color: red;" class="button" onclick={()=>{
        let nazwa = prompt('Podaj nazwe pliku');
        let tresc = prompt('Podaj tresc pliku');
        createFile(nazwa, tresc);
        }}>
        save
    </button>
    <button style="width: 100px; height: 100px; background-color: red;" class="button" onclick={()=>{
        let nazwa = prompt('Podaj nazwe pliku');
        readTheFile(nazwa);
        }}>
        read
    </button>
</div>


<div id="popups">
    <div id="loadingFiles">
        <div id="loadingFiles-title" class="loadingFiles-container">
            <h1>Loading Files</h1>
        </div>
        <div id="loadingFiles-info" class="loadingFiles-container">
            <p>Folder: C:/Users/Mateusz/Music/</p>
        </div>
        <div id="loadingFiles-progres" class="loadingFiles-container">
            <progress value={songsProgress.value} max={songsToProcess.value}></progress>
        </div>
    </div>
</div>

<main class="section" id="ok">
    {@render children()}
</main>

<div id="song-player" class="">
    <!--onclick={changeFullScreen} tabindex="0" role="button" onkeydown={(e) => { if (e.key === 'Enter') changeFullScreen(); }}-->
    <div id="top" > <!--  ONLY DESKTOP  -->
        <div id="picture-and-name">
            <img id="picture-of-playing-song" src={imageUrl} alt="" draggable="false">
            <div id="name-artist-and-album">
                <h1>{songName}</h1>
                <p>{artistAndAlbum}</p>
            </div>
        </div>


        <div id="control-buttons">
            <button class="button skip" 
            onclick={()=>{
                setPlayedSong(playedSong-1).then(()=>{
                    playLocal(true);
                    songChanged();
                })}}>
                <img src="skip_previous.svg" alt="">
            </button>

            <button class="button" 
            onclick={()=>{isPlaying ? playLocal(false) : playLocal(true)}}>
                <img src={playPasueButtonSrc} alt="" id="play-pause">
            </button>

            <button class="button skip" 
            onclick={()=>{
                setPlayedSong(playedSong+1).then(()=>{
                    playLocal(true);
                    songChanged();
                })}}>
                <img src="skip_next.svg" alt="">
            </button>
        </div>

        <div id="others-settings">
            <button class="button" onclick={changeFullScreen}><img src="full_screen.svg" alt=""></button>
            <button class="button"><img src="more_options.svg" alt=""></button>
            <button class="button"><img src="add_playlist.svg" alt=""></button>
            <button class="button"><img src="volume/volume2.svg" alt=""></button>
        </div>
    </div>
    

    <div id="bottom" class="section"> <!--  ONLY MOBILE  -->

        <p></p>
        
        <div id="bottom-content">

            <div id="picture-and-info">
                <div class="album-picture">
                    <div class="tests">
                        <img src={imageUrl} alt="" draggable="false">
                    </div>
                </div>
    
                <div id="info">
                    <h1>{songName}</h1>
                    <h2>{artistAndAlbum}</h2>
                    <q></q>
                </div>
            </div>
    
            
            <div id="controls">
                <input type="range" id="scroll-bar" oninput={timeChange} bind:value={currentTimee} maxlength={Math.floor(duration)}>
                <div id="buttons">
                    <button class="button" onclick={()=>{
                        setPlayedSong(playedSong-1).then(()=>{
                            playLocal(true);
                            songChanged();
                        })
                }}><img src="skip_previous.svg" alt=""></button>
                    <button class="button" onclick={()=>{isPlaying ? playLocal(false) : playLocal(true)}}><img src={playPasueButtonCircleSrc} alt="" style="transform:scale(1.8)"></button>
                    <button class="button" onclick={()=>{
                        setPlayedSong(playedSong+1).then(()=>{
                            playLocal(true);
                            songChanged();
                        })
                }}><img src="skip_next.svg" alt=""></button>
                </div>

            </div>

        </div>

        <div id="next-settings">
            <div onclick={()=>{document.body.scrollBy({ top: 10, behavior: 'smooth' })}} tabindex="0" role="button" onkeydown={(e) => { if (e.key === 'Enter') document.body.scrollBy({ top: 10, behavior: 'smooth' }) }}>Next</div>
            <div>Settings</div>
        </div>

    </div>
    
    <div id="next-settings-content" class="section"> <!--  ONLY MOBILE  -->
        <div id="next">
            {#each playList as song, index}
                <OblongSong theSong={song} theID={index} />
            {/each}
        </div>
        <div id="settings">

        </div>
    </div>
</div>

<div id="full"> <!--  ONLY DESKTOP  -->
    <div id="picture-full">
        <div class="album-picture" style="width: 80%; height: 80%; z-index: 5;">
            <div class="tests">
                <img src={imageUrl} alt="" draggable="false">
            </div>
        </div>
        <div class="album-picture" id="blure-picture">
            <div class="tests">
                <img src={imageUrl} alt="" draggable="false">
            </div>
        </div>
    </div>
    <div id="play-list" class="scroll-container">
        {#each playList as song, index}
            <OblongSong theSong={song} theID={index} />
        {/each}
    </div>
</div>


<style>


    #ok{
        margin-bottom: -75px;
    }

    :global(html), :global(body){
        overflow-y: auto; /* Umożliwia przewijanie */
        width: 100%;
        height: 100vh;
        scroll-snap-type: y mandatory;
        overflow-x: hidden;
    }

    .section{
        scroll-snap-align: start;
        scroll-snap-stop: always;
    }

    /*    
    #song-player{
        background-color: var(--black);
        border-top: 1px solid var(--dark-grey);
        display: flex;
        align-items: center;
        height: calc(100vh + 75px);
        width: 100%;
        z-index: 99999;
        position: relative;
    }
    */



</style>
  