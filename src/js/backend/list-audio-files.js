const fs = require('fs');
const path = require('path');
const os = require('os');
const { loadMusicMetadata } = require('music-metadata');  // Importowanie modułu do odczytu metadanych audio
global.whichAlbumsToAnalyze = [];
let loaded = false
const appDataPath = path.join(os.homedir(), 'AppData', 'Roaming', 'soundspace');
const songListFilePath = path.join(appDataPath, 'songList.json');

// Wywołanie funkcji
checkOrCreateSongList();
createFolder()

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
const getmissingAlbumCoverLocalPath = path.join(__dirname, '..', '..', 'allResources', 'albumCover', 'missingAlbumCover.png');

fs.copyFile(getmissingAlbumCoverLocalPath, path.join(appDataPath, 'Album Covers', path.basename(getmissingAlbumCoverLocalPath)), ()=>{})
const missingAlbumCoverPath = path.join(appDataPath, 'Album Covers', 'missingAlbumCover.png')

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
            fileName: path.basename(filePath),
            trackNumber: metadata.common.track ? metadata.common.track.no : null,
            //artistPicture: metadata
            //Buffer.from(Object.entries(metadata.native)[0][1][16].value.data).toString('base64') 
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
            fileName: path.basename(filePath),
            trackNumber: null
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






function getSongData(songPath = null) {
    // Sprawdzenie, czy plik songList.json istnieje
    if (!fs.existsSync(songListFilePath)) {
        throw new Error(`Plik ${songListFilePath} nie istnieje`);
    }

    // Odczytanie zawartości pliku songList.json
    const songListContent = fs.readFileSync(songListFilePath, 'utf-8');
    const songList = JSON.parse(songListContent);

    // Jeśli przekazano parametr songPath, zwracamy tylko informacje o tym pliku
    if (songPath) {
        if (songList[songPath]) {
            return songList[songPath];
        } else {
            return null
        }
    }

    // Zwracamy całą zawartość songList.json, jeśli nie podano parametrów
    return songList;
}




