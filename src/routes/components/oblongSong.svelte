<script lang="ts">
    import { playedSong, playList } from '../audioSys.svelte'
    import { currentPlatform, areWeMoveingTheSong, mousePosY } from '../ts/store.svelte'
    import { get } from 'svelte/store';
    import { onMount } from 'svelte';
    const platform = get(currentPlatform)
    let thisElement: HTMLElement;
    let container:HTMLElement;
    let SongCover = 'default.png';
    export let songTitle = 'Loading...';
    export let index:number
    let songArtist = 'Loading...'
    let songDuration = '...' 
    let heldTtem: HTMLElement | null;
    let holdTime: any
    const holdDuration = 200; 
    let mouseY: number = 0
    let playedSongLocal: number


    onMount(()=>{
        if(platform() == "android" || platform() == "ios"){
            container = document.getElementById('play-list-phone') as HTMLElement;
        }else{
            container = document.getElementById('play-list') as HTMLElement;
        }



        thisElement.addEventListener('pointerdown', () => {
            //scrolling(false)
            if (get(areWeMoveingTheSong) === false) {
                holdTime = setInterval(() => {
                    console.log('trzymamy');
                    heldTtem = thisElement;
                    thisElement.style.backgroundColor = '#161616'
                    thisElement.style.position = 'absolute'
                    thisElement.style.zIndex = "999"
                    areWeMoveingTheSong.set(true);
                }, holdDuration);
            }
        });



        thisElement.addEventListener('pointerup', () => {
            if (get(areWeMoveingTheSong) === false) {
                playedSong.set(index);
            }
            clearTimeout(holdTime);
        });


        document.addEventListener('pointerup', () => {
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
                            }
                            else if (currentPlayedSongIndex > draggedIndex && currentPlayedSongIndex <= targetIndex) {
                                playedSong.set(currentPlayedSongIndex - 1);
                            }
                            else if (currentPlayedSongIndex < draggedIndex && currentPlayedSongIndex >= targetIndex) {
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
        });



        setInterval(() => {
            console.log(get(playedSong))
        }, 1000);


        document.addEventListener('pointermove', (event) => {
            if (get(areWeMoveingTheSong)) {
                if(heldTtem){
                    if(platform() == "android" || platform() == "ios"){
                        thisElement.style.top = (Number(mouseY)+window.innerHeight-900)+"px"
                    }else{
                        thisElement.style.top = (Number(mouseY)-25)+"px"
                    }
                }
            }else{
                clearTimeout(holdTime);
            }
        });



        container.addEventListener('touchmove', (event) => {
            if (get(areWeMoveingTheSong)) {
                event.preventDefault();  
                console.log('anulujemy!');
            }
        }, { passive: false });

        
        /* !!!!!!!!!! TODO !!!!!!!!!!
        setInterval(() => {
            //playedSong.set(2)
            if(get(playedSong) == Number(thisElement.dataset.index)){
                thisElement.style.backgroundColor = "var(--ligth-black)"
            }else{
                thisElement.style.backgroundColor = "var(--black)"
            }
        }, 200);
        */

        if(thisElement.dataset.index == "0"){
            container.addEventListener('wheel', value =>{
                if(get(areWeMoveingTheSong)){
                    container.scrollBy(0, value.deltaY)
                }
            })
        }

    })
    
    mousePosY.subscribe( value =>{
        mouseY = value;
    });

    
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

</script>


<div bind:this={thisElement} data-index={index} class="oblong-song" id="container" tabindex="-1" role="button">
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