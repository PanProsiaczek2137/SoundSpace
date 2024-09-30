const fs = require('fs');
const path = require('path');
const os = require('os');
const { loadMusicMetadata } = require('music-metadata');  // Importowanie modułu do odczytu metadanych audio

// Funkcja do uzyskania ścieżki do folderu Muzyka
function getMusicFolderPath() {
    const platform = os.platform();
    if (platform === 'win32' || platform === 'darwin' || platform === 'linux') {
        return path.join(os.homedir(), 'Music');
    } else {
        throw new Error('Nieobsługiwany system operacyjny');
    }
}

//const getmissingAlbumCover = fs.readFileSync(path.join(__dirname, 'allResources', 'albumCover', 'missingAlbumCover.png')).toString('base64');
const getmissingAlbumCover = fs.readFileSync(path.join(__dirname, '..', '..', 'allResources', 'albumCover', 'missingAlbumCover.png')).toString('base64');

// Funkcja do odczytu metadanych pliku audio przy użyciu music-metadata
async function getAudioFileMetadata(filePath) {
    try {
        const mm = await loadMusicMetadata();
        const metadata = await mm.parseFile(filePath);

        const picture = metadata.common.picture && metadata.common.picture.length > 0 
            ? Buffer.from(metadata.common.picture[0].data).toString('base64') 
            : getmissingAlbumCover;

        return {
            title: metadata.common.title || path.basename(filePath),
            artist: metadata.common.artist || null,
            genre: metadata.common.genre ? metadata.common.genre.join(', ') : null,
            picture: picture,
            date: metadata.common.year || null,
            album: metadata.common.album || null,
            duration: metadata.format.duration,
            filePath: filePath,
            fileName: path.basename(filePath)
        };
    } catch (err) {
        console.error('Błąd podczas odczytu metadanych:', err);
        return {
            title: path.basename(filePath),
            artist: null,
            genre: null,
            picture: null,
            date: null,
            album: null,
            duration: null,
            filePath: filePath,
            fileName: path.basename(filePath)
        };
    }
}

// Funkcja do zwrócenia wszystkich nazw plików audio
function getAllAudioFilePaths() {
    const folderPath = getMusicFolderPath();
    const audioExtensions = ['.mp3', '.ogg', '.flac', '.opus', '.wav'];

    try {
        const files = fs.readdirSync(folderPath);
        return files
            .filter(file => audioExtensions.includes(path.extname(file).toLowerCase()))
            .map(file => path.join(folderPath, file)); // Dodanie pełnej ścieżki
    } catch (err) {
        console.error('Błąd podczas odczytu folderu:', err);
        return [];
    }
}

// Funkcja do zwrócenia metadanych konkretnego pliku audio
async function getSpecificAudioFile(filePath) {
  //console.log('Otrzymana ścieżka pliku:', filePath); // Loguj otrzymaną ścieżkę

  if (!fs.existsSync(filePath)) {
      throw new Error(`Plik o ścieżce ${filePath} nie istnieje.`);
  }

  const ext = path.extname(filePath).toLowerCase();
  if (!['.mp3', '.ogg', '.flac', '.opus', '.wav'].includes(ext)) {
      throw new Error(`Plik ${filePath} nie jest obsługiwanym plikiem audio.`);
  }

  return await getAudioFileMetadata(filePath);
}

function getAllJsonFilePaths() {
    const folderPath = getMusicFolderPath(); // Możesz zmienić na inny folder, jeśli to nie Muzyka
    const jsonExtension = '.json';

    try {
        const files = fs.readdirSync(folderPath);
        console.log(files)
        return files
            .filter(file => path.extname(file).toLowerCase() === jsonExtension)
            .map(file => path.join(folderPath, file)); // Zwróć pełną ścieżkę
    } catch (err) {
        console.error('Błąd podczas odczytu folderu:', err);
        return [];
    }
}


    
function getSpecificJsonFile(filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    if (!data) {
                        reject(new Error('Plik JSON jest pusty'));
                        return;
                    }
                    try {
                        const jsonData = JSON.parse(data);
                        resolve(jsonData);
                    } catch (parseErr) {
                        reject(parseErr);
                    }
                }
            });
        });
}

module.exports = { getAllAudioFilePaths, getSpecificAudioFile, getAllJsonFilePaths, getSpecificJsonFile };
