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


//moveSongToPosition(playlistName, songToMove, targetSong);

module.exports = { moveSongToPosition };
