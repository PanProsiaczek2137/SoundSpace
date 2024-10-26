const fs = require('fs');
const path = require('path');
const os = require('os');
const { getSpecificAudioFile } = require('./list-audio-files');
const { getAlbumTracks, getSongTags, getAlbumReleaseDate } = require('./wiki-api');

const soundSpacePath = path.join(process.env.APPDATA, 'soundspace')
const songsListPath = path.join(soundSpacePath, 'songList.json')

const getmissingAlbumCover = fs.readFileSync(path.join(__dirname, '..', '..', 'allResources', 'albumCover', 'missingAlbumCover.png')).toString('base64');
const appDataPath = path.join(os.homedir(), 'AppData', 'Roaming', 'soundspace');
const missingAlbumCoverPath = path.join(appDataPath, 'Album Covers', 'missingAlbumCover.png')

fs.mkdir(path.join(soundSpacePath, 'Transferring'), ()=>{})

async function transferAudioFile(sourcePath, destination, settings) {
  fs.copyFile(sourcePath, path.join(soundSpacePath, 'Transferring', path.basename(sourcePath)), (err) => {
      if (err) {
          console.log(err);
      } else {
          console.log('Audio file copied successfully!');
      }
  });

  const file = await getSpecificAudioFile(sourcePath);
  const data = await fs.promises.readFile(songsListPath, 'utf-8');
  const jsonArray = JSON.parse(data);
  
  let title;
  if (settings.removeInformationInBrackets) {
      title = removeParentheses(file.title);
  } else {
      title = file.title;
  }

  let picturePath;
  if (file.picture != getmissingAlbumCover) {
      picturePath = await checkOrAddAlbumCovers("data:image/png;base64," + file.picture, file.album);
  } else {
      picturePath = missingAlbumCoverPath;
  }






  let trackNumber = 0;
if(settings.setAlbumTrackNumber){
    if (file.trackNumber == 63 || (file.trackNumber == null)) {
        console.log('WYSZUKUJE!!!!!!!!!!!');

        // Czekaj na zakończenie pobierania utworów
        const list = await getAlbumTracks(file.album, file.artist);

        // Normalizacja nazwy pliku
        const normalizedFileName = removeParentheses(file.fileName)

        console.log('OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');
        console.log('szuka ' + normalizedFileName);
        console.log('OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');

        // Szukaj najbardziej podobnego utworu
        let closestIndex = -1;
        let closestMatchScore = Infinity; // Zainicjuj na dużą liczbę
        const trackNumbersFound = new Set(); // Zbiór do przechowywania znalezionych numerów utworów

        list.forEach((track, index) => {
            const normalizedTrackName = track
                .trim()
                .toLowerCase()
                .replace(/[.\-]/g, ' ')
                .replace(/\s+/g, ' ');

            // Oblicz odległość Levenshteina
            const distance = levenshteinDistance(normalizedFileName, normalizedTrackName);

            // Jeśli ta odległość jest mniejsza niż closestMatchScore, aktualizuj
            if (distance < closestMatchScore) {
                closestMatchScore = distance;
                closestIndex = index;
            }

            // Sprawdź, czy numer utworu jest już w zbiorze
            const trackNum = track.trackNumber;
            if (trackNumbersFound.has(trackNum)) {
                console.log(`Numer utworu ${trackNum} już istnieje: ${track.title}`);
            } else {
                trackNumbersFound.add(trackNum);
            }
        });

        // Sprawdzenie, czy znaleziono dopasowanie
        if (closestIndex !== -1) {
            trackNumber = closestIndex + 1; // Użyj +1, ponieważ numeracja utworów zaczyna się od 1
            console.log('znaleziono na miejscu ' + trackNumber);
        } else {
            console.log('Nie znaleziono utworu.');
        }
    } else {
        trackNumber = file.trackNumber;
    }
}else{
    trackNumber = file.trackNumber;
}



  const ID3v1Genres = [
    'blues', 'classic rock', 'country', 'dance', 'disco', 'funk', 'grunge', 'hip-hop',
    'jazz', 'metal', 'new age', 'oldies', 'other', 'pop', 'r&b', 'rap', 'reggae', 'rock',
    'techno', 'industrial', 'alternative', 'ska', 'death metal', 'pranks', 'soundtrack',
    'euro-techno', 'ambient', 'trip-hop', 'vocal', 'jazz+funk', 'fusion', 'trance', 
    'classical', 'instrumental', 'acid', 'house', 'game', 'gospel', 'noise', 'alt rock',
    'bass', 'soul', 'punk', 'space', 'meditative', 'instrumental pop', 'instrumental rock',
    'ethnic', 'gothic', 'darkwave', 'techno-industrial', 'electronic', 'pop-folk', 'eurodance', 
    'dream', 'southern rock', 'comedy', 'cult', 'gangsta', 'top 40', 'christian rap', 'pop/funk',
    'jungle', 'native american', 'cabaret', 'new wave', 'psychedelic', 'rave', 'showtunes', 
    'trailer', 'lo-fi', 'tribal', 'acid punk', 'acid jazz', 'polka', 'retro', 'musical', 'rock & roll', 
    'hard rock', 'progressive rock'];

    console.log('[[[[[[[[[[[[[[[[[[[[[[[')
    console.log(file.genre)
    console.log('[[[[[[[[[[[[[[[[[[[[[[[')

// Użycie funkcji
let genre;
if(settings.setSongTags){
    if(file.genre != null)
    console.log('szuka: '+ file.artist + " piosenka o nazwie: "+ file.title)
    await getSongTags(file.artist, file.title, file.album).then(tags => {
        console.log('--------------------------------');
        console.log(tags);
        console.log('--------------------------------');
        if (tags != null) {
            genre = tags;
        } else {
            genre = file.genre;
        }
    });

}else{
    genre = file.genre
}

  console.log('track ' + trackNumber);

  const musicFolderPath = getMusicFolderPath();
  const localPathToSong = path.normalize(path.join(musicFolderPath, path.basename(sourcePath)));
  let newObject = {
      "title": title,
      "artist": file.artist,
      "genre": genre,
      "picture": picturePath,
      "date": file.date,
      "album": file.album,
      "duration": file.duration,
      "filePath": localPathToSong,
      "fileName": file.fileName,
      "trackNumber": trackNumber
  };

  const formattedSourcePath = localPathToSong;
  jsonArray[formattedSourcePath] = newObject; 

  if (destination === 'Localy') {
      fs.copyFile(sourcePath, formattedSourcePath, () => {});
      fs.rm(path.join(soundSpacePath, 'Transferring', path.basename(sourcePath)), () => {});
  } else if (destination === 'GoogleDrive') {
      // Obsługa Google Drive, jeśli to konieczne
  }
  
  await fs.promises.writeFile(songsListPath, JSON.stringify(jsonArray, null, 2));

  if (settings.removeOriginal) {
      fs.rm(sourcePath, (err) => { console.log(err); });
  }
    return {'picture': picturePath, 'title': title, 'artist': file.artist}
}