// Funkcja sprawdzająca, czy plik istnieje
function checkOrCreateSongList() {
    // Sprawdź, czy katalog soundspace istnieje, jeśli nie to go stwórz
    if (!fs.existsSync(appDataPath)) {
        fs.mkdirSync(appDataPath, { recursive: true });
        console.log('Utworzono folder soundspace.');
    }

    // Sprawdź, czy plik songList.json istnieje
    if (!fs.existsSync(songListFilePath)) {
        // Jeśli plik nie istnieje, utwórz go z podstawową strukturą
        const initialData = {
            
        };
        fs.writeFileSync(songListFilePath, JSON.stringify(initialData, null, 2));
        console.log('Utworzono plik songList.json.');
        checkOrAddSongsInformations()
    } else {
        console.log('Plik songList.json już istnieje.');
        checkOrAddSongsInformations()
    }
    //SPRAWDŻ TUTAJ CZY MA JAKIŚ USUNĄĆ
    console.log('---------------------------------------------------------------------------------------------------------')
    for(let i = 0; i<whichAlbumsToAnalyze.length; i++){
        console.log(`albumow z obrazkiem: ${whichAlbumsToAnalyze[i]} jest po usunięciu ${countSongsWithAlbumCover(whichAlbumsToAnalyze[i])}`)
        if(countSongsWithAlbumCover(whichAlbumsToAnalyze[i]) == 0){
            console.log(`usuwam album z ścierzki ${whichAlbumsToAnalyze[i]}`)
            const filePath = whichAlbumsToAnalyze[i]

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Błąd podczas usuwania pliku: ${err.message}`);
                    return;
                }
                console.log(`Plik został pomyślnie usunięty.`);
            });
        }
    }
}
function createFolder() {
    const dirPath = path.join(appDataPath, 'Album Covers'); 
    fs.mkdir(dirPath, { recursive: true }, (err) => {
        if (err) {
            console.error(`Błąd podczas tworzenia folderu: ${err}`);
        } else {
            console.log(`Folder "${'Album Covers'}" został utworzony.`);
        }
    });
}



async function checkOrAddSongsInformations(){
    const localSongList = getAllAudioFilePaths()
    for(let i=0; i<localSongList.length; i++){
        if(getSongData(localSongList[i]) == null){

            console.log('plik nie istnieje, proces tworzenia')

            await addToJsonFile(songListFilePath, localSongList[i])


        }else{
            console.log('plik o sciezce '+localSongList[i]+" istnieje")
        }
    }
    console.log('zaczeto proces sprawdzania usunietych piosenek');
    const lengthOfList = Object.keys(getSongData()).length
    const allFile = getSongData()
    console.log(lengthOfList)
    for(let i=0; i<lengthOfList; i++){
        if(!fs.existsSync(Object.keys(allFile)[i])){

            console.log(`nie istnieje plik o sciezce ${Object.keys(allFile)[i]}, proces usuniecia w .json`)

            await removeSongFromJson(songListFilePath, Object.keys(allFile)[i]);

        }else{
            console.log(`istnieje plik o sciezce ${Object.keys(allFile)[i].replace(/\\/g, '\\\\')}`)
        }
    }
    loaded = true
    console.log('zakonczono proces !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    ipcRenderer.send('send-data-to-front', "test");

    fs.writeFileSync(songListFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
    console.log('Plik JSON został zaktualizowany.');
}

async function checkOrAddAlbumCovers(dataURL, fileName) {
    const dirPath = path.join(appDataPath, 'Album Covers');
    
    // Sprawdzenie, czy folder istnieje
    fs.access(dirPath, fs.constants.F_OK, (err) => {
        if (err) {
            console.err(err)
        } else {
            // Folder istnieje, dodaj obrazek
            addImageFromDataURL(dirPath, dataURL, fileName);
        }
    });
    return path.join(dirPath, fileName+".png");
}
function addImageFromDataURL(folderPath, dataURL, fileName) {
    const imageName = fileName+'.png'; // Nazwa pliku, możesz dostosować
    const destinationPath = path.join(folderPath, imageName);
    
    // Przekształcanie Data URL na bufor i zapisanie jako plik
    const buffer = dataURLtoBuffer(dataURL);
    fs.writeFile(destinationPath, buffer, (err) => {
        if (err) {
            console.error(`Błąd podczas zapisywania obrazka: ${err}`);
        } else {
            console.log(`Obrazek "${imageName}" został dodany do folderu "${folderPath}".`);
        }
    });
}
function dataURLtoBuffer(dataURL) {
    const matches = dataURL.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
        throw new Error('Invalid Data URL');
    }
    return Buffer.from(matches[2], 'base64');
}


async function addToJsonFile(filePath, newObject) {
    let jsonData = {};

    // Sprawdzamy, czy plik istnieje
    if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        jsonData = JSON.parse(fileContent);
    }

    // Dodajemy nowy obiekt do danych
    try{
        let data = await getAudioFileMetadata(newObject);
        let path;
        if(data.picture != getmissingAlbumCover){
            path = await checkOrAddAlbumCovers("data:image/png;base64,"+data.picture, data.album)
        }else{
            path = missingAlbumCoverPath
        }
        console.log(path)
        data.picture = path 

        jsonData[data.filePath] = data

        // Zapisujemy dane z powrotem do pliku
        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
    
        console.log('Obiekt został dodany.');
    }catch{
        console.error('error')
    }
}

async function removeSongFromJson(songListFilePath, songPathToRemove) {
    const keyPath = String(songPathToRemove); 

    
    try {
        // Odczytaj plik JSON
        const data = fs.readFileSync(songListFilePath, 'utf8');
        let jsonData = JSON.parse(data);

        // Sprawdź, czy klucz istnieje
        if (jsonData.hasOwnProperty(keyPath)) {
            console.log('znaleziono')
            //*const allFile = getSongData()
            const thisFile = await getSongData(keyPath)
            whichAlbumsToAnalyze.push(thisFile.picture)
            //let ileusuwa = 0       //?
            /*if(countSongsWithAlbumCover(thisFile.picture) < 1){

            }*/
            
            // Usuń obiekt
            delete jsonData[keyPath];
            console.log(`Usunięto obiekt: ${keyPath}`);

        } else {
            console.log('nie znaleziono')

            console.log(`Obiekt o kluczu ${keyPath} nie istnieje.`);
            return;
        }

        // Zapisz zmodyfikowany obiekt z powrotem do pliku JSON
        fs.writeFileSync(songListFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
        console.log('Plik JSON został zaktualizowany.');


    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}

function countSongsWithAlbumCover(albumCoverPath) {
    let count = 0;
    const data = getSongData()
    // Iterujemy przez każdy klucz (ścieżkę do pliku audio) w obiekcie danych
    for (const songPath in data) {
        if (data[songPath].picture === albumCoverPath) {
            count++; // Zwiększamy licznik, jeśli picture pasuje do albumCoverPath
        }
    }

    return count; // Zwracamy licznik
}

function isLoadedMusic(){
    return loaded
}







module.exports = { getAllAudioFilePaths, getSpecificAudioFile, getAllJsonFilePaths, getSpecificJsonFile, getSongData, isLoadedMusic };