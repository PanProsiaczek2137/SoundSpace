<script lang="ts">
    import { get } from "svelte/store";
    import { selectedFilter, selectedValue, currentPlatform } from "../ts/store.svelte";
    import { isDropDownOpen } from '../ts/store.svelte';
    export let data: any = null;
    export let type = "";

    import { onDestroy, onMount } from "svelte";

    const platform = get(currentPlatform);

    let isOpen = false;


    //Zmiana z
    /*
    function toggleDropdown() {
        setTimeout(() => {
            isOpen = !isOpen;
            setTimeout(() => {
                isDropDownOpen.set(isOpen)
            }, 200);
        }, 1);
    }
    */ 

    function toggleDropdown() {
        isOpen = !isOpen;
        setTimeout(() => {
            isDropDownOpen.set(isOpen)
        }, 200);
    }


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

    onDestroy(() => {
        window.removeEventListener("mousedown", handleClickOutside);
    });

    function returnAll(field: string): string[] {
        const result: string[] = [];

        if (type == "artist" || type == "album" || type == "genre") {
            
            for (const key in data) {
                const value = data[key][field];
                if (value !== null && value !== undefined && !result.includes(value)) {
                    result.push(value as string);
                }
            }
            return result;
        }

        if (type == "duration") {
            for (const key in data) {
                const value = data[key][field];
                if (value !== null && value !== undefined) {
                    let label = '';
                    if (value < 60) label = '1min';
                    else if (value >= 60 && value <= 120) label = '2min';
                    else if (value >= 120 && value <= 180) label = '3min';
                    else if (value >= 180 && value <= 240) label = '4min';
                    else if (value >= 240 && value <= 300) label = '5min';
                    else if (value >= 300 && value <= 600) label = '10min';
                    else if (value >= 600 && value <= 1200) label = '20min';

                    if (label && !result.includes(label)) {
                        result.push(label);
                    }
                }
            }
            result.sort((a, b) => parseInt(a) - parseInt(b));
            return result;
        }

        if (type == "year") {
            for (const key in data) {
                const value = data[key][field];
                if (value !== null && value !== undefined && typeof value === "number") {
                    let label = '';
                    if (value >= 1900) label = `${Math.floor(value / 10) * 10}s`;
                    else if (value >= 1500) label = `${Math.floor(value / 100) * 100}`;
                    if (label && !result.includes(label)) {
                        result.push(label);
                    }
                }
            }
            result.sort((a, b) => parseInt(b) - parseInt(a));
            return result;
        }

        return [];
    }

    onMount(() => {
        document.querySelectorAll("button, input, a, textarea, select").forEach(el => {
            el.setAttribute("tabindex", "-1");
        });
    });





    
    let unsubscribeFilter: () => void;
    let unsubscribeValue: () => void;
    unsubscribeFilter = selectedFilter.subscribe(value => {
        if (type == "all") {
            setTimeout(() => {
                const button = document.getElementById("local-btn-" + type) as HTMLButtonElement;
                if (value === type) {
                    if (button) button.style.backgroundColor = "var(--ligth-black)";
                } else {
                    if (button) button.style.backgroundColor = "var(--black)";
                }
            }, 0);
        }
    });
    unsubscribeValue = selectedValue.subscribe(value => {
        setTimeout(() => {
            const button = document.getElementById("local-btn-" + type) as HTMLButtonElement;
            const selectButton = document.getElementById(value) as HTMLButtonElement;
            if (get(selectedFilter) === type) {
                if (button) button.innerText = value;
                if (button) button.style.backgroundColor = "var(--ligth-black)";
            } else {
                if (button) button.innerText = type;
                if (selectButton) selectButton.style.backgroundColor = "var(--white)";
                if (selectButton) selectButton.style.color = "var(--black)";
            }
        }, 0);
    });
    onDestroy(() => {
        unsubscribeFilter();
        unsubscribeValue();
    });



    function selectItem(item: string) {
        console.log(type, item)

        if (get(selectedFilter) === type && get(selectedValue) === item) {
            selectedFilter.set("all");
            selectedValue.set("");
        } else {
            selectedFilter.set(type);
            selectedValue.set(item);

            console.log("OKK DALEJ!")

        }
        isOpen = false;
        setTimeout(() => {
            isDropDownOpen.set(isOpen);
        }, 200);
        
    }

    function getSortedItems() {
        const selected = get(selectedValue);
        const items = returnAll(type);
        if (selected && items.includes(selected)) {
            const index = items.indexOf(selected);
            items.splice(index, 1); // Usuń wybrany element
            items.unshift(selected); // Wstaw wybrany element na początek
        }
        return items;
    }
</script>

<div class="dropdown" id={"local-" + type} class:absolutePosition={isOpen && (platform() === "android" || platform() === "ios")}>
    <button onclick={toggleDropdown} id={"local-btn-" + type} class="dropbtn">{get(selectedValue) || type}</button>
    <div class="dropdown-content scrollY" class:show={isOpen} id={"local-dropDown-" + type}>
        {#if getSortedItems().length === 0}
            <button class="button" style="height: 50px;" disabled>brak</button>
        {:else}
            {#each getSortedItems() as item}
                <button
                    class="button"
                    id={item}
                    class:selected={item === get(selectedValue)}
                    onclick={() => {selectItem(item);}}
                >
                    {item}
                </button>
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
        top: 0;
    }

    .dropbtn:hover, .dropbtn:focus {
        background-color: var(--ligth-black);
    }

    .dropdown {
        position: relative;
    }

    .dropdown-content {
        top: 0px;
        left: 0px;
        display: none;
        position: absolute;
        background-color: #f1f1f1;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
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

    .selected {
        background-color: var(--ligth-black);
        color: var(--white);
    }
</style>
