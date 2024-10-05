import { setPlaylist, pauseSong, convertBackslashes } from '../../modules/soundSystem.js';
//import { pauseResumeSong } from '../songControler.js';
import { fullScreenOnOff } from '../fullScreen.js';


let selectedFilter = 'all';
let SongsDisplayed = [];
const songContainer = document.getElementById('songs');
window.stop = false;



const allFilter = document.getElementById('all-filter');
allFilter.addEventListener('click', () => {
    songContainer.innerHTML = ""
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

        selectedFilter = ''; // Resetowanie stanu
});


const dropdownContent1 = document.getElementById('dropdown-content1');
const playlistFilter = document.getElementById('playlist-filter');

playlistFilter.addEventListener('click', () => {
setTimeout(() => {
    if (selectedFilter !== 'playlist') {
        const dropdownContent1 = document.getElementById('dropdown-content1');
        console.log(dropdownContent1.style.display);
        dropdownContent1.style.display = 'block';
        selectedFilter = 'playlist';

        try {
            window.api.getAllJsonFilePaths().then(async (files) => {
                for (let i = 0; i < files.length; i++) {
                    const paragraph = document.createElement('p');
                    paragraph.className = 'PlayListParagraphs';

                    window.api.getSpecificJsonFile(files[i]).then(async (file) => {
                        paragraph.textContent = file.name;
                        paragraph.addEventListener('click', () => {
                            selectedFilter = file.name;
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
}, 1);
});






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
realoadAllArtistsAlbumsGenres()
async function realoadAllArtistsAlbumsGenres(){
    try {
        artists = []; albums = []; genres = [];
        window.api.getAllAudioFilePaths().then(async (files) => {

            for (let i = 0; i < files.length; i++) {  // Poprawione warunki pętli

                window.api.getSongData(files[i]).then((file) => {
                    const artist = file.artist || null;  // Sprawdzanie istnienia artysty w metadanych
                    if (!artists.includes(artist) && albums !=null) {  // Dodawanie artysty, jeśli nie ma go już na liście
                        artists.push(artist);
                    };
                    const album = file.album || null;  // Sprawdzanie istnienia artysty w metadanych
                    if (!albums.includes(album) && album !=null) {  // Dodawanie artysty, jeśli nie ma go już na liście
                        albums.push(album);
                    };
                    const genre = file.genre || null;  // Sprawdzanie istnienia artysty w metadanych
                    if (!genres.includes(genre) && genre !=null) {  // Dodawanie artysty, jeśli nie ma go już na liście
                        genres.push(genre);
                    };
                }).catch(err => console.error('Błąd:', err));
                
            }
            console.log(artists, albums, genres)
        });
    } catch (err) {
        console.error('Błąd:', err);
    }
}



const dropdownContent2 = document.getElementById('dropdown-content2');
const ArtistFilter = document.getElementById('artist-filter');

ArtistFilter.addEventListener('click', () => {
setTimeout(() => {
    if (selectedFilter !== 'artist') {
        console.log(dropdownContent2.style.display);
        dropdownContent2.style.display = 'block';
        selectedFilter = 'artist';

        try {
            
                //console.log('Artyści:', artists);  

                for (let i = 0; i < artists.length; i++) {
                    console.log(i)
                    const paragraph = document.createElement('p');
                    paragraph.className = 'PlayListParagraphs';

                    paragraph.textContent = artists[i];
                    paragraph.addEventListener('click', () => {
                        selectedFilter = artists;
                        songContainer.innerHTML = ""
                        dropdownContent2.innerHTML = ''
                        loadedPlaylistTo = []

                        window.api.getAllAudioFilePaths().then(async (files) => {
                            let count = 0
                            for (let i = 0; i < files.length; i++) {  // Poprawione warunki pętli
                                window.api.getSongData(files[i]).then((file) => {

                                    if (file.artist == paragraph.innerText) {  // Dodawanie artysty, jeśli nie ma go już na liście
                                        setUpArtist(file.title, file.filePath, count);
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
}, 1);
});


window.loadedPlaylistTo = []
async function setUpArtist(songs, path, count) {
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








const dropdownContent3 = document.getElementById('dropdown-content3');
const albumFilter = document.getElementById('album-filter');

albumFilter.addEventListener('click', () => {
setTimeout(() => {
    if (selectedFilter !== 'album') {
        console.log(dropdownContent3.style.display);
        dropdownContent3.style.display = 'block';
        selectedFilter = 'album';

        try {
            
                //console.log('Album:', artists);  

                for (let i = 0; i < albums.length; i++) {
                    console.log(i)
                    const paragraph = document.createElement('p');
                    paragraph.className = 'PlayListParagraphs';

                    paragraph.textContent = albums[i];
                    paragraph.addEventListener('click', () => {
                        selectedFilter = albums;
                        songContainer.innerHTML = ""
                        dropdownContent3.innerHTML = ''
                        loadedPlaylistTo = []

                        window.api.getAllAudioFilePaths().then(async (files) => {
                            let count = 0
                            for (let i = 0; i < files.length; i++) {  // Poprawione warunki pętli
                                window.api.getSongData(files[i]).then((file) => {

                                    if (file.album == paragraph.innerText) {  // Dodawanie artysty, jeśli nie ma go już na liście
                                        setUpAlbums(file.title, file.filePath, count);
                                        console.log(file.title, file.filePath, count)
                                        count = count+1
                                        console.log(count)
                                    }

                                }).catch(err => console.error('Błąd:', err));
                            }
                        });
                    });

                    dropdownContent3.appendChild(paragraph);
                }

        } catch (err) {
            console.error('Błąd:', err);
        }
    }
}, 1);
});

//TODO: dodać że ma typisać piosenki po MetaData: Nr
//TODO: dodać jeszcze że jak wybierzesz filtr to się podświetli i jak jest z dropdownem to ustawi nazwę na wybrany item
//TODO: pokazywanie i chowanie się prawego baru
//TODO: podświetli graną piosenkę na aktóalnej playliście
//TODO: możlwość zmiany kolejności playlisty na stałe
//TODO: dodać wyszukiwanie w dropdown'ach jeśli jaką więcej niż 10 wyników
async function setUpAlbums(songs, path, count) {
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










const dropdownContent4 = document.getElementById('dropdown-content4');
const genreFilter = document.getElementById('genre-filter');

genreFilter.addEventListener('click', () => {
setTimeout(() => {
    if (selectedFilter !== 'genre') {
        console.log(dropdownContent4.style.display);
        dropdownContent4.style.display = 'block';
        selectedFilter = 'genre';

        try {
            
                //console.log('Album:', artists);  

                for (let i = 0; i < genres.length; i++) {
                    console.log(i)
                    const paragraph = document.createElement('p');
                    paragraph.className = 'PlayListParagraphs';

                    paragraph.textContent = genres[i];
                    paragraph.addEventListener('click', () => {
                        selectedFilter = genres;
                        songContainer.innerHTML = ""
                        dropdownContent4.innerHTML = ''
                        loadedPlaylistTo = []

                        window.api.getAllAudioFilePaths().then(async (files) => {
                            let count = 0
                            for (let i = 0; i < files.length; i++) {  // Poprawione warunki pętli
                                window.api.getSongData(files[i]).then((file) => {

                                    if (file.genre == paragraph.innerText) {  // Dodawanie artysty, jeśli nie ma go już na liście
                                        setUpGenres(file.title, file.filePath, count);
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
}, 1);
});

async function setUpGenres(songs, path, count) {
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



































/*
//*Przykład użycia (o wiele szybszy!)
window.api.getAllAudioFilePaths().then((files) => {

    window.api.getSongData().then((files) => {

        console.log(files);

    }).catch(err => console.error('Błąd:', err));

}).catch(err => console.error('Błąd:', err));
*/

