<script lang="ts">
    import { formatDuration } from '../audioSys.svelte';
    import { playLocal } from '../+layout.svelte';
    import { setPlayedSong, playList } from '../audioSys.svelte';
    import { getDataOfFile, readTheImgFile } from '../saveSongData.svelte';
    import { onMount } from 'svelte';
    import { reload } from '../ts/store.svelte';
    import { platform } from '@tauri-apps/plugin-os';    

    export let myIndex = 0;
    export let theSong: any;
    let songData: any = null;
    let isLoading = true;
    let img: any;
    let container: HTMLElement;

    let isClick = true;
    let holdTimeout: any;
    const holdDuration = 200;
    let moving = false;
    let initialMouseY = 0;
    let initialContainerY = 0;
    let isMoved = false; // Zmienna, która śledzi, czy użytkownik ruszył palcem (lub kursorem)

    
    let test: any;
    let test2: any;
    const currentPlatform = platform();

    onMount(() => {
        let ok: HTMLElement;

        if (currentPlatform !== 'android' && currentPlatform !== 'ios') {
            ok = document.getElementById('play-list') as HTMLElement;

            // Obsługa myszki dla komputerów
            ok.addEventListener('mousemove', (event) => {
                test = event.clientY;
                console.log(test);

                // Przypisanie aktualnej wartości scrollTop do zmiennej test2
                test2 = ok.scrollTop;
                console.log('ScrollTop:', test2);
            });
        } else {
            ok = document.getElementById('next') as HTMLElement;

            // Obsługa dotyku dla urządzeń mobilnych
            ok.addEventListener('touchmove', (event) => {
                // Użyj pierwszego punktu dotyku (palca) z listy `touches`
                const touch = event.touches[0];
                test = touch.clientY;
                console.log(test);

                // Przypisanie aktualnej wartości scrollTop do zmiennej test2
                test2 = ok.scrollTop;
                console.log('ScrollTop:', test2);
            });
        }
    });
    

    // Pobranie danych asynchronicznie
    reload.subscribe(value => {
        if (value === true) {
            console.log('Reload zmieniło się na true!');
            reloadLocal();
            reload.set(false);
        }
    });

    reloadLocal();
    export async function reloadLocal() {
        console.log(container);
        songData = await getDataOfFile();
        img = await readTheImgFile(songData[theSong.src].picture);
        if (img == null) {
            img = 'default.png';
        }
        console.log('name: ', songData[theSong.src].title, "id: ", myIndex);
        isLoading = false;
    }

    function handleHoldStart(event: PointerEvent | TouchEvent) {
        // Resetujemy zmienną isMoved oraz isClick przy rozpoczęciu przytrzymania
        isMoved = false;
        isClick = true;  // Resetujemy isClick przed rozpoczęciem przytrzymania

        // Nasłuchujemy na ruch w czasie przytrzymania
        const moveListener = (moveEvent: PointerEvent | TouchEvent) => {
            if (
                (moveEvent instanceof PointerEvent && Math.abs(moveEvent.clientY - initialMouseY) > 10) ||
                (moveEvent instanceof TouchEvent && Math.abs(moveEvent.touches[0].clientY - initialMouseY) > 10)
            ) {
                isMoved = true; // Wykryto ruch, anulujemy odliczanie
                isClick = false;  // Zmiana na false, ponieważ było przesunięcie
                clearTimeout(holdTimeout); // Anulujemy odliczanie
                document.removeEventListener('pointermove', moveListener); // Usuwamy nasłuchiwacz
                document.removeEventListener('touchmove', moveListener); // Usuwamy nasłuchiwacz
            }
        };

        // Nasłuchiwanie na ruch podczas przytrzymania
        document.addEventListener('pointermove', moveListener);
        document.addEventListener('touchmove', moveListener);

        // Rozpoczynamy odliczanie
        holdTimeout = setTimeout(() => {
            if (!isMoved) {
                moving = true; // Ustawiamy moving na true, jeśli nie było ruchu
                console.log('Element przesuwany!');
                disableScroll();

                // Przechowujemy pozycję startową
                if (event instanceof PointerEvent) {
                    initialMouseY = event.clientY;
                } else if (event instanceof TouchEvent) {
                    initialMouseY = event.touches[0].clientY;
                }

                initialContainerY = container.offsetTop;
                container.style.position = "absolute";
                container.style.zIndex = "1000"; // Zwiększamy z-index, aby element był nad innymi
            }
        }, holdDuration); // Po 0.2 sekundy ustawiamy moving na true, jeśli nie było ruchu
    }

    document.addEventListener('wheel', (event) => {
        if(isMoved){
            const elment = document.getElementById('play-list') as HTMLElement;
            elment.scrollBy({ top: event.deltaY })
            console.log(event, isMoved)
            //test2 = event.offsetY
        }else{
            console.log(isMoved)
        }
    });

    document.addEventListener('touchmove', (event) => {
        //console.log('Touchmove event detected:', event);
    });

    function handleMouseMove(event: PointerEvent | TouchEvent) {
        if (moving) {
            let deltaY = 0;
            if (event instanceof PointerEvent) {
                deltaY = event.clientY - initialMouseY;
            } else if (event instanceof TouchEvent) {
                deltaY = event.touches[0].clientY - initialMouseY;
            }

            if(currentPlatform !== 'android' && currentPlatform !== 'ios'){
                container.style.top = `${(test-25)+test2}px`;

            }else{
                container.style.top = `${(window.innerHeight)+(test+40)+test2}px`;
                console.log(test, test2)
            }
        }
    }

    function handlePointerUp() {
        moving = false;
        isMoved = false; // Resetujemy zmienną
        console.log('przestajemy przesuwać!');
        enableScroll();

        container.style.zIndex = "1";
        setTimeout(() => {
            container.style.position = "";
        }, 10);

        if (isClick) {
            console.log('Kliknięto element!');
            // Tutaj obsługujesz kliknięcie
        } else {
            console.log('Element został przytrzymany!');
            // Tutaj obsługujesz przytrzymanie
        }

        const closestIndex = findClosestElement();
        if (closestIndex !== null) {
            console.log('Najbliższy element ma indeks:', closestIndex);

            const movedSong = playList.splice(myIndex, 1)[0];
            const targetIndex = closestIndex > myIndex ? closestIndex - 1 : closestIndex;
            playList.splice(targetIndex, 0, movedSong);

            console.log('Zaktualizowana playlista:', playList);
            reload.set(true);
        }
    }


    function setupHoldEvents() {
        container.addEventListener('pointerdown', (event) => {
            handleHoldStart(event);
        });

        container.addEventListener('touchstart', (event) => {
            handleHoldStart(event);
        });

        container.addEventListener('pointerup', () => {
            clearTimeout(holdTimeout); // Anulujemy odliczanie przy zwolnieniu przycisku
            if (moving) {
                handlePointerUp();
            } else {
                setPlayedSong(myIndex).then(() => {
                    playLocal(true);
                });
            }
        });

        container.addEventListener('touchend', () => {
            clearTimeout(holdTimeout); // Anulujemy odliczanie przy zwolnieniu przycisku
            if (moving) {
                handlePointerUp();
            } else {
                setPlayedSong(myIndex).then(() => {
                    playLocal(true);
                });
            }
        });

        // Nasłuchiwanie na ruch myszy
        document.addEventListener('pointermove', handleMouseMove);
        document.addEventListener('touchmove', handleMouseMove);
    }

    function findClosestElement() {
        const allElements = Array.from(document.querySelectorAll('.oblong-song')) as HTMLElement[];
        const draggedRect = container.getBoundingClientRect();
        let closestElement: HTMLElement | null = null;
        let closestDistance = Infinity;

        allElements.forEach((element) => {
            if (element === container) return;
            const rect = element.getBoundingClientRect();
            const distance = Math.abs(rect.top - draggedRect.top);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestElement = element;
            }
        });

        if (closestElement) {
            const closestIndex = (closestElement as HTMLElement).dataset.index;
            return closestIndex !== undefined ? parseInt(closestIndex, 10) : null;
        }

        return null;
    }

    onMount(() => {
        setupHoldEvents();

        return () => {
            document.removeEventListener('pointermove', handleMouseMove);
        };
    });

    
    function disableScroll() {
        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "none";
    }

    function enableScroll() {
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
    }
</script>




<div bind:this={container} data-index={myIndex} class="oblong-song" id="container" tabindex="-1" role="button">
    {#if isLoading}
        <p>Ładowanie...</p>
    {:else}
        <div id="img-container">
            <img src={img} alt="">
        </div>
        <div id="name-artists">
            <p id="name">{songData[theSong.src].title}</p>
            <p id="artist">{songData[theSong.src].artist}</p>
        </div>
        <div id="time">
            <p>{formatDuration(songData[theSong.src].duration)}</p>
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