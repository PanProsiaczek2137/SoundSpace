<script lang="ts">
    import { enable, isEnabled, disable } from '@tauri-apps/plugin-autostart';
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import { currentPlatform } from '../../ts/store.svelte';

    onMount(async ()=>{
        const autoTurnOnCheckBox = document.getElementById("autoTurnOn") as HTMLInputElement;
        if(await isEnabled()){
            autoTurnOnCheckBox.checked = true;
        }else{
            autoTurnOnCheckBox.checked = false;
        }
    })

    function handleChange(event: Event) {
        const checked = (event.target as HTMLInputElement).checked;
        if(checked){
            enable()
        }else{
            disable()
        }
    }
    // when using `"withGlobalTauri": true`, you may use
    // const { enable, isEnabled, disable } = window.__TAURI__.autostart;

    // Enable autostart
    const platform = get(currentPlatform);

</script>


{#if !(platform() === "android" || platform() === "ios")}
<label for="autoTurnOn">
    <input id="autoTurnOn" type="checkbox" onchange={handleChange}>
    autoTurnOn
</label>
{:else}
<p style="color: var(--white);">Jeśli masz pomysł na jakieś ustawienia, powiedz :></p>
{/if}


<!--

General

    🔲 Start with system – Włącz/wyłącz uruchamianie aplikacji przy starcie systemu
    🔲 Minimize to tray – Zminimalizuj aplikację do zasobnika systemowego zamiast zamykania
    🔲 Show notifications – Powiadomienia o zmianie utworu
    🔲 Enable scrobbling – Synchronizacja z Last.fm / Libre.fm
    🔲 Auto-update – Sprawdzanie i pobieranie aktualizacji

Appearance

    🎨 Theme – Jasny / Ciemny / Systemowy
    🎨 Accent color – Wybór koloru akcentu (np. niebieski, czerwony, zielony)
    🔲 Enable album art background – Ustawienie rozmytego tła z okładki albumu
    🔲 Show visualizations – Efekty wizualne podczas odtwarzania muzyki
    🔲 Compact mode – Ukrywanie niektórych elementów UI dla minimalizmu

Shortcuts

    ⌨️ Global shortcuts – Włącz/wyłącz globalne skróty klawiszowe
    ⌨️ Play/Pause – Domyślnie: Space
    ⌨️ Next Track – Domyślnie: Ctrl + →
    ⌨️ Previous Track – Domyślnie: Ctrl + ←
    ⌨️ Volume Up/Down – Domyślnie: Ctrl + ↑ / Ctrl + ↓
    🔲 Custom shortcuts – Opcja dodania własnych skrótów

Playback

    🎵 Output device – Wybór urządzenia audio
    🎵 Equalizer – Suwaki EQ + Presety (Rock, Pop, Jazz, Bass Boost itd.)
    🎵 Crossfade – Czas przenikania między utworami (np. 0-10s)
    🔲 Normalize volume – Automatyczne wyrównywanie głośności
    🔲 Gapless playback – Odtwarzanie bez przerw
    🔲 Enable hardware acceleration – Użycie sprzętowego dekodowania dźwięku

Extensions

    📦 Installed Extensions – Lista aktualnie zainstalowanych dodatków
    🔲 Enable lyrics fetching – Pobieranie tekstów piosenek
    🔲 Spotify/Youtube integration – Możliwość synchronizacji ze Spotify/YT
    🔲 Podcast support – Wsparcie dla RSS i podcastów
    ➕ Browse Extensions – Opcja pobierania dodatkowych wtyczek

Information

    ℹ️ Version – Numer wersji aplikacji
    ℹ️ Check for updates – Sprawdzenie dostępnych aktualizacji
    ℹ️ Developer credits – Informacje o twórcach
    ℹ️ License – Warunki licencji i użytkowania
    ℹ️ Report a bug – Link do zgłaszania błędów
    ℹ️ View logs – Podgląd dziennika zdarzeń aplikacji



-->