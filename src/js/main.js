const { app, BrowserWindow, ipcMain, globalShortcut, Menu } = require('electron');
const path = require('path');
const { getAudioFiles, getAllAudioFilePaths, getSpecificAudioFile, getAllJsonFilePaths, getSpecificJsonFile } = require('./backend/list-audio-files'); // Import funkcji

function createWindow() {
    let mainWindow = new BrowserWindow({
        width: 920,
        height: 540,
        minWidth: 920,
        minHeight: 540,
        icon: path.join(__dirname, '..', 'allResources', 'icon', 'SoundSpaceIconNew.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true, // Upewnij się, że to jest włączone
            enableRemoteModule: false,
            nodeIntegration: false, // Ze względów bezpieczeństwa wyłącz nodeIntegration
            disableHardwareAcceleration: false
        }
    });

    mainWindow.loadFile(path.join(__dirname, '..', 'index.html'));
    mainWindow.webContents.openDevTools();

    // Usunięcie menu aplikacji
    Menu.setApplicationMenu(null);

    // Obsługa wywołania metody get-audio-files
    ipcMain.handle('get-audio-files', async () => {
        try {
            const audioFiles = await getAudioFiles(); // Uzyskaj listę plików audio
            return audioFiles; // Zwróć pliki do renderera
        } catch (err) {
            console.error('Błąd podczas odczytu plików audio:', err);
            return []; // W przypadku błędu, zwróć pustą tablicę
        }
    });

    // Obsługa wywołania get-all-audio-file-names
    ipcMain.handle('get-all-audio-file-paths', async () => {
        try {
            return getAllAudioFilePaths(); // Zwróć wszystkie nazwy plików audio
        } catch (err) {
            console.error('Błąd podczas pobierania nazw plików audio:', err);
            return []; // W przypadku błędu, zwróć pustą tablicę
        }
    });

    ipcMain.handle('get-all-json-file-paths', async () => {
        try {
            return getAllJsonFilePaths(); // Zwróć wszystkie nazwy plików audio
        } catch (err) {
            console.error('Błąd podczas pobierania ścieżek do plików json:', err);
            return []; // W przypadku błędu, zwróć pustą tablicę
        }
    });

    // Obsługa wywołania get-specific-audio-file
    ipcMain.handle('get-specific-audio-file', async (event, fileName) => {
        try {
            return getSpecificAudioFile(fileName); // Zwróć metadane dla konkretnego pliku
        } catch (err) {
            console.error('Błąd przy pobieraniu pliku:', err);
            throw err; // Rzuć błąd, aby obsłużyć go w rendererze
        }
    });

    ipcMain.handle('get-specific-json-file', async (event, fileName) => {
        try {
            return getSpecificJsonFile(fileName); // Zwróć metadane dla konkretnego pliku
        } catch (err) {
            console.error('Błąd przy pobieraniu pliku:', err);
            throw err; // Rzuć błąd, aby obsłużyć go w rendererze
        }
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.whenReady().then(() => {
    // Rejestracja klawisza "Next Song" (MediaNextTrack)
    globalShortcut.register('MediaNextTrack', () => {
        const window = BrowserWindow.getAllWindows()[0]; // Pobranie referencji do okna
        window.webContents.send('media-next-track');
    });

    // Opcjonalnie możesz zarejestrować inne multimedialne przyciski
    globalShortcut.register('MediaPlayPause', () => {
        const window = BrowserWindow.getAllWindows()[0]; // Pobranie referencji do okna
        window.webContents.send('media-stop-play-track');
    });

    globalShortcut.register('MediaPreviousTrack', () => {
        const window = BrowserWindow.getAllWindows()[0]; // Pobranie referencji do okna
        window.webContents.send('media-previous-track');
    });
});

app.on('will-quit', () => {
    // Upewnij się, że odwołujesz rejestracje skrótów przy zamknięciu aplikacji
    globalShortcut.unregisterAll();
});