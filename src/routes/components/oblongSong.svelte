<script lang="ts">
    import { playedSong, playList, formatDuration, isPlaying, song } from '../ts/audioSys.svelte.ts'
    import { currentPlatform, areWeMoveingTheSong, playlistMetaData, readyToLoadMetaData, saveSongDuration } from '../ts/store.svelte'
    import { get, writable } from 'svelte/store';
    import { onMount, onDestroy } from 'svelte';
    import { readSongsMetaDataFile, readTheImgFile } from '../ts/saveSongData.svelte.ts'
    import { loadAllMetaData } from '../ts/loadingMetaData.svelte.ts'
    import { tick } from 'svelte';

    const platform = get(currentPlatform)

    export let songFile:string | null = null;
    export let index: number;

    let SongCover:any = 'default.png';
    let songTitle = 'Loading...';
    let songArtist = 'Loading...';
    let songDuration = '...';

    let heldTtem: HTMLElement | null;
    let holdTime: any;
    const holdDuration = 200;
    let updateBgInterval: any;
    let thisElement: HTMLElement;
    let container: HTMLElement;

    let handlePointerUp: any;
    let handlePointerMove: any;

    let loading = true

    onMount(()=>{

        /*
        if(thisElement.dataset.index == "0"){
            (async ()=>{
                const metaData = await readSongsMetaDataFile()
                playlistMetaData.set(metaData)
            })()

        }

        playlistMetaData.subscribe( () => {
            //reloadMetaDataOnSongs()
        });
        */





        /*
        playList.subscribe(()=>{
            if(thisElement.dataset.index == "0"){
                readyToLoadMetaData.set(false);
                (async ()=>{
                    const metaData = await readSongsMetaDataFile()
                    playlistMetaData.set(metaData)
                    setTimeout(() => {
                        readyToLoadMetaData.set(true);
                    }, 100);
                })()
            }
        })
        */

        readyToLoadMetaData.subscribe( event => {
            if(event){
                reloadMetaDataOnSongs()
            }
        });
        

        async function reloadMetaDataOnSongs(){
            const data:any = get(playlistMetaData)

            //songFile && data[songFile]
            if(songFile != null)
            if (data[songFile]) {

                console.log('MAMY!!!!!!!!!!!');
                console.log(data[songFile])
                
                songTitle = data[songFile].title;
                songArtist = data[songFile].artist;                
                songDuration = formatDuration(data[songFile].duration); 
                setTimeout(() => {
                    (async () => {
                        // Sprawdzamy, czy element jest nadal w DOM przed kontynuowaniem
                        if (!thisElement || !document.body.contains(thisElement)) {
                            //console.log('Element został usunięty, wczytywanie obrazu zatrzymane');
                            return;
                        }

                        const songImg = await readTheImgFile(data[songFile].picture);
                        if(songImg == null){
                            SongCover = "default.png";
                        }else
                        SongCover = songImg;
                        loading = false;
                        console.log('wczytano obraz numer: ' + index);
                    })();
                }, index * 1);
                //loading = false
                
            }

        }


        updateBgInterval = setInterval(updateBackgroundColor, 50);

        function updateBackgroundColor() {
            if (!thisElement || !document.body.contains(thisElement)) return; // Sprawdzenie, czy element jest nadal w DOM

            const isPlaying = get(playedSong) === index;
            let newColor = 'var(--black)';

            if (heldTtem === thisElement) {
                newColor = '#161616';
            } else if (isPlaying) {
                newColor = 'var(--ligth-black)';
            }

            thisElement.style.backgroundColor = newColor;
            
            // Pobieramy element #duration i upewniamy się, że to HTMLElement
            const durationElement = thisElement.querySelector('#duration') as HTMLElement | null;
            if (durationElement) {
                durationElement.style.backgroundColor = newColor;
            }
        }


        if(platform() == "android" || platform() == "ios"){
            container = document.getElementById('play-list-phone') as HTMLElement;
        }else{
            container = document.getElementById('play-list') as HTMLElement;
        }



        thisElement.addEventListener('pointerdown', () => {
            //scrolling(false)
            if (get(areWeMoveingTheSong) === false) {

                if(!(platform() == "android" || platform() == "ios")){
                    holdTime = setInterval(() => {
                        console.log('trzymamy');
                        heldTtem = thisElement;
                        thisElement.style.backgroundColor = '#161616'
                        thisElement.style.position = 'absolute'
                        thisElement.style.zIndex = "999"
                        areWeMoveingTheSong.set(true);
                    }, holdDuration);

                }

            }
        });


        // Przysuwanie na telefonie
        thisElement.addEventListener("contextmenu", event =>{
            event.preventDefault(); 
            if(platform() == "android" || platform() == "ios"){
                console.log("Przesuwamy!");
                console.log('trzymamy');
                heldTtem = thisElement;
                thisElement.style.backgroundColor = '#161616'
                thisElement.style.position = 'absolute'
                thisElement.style.zIndex = "999"
                areWeMoveingTheSong.set(true);
            }
        })



        thisElement.addEventListener('pointerup', () => {
            if (get(areWeMoveingTheSong) === false) {
                playedSong.set(index);
                setTimeout(() => {
                    isPlaying.set(true);
                }, 150);
            }
            clearTimeout(holdTime);
            updateBackgroundColor();
        });


        handlePointerUp = () => {
            if (get(areWeMoveingTheSong)) {
                console.log('upuszczono piosenkę!');
                if (heldTtem) {
                    const draggedIndex = parseInt(heldTtem.dataset.index || "-1", 10);
                    const targetIndex = findClosestElement();

                    console.log('---------------------------');
                    console.log(`przesuwamy: ${draggedIndex}`);
                    console.log(`do elementu: ${targetIndex}`);
                    console.log('---------------------------');

                    if (draggedIndex !== targetIndex && draggedIndex !== -1 && targetIndex !== -1) {
                        playList.update((list) => {
                            const updatedList = [...list];
                            const [movedItem] = updatedList.splice(draggedIndex, 1); // Usuń piosenkę z jej starej pozycji
                            updatedList.splice(targetIndex, 0, movedItem); // Wstaw na nową pozycję

                            const currentPlayedSongIndex = get(playedSong);

                            if (currentPlayedSongIndex === draggedIndex) {
                                playedSong.set(targetIndex);
                            } else if (currentPlayedSongIndex > draggedIndex && currentPlayedSongIndex <= targetIndex) {
                                playedSong.set(currentPlayedSongIndex - 1);
                            } else if (currentPlayedSongIndex < draggedIndex && currentPlayedSongIndex >= targetIndex) {
                                playedSong.set(currentPlayedSongIndex + 1);
                            }

                            return updatedList;
                        });
                    }

                    heldTtem.style.zIndex = "1";
                    heldTtem.style.backgroundColor = 'black';
                    heldTtem.style.position = 'static';

                    areWeMoveingTheSong.set(false);
                }
                heldTtem = null;
            }

            clearTimeout(holdTime);
            updateBackgroundColor();

        };

        document.addEventListener('pointerup', handlePointerUp);

        handlePointerMove = (event:any) => {
            if (get(areWeMoveingTheSong)) {
                if (heldTtem && thisElement && document.body.contains(thisElement)) { // Dodanie sprawdzenia
                    if (platform() == "android" || platform() == "ios") {
                        thisElement.style.top = (Number(event.clientY) + window.innerHeight - 900) + "px";
                    } else {
                        thisElement.style.top = (Number(event.clientY) - 25) + "px";
                    }
                }
            } else {
                clearTimeout(holdTime);
            }
        };
        document.addEventListener('pointermove', handlePointerMove);


        container.addEventListener('touchmove', (event) => {
            if (get(areWeMoveingTheSong)) {
                event.preventDefault();  
            }
        }, { passive: false });

        
        if(thisElement.dataset.index == "0"){
            container.addEventListener('wheel', value =>{
                if(get(areWeMoveingTheSong)){
                    container.scrollBy(0, value.deltaY)
                }
            })
        }

    })

    
    function findClosestElement(): number {
    // Pobranie wszystkich elementów z klasą "oblong-song"
    const allElements = Array.from(document.querySelectorAll('.oblong-song')) as HTMLElement[];

    // Pobranie prostokąta dla elementu przeciąganego
    const draggedRect = thisElement.getBoundingClientRect();

    let closestElement: HTMLElement | null = null;
    let closestDistance = Infinity;

    // Iteracja po wszystkich elementach
    allElements.forEach((element) => {
        // Pomijanie elementu, który jest aktualnie przeciągany
        if (element === thisElement) return;

        // Pobranie prostokąta dla danego elementu
        const rect = element.getBoundingClientRect();

        // Obliczenie odległości w pionie
        const distance = Math.abs(rect.top - draggedRect.top);

        // Aktualizacja najbliższego elementu, jeśli odległość jest mniejsza
        if (distance < closestDistance) {
            closestDistance = distance;
            closestElement = element;
        }
    });

    // Zwracanie wartości `theID` z najbliższego elementu, jeśli istnieje
    // @ts-ignore
    if (closestElement && closestElement.dataset.index) {
        // @ts-ignore
        return parseInt(closestElement.dataset.index, 10); // Pobranie ID z atrybutu data-index
    }

    // Jeśli nie znaleziono żadnego elementu, zwracamy null
    // @ts-ignore
    return thisElement.dataset.index;
}

    onDestroy(() => {
        console.log("usuwamy event listenery");

        // Sprawdzamy, czy element istnieje przed usunięciem eventów
        if (thisElement && document.body.contains(thisElement)) {
            clearInterval(updateBgInterval);

            // Usuwanie event listenerów
            document.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('pointerup', handlePointerUp);

            // Jeśli platforma to Android lub iOS, dodajemy odpowiednią logikę
            if (platform() == "android" || platform() == "ios") {
                container.removeEventListener('touchmove', (event) => {
                    if (get(areWeMoveingTheSong)) {
                        event.preventDefault();
                    }
                });
            } else {
                container.removeEventListener('wheel', () => {});
            }

            // Usuwanie nasłuchiwaczy z thisElement
            thisElement.removeEventListener('pointerdown', () => {});
            thisElement.removeEventListener('contextmenu', () => {});
            thisElement.removeEventListener('pointerup', () => {});
        }
    });


</script>


<div bind:this={thisElement} data-index={index} class="oblong-song" id="container" tabindex="-1" role="button">
    {#if loading}
        <div id="img-container">
            <img src={"default.svg"} alt="" draggable="false">
        </div>
        <div id="name-artists">
            <p id="name">{songFile}</p>
            <p id="artist">{"Loaging..."}</p>
        </div>
        <div id="duration">
            <p>{"..."}</p>
        </div>
    {:else}
        <div id="img-container">
            <img src={SongCover} alt="" draggable="false">
        </div>
        <div id="name-artists">
            <p id="name">{songTitle}</p>
            <p id="artist">{songArtist}</p>
        </div>
        <div id="duration">
            <p>{songDuration}</p>
        </div>
    {/if}
</div>


<style>
    #container {
        min-width: 250px;
        width: 100%;
        height: 60px;
        background-color: var(--black);
        display: flex;   
        border-bottom: solid 1px var(--black);
        z-index: 20;
    }

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

</style>