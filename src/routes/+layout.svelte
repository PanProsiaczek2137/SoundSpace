
<script lang="ts">

    //let { children } = $props();

    //import { invoke } from '@tauri-apps/api/core';

    import Page from './+page.svelte';
    import HomePage from './home/+page.svelte'
    import LibraryPage from './library/+page.svelte'
    import SettingsPage from './settings/+page.svelte';
    

    import {} from './style/global.css'
    import {} from './style/audioControlBar.css'
    import {} from './style/full.css'
    import {} from './style/bottom.css'
    import {} from './style/scrollBar.css'
    import {} from './style/timeline.css'
    import {} from './style/leftBar.css'
    import {} from './style/changePageBar.css'
    import {} from './style/contextmenu.css'
    import {} from './style/loadingData.css'
    import {} from './style/description.css'

    import { playList, playedSong, isPlaying, visible, duration, currentTime, formatDuration, song, loadVolumeRange } from './ts/audioSys.svelte.ts'
    import { currentPlatform, selectedPanel, ContextMenuOn, selectedFilter } from './ts/store.svelte.ts'
    import { contextMenu } from './ts/contextMenu.svelte.ts';
    import { toLoad, progres } from './ts/loadingMetaData.svelte.ts'
    import { keyboardShortcuts, spectialButtons } from './ts/keyboardShortcuts.svelte.ts'
    import { returnSongMetadata, loadingSongsLogic } from './ts/saveSongData.svelte.ts'
    import { updateColors } from './ts/colorUtils.svelte.ts'
    onMount(() => {
        // Przekazanie wartości do updateColors, które muszą być zapisane z localStorage
        const color = localStorage.getItem('color') || '#000000';
        const shadeFactor = parseFloat(localStorage.getItem('shadeFactor') || '0.5');
        updateColors(color, shadeFactor);
    });
    keyboardShortcuts()
    onMount(()=>{spectialButtons(); loadingSongsLogic();})



    contextMenu()
    //import {} from './ts/timeline.ts'

    import OblongSong, {} from './components/oblongSong.svelte'
    import { onMount, onDestroy } from "svelte";
    import { writable, get } from 'svelte/store';
	import { fly } from 'svelte/transition';
    //import Page from './+page.svelte';

    onMount(()=>{
        loadVolumeRange()
        document.querySelectorAll("button, input, a, textarea, select").forEach(el => {
            el.setAttribute("tabindex", "-1");
        });
    })

    

    selectedPanel.subscribe(value => {
        console.log(value);
        setTimeout(() => {
            visible.set(false);
        }, 10);
        //visible = false;
    });


    onMount(() => {

        const rangeInput = document.querySelector('.timeline') as HTMLInputElement;
        rangeInput.style.setProperty('--progress-width', 0 + '%');

        const updateRange = () => {
            const min = Number(rangeInput.min) || 0;
            const max = Number(rangeInput.max) || 100;
            const value = Number(rangeInput.value) || 0;
            const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;

            console.log(percent);
            rangeInput.style.setProperty('--progress-width', percent + '%');

            if(percent == 100){
                console.log("next Song!")
                const nextSongButton = document.getElementById("play-next") as HTMLButtonElement;
                nextSongButton.click();
                
            }
        };

        // Nadpisujemy setter `value`, aby wykrywać zmiany ustawiane przez kod
        const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');

        Object.defineProperty(rangeInput, 'value', {
            get() {
                return descriptor?.get?.call(rangeInput);
            },
            set(newValue) {
                descriptor?.set?.call(rangeInput, newValue);
                updateRange(); // Aktualizujemy stan suwaka
            }
        });

        // Obsługa zdarzenia `input` (zmiany przez użytkownika)
        rangeInput.addEventListener('input', updateRange);


        let timeValue = 0;

        rangeInput.addEventListener('input', (event) => {
            if (get(isPlaying)) {
                song.pause();
            }
            //@ts-ignore
            timeValue = event.target.value;
        });

        // Obsługa podniesienia palca/myszy
        const resumePlayback = () => {
            song.currentTime = timeValue;
            if (get(isPlaying)) {
                song.play();
            }
        };

        rangeInput.addEventListener('pointerup', resumePlayback);
        rangeInput.addEventListener('touchend', resumePlayback); // Dodaj obsługę dotyku




    const audioPlayElement = document.getElementById('audio-play') as HTMLElement;
    audioPlayElement.addEventListener('click', (event) => {
        const target = event.target as HTMLElement; // Rzutowanie na HTML element

        if (target.id === "audio-play") {
            visible.set(!get(visible));
        }
    });


    
});






    let d1List;
    let d2List:any;
    
    visible.subscribe(()=>{
        console.log('new')
            
        // Opóźnienie, aby dać Svelte czas na wyrenderowanie elementów
        setTimeout(() => {
            d1List = document.querySelectorAll('.album-picture');
            d2List = document.querySelectorAll('.tests');
            renewAlbumCover();
            //console.log(d1List, d2List);
        }, 0);
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




    //let songCurrentTime = $state(song.currentTime);

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


    onMount(()=>{
        const topContainer = document.getElementById('top-container') as HTMLElement;
        const audioPlay = document.getElementById('audio-play') as HTMLElement;
        if(platform() === "android" || platform() === "ios"){
            topContainer.style.height = "calc(100% - 135px)";
            audioPlay.style.height = "135px";
        }
    });



    let showDescription = $state(false);
    $effect(() => {
        const descriptionContainer = document.getElementById("description-container") as HTMLButtonElement | null;
        if (!descriptionContainer) return;
        const theDescription = document.getElementById("the-description") as HTMLParagraphElement | null;
        if(theDescription)
        theDescription.innerText = "Loading..."

        if (showDescription) {
            descriptionContainer.style.display = "flex";
            (async () => {
                try {
                    // @ts-ignore
                    const metadata = await returnSongMetadata(get(ContextMenuOn).name);
                    if (!metadata?.native?.["ID3v2.3"]) return;

                    const descriptionTags = metadata.native["ID3v2.3"]
                        .filter(tag => tag.id === "TXXX:description")
                        .map(tag => tag.value)
                        .filter(value => value); // Usuwa puste wartości

                    if (!descriptionTags.length) return;

                    if (!theDescription) return;
                    console.log(descriptionTags[0]);
                    theDescription.innerText = descriptionTags[0] as string;

                } catch (err) {
                    console.error("Błąd pobierania metadanych:", err);
                }
            })();
        } else {
            descriptionContainer.style.display = "none";
        }
    });

</script>












{#if $progres != -100}
    <div id="loading-data">
        <progress value={$progres} max={$toLoad}></progress>
    </div>
{/if}




{#if platform() === "android" || platform() === "ios"}
<div id="contextmenu-phone">
    <button id="contextmenu-add-as-next" class="button contextmenu-button" onclick={() => {
        // Stwórz nową playlistę, zaczynając od aktualnego stanu
        let newPlaylist = [...get(playList)]; // Skopiuj oryginalną playlistę

        //@ts-ignore
        newPlaylist.splice(get(playedSong) + 1, 0, { type: 'musicFolder', src: get(ContextMenuOn).name });


        console.log(newPlaylist);
        playList.set(newPlaylist); // Zaktualizuj playList


        const playPrevius = document.getElementById("play-previus") as HTMLButtonElement;
        if(get(playedSong) == 0){
            playPrevius.disabled = true;
        }else{
            playPrevius.disabled = false;
        }

            const playNext = document.getElementById("play-next") as HTMLButtonElement;
        if(get(playedSong) == get(playList).length-1){
            playNext.disabled = true;
        }else{
            playNext.disabled = false;
        }

    }}>
    dodaj jako następne
    </button>    
    <!--
    <button id="contextmenu-add-to-playlist" class="button contextmenu-button" disabled>
        dodaj do playListy
    </button>
    -->
    <button id="contextmenu-show-author" class="button contextmenu-button" onclick={async ()=>{

        //@ts-ignore
        const metadata = await returnSongMetadata(get(ContextMenuOn).name);
        
        if (metadata && metadata.native && metadata.native["ID3v2.3"]) {
            const purlTags = metadata.native["ID3v2.3"]
                .filter(tag => tag.id === "TXXX:purl")
                .map(tag => tag.value)
                .filter(value => value); // Usuwa puste wartości

            if (purlTags.length > 0) {
                let fullUrl = purlTags.join("/"); // Skleja fragmenty URL
                
                // Naprawa https: → https://
                fullUrl = fullUrl.replace(/^https:\//, "https://");

                console.log(fullUrl);

                // Otwiera link w nowej karcie
                window.open(fullUrl, "_blank");
            } else {
                console.log("Nie znaleziono URL");
            }
        } else {
            console.log("Brak danych ID3v2.3");
        }

    }}>
        odwiedź wytrynę
    </button>
    <button id="contextmenu-show-album" class="button contextmenu-button" onclick={()=>{
        showDescription = true;
    }}>
        pokaż opis
    </button>
    <button id="contextmenu-share" class="button contextmenu-button" disabled onclick={ ()=>{
        if(navigator.share){
            navigator.share({
                text: "test",
                title: "to jest test"
            })
        }else{
            console.log('nie jest wspierany!');
        }
    }}>
        udostępnij
    </button>
</div>
{:else}
<div id="contextmenu">
    <button id="contextmenu-add-as-next" class="button" onclick={() => {
            // Stwórz nową playlistę, zaczynając od aktualnego stanu
            let newPlaylist = [...get(playList)]; // Skopiuj oryginalną playlistę
        
            //@ts-ignore
            newPlaylist.splice(get(playedSong) + 1, 0, { type: 'musicFolder', src: get(ContextMenuOn).name });


            console.log(newPlaylist);
            playList.set(newPlaylist); // Zaktualizuj playList


            const playPrevius = document.getElementById("play-previus") as HTMLButtonElement;
            if(get(playedSong) == 0){
                playPrevius.disabled = true;
            }else{
                playPrevius.disabled = false;
            }

                const playNext = document.getElementById("play-next") as HTMLButtonElement;
            if(get(playedSong) == get(playList).length-1){
                playNext.disabled = true;
            }else{
                playNext.disabled = false;
            }

        }}>
        dodaj jako następne
    </button>
    <!--
    <button id="contextmenu-add-to-playlist" class="button" disabled>
        dodaj do playListy
    </button>
    -->
    <button id="contextmenu-show-author" class="button" onclick={async ()=>{

        //@ts-ignore
        const metadata = await returnSongMetadata(get(ContextMenuOn).name);
        
        if (metadata && metadata.native && metadata.native["ID3v2.3"]) {
            const purlTags = metadata.native["ID3v2.3"]
                .filter(tag => tag.id === "TXXX:purl")
                .map(tag => tag.value)
                .filter(value => value); // Usuwa puste wartości

            if (purlTags.length > 0) {
                let fullUrl = purlTags.join("/"); // Skleja fragmenty URL
                
                // Naprawa https: → https://
                fullUrl = fullUrl.replace(/^https:\//, "https://");

                console.log(fullUrl);

                // Otwiera link w nowej karcie
                window.open(fullUrl, "_blank");
            } else {
                console.log("Nie znaleziono URL");
            }
        } else {
            console.log("Brak danych ID3v2.3");
        }

    }}>
        odwiedź wytrynę
    </button>
    <button id="contextmenu-show-album" class="button" onclick={()=>{
        showDescription = true;
    }}>
        pokaż opis
    </button>
    <!--
    <button id="contextmenu-share" class="button" disabled onclick={ ()=>{
        if(navigator.share){
            navigator.share({
                text: "test",
                title: "to jest test"
            })
        }else{
            console.log('nie jest wspierany!');
        }
    }}>
        udostępnij
    </button>
    -->
</div>
{/if}




<div id="description-container" 
    role="button" 
    tabindex="0" 
    aria-label="Zamknij opis"
    onclick={(e) => {
        // @ts-ignore
        if (e.target.id == 'description-container') { 
            showDescription = false; 
        } 
    }}
    onkeydown={(e) => {
        if (e.key === "Enter" || e.key === " ") showDescription = false;
    }}>
    <div id="description" class="scrollY">
        <p id="the-description"></p>
    </div>
</div>



<div id="container">
    <div id="top" class="scroll-snap-section">

        <div id="top-container">

            <div id="left-bar">
                <button  id="left-bar-home" class="left-bar-buttons button" onclick={()=>{selectedPanel.set('home')}} style="background-color: {$selectedPanel === 'home' ? 'var(--ligth-black)' : 'transparent'}">
                    {#if $selectedPanel == "home"}
                        <img src="left-bar/home-filld.svg" alt="" draggable="false">
                    {:else}
                        <img src="left-bar/home.svg" alt="" draggable="false">
                    {/if}
                    <p>Home</p>
                </button>

                <button id="left-bar-library" class="left-bar-buttons button" onclick={()=>{selectedPanel.set('library')}} style="background-color: {$selectedPanel === 'library' ? 'var(--ligth-black)' : 'transparent'}">
                    {#if $selectedPanel == "library"}
                        <img src="left-bar/library-filld.svg" alt="" draggable="false">
                    {:else}
                        <img src="left-bar/library.svg" alt="" draggable="false">
                    {/if}
                    <p>Library</p>
                </button>

                <button id="left-bar-settings" class="left-bar-buttons button" onclick={()=>{selectedPanel.set('settings')}} style="background-color: {$selectedPanel === 'settings' ? 'var(--ligth-black)' : 'transparent'}">
                    {#if $selectedPanel == "settings"}
                        <img src="left-bar/settings-filld.svg" alt="" draggable="false">
                    {:else}
                        <img src="left-bar/settings.svg" alt="" draggable="false">
                    {/if}
                    <p>Settings</p>
                </button>
            </div>
            <main id="content">
                {#if $selectedPanel == "home"}
                    <HomePage></HomePage>
                {:else if $selectedPanel == "library"}
                    <LibraryPage></LibraryPage>
                {:else}
                    <SettingsPage></SettingsPage>
                {/if}
            </main>

        </div>

        <!--
        {#if platform() === "android" || platform() === "ios"}
            <div id="bottom-bar">
                    
            </div>
        {/if}
        -->

        <div id="audio-play">
            
            {#if platform() === "android" || platform() === "ios"}
                <div id="change-page">
                    <button class="button" onclick={()=>{selectedPanel.set('home')}}>
                        {#if $selectedPanel == "home"}
                            <img src="left-bar/home-filld.svg" class="change-page-button" alt="" draggable="false">
                        {:else}
                            <img src="left-bar/home.svg" class="change-page-button" alt="" draggable="false">
                        {/if}
                    </button>
    
                    <button class="button" onclick={()=>{selectedPanel.set('library')}}>
                        {#if $selectedPanel == "library"}
                            <img src="left-bar/library-filld.svg" class="change-page-button" alt="" draggable="false">
                        {:else}
                            <img src="left-bar/library.svg" class="change-page-button" alt="" draggable="false">
                        {/if}
                    </button>
    
                    <button class="button" onclick={()=>{selectedPanel.set('settings')}}>
                        {#if $selectedPanel == "settings"}
                            <img src="left-bar/settings-filld.svg" class="change-page-button" alt="" draggable="false">
                        {:else}
                            <img src="left-bar/settings.svg" class="change-page-button" alt="" draggable="false">
                        {/if}
                    </button>
                </div>
            {/if}

            <div id="audio-control-bar">

                <!--console.log(formatDuration(get(currentTime)), formatDuration(get(duration)));!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!-->
                <input type="range" class="timeline" id="time" min="0" max={Math.floor($duration)} value={Math.floor($currentTime)}>

                <div id="picture-and-info" 
                    role="button" 
                    tabindex="0" 
                    aria-label="Zamknij opis"
                    onclick={(e) => {
                        // @ts-ignore
                        
                        const containerElement = document.getElementById("container") as HTMLElement;
                        if(containerElement.scrollTop > 396){
                            containerElement.scrollTo({
                                top: -99999999999999999, // Przewija do 500px w dół
                                behavior: 'smooth' // Gładkie przewijanie
                            });
                        }else{
                            containerElement.scrollTo({
                                top: 99999999999999999, // Przewija do 500px w dół
                                behavior: 'smooth' // Gładkie przewijanie
                            });
                        }

                    }}
                    onkeydown={() => {}}>

                    <div id="album-picture">
                        <img id="album-pucture-on-bar" src={"default.png"} alt="" draggable="false">
                    </div>
        
                    <div id="info">
                        <h1 id="picture-and-info-song-name">{"songName"}</h1>
                        <h2 id="picture-and-info-artist-album">{"artistAndAlbum"}</h2>
                    </div>
                </div>
            
                <div id="controls">

                        <button class="button" id="play-previus" onclick={()=>{
                                let local = get(playedSong);
                                local--;
                                playedSong.set(local);
                                /*setTimeout(() => {
                                    isPlaying.set(true);
                                }, 150);*/
                            }}><img src="skip_previous.svg" alt="" draggable="false">
                        </button>

                        <button class="button" id="play-pause" onclick={()=>{get(isPlaying) ? isPlaying.set(false) : isPlaying.set(true)}}>
                            <img src={$isPlaying ? "pause_circle.svg" : "play_circle.svg"} alt="" style="transform:scale(1.8)" draggable="false">
                        </button>
                        
                        <button class="button" id="play-next" onclick={()=>{
                                let local = get(playedSong);
                                local++;
                                playedSong.set(local);
                                /*setTimeout(() => {
                                    isPlaying.set(true);
                                }, 150);*/
                        }}><img src="skip_next.svg" alt="" draggable="false">
                        </button>

                </div>

                <div id="others-settings">
                    <button class="button" onclick={() => {visible.set(!get(visible))}}><img src="full_screen.svg" alt="" draggable="false"></button>
                    <button class="button"><img src="more_options.svg" alt="" draggable="false"></button>
                    <button class="button"><img src="add_playlist.svg" alt="" draggable="false"></button>
                    <button class="button" id="volume-button"><img src="volume/volume2.svg" id="volume-button-img" alt="" draggable="false"></button>
                    <input type="range" id="volume-range">
                </div>

            </div>

        </div>

        </div>
        {#if platform() === "android" || platform() === "ios"}
            <div id="bottom" class="scroll-snap-section">

                <div id="play-list-phone">
                    {#each $playList as songs, myIndex}
                        <OblongSong songFile={songs.src} index={myIndex}></OblongSong>
                    {/each}
                </div>

            </div>   
        {:else}
            {#if $visible}
                <div id="full" transition:fly={{ y: window.innerHeight, duration: 500 }}>


                    <div id="picture-full">
                        <div class="album-picture" style="width: 80%; height: 80%; z-index: 5;">
                            <div class="tests">
                                <img id="full-picture" src={"default.png"} alt="" draggable="false">
                            </div>
                        </div>
                        <div class="album-picture" id="blure-picture">
                            <div class="tests">
                                <img id="full-picture-blure" src={"default.png"} alt="" draggable="false">
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
