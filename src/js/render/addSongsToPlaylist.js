import { playedPlaylistTrack, playingPlaylist } from '../modules/soundSystem.js';

const dropbtnPlaylist = document.getElementById('dropbtnPlaylist');
const dropdownContentPlaylist = document.getElementById('dropdown-content-playlist');

document.addEventListener('click', (event) => {
    if (!dropdownContentPlaylist.contains(event.target) && event.target !== dropbtnPlaylist) {
        dropdownContentPlaylist.style.visibility = 'hidden';
    }
});

let playlistToAddTo;

dropbtnPlaylist.addEventListener('click', () => {
    setTimeout(async () => {
        dropdownContentPlaylist.innerHTML = ''; // Czyścimy dropdown przed dodaniem nowych elementów
        const allPlaylists = await window.api.getAllJsonFilePaths(); // Pobieramy listę playlist

        // Iterujemy po wszystkich playlistach i tworzymy akapity z nazwami
        for (let i = 0; i < allPlaylists.length; i++) {
            const paragraph = document.createElement('p');
            paragraph.className = 'playlistToAddTo';
            const playlist = await window.api.getSpecificJsonFile(allPlaylists[i]);
            paragraph.innerText = playlist.name;
            if(playlist.songs.includes(playingPlaylist[playedPlaylistTrack])){
                paragraph.style.backgroundColor = "#444444"
            }            
            dropdownContentPlaylist.appendChild(paragraph); // Dodajemy akapit do dropdownu
        }

        dropdownContentPlaylist.style.visibility = 'visible';
        playlistToAddTo = document.getElementsByClassName('playlistToAddTo');

        // Zamieniamy HTMLCollection na tablicę, aby móc użyć forEach
        Array.from(playlistToAddTo).forEach(item => {
            item.addEventListener('click', async (event) => {
                console.log('ze wszystkich:', allPlaylists);
                console.log('Kliknięto element:', "."+event.target.innerText);
                window.api.addRemoveSongToPlaylist("."+event.target.innerText, playingPlaylist[playedPlaylistTrack]).then(()=>{
                    dropbtnPlaylist.click()
                })

                // Tutaj możesz dodać logikę dla klikniętego elementu
            });
        });
    }, 1); // Krótka pauza, aby poczekać na aktualizację dropdownu
});