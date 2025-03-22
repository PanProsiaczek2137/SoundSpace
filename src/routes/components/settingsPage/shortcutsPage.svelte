<script lang="ts">
    import { get } from 'svelte/store';
    import { isPlaying } from '../../ts/audioSys.svelte.ts';
    import keyboardShortcuts from '../../ts/keyboardShortcuts.svelte.ts';

    let shortcuts = [
        { action: 'Play/Pause', keys: '' },
        { action: 'Seek backward 5 seconds', keys: '' },
        { action: 'Seek forward 5 seconds', keys: '' },
        { action: 'Up volume', keys: '' },
        { action: 'Down volume', keys: '' },
        { action: 'Mute/unmute', keys: '' },
        { action: 'Next track', keys: '' },
        { action: 'Previous track', keys: '' },
        { action: 'Open search bar', keys: '' },
        { action: 'Toggle fullscreen mode', keys: '' }
    ];

    let editingIndex: number | null = null; // Indeks aktualnie edytowanego skrótu
    let currentKey: string = ''; // Zmienna przechowująca aktualnie wprowadzany klawisz

    // Funkcja obsługująca kliknięcie na komórkę
    function handleCellClick(index: number) {
        // Zapisz poprzedni skrót, jeśli jest edytowany
        if (editingIndex !== null && currentKey) {
            handleKeyChange();
        }

        // Rozpocznij edycję
        editingIndex = index;
        currentKey = shortcuts[index].keys || ''; // Załaduj istniejący skrót
    }

    // Funkcja do zakończenia edycji i zapisania skrótu
    function handleKeyChange() {
        if (editingIndex !== null && currentKey) {
            // Zapisz nowy skrót do tabeli
            shortcuts[editingIndex].keys = currentKey;

            // Sprawdzenie, czy `editingIndex` jest poprawnym indeksem w tablicy
            const currentShortcut = shortcuts[editingIndex];
            if (currentShortcut) {
                const key = currentKey.toLowerCase(); // Normalizuj klawisz na małe litery
                keyboardShortcuts.addShortcut(key, () => {
                    console.log(`${currentShortcut.action} wyzwolone!`);
                    if (currentShortcut.action === "Play/Pause") {
                        isPlaying.set(!get(isPlaying));
                    }
                });
            }
        }
        editingIndex = null; // Zakończ edycję
        currentKey = ''; // Wyczyść zmienną
    }

    // Funkcja obsługująca wprowadzanie klawiszy
    function handleKeyInput(event: KeyboardEvent) {
        if (editingIndex !== null) {
            // Jeśli użytkownik wprowadza pojedynczy klawisz
            if (event.key === "Escape") {
                cancelEdit(); // Anuluj edycję, gdy wciśniesz Escape
                return;
            }

            if (event.key === "Enter") {
                handleKeyChange(); // Zapisz skrót po naciśnięciu Enter
                return;
            }

            // Dodaj wciśnięty klawisz do kombinacji (unikamy duplikatów i pustych wartości)
            currentKey = event.key.toLowerCase(); // Przechowuj tylko jeden klawisz
            handleKeyChange(); // Zapisz po wprowadzeniu klawisza
        }
    }

    // Funkcja do anulowania edycji
    function cancelEdit() {
        editingIndex = null; // Zakończ edycję
        currentKey = ''; // Wyczyść zmienną
    }

    // Nasłuchuj na wprowadzenie klawiszy
    window.addEventListener("keydown", handleKeyInput);

    // Funkcja do zapisywania po kliknięciu poza edytowaną komórką
    function handleTableClick(event: MouseEvent) {
        const target = event.target as HTMLElement; // Rzutowanie na HTMLElement
        // Sprawdzenie, czy kliknięto poza komórką edytowaną
        if (editingIndex !== null && !target.closest('td')) {
            handleKeyChange();
        }
    }

    // Nasłuchuj na kliknięcie w tabeli, aby zapisać zmiany
    window.addEventListener('click', handleTableClick);
</script>

<table>
    <thead>
        <tr>
            <th>Key combination</th>
            <th>Performed action</th>
        </tr>
    </thead>
    <tbody>
        {#each shortcuts as { action, keys }, index}
            <tr>
                <td 
                    on:click={() => handleCellClick(index)} 
                    style="background-color: {editingIndex === index ? '#4A90E2' : 'transparent'};">
                    {editingIndex === index ? currentKey : keys || 'Click to assign'}
                </td>
                <td>{action}</td>
            </tr>
        {/each}
    </tbody>
</table>


<style>
    table {
        width: 100%;
        border-collapse: collapse;
    }

    thead {
        color: var(--black);
        font-family: var(--font);
        font-size: 1.75rem;
    }

    th, td {
        border: 1px solid var(--ligth-black);
        padding: 10px;
        text-align: left;
        color: var(--white);
        font-family: var(--font);
    }

    tbody tr{
        background-color: var(--black);
    }

    tbody tr:hover {
        background-color: var(--ligth-black);
    }

    td {
        cursor: pointer;
    }
</style>
