<script lang="ts">
    let { children } = $props();



    import {} from './style/global.css'
    import {} from './style/audioControlBar.css'
    import {} from './style/full.css'
    import {} from './style/bottom.css'
    import {} from './style/scrollBar.css'
    import {} from './style/timeline.css'
    import {} from './style/leftBar.css'

    import { playList, playedSong, isPlaying } from './ts/audioSys.svelte.ts'
    import { currentPlatform } from './ts/store.svelte.ts'
    //import {} from './ts/timeline.ts'

    import OblongSong, {} from './components/oblongSong.svelte'
    
    import { onMount, onDestroy } from "svelte";
    import { writable, get } from 'svelte/store';
	import { fly } from 'svelte/transition';
    import Page from './+page.svelte';



    onMount(() => {
    const rangeInput = document.querySelector('.timeline') as HTMLInputElement;

    rangeInput.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;
        
        // Pobieramy wartości min, max, value i zamieniamy na liczby
        const min = Number(target.min) || 0;
        const max = Number(target.max) || 100; // Jeśli max nie jest ustawione, domyślnie 100
        const value = Number(target.value) || 0;

        // Sprawdzamy, czy max > min, aby uniknąć dzielenia przez 0
        const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;
        
        console.log(percent);
        target.style.setProperty('--progress-width', percent + '%');
    });



    const audioPlayElement = document.getElementById('audio-play') as HTMLElement;
    audioPlayElement.addEventListener('click', (event) => {
        const target = event.target as HTMLElement; // Rzutowanie na HTML element

        if (target.id === "audio-play") {
            visible = !visible;
        }
    });


    
});






    let d1List;
    let d2List:any;

    let visible = $state(false);
    $effect(() => {
        if (visible) {
            console.log('new')
            
            // Opóźnienie, aby dać Svelte czas na wyrenderowanie elementów
            setTimeout(() => {
                d1List = document.querySelectorAll('.album-picture');
                d2List = document.querySelectorAll('.tests');
                renewAlbumCover();
                //console.log(d1List, d2List);
            }, 0);
        }
    })

    const platform = get(currentPlatform);


    function renewAlbumCover(){
        d1List = document.querySelectorAll('.album-picture');
        d2List = document.querySelectorAll('.tests');
        //console.log(d1List, d2List);
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
    }





    let songName = $state('Song');
    let imageUrl = $state('default.svg');
    let artistAndAlbum = $state('Artist • Album');
    let songDuration = $state('0:00');
    //let songCurrentTime = $state(song.currentTime);

    let playPasueButtonCircleSrc = $state('play_circle.svg');


    onMount(() => {
            const containerElement = document.getElementById('container') as HTMLElement;
            if (platform() === "android" || platform() === "ios") {
                document.body.style.overflow = "auto";
                containerElement.style.overflow = "auto";
            } else {
                document.body.style.overflow = "hidden";
                containerElement.style.overflow = "hidden";
            }

    });

    onDestroy(() => {
        document.body.style.overflow = "auto"; // Przywrócenie domyślnej wartości
    });
</script>






<div id="container">
    <div id="top" class="scroll-snap-section">

        <div id="top-container">

            <div id="left-bar">

            </div>
            <main id="content">
                {@render children()}
            </main>

        </div>
        <div id="audio-play">

            <input type="range" class="timeline" id="time" min="0" maxlength={100} value={50}>

            <div id="picture-and-info">
                <div id="album-picture">
                    <img src={imageUrl} alt="" draggable="false">
                </div>
    
                <div id="info">
                    <h1>{songName}</h1>
                    <h2>{artistAndAlbum}</h2>
                </div>
            </div>
    
            
            <div id="controls">

                    <button class="button" id="play-previus" onclick={()=>{
                            let local = get(playedSong);
                            local--;
                            playedSong.set(local);
                        }}><img src="skip_previous.svg" alt="">
                    </button>

                    <button class="button" id="play-pause" onclick={()=>{get(isPlaying) ? isPlaying.set(false) : isPlaying.set(true)}}>
                        <img src={playPasueButtonCircleSrc} alt="" style="transform:scale(1.8)">
                    </button>
                    
                    <button class="button" id="play-next" onclick={()=>{
                            let local = get(playedSong);
                            local++;
                            playedSong.set(local);
                    }}><img src="skip_next.svg" alt="">
                    </button>

            </div>

            <div id="others-settings">
                <input type="range">
                <button class="button"><img src="volume/volume2.svg" alt=""></button>
                <button class="button"><img src="add_playlist.svg" alt=""></button>
                <button class="button"><img src="more_options.svg" alt=""></button>
                <button class="button" onclick={() => visible = !visible}><img src="full_screen.svg" alt=""></button>

            </div>

        </div>

    </div>
    <div id="bottom" class="scroll-snap-section">
        {#if platform() === "android" || platform() === "ios"}

            <div id="play-list-phone">
                {#each $playList as songs, myIndex}
                    <OblongSong songFile={songs.src} index={myIndex}></OblongSong>
                {/each}
            </div>

        {:else}
            {#if visible}
                <div id="full" transition:fly={{ y: window.innerHeight, duration: 500 }}>


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




                    <div id="play-list" class="scrollY">

                        {#each $playList as songs, myIndex}
                            <OblongSong songFile={songs.src} index={myIndex}></OblongSong>
                        {/each}
    
                    </div>

                </div>
            {/if}
        {/if}
    </div>    
</div>
