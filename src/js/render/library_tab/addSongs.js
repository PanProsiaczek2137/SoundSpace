const addSong = document.getElementById('add-song');
const addSongsMenuSongs = document.getElementById('add-songs-menu-songs');

const addSongsMenu = document.getElementById('add-songs-menu')
const popupMenu = document.getElementById('popup')

document.getElementById('add-song').addEventListener('click', async () => {
    const filePaths = await window.api.openFileDialog();
    addSongsMenuSongs.innerHTML = ''
    filePaths.forEach(filePath => {
        console.log('Selected file path:', filePath);
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

/*fileInputAddSong.addEventListener('change', () => {
    const files = fileInputAddSong.files;
    for (let i = 0; i < files.length; i++) {

        window.api.getSpecificAudioFile("C:\\Users\\Mateusz\\Music\\She Just Won't Believe Me.mp3").then((file) => {
            console.log(file)
            const img = document.getElementById('testowe');
            img.src = `data:image/png;base64,${file.artistPicture}`
        }).catch(err => console.error('Błąd:', err));
        console.log(`Selected song: ${files[i].name}`);

        const newDiv = document.createElement('div');
        newDiv.innerHTML = `
        <div style="display: flex;">
            <img src="${'audioFile.picture'}" class="right-bar-song-img" draggable="false">
            <div style="display: flex; flex-direction: column;">
                <p class="rightBarSongName">${'audioFile.title'}</p> 
                <p class="rightBarArtistName">${'audioFile.artist'}</p>
            </div>
        </div>
        `;
        addSongsMenuSongs.appendChild(newDiv)
    }
    popupMenu.style.visibility = 'visible'
    addSongsMenu.style.visibility = 'visible'
    popupMenu.style.animation = 'show 0.2s ease-in-out';
    addSongsMenu.style.animation = 'fullscreenOn-AlbumCover 0.3s ease-in-out';
});
*/

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