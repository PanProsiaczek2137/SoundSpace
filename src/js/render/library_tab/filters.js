import { setPlaylist, pauseSong, convertBackslashes } from '../../modules/soundSystem.js';
//import { pauseResumeSong } from '../songControler.js';
import { fullScreenOnOff } from '../fullScreen.js';
import { showlibraryRightBar, changelibraryRightBar } from './rightBar.js';

//* DEKLARACJA ZMIENNYCH
let selectedFilter = 'all';
let SongsDisplayed = [];
const songContainer = document.getElementById('songs');
window.stop = false;
window.loadedPlaylistTo = []

//* AKCJA WYKONAWANA PO KLIKNIĘCIU FILTRA WSZYSTKIE PIOSENKI
const allFilter = document.getElementById('all-filter');
allFilter.addEventListener('click', () => {
    songContainer.innerHTML = ""
    allFilter.style.backgroundColor = "#444444"
    playlistFilter.classList.remove("librarybtnMakeBigger");
    ArtistFilter.classList.remove("librarybtnMakeBigger");
    albumFilter.classList.remove("librarybtnMakeBigger");
    genreFilter.classList.remove("librarybtnMakeBigger");
    playlistFilter.style.backgroundColor = "#2c2c2c"
    ArtistFilter.style.backgroundColor = "#2c2c2c"
    albumFilter.style.backgroundColor = "#2c2c2c"
    genreFilter.style.backgroundColor = "#2c2c2c"
    playlistFilter.innerText = "☰ PlayLists"
    ArtistFilter.innerText = "☰ Artists"
    albumFilter.innerText = "☰ Album"
    genreFilter.innerText = "☰ Genres"
    showlibraryRightBar(false)
    window.stop = true;  // Ustaw stop na true, aby przerwać aktualną operację
    setTimeout(() => {
        displayAllSongs(); // Po krótkim czasie uruchom ponownie funkcję
    }, 100);
});

const LibraryBtn = document.getElementById('Library');
LibraryBtn.addEventListener('click', () => {
    songContainer.innerHTML = ""
    window.stop = true;  // Zatrzymaj aktualne ładowanie
    setTimeout(() => {
        displayAllSongs(); // Ponownie uruchom ładowanie po zatrzymaniu
    }, 100);
});



//* WYŚWIETLA WSZYSTKIE PIOSENKI
async function displayAllSongs() {
    selectedFilter = 'all';
    songContainer.innerHTML = '';
    window.stop = false;  // Resetowanie flagi do zatrzymania



    window.api.getAllAudioFilePaths().then((files) => {
        for (let i = 0; i < files.length; i++) {
            window.api.getSongData(files[i]).then((file) => {
                
                    if (window.stop) {
                        console.log("Przerwano ładowanie");
                        return;  // Zakończ wykonywanie, jeśli stop jest ustawione na true
                    }
                        
                    const newDiv = document.createElement('div');
                    newDiv.classList = 'songToSelectInLibrary';
                    newDiv.id = i;
                    newDiv.style.display = "flex";
                    newDiv.onclick = () => {
                        setTimeout(() => {
                            setPlaylist('all', null, newDiv.id, true);
                            fullScreenOnOff(true);
                        }, 100);
        
                    };
        
                    let secondsDuration = Math.floor(file.duration) % 60;
                    let minutesDuration = file.duration.toFixed(2) / 60;
                    let correctTime = `${Math.floor(minutesDuration)}:${secondsDuration < 10 ? "0" + secondsDuration : secondsDuration}`;
                    

                    newDiv.innerHTML = `
                        <div style="display: flex">
                            <img src="${file.picture}" style="height: 55px; margin-left: 10px; margin-right: 10px; aspect-ratio: 1 / 1; object-fit: cover;" draggable="false">
                            <div style="display: flex; flex-direction: column;">
                                <p class="rightBarSongName" draggable="false">${file.title}</p>
                                <p class="rightBarArtistName" draggable="false">${file.artist}</p>
                            </div>
                        </div>
                        <div class="artist-genre-library-text" style="right: 425px">
                            <p>${file.album}</p>
                        </div>
                        <div class="artist-genre-library-text" style="right: 175px">
                            <p>${file.genre}</p>
                        </div>
                        <div style="display: flex; align-items: center">
                            <p class="songTime" draggable="false">${correctTime}</p>
                        </div>`;
                        
            
                    songContainer.appendChild(newDiv);

        
            }).catch(err => console.error('Błąd:', err));
        }
    }).catch(err => console.error('Błąd:', err));
}





