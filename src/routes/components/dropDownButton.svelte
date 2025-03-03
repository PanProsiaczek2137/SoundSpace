<script lang="ts">
    import { selectedFilter, selectedValue } from "../ts/store.svelte";
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

    let isOpen = false;

    function toggleDropdown() {
        setTimeout(() => {
            isOpen = !isOpen;
        }, 1);
    }

    // Zamknięcie dropdowna po kliknięciu poza nim
    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if(target.closest(".dropdown-content") === null)
        isOpen = false;
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

</script>

<div class="dropdown">
    <button onclick={toggleDropdown} class="dropbtn" id={"local-"+type}>{type}</button>
    <div class="dropdown-content" class:show={isOpen}>
        {#each returnAll(type) as item}
            <button class="button" onclick={()=>{isOpen = false; selectedFilter.set(type); selectedValue.set(item);} }>{item}</button>
        {/each}
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

    .dropbtn:hover, .dropbtn:focus {
        background-color: var(--ligth-black);
    } 

    .dropdown {
        width: 100%; /* Dropdown zajmuje całą szerokość */
        position: relative; /* Aby .dropdown-content mogło się ustawić absolutnie względem rodzica */
    }

    .dropdown-content {
        display: none;
        position: absolute;
        background-color: #f1f1f1;
        width: 100%; /* Ustawienie szerokości na 100% */
        overflow: auto;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 5;
    }

    .dropdown-content button {
        color: black;
        padding: 12px 16px;
        text-decoration: none;
        display: block;
        width: 100%;
    }

    .dropdown button:hover { background-color: var(--ligth-black); }

    .show {
        display: block;
    }

    #local-playlist {
        width: 100%;
    }
    @media (width <= 650px) {
        #local-playlist { width: 100%; }
    }
</style>