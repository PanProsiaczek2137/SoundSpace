<script lang="ts">
    import {} from '../style/settings.css'
    import SettingsCategory from '../components/settingsCategory.svelte'
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
</div>