showlibraryRightBar(false)
export function showlibraryRightBar(show){
    let playlistsInfo = document.getElementById('playlists-info');
    let songContainer = document.getElementById('songs'); 
    if(show){

        if(playlistsInfo.style.visibility != 'visible'){
            playlistsInfo.style.visibility = 'visible';
            playlistsInfo.style.animation += 'fullscreenOn-RightBar 0.25s forwards';
            songContainer.style.animation = 'notFull 0.25s forwards';

            setTimeout(() => {
                playlistsInfo.style.animation = '';
                songContainer.style.width = 'calc(100% - 336px)';
                songContainer.style.animation = '';
            }, 250);
        }

    }else{

        if(playlistsInfo.style.visibility != 'hidden'){
            playlistsInfo.style.animation += 'fullscreenOff-RightBar 0.25s forwards';
            songContainer.style.animation += 'full 0.25s forwards';

            setTimeout(() => {
                playlistsInfo.style.visibility = 'hidden';
                playlistsInfo.style.animation = '';
                songContainer.style.width = '100%';
                songContainer.style.animation = '';
            }, 250);
        }

    }
}

export function changelibraryRightBar(pictureTo, titleTo, descriptionTo, privacyTo, numberOfSongsTo, durationTo) {
    console.log('wykonano');

    let songsDurations = [];

    for (let i = 0; i < durationTo.length; i++) {
        window.api.getSongData(durationTo[i]).then((file) => {
            songsDurations.push(Number(file.duration));
        }).catch(err => console.error('Błąd:', err));
    }

    const img = document.getElementById('playlists-info-img');
    const imgBg = document.getElementById('playlists-info-img-blur');
    const title = document.getElementById('rigth-bar-library-title');
    const description = document.getElementById('rigth-bar-library-description');
    const info = document.getElementById('rigth-bar-library-info');

    img.src = pictureTo;
    imgBg.src = pictureTo;
    title.innerText = titleTo;
    description.innerText = descriptionTo;

    // Czekamy na zakończenie pobierania długości utworów
    setTimeout(() => {
        const totalDurationInSeconds = songsDurations.reduce((acc, curr) => acc + curr, 0);
        const formattedDuration = formatDuration(totalDurationInSeconds);
        info.innerText = `${privacyTo} ∙ ${numberOfSongsTo} Songs ∙ Duration ${formattedDuration}`;
        console.log(songsDurations);
        console.log('Całkowity czas trwania:', formattedDuration);
    }, 1);
}

// Funkcja do formatowania długości w sekundy
function formatDuration(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m`;
}
