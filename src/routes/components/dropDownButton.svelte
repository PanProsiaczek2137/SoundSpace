<script lang="ts">
    import { get } from "svelte/store";
    import { selectedFilter, selectedValue, currentPlatform } from "../ts/store.svelte";
    import { isDropDownOpen } from '../ts/store.svelte';
    export let data:any = null;
    export let type = "";

    /*
    playlist
    artist
    album
    year
    genre
    duration
    */
    import { onMount } from "svelte";

    const platform = get(currentPlatform);

    let isOpen = false;

    function toggleDropdown() {
        setTimeout(() => {
            isOpen = !isOpen;
            setTimeout(() => {
                isDropDownOpen.set(isOpen)
            }, 200);
        }, 1);
    }

    // Zamknięcie dropdowna po kliknięciu poza nim
    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if(target.closest(".dropdown-content") === null)
        isOpen = false;
        setTimeout(() => {
            isDropDownOpen.set(isOpen)
        }, 200);
    }

    onMount(() => {
        window.addEventListener("mousedown", handleClickOutside);
    });

    function returnAll(field: string): string[] {
        if(type == "artist" || type == "album"  || type == "genre"){
            const result: string[] = [];
            
            // Iterujemy po data i dodajemy wartość pola do tablicy, jeśli nie ma jej jeszcze w tablicy wynikowej
            for (const key in data) {
                const value = data[key][field];
                if (value !== null && value !== undefined && !result.includes(value)) {
                    result.push(value as string);
                }
            }
            
            return result;
        }



        if (type == "duration") {
            const result: string[] = [];

            for (const key in data) {
                const value = data[key][field];

                if (value !== null && value !== undefined) {
                    let label = '';

                    if (value < 60) {
                        label = '1min';
                    } else if (value >= 60 && value <= 120) {
                        label = '2min';
                    } else if (value >= 120 && value <= 180) {
                        label = '3min';
                    } else if (value >= 180 && value <= 240) {
                        label = '4min';
                    } else if (value >= 240 && value <= 300) {
                        label = '5min';
                    } else if (value >= 300 && value <= 600) {
                        label = '10min';
                    } else if (value >= 600 && value <= 1200) {
                        label = '20min';
                    }

                    // Sprawdź, czy label już istnieje w result
                    if (label && !result.includes(label)) {
                        result.push(label);
                    }
                }
            }

            // Posortuj tablicę według wartości liczbowej
            result.sort((a, b) => {
                const numA = parseInt(a);
                const numB = parseInt(b);
                return numA - numB;
            });

            return result;
        }





        if (type == "year") {
            const result: string[] = [];

            for (const key in data) {
                const value = data[key][field];

                if (value !== null && value !== undefined && typeof value === "number") {
                    let label = '';

                    if (value >= 1900) {
                        label = `${Math.floor(value / 10) * 10}s`; // Dekady: 2020s, 2010s, ..., 1900s
                    } else if (value >= 1500) {
                        label = `${Math.floor(value / 100) * 100}`; // Setki: 1800, 1700, ..., 1500
                    }

                    // Sprawdź, czy label już istnieje w result
                    if (label && !result.includes(label)) {
                        result.push(label);
                    }
                }
            }

            // Posortuj od najnowszych do najstarszych
            result.sort((a, b) => {
                const numA = parseInt(a);
                const numB = parseInt(b);
                return numB - numA; // Sortowanie malejące (od najnowszych)
            });

            return result;
        }





        else{
            return [];
        }
    }



    onMount(()=>{
        document.querySelectorAll("button, input, a, textarea, select").forEach(el => {
            el.setAttribute("tabindex", "-1");
        });
    })

    selectedFilter.subscribe(value=>{
        setTimeout(() => {
            const button = document.getElementById("local-btn-"+type) as HTMLButtonElement;
            if(value == type){
                if(button)
                button.style.backgroundColor = "var(--ligth-black)"
            }else{
                if(button)
                button.style.backgroundColor = "var(--black)"
            }
        }, 0);
    })

    selectedValue.subscribe(value=>{
        setTimeout(() => {
            const button = document.getElementById("local-btn-"+type) as HTMLButtonElement;
            const selectButton = document.getElementById(value) as HTMLButtonElement;
            if(get(selectedFilter) == type){
                if(button)
                button.innerText = value;
            }else{
                if(button)
                type
                if(selectButton)
                selectButton.style.backgroundColor = "var(--white)";
                if(selectButton)
                selectButton.style.color = "var(--black)";
            }
        }, 0);
    })

</script>

<div class="dropdown" id={"local-"+type} class:absolutePosition={isOpen && (platform() === "android" || platform() === "ios")}>
    <button onclick={toggleDropdown} id={"local-btn-"+type} class="dropbtn" >{type}</button>
    <div class="dropdown-content scrollY" class:show={isOpen} id={"local-dropDown-"+type}>
        {#if returnAll(type).length == 0}
            <button class="button" style="height: 50px;" disabled>brak</button>
        {:else}

            {#each returnAll(type) as item}
                <button class="button" id={item} onclick={()=>{
                    isOpen = false;
                    setTimeout(() => {
                        isDropDownOpen.set(isOpen)
                    }, 200);
                    if(get(selectedFilter) == type && get(selectedValue) == item){
                        selectedFilter.set("all");
                        selectedValue.set("");
                    }else{
                        selectedFilter.set(type);
                        selectedValue.set(item);
                    }
                }}>{item}</button>
            {/each}

        {/if}
    
    </div>
</div>

<style>
    .dropbtn {
        background-color: var(--black);
        color: white;
        padding: 16px;
        font-size: 16px;
        border: none;
        cursor: pointer;
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    .dropdown.absolutePosition {
        position: absolute;
        top: 0;  /* Dopasowanie w razie potrzeby */
    }

    .dropbtn:hover, .dropbtn:focus {
        background-color: var(--ligth-black);
    } 

    .dropdown {
        position: relative; /* Aby .dropdown-content mogło się ustawić absolutnie względem rodzica */
    }

    .dropdown-content {
        top: 0px;
        left: 0px;
        display: none;
        position: absolute;
        background-color: #f1f1f1;
        /*overflow: auto;*/
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 5;
        max-height: 329px;
    }

    .dropdown-content button {
        background-color: var(--black);
        color: var(--white);
        border: 1px solid var(--ligth-black);
        padding: 12px 0px;
        text-decoration: none;
        display: block;
        width: 100%;
        text-align: center;
    }

    .dropdown button:hover { background-color: var(--ligth-black); }

    .show {
        display: block;
    }

    /*
    @media (width <= 650px) {
        #local-playlist { width: 100%; }
    }
    */
</style>