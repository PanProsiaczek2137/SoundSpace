<script lang="ts">
    import { updateColors } from '../../ts/colorUtils.svelte';

    let shadeFactor = 0.5;
    let color: string = "#000000";

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
</script>

<div class="color-settings">
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
</div>

<style>
    .color-settings {
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
    }

    input[type="color"],
    input[type="range"] {
        width: 100%;
    }

    span {
        font-size: 1rem;
        font-weight: 300;
        color: var(--white);
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