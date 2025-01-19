<script lang="ts">
    import { onMount } from 'svelte';
    import { setPlayedSong, playList, returnSongMetadata } from '../audioSys.svelte';
    import { getDataOfFile, readTheImgFile } from '../saveSongData.svelte';
    import { areWeMoveingTheSong, oblongSongLoading, mousePosY, reload } from '../ts/store.svelte'
    import { platform } from '@tauri-apps/plugin-os';
    export let theSong: any
    export let theID: number
    let songData: any;
    let thisElement: HTMLElement 
    let isLoading = true;
    let imageUrl: any;
    let areWeMoveingTheSongLocal: boolean
    const currentPlatform = platform();

    let holdTime: any
    const holdDuration = 200; 
    let container: HTMLElement

    onMount(() => {
        if(currentPlatform == "android" || currentPlatform == "ios"){
            container = document.getElementById('next') as HTMLElement;
        }else{
            container = document.getElementById('play-list') as HTMLElement;
        }

        thisElement.addEventListener('pointerdown', () => {
            //scrolling(false)
            if (areWeMoveingTheSongLocal === false) {
                holdTime = setInterval(() => {
                    console.log('trzymamy');
                    thisElement.style.backgroundColor = '#161616'
                    thisElement.style.position = 'absolute'
                    thisElement.style.zIndex = "999"
                    areWeMoveingTheSong.set(true);
                }, holdDuration);
            }
        });

        // Zdarzenie upuszczenia
        thisElement.addEventListener('pointerup', () => {
            if (areWeMoveingTheSongLocal === false) {
                console.log('play');
            }else{



                //playList.push({type: 'musicFolder', src: 'I Want It All.mp3'})


                //const closestIndex = findClosestElement();
                //console.log('closestIndex:', closestIndex);

                //if (closestIndex !== null) {
                //    playList.splice(0, 0, {type: 'musicFolder', src: 'I Want It All.mp3'})
                //    console.log('Updated playList:', playList);
                //}






                container.style.zIndex = "1";
                thisElement.style.backgroundColor = 'black'

                //const closestID = findClosestElement();
                //if(closestID){
                //playList.splice(closestID, 0, songData);
                //}

                thisElement.style.position = 'static'
            }
            clearTimeout(holdTime);
        });

        // Nasłuchiwanie na upuszczenie na całym dokumencie
        document.addEventListener('pointerup', () => {
            //scrolling(true)
            if (areWeMoveingTheSongLocal === true) {
                console.log('upuszczono piosenkę!');
                areWeMoveingTheSong.set(false);
            }
            clearTimeout(holdTime);
        });

        // Nasłuchiwanie na ruch
        document.addEventListener('pointermove', (event) => {
            if (areWeMoveingTheSongLocal === false) {
                clearTimeout(holdTime);
            }
        });

        // Nasłuchiwanie na touchmove w kontenerze
        container.addEventListener('touchmove', (event) => {
            if (areWeMoveingTheSongLocal === true) {
                event.preventDefault();  
                //console.log('anulujemy!');
            }
        }, { passive: false });

    });

    areWeMoveingTheSong.subscribe( value =>{
        areWeMoveingTheSongLocal = value
    });

    oblongSongLoading.subscribe( value =>{
        if(value == theID){
            reloadLocal();
        }
    });
    
    mousePosY.subscribe( value =>{
        if(areWeMoveingTheSongLocal == true){
            console.log(value)
            if(currentPlatform == "android" || currentPlatform == "ios"){
                thisElement.style.top = (Number(value)+window.innerHeight+50)+container.scrollTop+"px"
            }else{
                thisElement.style.top = (Number(value)-25)+container.scrollTop+"px"
            }
        }
    });
    
    
    //reloadLocal();
    export async function reloadLocal() {
            songData = await returnSongMetadata(theSong.src);
            let picture;

            if (songData.common.picture?.[0]?.data) {
                picture = songData.common.picture[0].data
                const uint8Array: Uint8Array = new Uint8Array(picture);
                const blob = new Blob([uint8Array], { type: 'image/jpeg' });
                imageUrl = URL.createObjectURL(blob);
            } else {
                imageUrl = 'default.png';
            }


            console.log('---------------------')
            console.log(songData)
            console.log(imageUrl)
            console.log('---------------------')
            isLoading = false

            oblongSongLoading.set(theID+1)
        };


        function findClosestElement(): number | null {
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
            if (closestElement) {
                // @ts-ignore
                return parseInt(closestElement.dataset.index, 10); // Pobranie ID z atrybutu data-index
            }

            // Jeśli nie znaleziono żadnego elementu, zwracamy null
            return null;
        }


</script>




<div bind:this={thisElement} data-index={theID} class="oblong-song" id="container" tabindex="-1" role="button" >
    {#if isLoading}
        <p>Ładowanie...</p>
    {:else}
        <div id="img-container">
            <img src={imageUrl} alt="" draggable="false">
        </div>
        <div id="name-artists">
            <p id="name">{songData.common.title}</p>
            <p id="artist">{songData.common.artist}</p>
        </div>
        <div id="time">
            <p>{theID}</p>
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
        border-bottom: solid 1px var(--light-black);
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
        color: var(--grey);
    }

    #time {
        display: flex;
        align-items: center;
        position: relative;
        background-color: var(--black);
        padding: 20px;
    }

</style>