//* PRZY KLIKNIĘCIU GDZIEKOLWIEK CHOWA DROPDOWN
document.addEventListener('click', () => {
    // Sprawdza, czy kliknięty element nie jest wewnątrz dropdowna lub przycisku otwierającego

        dropdownContent1.innerHTML = ''
        dropdownContent1.style.display = 'none'; // Ukrycie dropdowna

        dropdownContent2.innerHTML = ''
        dropdownContent2.style.display = 'none'; // Ukrycie dropdowna
        
        dropdownContent3.innerHTML = ''
        dropdownContent3.style.display = 'none'; // Ukrycie dropdowna
        
        dropdownContent4.innerHTML = ''
        dropdownContent4.style.display = 'none'; // Ukrycie dropdowna
});



//* DROP DOWN DLA PLAYLIST
const dropdownContent1 = document.getElementById('dropdown-content1');
const playlistFilter = document.getElementById('playlist-filter');

playlistFilter.addEventListener('click', () => {
setTimeout(() => {
        const dropdownContent1 = document.getElementById('dropdown-content1');
        console.log(dropdownContent1.style.display);
        dropdownContent1.style.display = 'block';

        try {
            window.api.getAllJsonFilePaths().then(async (files) => {
                for (let i = 0; i < files.length; i++) {
                    const paragraph = document.createElement('p');
                    paragraph.className = 'PlayListParagraphs';

                    window.api.getSpecificJsonFile(files[i]).then(async (file) => {
                        paragraph.textContent = file.name;
                        paragraph.addEventListener('click', () => {
                            allFilter.style.backgroundColor = "#2c2c2c"
                            playlistFilter.classList.add("librarybtnMakeBigger");
                            ArtistFilter.classList.remove("librarybtnMakeBigger");
                            albumFilter.classList.remove("librarybtnMakeBigger");
                            genreFilter.classList.remove("librarybtnMakeBigger");
                            playlistFilter.style.backgroundColor = "#444444"
                            ArtistFilter.style.backgroundColor = "#2c2c2c"
                            albumFilter.style.backgroundColor = "#2c2c2c"
                            genreFilter.style.backgroundColor = "#2c2c2c"
                            playlistFilter.innerText = file.name
                            ArtistFilter.innerText = "☰ Artists"
                            albumFilter.innerText = "☰ Album"
                            genreFilter.innerText = "☰ Genres"
                            showlibraryRightBar(true)
                            changelibraryRightBar(file.picture, file.name, file.discription, file.privacy, file.songs.length, file.songs)
                            songContainer.innerHTML = ""
                            setUpPlaylist(file.songs, files[i]); // Wywołaj funkcję w reakcji na kliknięcie
                            dropdownContent1.innerHTML = ''
                        });
                    });

                    dropdownContent1.appendChild(paragraph);
                }
            });
        } catch (err) {
            console.error('Błąd:', err);
        }
    }
, 1);
});
//* WYPISUJE POLA PIOSENEK PO KLIKNIĘCUY OPCJI Z DROPDOWNA ALE TYLKO DLA PLAYLIST
async function setUpPlaylist(songs, path) {
    try {
        SongsDisplayed = songs;
        console.log(songs);
        for (let i = 0; i < SongsDisplayed.length; i++) {
            if (window.stop) {
                console.log("Przerwano ładowanie");
                return;
            }

            window.api.getSongData(SongsDisplayed[i]).then((file) => {

                const newDiv = document.createElement('div');
                newDiv.classList = 'songToSelectInLibrary';
                newDiv.id = i;
                newDiv.style.display = "flex";
                newDiv.onclick = () => {
                    setTimeout(() => {
                        console.log(songs)
                        setPlaylist('file', path, newDiv.id, true);
                        fullScreenOnOff(true);
                    }, 100);
                };

                let secondsDuration = Math.floor(file.duration) % 60;
                let minutesDuration = file.duration.toFixed(2) / 60;
                let correctTime = `${Math.floor(minutesDuration)}:${secondsDuration < 10 ? "0" + secondsDuration : secondsDuration}`;

                newDiv.innerHTML = `
                    <div style="display: flex">
                        <img src="${file.picture}" style="height: 55px; margin-left: 10px; margin-right: 10px; aspect-ratio: 1 / 1; object-fit: cover;" draggable="false">
                        <div style="display: flex; flex-direction: column;">
                            <p class="rightBarSongName" draggable="false">${file.title}</p>
                            <p class="rightBarArtistName" draggable="false">${file.artist}</p>
                        </div>
                    </div>
                    <div class="artist-genre-library-text" style="right: 425px">
                        <p>${file.album}</p>
                    </div>
                    <div class="artist-genre-library-text" style="right: 175px">
                        <p>${file.genre}</p>
                    </div>
                    <div style="display: flex; align-items: center">
                        <p class="songTime" draggable="false">${correctTime}</p>
                    </div>`;
                
                songContainer.appendChild(newDiv);
            }).catch(err => console.error('Błąd:', err));
        }
    } catch (err) {
        console.error('Błąd:', err);
    }
}







