const { contextBridge, ipcRenderer } = require('electron');

// Wystawienie API do komunikacji przez IPC
contextBridge.exposeInMainWorld('api', {
    getAudioFiles: () => ipcRenderer.invoke('get-audio-files'),
    getAllAudioFilePaths: () => ipcRenderer.invoke('get-all-audio-file-paths'),  // Poprawiona nazwa metody
    getAllJsonFilePaths: () => ipcRenderer.invoke('get-all-json-file-paths'),
    getSpecificAudioFile: (fileName) => ipcRenderer.invoke('get-specific-audio-file', fileName),
    getSpecificJsonFile: (fileName) => ipcRenderer.invoke('get-specific-json-file', fileName),
    onPreviousTrack: (callback) => ipcRenderer.on('media-previous-track', callback),
    onNextTrack: (callback) => ipcRenderer.on('media-next-track', callback),
    onStopPlayTrack: (callback) => ipcRenderer.on('media-stop-play-track', callback)
});


