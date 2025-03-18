<script lang="ts">
    import { selectedCategory } from '../ts/store.svelte'

    import {} from '../style/settings.css'
    import SettingsCategory from '../components/settingsCategory.svelte'
    import AppearancePage from '../components/settingsPage/appearancePage.svelte'
    import ExtensionsPage from '../components/settingsPage/extensionsPage.svelte'
    import GeneralPage from '../components/settingsPage/generalPage.svelte'
    import InformationPage from '../components/settingsPage/informationPage.svelte'
    import PlaybackPage from '../components/settingsPage/playbackPage.svelte'
    import ShortcutsPage from '../components/settingsPage/shortcutsPage.svelte'
</script>

<div id="settings-container">
    <div id="settings-category-container" class="scrollX">
        <SettingsCategory type="General"></SettingsCategory>
        <SettingsCategory type="Appearance"></SettingsCategory>
        <SettingsCategory type="Shortcuts"></SettingsCategory>
        <SettingsCategory type="Playback"></SettingsCategory>
        <SettingsCategory type="Extensions"></SettingsCategory>
        <SettingsCategory type="Information"></SettingsCategory>
    </div>

    <div id="settings-bottom">
        {#if $selectedCategory == "General"}
            <GeneralPage></GeneralPage>
        {:else if $selectedCategory == "Appearance"}
            <AppearancePage></AppearancePage>
        {:else if $selectedCategory == "Shortcuts"}
            <ShortcutsPage></ShortcutsPage>
        {:else if $selectedCategory == "Playback"}
            <PlaybackPage></PlaybackPage>
        {:else if $selectedCategory == "Extensions"}
            <ExtensionsPage></ExtensionsPage>
        {:else if $selectedCategory == "Information"}
            <InformationPage></InformationPage>
        {/if}
    </div>

</div>