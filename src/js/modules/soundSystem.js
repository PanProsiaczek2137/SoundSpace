import { pauseResumeSong } from '../render/songControler.js';

//const jsmediatags = window.jsmediatags
const albumCover = document.getElementById('album-image-fullScreen');
const albumCoverBlur = document.getElementById('album-blure-fullScreen');
const RightBar = document.getElementById('next-songs-list');


let songURL = new Audio('allResources/audio/' + 'WelcomeToSoundSpace.wav');
export let songDuration = 0;
export let songCurrentTime = 0;
export let volume = 0.5;
export let playedPlaylistTrack = 0;
export let playingPlaylist = [];




export function setSong(song, playOnStart) {
    

    pauseSong()
    songURL == null

    window.api.getSpecificAudioFile(song).then((file) => {

        albumCover.src = 'data:image/png;base64,'+file.picture;
        albumCoverBlur.src ='data:image/png;base64,'+file.picture;
        songURL = new Audio(song);
        setVolume(volume)

        setTimeout(() => {
            playedPlaylistTrack = playingPlaylist.indexOf(song);
            console.log(playingPlaylist)
            console.log(song)
            console.log(playingPlaylist.indexOf(song))
            console.log(playedPlaylistTrack)
        }, 10);
            

        songURL.addEventListener('loadedmetadata', () => {
            songDuration = songURL.duration;
            //console.log('Czas trwania piosenki:', window.songDuration);
        });

        const songName = document.getElementById('song-name');
        songName.innerText = file.title
        const artistAndAlbumName = document.getElementById('artistAndAlbum');
        artistAndAlbumName.innerText = file.album == null ? file.artist : file.artist + " ∙ " + file.album;
        const albumImage = document.getElementById('album-image');
        albumImage.src = 'data:image/png;base64,'+file.picture;


        const TimeLine = document.getElementById('time-line');
        // Nasłuchiwanie, aby aktualizować bieżący czas odtwarzania
        songURL.addEventListener('timeupdate', () => {

            console.log(playedPlaylistTrack)

            songCurrentTime = songURL.currentTime;
            TimeLine.max = Math.floor(songDuration);
            TimeLine.value = Math.floor(songCurrentTime);
            const songTimeElement = document.getElementById('time');
            let secondsCurrentTime = Math.floor(songCurrentTime) % 60
            let secondsDuration = Math.floor(songDuration) % 60
            let minutsCurrentTime = songCurrentTime.toFixed(2) / 60
            let minutsDuration = songDuration.toFixed(2) / 60
            songTimeElement.innerText = `${Math.floor(minutsCurrentTime) < 1 ? '0' : Math.floor(minutsCurrentTime)}:${secondsCurrentTime < 10 ? "0"+secondsCurrentTime : secondsCurrentTime} / ${Math.floor(minutsDuration)}:${secondsDuration < 10 ? "0"+secondsDuration : secondsDuration}`;
        });//! to addEventListener może powodować spadki wydajności


        songURL.addEventListener('ended', () => {

            pauseSong()
            setSong(playingPlaylist[playedPlaylistTrack+1], true);

        })
        
        if(playOnStart){
            setTime(0);
            pauseResumeSong('resume')
        }

    }).catch(err => console.error('Błąd:', err));

}

export function playSong() {
    songURL.play();
}

export function pauseSong() {
    songURL.pause();
}

export function setTime(to){
    songURL.currentTime = to
    songCurrentTime = songURL.currentTime;
}

export function setVolume(to){
    songURL.volume = to;
    volume = to;
}

export function convertBackslashes(path) {
    console.log(path);
    //console.log(path.replace(/\\/g, '\\\\'));
    return path.replace(/\\/g, '\\\\');
}


    //setPlaylist('all')
    //setPlaylist('file', "C:\\Users\\Mateusz\\Music\\.PlayList1.json")
    //setPlaylist('custom', ['C:\\Users\\Mateusz\\Music\\Another Brick In The Wall (Part 3).mp3','C:\\Users\\Mateusz\\Music\\Apocalypse Dreams.mp3','C:\\Users\\Mateusz\\Music\\Arabella.mp3'])