let artists = [];
let albums = [];
let genres = [];

//* WYPISUJE WSZYSTKICH ARTYSTÓW ALBUMY I GATUNKI W LISTACH
const intervalId = setInterval(() => {
    window.api.isLoadedMusic().then((test) => {
        console.log(test);
        // Jeśli test jest równy true, zatrzymaj interwał
        if (test === true) {
            clearInterval(intervalId);
            realoadAllArtistsAlbumsGenres();
        }
    }).catch(err => console.error('Błąd:', err));
}, 50);

async function realoadAllArtistsAlbumsGenres() {
    try {
        artists = [];
        albums = [];
        genres = [];

        window.api.getSongData().then((files) => {
            // Iterujemy po plikach muzycznych
            Object.keys(files).forEach(filePath => {
                const fileData = files[filePath];

                // Sprawdzamy, czy artysta już nie został dodany
                let artist = fileData.artist || "Unknown Artist";
                if (!artists.includes(artist)) {
                    artists.push(artist);
                    console.log("Artist:", artist);
                }

                // Sprawdzamy, czy album już nie został dodany
                let album = fileData.album || "Unknown Album";
                if (!albums.includes(album)) {
                    albums.push(album);
                    console.log("Album:", album);
                }

                // Sprawdzamy, czy gatunek już nie został dodany i czy nie jest pusty
                let genre = fileData.genre;
                if (genre && !genres.includes(genre)) {  // Dodajemy gatunek tylko jeśli jest niepusty
                    genres.push(genre);
                    console.log("Genre:", genre);
                }
            });

            console.log("Artists:", artists);
            console.log("Albums:", albums);
            console.log("Genres:", genres);
        }).catch(err => console.error('Błąd:', err));
    } catch (err) {
        console.error('Błąd:', err);
    }
}






const dropdownContent2 = document.getElementById('dropdown-content2');
const ArtistFilter = document.getElementById('artist-filter');
//* DROP DOWN DLA ARTYSTÓW
ArtistFilter.addEventListener('click', () => {
setTimeout(() => {
        console.log(dropdownContent2.style.display);
        dropdownContent2.style.display = 'block';

        try {
            
                //console.log('Artyści:', artists);  

                for (let i = 0; i < artists.length; i++) {
                    console.log(i)
                    const paragraph = document.createElement('p');
                    paragraph.className = 'PlayListParagraphs';

                    paragraph.textContent = artists[i];
                    paragraph.addEventListener('click', () => {

                        allFilter.style.backgroundColor = "#2c2c2c"
                        playlistFilter.classList.remove("librarybtnMakeBigger");
                        ArtistFilter.classList.add("librarybtnMakeBigger");
                        albumFilter.classList.remove("librarybtnMakeBigger");
                        genreFilter.classList.remove("librarybtnMakeBigger");
                        playlistFilter.style.backgroundColor = "#2c2c2c"
                        ArtistFilter.style.backgroundColor = "#444444"
                        albumFilter.style.backgroundColor = "#2c2c2c"
                        genreFilter.style.backgroundColor = "#2c2c2c"
                        playlistFilter.innerText = "☰ PlayLists"
                        ArtistFilter.innerText = paragraph.innerText
                        albumFilter.innerText = "☰ Album"
                        genreFilter.innerText = "☰ Genres"
                        showlibraryRightBar(true)

                        songContainer.innerHTML = ""
                        dropdownContent2.innerHTML = ''
                        loadedPlaylistTo = []

                        window.api.getAllAudioFilePaths().then(async (files) => {
                            let count = 0
                            for (let i = 0; i < files.length; i++) {  // Poprawione warunki pętli
                                window.api.getSongData(files[i]).then((file) => {

                                    if (file.artist == paragraph.innerText) {  // Dodawanie artysty, jeśli nie ma go już na liście
                                        setUpSongPole(file.title, file.filePath, count);
                                        console.log(file.title, file.filePath, count)
                                        count = count+1
                                        console.log(count)
                                    }

                                }).catch(err => console.error('Błąd:', err));
                            }
                        });
                    });

                    dropdownContent2.appendChild(paragraph);
                }

        } catch (err) {
            console.error('Błąd:', err);
        }
    }
, 1);
});


