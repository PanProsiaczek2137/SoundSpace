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

    const img = document.getElementById('playlists-info-img');
    const imgBg = document.getElementById('playlists-info-img-blur');
    const title = document.getElementById('rigth-bar-library-title');
    const description = document.getElementById('rigth-bar-library-description');
    const info = document.getElementById('rigth-bar-library-info');


    let songsDurations = [];

    for (let i = 0; i < durationTo.length; i++) {
        window.api.getSongData(durationTo[i]).then((file) => {
            songsDurations.push(Number(file.duration));
        }).catch(err => console.error('Błąd:', err));
    }

    img.src = pictureTo;
    imgBg.src = pictureTo;
    title.innerText = titleTo;

    if(descriptionTo[0] == 'Loading...'){
        description.innerText = 'Loading...';
        if(descriptionTo[1] == 'album'){

            (async () => {
                console.log('WYKONANO!!!!!!!!')
                const data = await window.api.getAlbumDataWithExternalLinks(descriptionTo[2], descriptionTo[3])
                console.log(data)
                    if (data == null) {
                        description.innerText = 'This artist or album was not found in the database';
                    }else{
                        console.log('Album Data:', data.albumData);
                        if (data.externalLinks.length > 0) {
                            console.log('External Links:', data.externalLinks);
                            const intro = await window.api.getWikipediaIntroFromWikidata(data.externalLinks[0].url);
                            if (intro) {
                                description.innerText = intro;
                            }
                        } else {
                            description.innerText = 'no article found about this album';
                        }
                    }
            })();

        }
    }else{
        description.innerText = descriptionTo;
    }

    // Czekamy na zakończenie pobierania długości utworów
    setTimeout(() => {
        const totalDurationInSeconds = songsDurations.reduce((acc, curr) => acc + curr, 0);
        const formattedDuration = formatDuration(totalDurationInSeconds);
        info.innerText = `${privacyTo} ∙ ${numberOfSongsTo} Songs ∙ Duration ${formattedDuration}`;
        console.log(songsDurations);
        console.log('Całkowity czas trwania:', formattedDuration);
    }, 40);
}

// Funkcja do formatowania długości w sekundy
function formatDuration(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m`;
}
