import { setPlaylist, pauseSong } from '../../modules/soundSystem.js';
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
    
    try {
        const files = await window.api.getAllAudioFilePaths();
        SongsDisplayed = files;
        
        for (let i = 0; i < SongsDisplayed.length; i++) {
            if (window.stop) {
                console.log("Przerwano ładowanie");
                return;  // Zakończ wykonywanie, jeśli stop jest ustawione na true
            }

            const file = await window.api.getSpecificAudioFile(files[i]);

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
                    <img src="${'data:image/png;base64,' + file.picture}" style="height: 55px; margin-left: 10px; margin-right: 10px; aspect-ratio: 1 / 1; object-fit: cover;" draggable="false">
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
        }
    } catch (err) {
        console.error('Błąd:', err);
    }
}






document.addEventListener('click', (event) => {
    // Sprawdza, czy kliknięty element nie jest wewnątrz dropdowna lub przycisku otwierającego
    if (selectedFilter === 'playlist' && !dropdownContent1.contains(event.target) && event.target !== playlistFilter) {
        
        dropdownContent1.innerHTML = ''
        dropdownContent1.style.display = 'none'; // Ukrycie dropdowna
        selectedFilter = ''; // Resetowanie stanu
    }
});


const dropdownContent1 = document.getElementById('dropdown-content1');
const playlistFilter = document.getElementById('playlist-filter');

playlistFilter.addEventListener('click', () => {
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

            const file = await window.api.getSpecificAudioFile(songs[i]);

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
                        <img src="${'data:image/png;base64,' + file.picture}" style="height: 55px; margin-left: 10px; margin-right: 10px; aspect-ratio: 1 / 1; object-fit: cover;" draggable="false">
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
        }
    } catch (err) {
        console.error('Błąd:', err);
    }
}
































reloadResults()

function reloadResults(){
    let SongsDisplayed = [];
    /*AllPlayLists = playingList.filter(playlist => playlist.name).map(playlist => playlist.name);
    AllArtists = [...new Set(AllSongs.map(song => song.artist))].slice(1);
    const ArtistParagraphs = document.getElementsByClassName('ArtistParagraphs');
    const GenreParagraphs = document.getElementsByClassName('GenreParagraphs');
    const dropdownContent1 = document.getElementById('dropdown-content1');
    const dropdownContent2 = document.getElementById('dropdown-content2');
    const dropdownContent3 = document.getElementById('dropdown-content3');
    while (dropdownContent1.firstChild) {
        dropdownContent1.removeChild(dropdownContent1.firstChild);
    }
    while (dropdownContent2.firstChild) {
        dropdownContent2.removeChild(dropdownContent2.firstChild);
    }
    /*while (dropdownContent3.firstChild) {
        dropdownContent3.removeChild(dropdownContent3.firstChild);
    }

    for(i = 0; i<AllPlayLists.length; i++){
        paragraphss = document.getElementsByClassName('PlayListParagraphs');
        const paragraph = document.createElement('p');
        paragraph.className = 'PlayListParagraphs';
        //paragraph.style.paddingTop = '2px'
        paragraph.setAttribute('onclick', `selectedFilter = AllPlayLists[${i}]; filterChanged()`);
        paragraph.textContent = AllPlayLists[i];
        paragraph.addEventListener('mouseover', () => showImg(paragraph)); // Najechanie na element
        paragraph.addEventListener('mouseout', () => hideImg(paragraph));  // Zjechanie z elementu
        
        const img = document.createElement('img');
        img.src = 'allResources/icon/edit.svg';
        img.alt = 'Edit icon'; // Dodajemy tekst alternatywny
        img.id = i+1;
        img.draggable = false;
        img.style.position = 'absolute';
        img.style.right = '10px';
        //img.style.marginBottom = '10px';
        img.style.visibility = 'hidden';
        img.addEventListener('click', () => showPopupEditPlaylist(true, AllPlayLists[img.id-1])); // Najechanie na element

        paragraph.appendChild(img);

        dropdownContent1.appendChild(paragraph);
        
        //PlayListParagraphs[i].innerText = AllPlayLists[i];
    }

    for(i = 0; i<AllArtists.length; i++){
        const paragraph = document.createElement('p');
        paragraph.className = 'ArtistParagraphs';
        paragraph.setAttribute('onclick', `selectedFilter = AllArtists[${i}]; filterChanged()`);
        paragraph.textContent = 'none';
        dropdownContent2.appendChild(paragraph);
        ArtistParagraphs[i].innerText = AllArtists[i];
    }

    for(i = 0; i<4; i++){
        GenreParagraphs[i].innerText = AllGenres[i];
        //ToDo: zrobć to samo po w pozostałych tylko dla zakładki Genres
    }


    if(AllPlayLists.length > 10){
        const searchBar = document.createElement('input');
        searchBar.className = 'PlaylistParagraphs filtersSerchbar';
        searchBar.id = 'PlaylistSerchBar'
        searchBar.type = 'serch';
        searchBar.setAttribute('onkeyup', 'filterPlaylists()',);
        searchBar.placeholder = 'Search playlists...';
        searchBar.spellcheck = false;
        searchBar.autocomplete = 'off'
        searchBar.onmouseover = function() {
            PlaylistSearchBar = true;
        };
        
        searchBar.onmouseout = function() {
            PlaylistSearchBar = false;
        };
        searchBar.addEventListener('focus', function() {
            keybinds = false;
          });
        searchBar.addEventListener('blur', function() {
            keybinds = true;
          });

        dropdownContent1.insertBefore(searchBar, dropdownContent1.firstChild);
    }

    if(AllArtists.length > 10){
        const searchBar = document.createElement('input');
        searchBar.className = 'ArtistParagraphs filtersSerchbar';
        searchBar.id = 'ArtistSerchBar'
        searchBar.type = 'serch';
        searchBar.setAttribute('onkeyup', 'filterArtists()',);
        searchBar.placeholder = 'Search artists...';
        searchBar.spellcheck = false;
        searchBar.autocomplete = 'off'
        searchBar.onmouseover = function() {
            ArtistSearchBar = true;
        };
        
        searchBar.onmouseout = function() {
            ArtistSearchBar = false;
        };
        searchBar.addEventListener('focus', function() {
            keybinds = false;
          });
        searchBar.addEventListener('blur', function() {
            keybinds = true;
          });

        dropdownContent2.insertBefore(searchBar, dropdownContent2.firstChild);
    }*/

    //ToDO: zrobć to samo po w pozostałych tylko dla zakładki Genres

}