const dropdownContent3 = document.getElementById('dropdown-content3');
const albumFilter = document.getElementById('album-filter');
//* DROP DOWN DLA ALBUMÓW
albumFilter.addEventListener('click', () => {
    setTimeout(() => {
            console.log(dropdownContent3.style.display);
            dropdownContent3.style.display = 'block';

            try {
                for (let i = 0; i < albums.length; i++) {
                    console.log(i);
                    const paragraph = document.createElement('p');
                    paragraph.className = 'PlayListParagraphs';

                    paragraph.textContent = albums[i];
                    paragraph.addEventListener('click', () => {

                        allFilter.style.backgroundColor = "#2c2c2c"
                        playlistFilter.classList.remove("librarybtnMakeBigger");
                        ArtistFilter.classList.remove("librarybtnMakeBigger");
                        albumFilter.classList.add("librarybtnMakeBigger");
                        genreFilter.classList.remove("librarybtnMakeBigger");
                        playlistFilter.style.backgroundColor = "#2c2c2c"
                        ArtistFilter.style.backgroundColor = "#2c2c2c"
                        albumFilter.style.backgroundColor = "#444444"
                        genreFilter.style.backgroundColor = "#2c2c2c"
                        playlistFilter.innerText = "☰ PlayLists"
                        ArtistFilter.innerText = "☰ Artists"
                        albumFilter.innerText = paragraph.innerText
                        genreFilter.innerText = "☰ Genres"
                        showlibraryRightBar(true)

                        selectedFilter = 'album';
                        songContainer.innerHTML = "";
                        dropdownContent3.innerHTML = '';
                        loadedPlaylistTo = [];

                        window.api.getAllAudioFilePaths().then(async (files) => {
                            const songsToDisplay = []; // Tablica do przechowywania piosenek

                            for (let i = 0; i < files.length; i++) {
                                window.api.getSongData(files[i]).then((file) => {
                                    if (file.album == paragraph.innerText) {
                                        // Zbieranie piosenek w tablicy
                                        songsToDisplay.push(file);
                                    }
                                }).catch(err => console.error('Błąd:', err));
                            }

                            // Po zebraniu wszystkich piosenek, sortuj je według trackNumber
                            setTimeout(() => {
                                songsToDisplay.sort((a, b) => a.trackNumber - b.trackNumber); // Sortowanie
                                let count = 0;

                                // Dodawanie piosenek do wyświetlenia
                                songsToDisplay.forEach(song => {
                                    setUpSongPole(song.title, song.filePath, count);
                                    console.log(song.title, song.filePath, count);
                                    count++;
                                });
                            }, 100); // Daj chwilę na zebranie danych
                        });
                    });

                    dropdownContent3.appendChild(paragraph);
                }
            } catch (err) {
                console.error('Błąd:', err);
            }
        }
    , 1);
});


