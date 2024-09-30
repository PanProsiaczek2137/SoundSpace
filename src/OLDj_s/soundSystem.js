const fullScreenDiv = document.getElementById('fullScreen');
const stopPlay = document.getElementById('play-stop');
const RightBar = document.getElementById('next-songs-list');
const albumCover = document.getElementById('album-image-fullScreen');
const albumCoverBlur = document.getElementById('album-blure-fullScreen');
const fullScreenButton = document.getElementById('fullScreen-button');


export function playPlaylist(whichOne, withFullScreen, startForm, playOnStart, startAtTime){
    WhichPlaylistSelected = whichOne;
    console.log('wybrano playlistę:' + WhichPlaylistSelected);
    setSongTo(playingList[WhichPlaylistSelected].songs[startForm], withFullScreen, playOnStart, startAtTime);
    newSelected('playlist');
    playingSongFromPlaylist = startForm;
}

export function playSingleSong(whichOne2, withFullScreen, playOnStart){
    setSongTo(whichOne2, withFullScreen, playOnStart);
    newSelected('song');
    playingSongFromPlaylist = -1;
}


export function setSongTo(Song, withFullScreen, playOnStart, startAtTime){
    if (audio) {
        audio.pause();
    }
    songPlayed = Song;
    isPlaying = false

    const albumImageFull = document.getElementById('album-image-fullScreen');
    const albumBlurFull = document.getElementById('album-blure-fullScreen');
    const albumImage = document.getElementById('album-image');
    const songName = document.getElementById('song-name');
    const artistAndAlbumName = document.getElementById('artistAndAlbum');

    albumImage.src = 'allResources/albumCover/' + AllSongs[Song].icon;
    songName.innerText = AllSongs[Song].name;
    albumImageFull.src = 'allResources/albumCover/'+AllSongs[Song].icon;
    albumBlurFull.src = 'allResources/albumCover/'+AllSongs[Song].icon;
    artistAndAlbumName.innerText = AllSongs[Song].album == '-' ? AllSongs[Song].artist : AllSongs[Song].artist + " ∙ " + AllSongs[Song].album;

    audio = new Audio('allResources/music/'+ AllSongs[Song].audio)

    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: AllSongs[Song].name,
            artist: AllSongs[Song].artist,
            album: AllSongs[Song].album,
            artwork: [
                { src: 'allResources/albumCover/' + AllSongs[Song].icon, sizes: '512x512', type: 'image/jpg' }
            ]
        });
    }

    if(playOnStart){
        audio.play();
        isPlaying = true;
        stopPlay.src = "allResources/icon/pause.svg"
    }else{
        stopPlay.src = "allResources/icon/playArrow.svg"
    }
    if(withFullScreen){
        fullScreenOnOff(true)
    }
    playedSongIndex = Song;
    if(startAtTime != undefined){
        audio.currentTime = startAtTime
    }
    audio.addEventListener("timeupdate", (event) => {
        updateTimeBar();
        updateTimeLine();  
    });
}

function fullScreenOnOff(fullScreenOnOff){

    if(fullScreenOnOff){
        fullScreenDiv.hidden = false;
        fullScreen = true;
        RightBar.style.animation = "fullscreenOn-RightBar 0.35s forwards";
        albumCover.style.animation = "fullscreenOn-AlbumCover 0.35s forwards"
        fullScreenDiv.style.animation = "show 0.35s"
        albumCoverBlur.style.animation = "fullscreenOn-AlbumCover 0.35s forwards"
        fullScreenDiv.style.visibility = 'visible';
        fullScreenButton.src = 'allResources/icon/exit-fullscreen.svg' 
    }else{
        fullScreenDiv.hidden = true;
        fullScreen = false;
        RightBar.style.animation = "fullscreenOff-RightBar 0.35s forwards";
        albumCover.style.animation = "fullscreenOff-AlbumCover 0.35s forwards"
        fullScreenDiv.style.animation = "hide 0.35s"
        albumCoverBlur.style.animation = "fullscreenOff-AlbumCover 0.35s forwards"
        fullScreenButton.src = 'allResources/icon/fullscreen.svg'
        setTimeout(() => {
            fullScreenDiv.style.visibility = 'hidden';
        }, 330);
    }
};

async function newSelected(PlaylisySong) {
    if (PlaylisySong == 'playlist') {
        deleteAllSongsFromRightBar();
        playingSongFromPlaylist = 0;
        for (let i = 0; i < playingList[WhichPlaylistSelected].songs.length; i++) {
            const song = AllSongs[playingList[WhichPlaylistSelected].songs[i]];
            const duration = await updateAudioDuration(song.audio);
            setRightBarSong(i, 'allResources/albumCover/' + song.icon, song.name, song.artist, duration);
        }
    } else {
        deleteAllSongsFromRightBar();
        playingSongFromPlaylist = -1;
        const song = AllSongs[songPlayed];
        setTimeout(() => {
            let seconds = Math.floor(audio.duration % 60);
            let minutes = Math.floor(audio.duration / 60);
            if (seconds.toString().length === 1) {
                seconds = '0' + seconds;
            }
            let duration = (minutes + ":" + seconds);
            setRightBarSong(0, 'allResources/albumCover/' + song.icon, song.name, song.artist, duration);
        }, 50);
    }
}