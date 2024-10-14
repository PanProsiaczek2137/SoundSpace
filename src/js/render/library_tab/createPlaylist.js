const playListCreateButton = document.getElementById('add-playlist');
const createPlaylistMenu = document.getElementById('create-playlist-menu')
const popupMenu = document.getElementById('popup')

playListCreateButton.addEventListener('click', ()=>{
    popupMenu.style.visibility = 'visible'
    createPlaylistMenu.style.visibility = 'visible'
    popupMenu.style.animation = 'show 0.2s ease-in-out';
    createPlaylistMenu.style.animation = 'fullscreenOn-AlbumCover 0.3s ease-in-out';
})

popupMenu.addEventListener('click', (event)=>{
    if(event.target == popupMenu){
        setTimeout(() => {
            popupMenu.style.visibility = 'hidden'
            createPlaylistMenu.style.visibility = 'hidden'
        }, 300);
        popupMenu.style.animation = 'hide 0.3s ease-in-out';
        createPlaylistMenu.style.animation = 'fullscreenOff-AlbumCover 0.3s ease-in-out';
    }
})



const playlistNameInput = document.getElementById('play-list-name-input');
const playlistDescriptionInput = document.getElementById('play-list-description-input');
const dropdownCreatePlaylist = document.getElementById('public-private-create');
const graphicsToSet = document.getElementById('graphicsToSet');
const createPlaylist = document.getElementById('create-playlist')

let imgData;

createPlaylist.addEventListener('click', () => {
    const playlistName = playlistNameInput.value.trim();

    // Funkcja do sprawdzenia, czy nazwa playlisty jest prawidłowa
    const isValidPlaylistName = (name) => {
        const invalidChars = /[<>:"/\\|?*\x00-\x1F]/; // Zestaw niedozwolonych znaków
        const maxLength = 255; // Maksymalna długość nazwy pliku
        return name.length > 0 && name.length <= maxLength && !invalidChars.test(name);
    };

    window.api.doesJsonFileExist('.' + playlistName).then((files) => {
        console.log(files);
        
        // Sprawdzenie, czy nazwa playlisty jest prawidłowa
        if (isValidPlaylistName(playlistName) && !files) {
            console.log('wykonano');

            // Upewnij się, że przesyłasz imgData jako poprawny string
            window.api.saveImageToPlaylistCovers(playlistName+'.png', imgData).then((filePath) => {
                console.log('Ścieżka do zapisanego pliku:', filePath);
                window.api.createJsonFile(playlistName, filePath, playlistDescriptionInput.value, dropdownCreatePlaylist.value);
            }).catch((err) => {
                console.error('Błąd przy zapisywaniu obrazu:', err);
            });

            setTimeout(() => {
                popupMenu.style.visibility = 'hidden';
                createPlaylistMenu.style.visibility = 'hidden';
            }, 300);
            popupMenu.style.animation = 'hide 0.3s ease-in-out';
            createPlaylistMenu.style.animation = 'fullscreenOff-AlbumCover 0.3s ease-in-out';
        } else {
            console.error('Nazwa playlisty jest nieprawidłowa lub plik już istnieje.');
        }
    }).catch(err => console.error('Błąd:', err));
});


const addPlaylistCover = document.getElementById('addPlaylistCover');
const fileInput = document.getElementById('fileInput');

// Otwórz eksplorator plików po kliknięciu w obrazek
addPlaylistCover.addEventListener('click', () => {
    fileInput.click();
});

// Obsługuje wybór pliku
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0]; // Pobierz pierwszy wybrany plik

    if (file) {
        const reader = new FileReader();

        // Odczytaj zawartość pliku jako URL
        reader.onload = (e) => {
            const base64Data = e.target.result.split(',')[1]; // Usuń prefiks
            addPlaylistCover.src = e.target.result; // Ustaw src na nowo wybrany plik
            imgData = base64Data
        };

        reader.readAsDataURL(file); // Odczytaj plik jako URL
    }
});