const dropdownContent4 = document.getElementById('dropdown-content4');
const genreFilter = document.getElementById('genre-filter');
//* DROP DOWN DLA GATUNKÓW
genreFilter.addEventListener('click', () => {
setTimeout(() => {
        console.log(dropdownContent4.style.display);
        dropdownContent4.style.display = 'block';

        try {
            
                //console.log('Album:', artists);  

                for (let i = 0; i < genres.length; i++) {
                    console.log(i)
                    const paragraph = document.createElement('p');
                    paragraph.className = 'PlayListParagraphs';

                    paragraph.textContent = genres[i];
                    paragraph.addEventListener('click', () => {
                        selectedFilter = 'genre';
                        songContainer.innerHTML = ""

                        allFilter.style.backgroundColor = "#2c2c2c"
                        playlistFilter.classList.remove("librarybtnMakeBigger");
                        ArtistFilter.classList.remove("librarybtnMakeBigger");
                        albumFilter.classList.remove("librarybtnMakeBigger");
                        genreFilter.classList.add("librarybtnMakeBigger");
                        playlistFilter.style.backgroundColor = "#2c2c2c"
                        ArtistFilter.style.backgroundColor = "#2c2c2c"
                        albumFilter.style.backgroundColor = "#2c2c2c"
                        genreFilter.style.backgroundColor = "#444444"
                        playlistFilter.innerText = "☰ PlayLists"
                        ArtistFilter.innerText = "☰ Artists"
                        albumFilter.innerText = "☰ Album"
                        genreFilter.innerText = paragraph.innerText
                        showlibraryRightBar(true)

                        dropdownContent4.innerHTML = ''
                        loadedPlaylistTo = []

                        window.api.getAllAudioFilePaths().then(async (files) => {
                            let count = 0
                            for (let i = 0; i < files.length; i++) {  // Poprawione warunki pętli
                                window.api.getSongData(files[i]).then((file) => {

                                    if (file.genre == paragraph.innerText) {  // Dodawanie artysty, jeśli nie ma go już na liście
                                        setUpSongPole(file.title, file.filePath, count);
                                        console.log(file.title, file.filePath, count)
                                        count = count+1
                                        console.log(count)
                                    }

                                }).catch(err => console.error('Błąd:', err));
                            }
                        });
                    });

                    dropdownContent4.appendChild(paragraph);
                }

        } catch (err) {
            console.error('Błąd:', err);
        }
    }
, 1);
});




//* WYPISUJE POLA PIOSENEK PO WYBRANIU FILTRA
async function setUpSongPole(songs, path, count) {
    try {
        SongsDisplayed = songs;

            const file = await window.api.getSongData(path);

            console.log(file)

                const newDiv = document.createElement('div');
                newDiv.classList = 'songToSelectInLibrary';
                newDiv.id = count;
                newDiv.style.display = "flex";
                loadedPlaylistTo.push(path)
                newDiv.onclick = () => {
                    setTimeout(() => {
                        console.log(loadedPlaylistTo)
                        setPlaylist('custom', loadedPlaylistTo, newDiv.id, true);
                        fullScreenOnOff(true);
                    }, 100);
                };

                let secondsDuration = Math.floor(file.duration) % 60;
                let minutesDuration = file.duration.toFixed(2) / 60;
                let correctTime = `${Math.floor(minutesDuration)}:${secondsDuration < 10 ? "0" + secondsDuration : secondsDuration}`;

                newDiv.innerHTML = `
                    <div style="display: flex">
                        <img src="${file.picture}" style="height: 55px; margin-left: 10px; margin-right: 10px; aspect-ratio: 1 / 1; object-fit: cover;" draggable="false">
                        <div style="display: flex; flex-direction: column;">
                            <p class="rightBarSongName" draggable="false">${file.title}</p>
                            <p class="rightBarArtistName" draggable="false">${file.artist}</p>
                        </div>
                    </div>
                    <div class="artist-genre-library-text" style="right: 425px">
                        <p>${file.album}</p>
                    </div>
                    <div class="artist-genre-library-text" style="right: 175px">
                        <p>${file.genre}</p>
                    </div>
                    <div style="display: flex; align-items: center">
                        <p class="songTime" draggable="false">${correctTime}</p>
                    </div>`;
                
                songContainer.appendChild(newDiv);

    } catch (err) {
        console.error('Błąd:', err);
    }
}































// dodać że ma typisać piosenki po MetaData: Nr
// dodać jeszcze że jak wybierzesz filtr to się podświetli i jak jest z dropdownem to ustawi nazwę na wybrany item
//* pokazywanie i chowanie się prawego baru jak i informacje na nich o wybranym filtrze
// podświetli graną piosenkę na aktóalnej playliście
//TODO: możlwość zmiany kolejności playlisty na stałe
//TODO: dodać wyszukiwanie w dropdown'ach jeśli jaką więcej niż 10 wyników
// optymalizacja tworzenia div'ów jako jedna funkja a nie 3 bądź 4 osobne
// zoptymailizowanie się wczytywania playlisty lokalnej z nowej funkji a nie starej



/*
//*Przykład użycia (o wiele szybszy!)
window.api.getAllAudioFilePaths().then((files) => {

    window.api.getSongData().then((files) => {

        console.log(files);

    }).catch(err => console.error('Błąd:', err));

}).catch(err => console.error('Błąd:', err));
*/