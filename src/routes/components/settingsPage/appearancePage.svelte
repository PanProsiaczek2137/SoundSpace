<script lang="ts">
    import { updateColors, showScroll } from '../../ts/colorUtils.svelte';

    let shadeFactor = 0.5;
    let color: string = "#000000";

    let isScrollHidenChecked = localStorage.getItem('isScrollEnabled') === 'true';

    // Inicjalizacja ustawień przy starcie aplikacji
    if (localStorage.getItem('color')) {
        color = localStorage.getItem('color')!;
    }
    if (localStorage.getItem('shadeFactor')) {
        shadeFactor = parseFloat(localStorage.getItem('shadeFactor')!);
    }

    updateColors(color, shadeFactor);

    // Funkcja aktualizująca kolory
    function handleColorChange(event: Event) {
        color = (event.target as HTMLInputElement).value;
        updateColors(color, shadeFactor);
    }

    function handleShadeFactorChange(event: Event) {
        shadeFactor = parseFloat((event.target as HTMLInputElement).value);
        updateColors(color, shadeFactor);
    }
    

    function changeScroll(){
        showScroll(String(isScrollHidenChecked));
        localStorage.setItem('isScrollEnabled', String(isScrollHidenChecked));
    }


    /*
    changeScroll()
    function changeScroll() {
    let styleTag = document.getElementById('dynamicStyles');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'dynamicStyles';
        document.head.appendChild(styleTag);
    }

    if (isScrollHidenChecked) {
        // Kiedy checkbox jest zaznaczony, włącz pasek przewijania
        styleTag.innerHTML = `
            .scrollY {
                overflow-y: auto;
                scrollbar-width: thin;
                scrollbar-color: var(--dark-white) var(--black);
            }
            .scrollY::-webkit-scrollbar {
                width: 8px;
            }
            .scrollY::-webkit-scrollbar-track {
                background: #ccc;
            }
            .scrollY::-webkit-scrollbar-thumb {
                background-color: #888;
            }
            .scrollY::-webkit-scrollbar-button {
                display: none !important;
            }
            .scrollY::-webkit-scrollbar-button:start,
            .scrollY::-webkit-scrollbar-button:end {
                display: none !important;
            }
            .scrollY {
                -ms-overflow-style: none;
            }

            .scrollX {
                overflow-x: auto;
                scrollbar-width: thin;
                scrollbar-color: var(--dark-white) var(--black);
            }
            .scrollX::-webkit-scrollbar {
                height: 8px;
            }
            .scrollX::-webkit-scrollbar-track {
                background: #ccc;
            }
            .scrollX::-webkit-scrollbar-thumb {
                background-color: #888;
            }
            .scrollX::-webkit-scrollbar-button {
                display: none !important;
            }
            .scrollX::-webkit-scrollbar-button:start,
            .scrollX::-webkit-scrollbar-button:end {
                display: none !important;
            }
            .scrollX {
                -ms-overflow-style: none;
            }
        `;
    } else {
        // Kiedy checkbox jest odznaczony, ukryj paski przewijania
        styleTag.innerHTML = `
            .scrollY::-webkit-scrollbar {
                width: 0 !important; 
            }
            .scrollX::-webkit-scrollbar {
                height: 0 !important;
            }

            .scrollY {
                overflow-y: scroll !important;
                scrollbar-color: transparent transparent !important;
            }

            .scrollX {
                overflow-x: scroll !important; 
                scrollbar-color: transparent transparent !important;
            }
        `;
    }

    localStorage.setItem('isScrollEnabled', String(isScrollHidenChecked));
}
*/

    
</script>

<div id="settings-container-appearance">
    <div class="setting-item">
        <label for="colorPicker">kolor:</label>
        <input
            id="colorPicker"
            type="color"
            oninput={handleColorChange}
            bind:value={color}
        />
    </div>

    <div class="setting-item">
        <label for="shadeFactor">Kontrast:</label>
        <input
            id="shadeFactor"
            type="range"
            min="0.1"
            max="0.5"
            step="0.05"
            bind:value={shadeFactor}
            oninput={handleShadeFactorChange}
        />
        <span>{shadeFactor}</span>
    </div>

    <div id="">
        <label for="scrollVisibleCheckBox" class="checkbox-label">
            <input id="scrollVisibleCheckBox" type="checkbox" bind:checked={isScrollHidenChecked} onchange={changeScroll} class="checkbox-input">
            <span>czy ma być widać scroll</span>
        </label>
    </div>
</div>


<style>

    /* Stylizacja kontenera etykiety */
    .checkbox-label {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 1rem;
        color: var(--white);
        font-family: var(--font);
    }

    /* Ukryj domyślny checkbox */
    .checkbox-input {
        margin-right: 15px;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        width: 40px;
        height: 40px;
        border: 2px solid var(--ligth-black);
        border-radius: 5px;
        background-color: var(--black);
        margin-right: 10px;
        position: relative;
        cursor: pointer;
        transition: background-color 0.2s ease, border-color 0.2s ease;
    }

    /* Stylizacja stanu zaznaczonego checkboxa */
    .checkbox-input:checked {
        background-color: var(--dark-white);
        border-color: var(--ligth-black);
    }

    /* Tworzenie okrągłego środka, który pojawi się po zaznaczeniu */
    .checkbox-input:checked::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        background-color: var(--black);
        border-radius: 50%;
        transition: background-color 0.2s ease;
        transform: translate(-50%, -50%); /* Wyśrodkowanie względem środka */
    }


    /* Dodanie efektu hover na checkboxie */
    .checkbox-input:hover {
        border-color: var(--white);
    }

    /* Stylizacja tekstu obok checkboxa */
    .checkbox-label span {
        font-size: 1.4rem;
        font-weight: 500;
    }





    #settings-container-appearance {
        display: flex;
        flex-direction: column;
        gap: 20px; /* Odstęp między elementami */
        margin: auto; /* Centrowanie na stronie */
        padding: 20px;
    }

    .setting-item {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    label {
        font-size: 1rem;
        font-weight: 500;
        color: var(--white);
        font-family: var(--font);
    }

    input[type="color"],
    input[type="range"] {
        width: 100%;
    }

    span {
        font-size: 1rem;
        font-weight: 300;
        color: var(--white);
        font-family: var(--font);
    }


    
    input[type="range"] {
        width: 100%;
        -webkit-appearance: none; /* Ukrywa domyślne style przeglądarki */
        appearance: none;
        height: 10px;
        background: var(--ligth-black);
        border-radius: 5px;
        outline: none;
        transition: background 0.2s ease-in-out;
    }

    input[type="range"]::-webkit-slider-runnable-track {
        height: 10px;
        background: var(--ligth-black);
        border-radius: 5px;
    }

    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--white);
        border: 2px solid var(--ligth-black);
        cursor: pointer;
        transition: background 0.2s ease-in-out, transform 0.2s ease-in-out;
        margin-top: -5px; /* Podnosi kółko */
    }

    input[type="range"]:hover::-webkit-slider-thumb {
        background: var(--ligth-black);
        transform: scale(1.2);
    }

    input[type="range"]::-moz-range-track {
        height: 10px;
        background: var(--ligth-black);
        border-radius: 5px;
    }

    input[type="range"]::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--white);
        border: 2px solid var(--ligth-black);
        cursor: pointer;
        transition: background 0.2s ease-in-out, transform 0.2s ease-in-out;
        margin-top: -5px; /* Podnosi kółko */
    }

    input[type="range"]:hover::-moz-range-thumb {
        background: var(--ligth-black);
        transform: scale(1.2);
    }

</style>