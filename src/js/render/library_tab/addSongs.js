
const addSong = document.getElementById('add-song');
const addSongsMenuSongs = document.getElementById('add-songs-menu-songs');

const addSongsMenu = document.getElementById('add-songs-menu')
const popupMenu = document.getElementById('popup')

let pathsToFiles = []

addSong.addEventListener('click', async () => {
    const filePaths = await window.api.openFileDialog();
    addSongsMenuSongs.innerHTML = ''
    filePaths.forEach(filePath => {
        console.log('Selected file path:', filePath);
        pathsToFiles.push(filePath)
        const newDiv = document.createElement('div');
        window.api.getSpecificAudioFile(filePath).then((file) => {
            console.log(file)
            newDiv.style.marginTop = '10px'
            newDiv.style.marginBottom = '10px'
            newDiv.innerHTML = `
            <div style="display: flex;">
                <img src="${'data:image/png;base64,'+file.picture}" class="right-bar-song-img" draggable="false">
                <div style="display: flex; flex-direction: column;">
                    <p class="rightBarSongName">${file.title}</p> 
                    <p class="rightBarArtistName">${file.artist}</p>
                </div>
            </div>
            `;

        }).catch(err => console.error('Błąd:', err));

        addSongsMenuSongs.appendChild(newDiv)
    });
    console.log('zamknięto!')
    popupMenu.style.visibility = 'visible'
    addSongsMenu.style.visibility = 'visible'
    popupMenu.style.animation = 'show 0.2s ease-in-out';
    addSongsMenu.style.animation = 'fullscreenOn-AlbumCover 0.3s ease-in-out';
});

popupMenu.addEventListener('click', (event)=>{
    if(event.target == popupMenu){
        setTimeout(() => {
            popupMenu.style.visibility = 'hidden'
            addSongsMenu.style.visibility = 'hidden'
        }, 300);
        popupMenu.style.animation = 'hide 0.3s ease-in-out';
        addSongsMenu.style.animation = 'fullscreenOff-AlbumCover 0.3s ease-in-out';
    }
})

const inputDeleteOryginal = document.getElementById('add-songs-input-delete-oryginal');
const inputInformationBrackets = document.getElementById('add-songs-input-information-brackets');
const inputTrackNumner = document.getElementById('add-songs-input-track-numner');
const inputGenre = document.getElementById('add-songs-input-genre');

setInterval(() => {
    console.log(inputGenre.checked)
}, 1000);

const addSongsMenuButton = document.getElementById('add-songs-menu-button');
addSongsMenuButton.addEventListener('click', ()=>{
    const hostPlace = document.getElementById('host-place');

    async function transferAllAudioFiles(paths) {
        for (let i = 0; i < paths.length; i++) {
            try {
                console.time('start')
                const file = await window.api.transferAudioFile(paths[i], hostPlace.value, {
                    removeOriginal: inputDeleteOryginal.checked,
                    removeInformationInBrackets: inputInformationBrackets.checked,
                    setImage: true,
                    setAlbumTrackNumber: inputTrackNumner.checked,
                    setSongTags: inputGenre.checked,
                    setAlbumReleaseDate: true,
                });
                console.log(file);
                console.timeEnd('start')
            } catch (err) {
                console.error('Błąd:', err);
            }
        }
        pathsToFiles = []
    }
    
    // Wywołanie funkcji
    transferAllAudioFiles(pathsToFiles);
    
    setTimeout(() => {
        popupMenu.style.visibility = 'hidden'
        addSongsMenu.style.visibility = 'hidden'
    }, 300);
    popupMenu.style.animation = 'hide 0.3s ease-in-out';
    addSongsMenu.style.animation = 'fullscreenOff-AlbumCover 0.3s ease-in-out';
    
    if(hostPlace.value = 'Localy'){
        
    }else if(hostPlace.value = 'GoogleDrive'){

    }
    //TODO: zrobić że jak to klikniesz to doda wybrane piosenki do programu 
})

//SETTINGS:
/* [gdzie hotować piosenki]
?- po przesłaniu do programu usuwa oryginalny plik (domyślnie zaznaczone)
?- jeśli plik niema obrazka dodaj z bazydabych
?- usuwa informację w nawiasie przy nazwie piosenki
?- dodaje numer utworu w albumie jeśli niema
?- dodaje najpopularniej wybierany garuket z bazy danchy dla utowru
?- sprawdza datę wydanie czy jest poprawna, jeśli nie to ją poprawia
?- dodaje opis albumu przy pliku z wikipedi

                            <option value="withoutModification">without file modification</option>
                            <option value="withoutMetadata">without adding metadata</option>
                            <option value="missing">with adding missing metadata</option>
                            <option value="all">adding all metadata</option>

?- dodaje odpowiednik do yt jeśli niema  (nie teraz)
?- Automatycznie wykrywa i usuwa długie, ciche fragmenty na początku lub końcu utworu  (nie teraz)
- Analizuje tempo utworu (BPM – beats per minute) i automatycznie przypisuje do metadanych kategorię, np. „slow”, „medium”, „fast”.  (nie teraz)
*/