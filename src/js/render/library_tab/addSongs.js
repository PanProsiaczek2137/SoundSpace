
const addSong = document.getElementById('add-song');
const addSongsMenuSongs = document.getElementById('add-songs-menu-songs');

const addSongsMenu = document.getElementById('add-songs-menu')
const popupMenu = document.getElementById('popup')

let pathsToFiles = []

const hostPlace = document.getElementById('host-place');
const inputDeleteOryginal = document.getElementById('add-songs-input-delete-oryginal');
const inputInformationBrackets = document.getElementById('add-songs-input-information-brackets');
const inputTrackNumner = document.getElementById('add-songs-input-track-numner');
const inputGenre = document.getElementById('add-songs-input-genre');
const addSongsMenuDefult = document.getElementById('add-songs-menu-defult')

addSong.addEventListener('click', async () => {

    addSongsMenuDefult.value = 'important'
    hostPlace.value = 'Localy'
    inputDeleteOryginal.checked = true
    inputInformationBrackets.checked = true
    inputTrackNumner.checked = false
    inputGenre.checked = true

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


addSongsMenuDefult.addEventListener('change', ()=>{
    console.log(addSongsMenuDefult.value)

    if(addSongsMenuDefult.value == 'without'){
        inputInformationBrackets.checked = false
        inputTrackNumner.checked = false
        inputGenre.checked = false
    }
    if(addSongsMenuDefult.value == 'important'){
        inputInformationBrackets.checked = true
        inputTrackNumner.checked = false
        inputGenre.checked = true
    }
    if(addSongsMenuDefult.value == 'all'){
        inputInformationBrackets.checked = true
        inputTrackNumner.checked = true
        inputGenre.checked = true
    }
})



const transferringSongInformation = document.getElementById('transferring-song-information')
const addSongsMenuButton = document.getElementById('add-songs-menu-button');

const loadingSongs = document.getElementById('loading-songs');
loadingSongs.style.visibility = 'hidden'
loadingSongs.style.animation = "fullscreenOff-RightBar 0.3s ease-in-out forwards"

addSongsMenuButton.addEventListener('click', ()=>{
    loadingSongs.style.visibility = 'visible'
    loadingSongs.style.animation = "fullscreenOn-RightBar 0.5s ease-in-out forwards"
    async function transferAllAudioFiles(paths) {
        const allSongsProgres = document.getElementById('allSongs')
        allSongsProgres.max = paths.length
        allSongsProgres.value = 0
        console.log('ustawia na max: '+ paths.length)
        for (let i = 0; i < paths.length; i++) {
            try {
                console.time('start')
                transferringSongInformation.innerText = Math.floor((allSongsProgres.value / allSongsProgres.max) * 100) + "%"
                const file = await window.api.transferAudioFile(paths[i], hostPlace.value, {
                    removeOriginal: inputDeleteOryginal.checked,
                    removeInformationInBrackets: inputInformationBrackets.checked,
                    setImage: true,
                    setAlbumTrackNumber: inputTrackNumner.checked,
                    setSongTags: inputGenre.checked,
                    setAlbumReleaseDate: true,
                });
                document.getElementById('transferring-song-cover').src = file.picture
                document.getElementById('transferring-song-name').innerText = file.title
                document.getElementById('transferring-song-artist').innerText = file.artist

                console.timeEnd('start')
                allSongsProgres.value += 1
                transferringSongInformation.innerText = Math.floor((allSongsProgres.value / allSongsProgres.max) * 100) + "%"
                console.log('proces: '+ allSongsProgres.value)
            } catch (err) { 
                console.error('Błąd:', err);
            }
        }
        setTimeout(() => {
            loadingSongs.style.animation = "fullscreenOff-RightBar 0.3s ease-in-out forwards"
            setTimeout(() => {
                loadingSongs.style.visibility = 'hidden'
            }, 300);
        }, 1000);
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