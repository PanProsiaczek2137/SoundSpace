const path = require('path');
const os = require('os');
const fs = require('fs');
const { getAllJsonFilePaths, getSpecificJsonFile } = require('./list-audio-files.js'); // Zaimportuj swoje funkcje

// Funkcja do odsłonięcia pliku (jeśli jest ukryty)
function unhideFile(filePath) {
    return new Promise((resolve, reject) => {
        const command = `attrib -h "${filePath}"`; // Komenda do usunięcia atrybutu ukrycia
        const exec = require('child_process').exec;

        exec(command, (error) => {
            if (error) {
                reject(`Nie można odsłonić pliku: ${error.message}`);
            } else {
                resolve();
            }
        });
    });
}

// Funkcja do ponownego ukrycia pliku
function hideFile(filePath) {
    return new Promise((resolve, reject) => {
        const command = `attrib +h "${filePath}"`; // Komenda do dodania atrybutu ukrycia
        const exec = require('child_process').exec;

        exec(command, (error) => {
            if (error) {
                reject(`Nie można ukryć pliku: ${error.message}`);
            } else {
                resolve();
            }
        });
    });
}

// Funkcja do przesunięcia piosenki na miejsce innej w playliście
async function moveSongToPosition(playlist, newSongsOrder) {
    // Odsłonięcie pliku, jeśli jest ukryty
    try {
        await unhideFile(playlist);
    } catch (error) {
        console.error(error);
        return; // Zakończ działanie funkcji w przypadku błędu
    }

    // Odczyt pliku JSON
    try {
        const files = await getSpecificJsonFile(playlist);

        let array = newSongsOrder


        // Nowe dane do zapisania
        const newData = {
            name: files.name,
            picture: files.picture,
            discription: files.discription,
            privacy: files.privacy,
            songs: array
        };
        const jsonData = JSON.stringify(newData, null, 2);

        // Zapisujemy zmodyfikowany plik JSON
        fs.writeFile(playlist, jsonData, (err) => {
            if (err) {
                console.error('Wystąpił błąd podczas zapisywania pliku:', err);
            } else {
                console.log('Zawartość pliku JSON została zaktualizowana.');
            }
        });
    } catch (error) {
        console.error('Wystąpił błąd podczas odczytu pliku:', error);
    }

    // Ponowne ukrycie pliku
    try {
        await hideFile(playlist);
    } catch (error) {
        console.error(error);
    }
}



function createJsonFile(fileName, picturePath, discription, privacy) {

    data = {
        "name": fileName,
        "picture": picturePath,
        "discription": discription,
        "privacy" : privacy,
        "songs": []
      }

    // Ścieżka do systemowego folderu Muzyka
    const musicFolderPath = path.join(os.homedir(), 'Music');

    // Tworzenie pełnej ścieżki do pliku
    const filePath = path.join(musicFolderPath, `.${fileName}.json`);

    // Konwersja obiektu na JSON
    const jsonData = JSON.stringify(data, null, 2); // Formatowanie z wcięciem 2 spacje

    // Zapis pliku JSON
    fs.writeFile(filePath, jsonData, (err) => {
        if (err) {
            console.error('Błąd podczas zapisywania pliku:', err);
        } else {
            console.log(`Plik ${fileName}.json został zapisany w folderze Muzyka.`);
        }
    });
    hideFile(filePath)
}



function doesJsonFileExist(fileName) {
    const musicFolderPath = path.join(os.homedir(), 'Music');
    const filePath = path.join(musicFolderPath, `${fileName}.json`);

    // Zwróć true, jeśli plik istnieje, w przeciwnym razie false
    return fs.existsSync(filePath);
}





// Ścieżka do folderu PlayList Picture
const folderPath = path.join(process.env.APPDATA, 'SoundSpace', 'PlayList Picture');

// Tworzenie folderu
fs.mkdir(folderPath, { recursive: true }, (err) => {
  if (err) {
    return console.error('Błąd przy tworzeniu folderu:', err);
  }
  console.log('Folder PlayList Picture został pomyślnie utworzony:', folderPath);
});



// Funkcja zapisująca obraz w folderze PlayList Picture
function saveImageToPlaylistCovers(fileName, base64Data) {
    return new Promise((resolve, reject) => {
        const folderPath = path.join(process.env.APPDATA, 'SoundSpace', 'PlayList Picture');
        const filePath = path.join(folderPath, fileName);

        // Tworzenie folderu, jeśli nie istnieje
        fs.mkdir(folderPath, { recursive: true }, (err) => {
            if (err) {
                console.error('Błąd przy tworzeniu folderu:', err);
                return reject(err); // Zwraca błąd, jeśli folderu nie udało się utworzyć
            }

            // Konwertuj base64 na buffer
            const buffer = Buffer.from(base64Data, 'base64');

            // Zapisanie pliku obrazu
            fs.writeFile(filePath, buffer, (err) => {
                if (err) {
                    console.error('Błąd przy zapisywaniu pliku:', err);
                    return reject(err); // Zwraca błąd, jeśli zapisywanie nie powiodło się
                }

                console.log(`Plik ${fileName} został pomyślnie zapisany w: ${filePath}`);
                resolve(filePath); // Zwraca ścieżkę do zapisanego pliku
            });
        });
    });
}







//moveSongToPosition(playlistName, songToMove, targetSong);

module.exports = { moveSongToPosition, createJsonFile, doesJsonFileExist, saveImageToPlaylistCovers };