export function setPlaylist(to, content, startFrom, playOnStart) {
    if (to === 'all') {
        RightBar.innerHTML = ""
        playingPlaylist = []
        console.log('pliylist form folder music')
        window.api.getAllAudioFilePaths().then(async (files) => {
            for (let i = 0; i < files.length; i++) {
                await setRightBarSong(files[i]);
                playingPlaylist.push(files[i]);
                if(i == 0 && startFrom == undefined || null){
                    setSong(files[i], playOnStart);
                }else if(i == 0 && startFrom != undefined || null){
                    setSong(files[startFrom], playOnStart);
                }
                if(i == files.length-1 && startFrom != undefined || null){
                    playedPlaylistTrack = Number(startFrom)
                }
            }
            //console.log(window.playingPlaylist);
        }).catch(err => console.error('Błąd:', err));
    } 

    else if(to === 'file'){
        RightBar.innerHTML = ""
        playingPlaylist = []
        console.log('playlist from a file');
        (async () => {
            try {
                window.api.getSpecificJsonFile(content).then(async (file) => {
                    console.log(file)
                    for (let i = 0; i < file.songs.length; i++) {
                        await setRightBarSong(file.songs[i]);
                        playingPlaylist.push(file.songs[i]);
                        if(i == 0 && startFrom == undefined || null){
                            setSong(file.songs[0], playOnStart);
                            console.log('to')
                            console.log(file.songs[0])
                        }else if(i == 0 && startFrom != undefined){
                            setSong(file.songs[startFrom], playOnStart);
                        }
                        if(i == file.length-1 && startFrom != undefined || null){
                            playedPlaylistTrack = Number(startFrom)
                        }
                    }
                    //console.log(window.playingPlaylist);
                }).catch(err => console.error('Błąd:', err)); 
            } catch (err) {
                console.error('Błąd:', err);
            }
        })();
    }

    else if(to === 'custom'){
        RightBar.innerHTML = ""
        playingPlaylist = []
        console.log('custom playlist');
        (async () => {
            try {
                for (let i = 0; i < content.length; i++) {
                    await setRightBarSong(content[i]);
                    playingPlaylist.push(content[i]);
                    if(i == 0 && startFrom == undefined || null){
                        setSong(content[i], playOnStart);
                    }else if(i == 0 && startFrom != undefined || null){
                        setSong(content[startFrom], playOnStart);
                    }
                    if(i == content.length-1 && startFrom != undefined || null){
                        playedPlaylistTrack = Number(startFrom)
                    }
                }
                console.log(playingPlaylist)
            } catch (err) {
                console.error('Błąd:', err);
            }
        })();
    }
    
}


