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
    createJsonFile: (playlistName, playlistPicturePath, playlistDiscription, playlistPrivacy) => ipcRenderer.invoke('create-json-file', playlistName, playlistPicturePath, playlistDiscription, playlistPrivacy),
    doesJsonFileExist: (fileName) => ipcRenderer.invoke('does-json-file-exist', fileName),
    saveImageToPlaylistCovers: (fileName, imageData) => ipcRenderer.invoke('save-image-to-playlist-covers', fileName, imageData),
    transferAudioFile: (sourcePath, destination, settings) => ipcRenderer.invoke('transfer-audio-file', sourcePath, destination, settings),
    addRemoveSongToPlaylist: (playlistName, songPath) => ipcRenderer.invoke('add-remove-song-to-playlist', playlistName, songPath),
    onPreviousTrack: (callback) => ipcRenderer.on('media-previous-track', callback),
    onNextTrack: (callback) => ipcRenderer.on('media-next-track', callback),
    onStopPlayTrack: (callback) => ipcRenderer.on('media-stop-play-track', callback),
    isLoadedMusic: () => ipcRenderer.invoke('is-loaded-music'),
    openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
    addArtist: (name) => ipcRenderer.invoke('add-artist', name),
    addAlbum: (artistName, albumName, songs, date, description) => ipcRenderer.invoke('add-album', artistName, albumName, songs, date, description),
    getArtist: (artistName) => ipcRenderer.invoke('get-artist', artistName)
});