function removeParentheses(nazwaPliku) {
    // Znajduje ostatnią kropkę w nazwie pliku
    const ostatniaKropka = nazwaPliku.lastIndexOf('.');
    
    // Sprawdza, czy kropka została znaleziona
    let nazwaBezRozszerzenia;
    if (ostatniaKropka !== -1) {
        // Zwraca część nazwy pliku przed ostatnią kropką
        nazwaBezRozszerzenia = nazwaPliku.substring(0, ostatniaKropka);
    } else {
        // Jeśli nie ma kropki, używa oryginalnej nazwy pliku
        nazwaBezRozszerzenia = nazwaPliku;
    }

    // Usuwa ostatnie nawiasy i ich zawartość
    return nazwaBezRozszerzenia.replace(/\s*\([^()]*\)\s*$/, '');
}

function getMusicFolderPath() {
  const platform = os.platform();
  if (platform === 'win32' || platform === 'darwin' || platform === 'linux') {
      return path.join(os.homedir(), 'Music');
  } else {
      throw new Error('Nieobsługiwany system operacyjny');
  }
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
// Function to calculate the Levenshtein distance
function levenshteinDistance(a, b) {
    const matrix = [];

    // Tworzymy pustą macierz
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Wypełniamy macierz
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1]; // Brak operacji
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // Zastąpienie
                    Math.min(matrix[i][j - 1] + 1, // Wstawienie
                               matrix[i - 1][j] + 1) // Usunięcie
                );
            }
        }
    }

    return matrix[b.length][a.length];
}



//TODO: dodawanie brazka dopiero jak będą dostępne na musicbrainz

//transferAudioFile('C:\\Users\\Mateusz\\Downloads\\Sharp Dressed Man (2008 Remaster).mp3', 'Localy', {removeOriginal: false, removeInformationInBrackets: true, setImage: true, setAlbumTrackNumber: true, setSongTags: true, setAlbumReleaseDate: true});

module.exports = { transferAudioFile };