//ToDo: naprawić przestawianie pisenek aby ze scrollem działało i nie wczytywało wszystkich plików od nowa
let mouseYpos;
async function setRightBarSong(file) {
    try {
        let scrollPosition = 0;
        const audioFile = await window.api.getSpecificAudioFile(file);

        let secondsDuration = Math.floor(audioFile.duration) % 60;
        let minutesDuration = Math.floor(audioFile.duration / 60);
        let converted = `${minutesDuration}:${secondsDuration < 10 ? "0" + secondsDuration : secondsDuration}`;

        const newDiv = document.createElement('div');
        newDiv.classList.add('songToSelect');
        newDiv.setAttribute('data-song-file', file);
        newDiv.innerHTML = `
            <div style="display: flex;">
                <img src="${'data:image/png;base64,' + audioFile.picture}" class="right-bar-song-img" draggable="false">
                <div style="display: flex; flex-direction: column;">
                    <p class="rightBarSongName">${audioFile.title}</p> 
                    <p class="rightBarArtistName">${audioFile.artist}</p>
                </div>
            </div>
            <p class="songTime">${converted}</p>
        `;

        let mouseDown = false;
        let changeSongPosition = false;
        newDiv.addEventListener('mousedown', (event) => {
            if(event.button === 0){
                mouseDown = true;
                newDiv.id = "grabbed";
            }
        });

        document.addEventListener('mouseup', (event) => {
            if(event.button === 0){
                mouseDown = false;
                if (changeSongPosition) {
                    changeSongPosition = false;
                    newDiv.style.zIndex = '50';
                    const closestDiv = getClosestDiv('next-songs-list', newDiv);
                    if (closestDiv) {
                        console.log('Najbliższy div to:', closestDiv);
                    } else {
                        console.log('Nie znaleziono żadnego najbliższego diva.');
                    }
                    newDiv.removeAttribute('id'); // Zdejmij ID po zakończeniu

                    console.log(playedPlaylistTrack, playingPlaylist.indexOf(newDiv.getAttribute('data-song-file')))
                    const old = playingPlaylist[playedPlaylistTrack]
                    if(playedPlaylistTrack == playingPlaylist.indexOf(newDiv.getAttribute('data-song-file'))){

                        playingPlaylist.splice(playingPlaylist.indexOf(newDiv.getAttribute('data-song-file')), 1);
                        playingPlaylist.splice(playingPlaylist.indexOf(closestDiv.getAttribute('data-song-file')), 0, newDiv.getAttribute('data-song-file'));
                        newDiv.style.position = 'static'
                        RightBar.insertBefore(newDiv, closestDiv);

                        playedPlaylistTrack = playingPlaylist.indexOf(newDiv.getAttribute('data-song-file'))

                        console.log('przesuwasz tego co gra')
                    }else {
                        playingPlaylist.splice(playingPlaylist.indexOf(newDiv.getAttribute('data-song-file')), 1);
                        playingPlaylist.splice(playingPlaylist.indexOf(closestDiv.getAttribute('data-song-file')), 0, newDiv.getAttribute('data-song-file'));
                        newDiv.style.position = 'static'
                        RightBar.insertBefore(newDiv, closestDiv);
                        if(playingPlaylist != playedPlaylistTrack){
                            playedPlaylistTrack = playingPlaylist.indexOf(old)
                        }

                    }


                    //console.log(playingPlaylist.indexOf(newDiv.getAttribute('data-song-file')))
                    //console.log(newDiv.getAttribute('data-song-file'))
                    //console.log(playingPlaylist)

                    /*RightBar.innerHTML = '';
                    window.api.getAllAudioFilePaths().then(async (files) => {
                        for (let i = 0; i < window.playingPlaylist.length; i++) {
                            await setRightBarSong(window.playingPlaylist[i], i);
                        }
                        console.log(window.playingPlaylist);
                    }).catch(err => console.error('Błąd:', err));*/
                    console.log(mouseDown, changeSongPosition)
                }
            }
        });

        newDiv.addEventListener('mouseup', (event) => {
            if (!changeSongPosition && event.button === 0) {
                pauseSong()
                setSong(newDiv.getAttribute('data-song-file'))
                console.log(file)
                setTimeout(() => {
                    setTime(0);
                    pauseResumeSong('resume');
                }, 100);
            }
        })



        newDiv.addEventListener('mousemove', (event) => {
            if (mouseDown) {
                changeSongPosition = true
                newDiv.style.zIndex = '999';
                newDiv.style.position = 'absolute';
                newDiv.style.top = event.clientY - 100 + scrollPosition + "px";
                mouseYpos = event.clientY
            }
        });

        RightBar.addEventListener('scroll', () => {
            scrollPosition = RightBar.scrollTop; // Pozycja scrolla w pionie
            const grabbedDiv = document.getElementById('grabbed');
            if(grabbedDiv){
                grabbedDiv.style.top = mouseYpos - 100 + scrollPosition + "px";
            }
        });

        RightBar.appendChild(newDiv);
    } catch (err) {
        console.error('Błąd:', err);
    }
}

function getClosestDiv(containerId, referenceElement) {
    const container = document.getElementById(containerId);
    const divs = container.getElementsByClassName('songToSelect');
    let closestDiv = null;
    let closestDistance = Infinity;

    const rect1 = referenceElement.getBoundingClientRect();

    Array.from(divs).forEach((div) => {
        // Ignoruj element referencyjny
        if (div !== referenceElement) {
            const rect2 = div.getBoundingClientRect();

            // Oblicz odległość między elementami
            const distance = Math.sqrt(
                Math.pow(rect1.left - rect2.left, 2) +
                Math.pow(rect1.top - rect2.top, 2)
            );

            // Sprawdź, czy to jest najbliższy element
            if (distance < closestDistance) {
                closestDistance = distance;
                closestDiv = div;
            }
        }
    });

    return closestDiv;
}


//TODO: zminiejszyć ilość window.api.getAudioFiles