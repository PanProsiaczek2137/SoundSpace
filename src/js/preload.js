const { contextBridge, ipcRenderer } = require('electron');

// Wystawienie API do komunikacji przez IPC
contextBridge.exposeInMainWorld('api', {
    getAudioFiles: () => ipcRenderer.invoke('get-audio-files'),
    getAllAudioFilePaths: () => ipcRenderer.invoke('get-all-audio-file-paths'),
    getAllJsonFilePaths: () => ipcRenderer.invoke('get-all-json-file-paths'),
    getSpecificAudioFile: (fileName) => ipcRenderer.invoke('get-specific-audio-file', fileName),
    getSpecificJsonFile: (fileName) => ipcRenderer.invoke('get-specific-json-file', fileName),
    getSongData: (fileName) => ipcRenderer.invoke('get-song-data', fileName),
    getWikipediaIntroFromWikidata: (fileName) => ipcRenderer.invoke('get-wikipedia-intro-from-wikidata', fileName),
    getAlbumDataWithExternalLinks: (albumName, artistName) => ipcRenderer.invoke('get-album-data-with-external-links', albumName, artistName),
    moveSongToPosition: (playlist, newOrder) => ipcRenderer.invoke('move-song-to-position', playlist, newOrder),
    onPreviousTrack: (callback) => ipcRenderer.on('media-previous-track', callback),
    onNextTrack: (callback) => ipcRenderer.on('media-next-track', callback),
    onStopPlayTrack: (callback) => ipcRenderer.on('media-stop-play-track', callback),
    isLoadedMusic: () => ipcRenderer.invoke('is-loaded-music'),
});