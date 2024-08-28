let thisSongRating = 4.9;
let isPlaying = false;
let fullScreen = false;
let volume = 0.5;
let mute = false;
let audio;
let songPlayed = -1;
let playedSongIndex;
let songToSelect;
let keybinds = true;
let selectedPlaylist;
let AllPlayLists = ['aha', 'PlayList2']
let AllArtists = ['Tame Impala', 'Pink Floyd', 'Led Zeppelin', 'Daft Punk',]
let AllGenres = ['Rock (Psychedelic)', 'Rock (Clasic)', 'Rock (Hard)', 'Indie']
let AllSongs = [{name: 'Welcome to SoundSpace', audio: 'WelcomeToSoundSpaceEcho.wav', artist: 'SoundSpace', album: '-', icon: 'NewUser.svg'},
                {name: 'Inside Out', audio: 'song.opus', artist: 'Pink Floyd', album: 'Devision Bell', icon: 'DivisionBell.webp'},
                {name: 'The Serpentine', audio: 'TheSerpentine.opus', artist: 'Tame Impala', album: '-', icon: 'Lonerism.jpg'},
                {name: 'COCOLINI', audio: 'COCOLINI - TEENZ.opus', artist: 'TEENZ', album: '-', icon: 'unnamed.jpg'},
                {name: 'Mind Mischief', audio: 'Mind Mischief.opus', artist: 'Tame Impala', album: '-', icon: 'Lonerism.jpg'}];

let playingSongFromPlaylist = -1;
let WhichPlaylistSelected = 0;
let playingList = [ {songs: [1, 2, 3]}, 
                    {name: 'aha', description: 'Normale piosenki dla normalnych ludzi', icon: 'Lonerism.jpg', songs: [1,2,4], type: 'Private'},
                    {name: 'PlayList2', description: 'wszystkie piosenki i te normalne i ta dziwna', icon: 'DivisionBell.webp', songs: [3,1,2,3,3,4,1], type: 'PublicAdd'}];


                setTimeout(() => {
                    playSingleSong(0, false, false);
                    pauseResumeSong('pause');
                }, 1);


const ImageStar = document.getElementById('star')
const tabTitle = document.getElementById('open-tab');
const buttonHome = document.getElementById('Home');
const buttonLibrary = document.getElementById('Library');
const buttonMedia = document.getElementById('Media');
const iconHome = document.getElementById('home-icon');
const iconLibrary = document.getElementById('library-icon');
const iconMedia = document.getElementById('media-icon');
const songTimeElement = document.getElementById('time');
const volumeBar = document.getElementById('volume-bar');
const fullScreenButton = document.getElementById('fullScreen-button');
const albumCover = document.getElementById('album-image-fullScreen');
const RightBar = document.getElementById('next-songs-list');
const albumCoverBlur = document.getElementById('album-blure-fullScreen');
const TimeLine = document.getElementById('time-line');
const homeAlbumCover = document.getElementsByClassName('home-album-cover');
const skipNext = document.getElementById('skipNext');
const skipPrevious = document.getElementById('skipPrevious');


//Main Loop
setInterval(() => {
    TimeLine.max = Math.floor(audio.duration);
    volumeBarUpdate();
    PlayAnotherSongIfPosibleUpdate();
    highlightTheSongOnRightBar();
    DisableButtonIfNeedTo();
    makeSongsDragable();
    saveButtonAnimation();
    //initializeDisableKeybinds()
    if(selectedFilter == 'All'){
        filterType = 'All'
    }
}, 10);//ToDO: ZNALEŚĆ CO TAK OBCIĄRZA KOD!

function updateTimeBar(){
    let secondsCurrentTime = Math.floor(audio.currentTime) % 60
    let secondsDuration = Math.floor(audio.duration) % 60
    let minutsCurrentTime = audio.currentTime.toFixed(2) / 60
    let minutsDuration = audio.duration.toFixed(2) / 60
    songTimeElement.innerText = `${Math.floor(minutsCurrentTime) < 1 ? '0' : Math.floor(minutsCurrentTime)}:${secondsCurrentTime < 10 ? "0"+secondsCurrentTime : secondsCurrentTime} / ${Math.floor(minutsDuration)}:${secondsDuration < 10 ? "0"+secondsDuration : secondsDuration}`;
};


function setTab(to){
    const homeContent = document.getElementById('home-content');
    const libraryContent = document.getElementById('library-content');
    if(to == 'Home'){
        buttonHome.style.backgroundColor = "#161616"
        iconHome.src = "allResources/icon/home-filld.svg"
        homeContent.style.visibility = 'visible'
        fullScreenOnOff(false);
        deleteAllSongsFormLibrary()
        showlibraryRightBar(false)
    }else{
        buttonHome.style.backgroundColor = ''
        iconHome.src = "allResources/icon/home.svg"
        homeContent.style.visibility = 'hidden'
    }

    if(to == 'Library'){
        buttonLibrary.style.backgroundColor = "#161616"
        iconLibrary.src = "allResources/icon/library-filld.svg"
        libraryContent.style.visibility = 'visible'
        fullScreenOnOff(false);
        showSongsInLibraryWith()
        if(filterType == 'PlayLists'){
            showlibraryRightBar(true);   
        }
    }else{
        buttonLibrary.style.backgroundColor = ''
        iconLibrary.src = "allResources/icon/library.svg"
        libraryContent.style.visibility = 'hidden'
    }

    if(to == 'Media'){
        buttonMedia.style.backgroundColor = "#161616"
        iconMedia.src = "allResources/icon/media-filld.svg"
    }else{
        buttonMedia.style.backgroundColor = ''
        iconMedia.src = "allResources/icon/media.svg"
    }
    
    tabTitle.innerText = to + ":"
};


function SetStarRating(to){
    thisSongRating = to
    const percentage = (to / 5) * 100;
    ImageStar.style.background = `linear-gradient(90deg, rgba(255,255,255,1) ${percentage}%, rgba(255,255,255,0.24) ${percentage}%`
};


const stopPlay = document.getElementById('play-stop');
function pauseResumeSong(pauseResume){
    if(pauseResume === 'pause'){
        isPlaying = false
        audio.pause()
        stopPlay.src = "allResources/icon/playArrow.svg"
    }else{
        isPlaying = true
        audio.play();
        stopPlay.src = "allResources/icon/pause.svg"
    }
};


stopPlay.addEventListener('click', ()=>{
    if(isPlaying){
        pauseResumeSong('pause');
    }else{
        pauseResumeSong('resume');
    }
});
stopPlay.addEventListener('mousedown', () => {
    stopPlay.style.animation = 'makeSmaller 0.25s forwards';
});
stopPlay.addEventListener('mouseup', () => {
    stopPlay.style.animation = 'makeNormal 0.25s forwards';
});
stopPlay.addEventListener('mouseout', () => {
    stopPlay.style.animation = 'mauseOut 0.3s forwards';
});
stopPlay.addEventListener('mouseenter', () => {
    stopPlay.style.animation = 'mauseOn 0.3s forwards';
});


//Volume Bar
const volumeIcon = document.getElementById('volume');
const songControlDiv = document.getElementById('song-control');
volumeIcon.addEventListener('mouseenter', ()=>{
    volumeBar.hidden = false
    volumeBar.style.animation = 'show 0.2s forwards'
});
songControlDiv.addEventListener('mouseleave', ()=>{
    setTimeout(() => {
        volumeBar.hidden = true
    }, 200);
    volumeBar.style.animation = 'hide 0.2s forwards'
});

volumeIcon.addEventListener('click',()=>{
    if(mute){
        volumeBar.value = volume * 100;
        audio.volume = volume;
        mute = false;
    }else{
        volumeBar.value = 0;
        audio.volume = 0;
        mute = true;
    }
})
volumeBar.addEventListener('input', function(event){
    volume = Number(event.target.value /100);
});
function volumeBarUpdate(){
    if(mute && volumeBar.value != 0){
        volumeBar.value = volume * 100;
        audio.volume = volume;
        mute = false
    }
    if(!mute){
        audio.volume = volume
        if(volume >=0.5){
            volumeIcon.src = 'allResources/icon/volume2.svg'
        }else if(volume < 0.5 && volume != 0){
            volumeIcon.src = 'allResources/icon/volume1.svg'
        }else{
            volumeIcon.src = 'allResources/icon/volume0.svg'
        }
    }else{
        if(volume >=0.5){
            volumeIcon.src = 'allResources/icon/mute2.svg'
        }else if(volume < 0.5 && volume != 0){
            volumeIcon.src = 'allResources/icon/mute1.svg'
        }else{
            volumeIcon.src = 'allResources/icon/mute0.svg'
        }
    }
    if(mute){
        audio.volume = 0;
    }
};


function PlayAnotherSongIfPosibleUpdate(){
    if(audio.duration == audio.currentTime){
        if(playingSongFromPlaylist == -1){
            isPlaying = false;
            audio.pause();
            stopPlay.src = "allResources/icon/playArrow.svg";
            audio.currentTime = 0;
        }else{
            if(playingSongFromPlaylist > playingList[WhichPlaylistSelected].songs.length){
                playingSongFromPlaylist = -1
            }else{
                playingSongFromPlaylist++
                setSongTo(playingList[WhichPlaylistSelected].songs[playingSongFromPlaylist], false, true);
            }
        }
    }
}


//turning fullscreen on and off
const fullScreenDiv = document.getElementById('fullScreen');
fullScreenButton.addEventListener('click', ()=>{
    if(fullScreen){ 
        fullScreenOnOff(false)
    }else{
        fullScreenOnOff(true)
    }
});


function setRightBarSong(id, icon, name, artist, time) {
    const newDiv = document.createElement('div');
    newDiv.classList = 'songToSelect ' + playingList[WhichPlaylistSelected].songs[id];
    newDiv.id = id;
    newDiv.draggable = true;
    newDiv.innerHTML = `<div style="display: flex;"><img src="${icon}" style="height: 55px; padding-left: 10px; padding-right: 10px;"><div style="display: flex; flex-direction: column;"><p class="rightBarSongName">${name}</p> <p class="rightBarArtistName">${artist}</p></div></div><p class="songTime">${time}</p>`;
    RightBar.appendChild(newDiv);
    songToSelect = document.getElementsByClassName('songToSelect');
    if (fullScreen && playingSongFromPlaylist != -1) {
        // Dodajemy nasłuchiwacz bezpośrednio do nowo stworzonego elementu
        newDiv.addEventListener('click', () => {
            setSongTo(playingList[WhichPlaylistSelected].songs[newDiv.id], true, true);
            playingSongFromPlaylist = newDiv.id
        });
    }
}

function deleteAllSongsFromRightBar(){
    const songToSelectLocal = document.getElementsByClassName('songToSelect')
    Array.from(songToSelectLocal).forEach(element => {
        element.remove();
    });
}

function highlightTheSongOnRightBar(){
    if(fullScreen && playingSongFromPlaylist != -1){
        Array.from(songToSelect).forEach(element =>{
            element.addEventListener('mouseover', ()=>{
                element.style.filter = "contrast(125%)";
            })
            element.addEventListener('mouseleave', ()=>{
                element.style.filter = "contrast(100%)";
            })
        })
    }
};

function setupDragAndDropRightBar() {
    let dragedElementPlacement
    let draggedElement = null;
    let initialY = 0;
    let initialIndex = 0;
    const songContainer = document.getElementById('next-songs-list');

    songContainer.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('songToSelect')) {
            draggedElement = e.target;
            draggedElement.classList.add('dragging');
            draggedElement.style.zIndex = '1000';
            initialY = e.clientY;

            // Ustal początkowy indeks elementu
            initialIndex = Array.from(songContainer.children).indexOf(draggedElement);
        }
    });

    songContainer.addEventListener('dragend', () => {
        if (draggedElement) {
            draggedElement.classList.remove('dragging');
            draggedElement.style.zIndex = '';
            draggedElement = null;
        }
    });

    songContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (e.target.classList.contains('songToSelect')) {
            e.target.classList.add('drag-over');
        }
    });

    songContainer.addEventListener('dragleave', (e) => {
        dragedElementPlacement = e.target;
        e.target.classList.remove('drag-over');
    });

    songContainer.addEventListener('drop', (e) => {
        let dragedElement = e.target;
        e.preventDefault();
        if (e.target.classList.contains('songToSelect') && e.target !== draggedElement) {
            e.target.classList.remove('drag-over');
            const targetElement = e.target;
            const rect = targetElement.getBoundingClientRect();
            if (e.clientY < initialY) {
                songContainer.insertBefore(draggedElement, targetElement);
            } else {
                songContainer.insertBefore(draggedElement, targetElement.nextSibling);
            }
            const finalIndex = Array.from(songContainer.children).indexOf(draggedElement);
            const moveDifference = finalIndex - initialIndex;


            //ToDo: Przyko mi przyszły ja lecz będziesz musiał to coś naprawić. Dokładniej to spraw aby nie było tej przerwy kiedy zmieniasz piosenkę z granej. Powodzenia, wierzę w ciebie 😁
            container = document.getElementById('next-songs-list');
            let after;
            let before = Array.from(container.querySelectorAll('div'))[playingSongFromPlaylist*3].id
            setupPlaylistZero('localSongsOrderChanged');
            playPlaylist(0, false, playingSongFromPlaylist, false, audio.currentTime);
            setTimeout(() => {
                after = Array.from(container.querySelectorAll('div'))[playingSongFromPlaylist*3].id;
                if(after != before){
                    playingSongFromPlaylist = Number(playingSongFromPlaylist)
                    console.log(playingSongFromPlaylist)
                    console.log(moveDifference)
                    console.log(playingSongFromPlaylist + moveDifference)
                    playingSongFromPlaylist = playingSongFromPlaylist + moveDifference
                    setSongTo(playingList[0].songs[playingSongFromPlaylist], false, true, audio.currentTime);
                }
            }, 200);


        }
    });
}

setupDragAndDropRightBar()




function playPlaylist(whichOne, withFullScreen, startForm, playOnStart, startAtTime){
    WhichPlaylistSelected = whichOne;
    console.log('wybrano playlistę:' + WhichPlaylistSelected);
    setSongTo(playingList[WhichPlaylistSelected].songs[startForm], withFullScreen, playOnStart, startAtTime);
    newSelected('playlist');
    playingSongFromPlaylist = startForm;
}

function playSingleSong(whichOne, withFullScreen, playOnStart){
    setSongTo(whichOne, withFullScreen, playOnStart);
    newSelected('song');
    playingSongFromPlaylist = -1;
}


function setSongTo(Song, withFullScreen, playOnStart, startAtTime){
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


//Skip By button on keybord and button in program
navigator.mediaSession.setActionHandler('previoustrack', () => {
    if(playingSongFromPlaylist > 0){
        playingSongFromPlaylist--
        setSongTo(playingList[WhichPlaylistSelected].songs[playingSongFromPlaylist], false, true);
    }
});

navigator.mediaSession.setActionHandler('nexttrack', () => {
    if(playingSongFromPlaylist < playingList[WhichPlaylistSelected].songs.length-1 && playingSongFromPlaylist != -1){
        playingSongFromPlaylist++
        setSongTo(playingList[WhichPlaylistSelected].songs[playingSongFromPlaylist], false, true);
    }
});

skipNext.addEventListener('click', ()=>{
    if(playingSongFromPlaylist < playingList[WhichPlaylistSelected].songs.length-1 && playingSongFromPlaylist != -1){
        playingSongFromPlaylist++
        setSongTo(playingList[WhichPlaylistSelected].songs[playingSongFromPlaylist], false, true);
    }
});

skipPrevious.addEventListener('click', ()=>{
    if(playingSongFromPlaylist > 0){
        playingSongFromPlaylist--
        setSongTo(playingList[WhichPlaylistSelected].songs[playingSongFromPlaylist], false, true);
    }
})

//Animations
skipNext.addEventListener('mouseenter', ()=>{
    if(playingSongFromPlaylist < playingList[WhichPlaylistSelected].songs.length-1 && playingSongFromPlaylist != -1){
        skipNext.style.animation = 'none';
        skipNext.style.animation = 'mauseOn 0.25s forwards';
    }
})

skipNext.addEventListener('mouseleave', ()=>{
    skipNext.style.animation = 'mauseOut 0.25s forwards';   
})


skipPrevious.addEventListener('mouseenter', ()=>{
    if(playingSongFromPlaylist > 0){
        skipPrevious.style.animation = 'none';
        skipPrevious.style.animation = 'mauseOn 0.25s forwards';
    }
})

skipPrevious.addEventListener('mouseleave', ()=>{
    skipPrevious.style.animation = 'mauseOut 0.25s forwards';   
})



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


//If the user is scrolling, stop the song and scroll
TimeLine.addEventListener('input', checkValueChange);
let oldValue = TimeLine.value;
function checkValueChange() {
    if (TimeLine.value != oldValue) {
        oldValue = TimeLine.value;
        audio.pause();
        audio.currentTime = oldValue
    }
};

TimeLine.addEventListener('mouseup', ()=>{
    if(isPlaying){
        audio.play();
    }
});

function updateTimeLine(){
    TimeLine.value = Math.floor(audio.currentTime);
};


//Highlighted elements when hovered over in the home tab
//ToDo: Przenieść do kategorii home (jak będzie)
Array.from(homeAlbumCover).forEach(element => {
    element.addEventListener('mouseover', () => {
        element.style.filter = 'contrast(125%)';
    });
    element.addEventListener('mouseout', () => {
        element.style.filter = '';
    });

});


//keybinds
document.addEventListener('keydown', function(event){
    if(keybinds == true){
        if(event.key == "f" || event.key == "F"){
            if(fullScreen){
                fullScreenOnOff(false)
            }else{
                fullScreenOnOff(true)
            }
        }
        if(event.key == "s" || event.key == "S"){
            if(isPlaying){
                isPlaying = false
                audio.pause();
                stopPlay.src = "allResources/icon/playArrow.svg"
            }else{
                isPlaying = true
                audio.play();
                stopPlay.src = "allResources/icon/pause.svg"
            }
        }
        if(event.key == " "){
            if(isPlaying){
                isPlaying = false
                audio.pause();
                stopPlay.src = "allResources/icon/playArrow.svg"
            }else{
                isPlaying = true
                audio.play();
                stopPlay.src = "allResources/icon/pause.svg"
            }
        }
        if(event.key == "m" || event.key == "M"){
            if(mute){
                volumeBar.value = volume * 100;
                audio.volume = volume;
                mute = false;
            }else{
                volumeBar.value = 0;
                audio.volume = 0;
                mute = true;

            }
        }
    }
})


//disable keyboard shortcuts when you click on this text input
function initializeDisableKeybinds() {
    const elements = document.querySelectorAll('.disable-keybinds');
        
    elements.forEach(element => {
        element.addEventListener('focus', function() {
            keybinds = false;
        });
            
        element.addEventListener('blur', function() {
            keybinds = true;
        });
    });
}


//Adds a playlist or a single song to the rightBar
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


//stops or resumes after clicking on the album
albumCover.addEventListener('click', () => {
    const playPauseInCircle = document.getElementById('play-pause-in-circle');
    playPauseInCircle.style.visibility = 'visible';
    setTimeout(() => {
        playPauseInCircle.style.visibility = 'hidden';
    }, 350);
    // Dodanie i natychmiastowe usunięcie klasy animacji, aby ją zresetować
    playPauseInCircle.style.animation = 'none';
    playPauseInCircle.offsetHeight; // Trigger a reflow
    playPauseInCircle.style.animation = 'shrink-to-zero .35s forwards ease-out';

    if(isPlaying){
        pauseResumeSong("pause");
        playPauseInCircle.src = "allResources/icon/pause.svg";
    }else{
        pauseResumeSong("play");
        playPauseInCircle.src = "allResources/icon/playArrow.svg";
    }
});


//function that returns a promise with audio duration
function getAudioDuration(fileName) {
    return new Promise((resolve, reject) => {
        let temporaryAudio = new Audio('allResources/music/' + fileName);
        temporaryAudio.addEventListener('loadedmetadata', function() {
            let seconds = Math.floor(temporaryAudio.duration % 60);
            let minutes = Math.floor(temporaryAudio.duration / 60);
            if (seconds.toString().length === 1) {
                seconds = '0' + seconds;
            }
            let duration = (minutes + ":" + seconds);
            resolve(duration);
        });
        temporaryAudio.addEventListener('error', () => reject('Wystąpił błąd podczas ładowania audio'));
    });
}
// An asynchronous function that sets a global variable
async function updateAudioDuration(fileName) {
    try {
        return await getAudioDuration(fileName);
    } catch (error) {
        console.error('An error occurred:', error);
        return '';
    }
}


//Dropdown when adding to playlist
let canHideDropDownAddToPlaylist = false;
document.addEventListener('DOMContentLoaded', function () {
    const dropdown = document.getElementById('dropdown-content-playlist');
    let isMouseOverDropdown = false;

    dropdown.addEventListener('mouseover', function () {
        isMouseOverDropdown = true;
    });

    dropdown.addEventListener('mouseout', function () {
        isMouseOverDropdown = false;
    });

    document.addEventListener('click', function (event) {
        if (!isMouseOverDropdown && canHideDropDownAddToPlaylist) {
            canHideDropDownAddToPlaylist = false;
            document.getElementById('dropdown-content-playlist').style.visibility = 'hidden'
        }
    });
});

function refreshDropDownAddToPlaylist() {
    const container = document.getElementById('dropdown-content-playlist');
    AllPlayLists = playingList.filter(playlist => playlist.name).map(playlist => playlist.name);
    while(container.firstChild){
        container.removeChild(container.firstChild);
    }

    for (let i = 0; i < AllPlayLists.length; i++) {
        const paragraph = document.createElement('p');
        paragraph.className = 'playlistToAddTo';
        paragraph.textContent = AllPlayLists[i];
        //PlayListParagraphs[i].innerText = AllPlayLists[i];
        container.appendChild(paragraph);
    }
    setTimeout(() => {
        elements = Array.from(document.getElementsByClassName('playlistToAddTo'));
        elements.forEach(element => {
            element.addEventListener('click', handleClick); // Dodaj nasłuchiwacz zdarzeń 'click'
            setInterval(() => {
                if(playingList[getPlaylistIndexWithName(element.textContent)].songs.includes(playedSongIndex)){
                    element.style.backgroundColor = '#444444'
                }else{
                    element.style.backgroundColor = '#2c2c2c'
                }
            }, 40);
        });
    }, 1);

}


//Add's and deletes songs to playlists fromd dropdown
let elements = Array.from(document.getElementsByClassName('playlistToAddTo'));
function handleClick(event) {
    let playlistSongs = playingList[(getPlaylistIndexWithName(event.target.textContent))].songs
if(playedSongIndex != 0){
    if(!playingList[(getPlaylistIndexWithName(event.target.textContent))].songs.includes(playedSongIndex)){
        playingList[(getPlaylistIndexWithName(event.target.textContent))].songs.push(playedSongIndex);
        console.log('song added to ' + event.target.textContent)
        showSongsInLibraryWith()
        return
    }

    if(playingList[(getPlaylistIndexWithName(event.target.textContent))].songs.includes(playedSongIndex)){
        console.log('song removed from playlist ' + event.target.textContent);
        if(WhichPlaylistSelected > 0 && playlistSongs.includes(playedSongIndex)){
            let currentTimeWhenReload = audio.currentTime
            let wasPlaying = isPlaying
            console.log('refreshed!');
            setTimeout(() => {
                if(WhichPlaylistSelected == getPlaylistIndexWithName(event.target.textContent)){
                    playPlaylist(WhichPlaylistSelected, false, playingSongFromPlaylist, true);
                }else{
                    playPlaylist(WhichPlaylistSelected, false, playingSongFromPlaylist, wasPlaying, currentTimeWhenReload);
                };
            }, 1);
        }
        playingList[(getPlaylistIndexWithName(event.target.textContent))].songs.splice(playlistSongs.indexOf(playedSongIndex), 1);
        showSongsInLibraryWith()
    }
}}


function getPlaylistIndexWithName(playlistName) {
    // Iteracja po wszystkich elementach w playingList
    for (let i = 0; i < playingList.length; i++) {
        // Sprawdzenie, czy obecny element ma nazwę równą playlistName
        if (playingList[i].name === playlistName) {
            return i; // Zwróć indeks, jeśli znajdziesz playlistę
        }
    }
    return -1; // Zwróć -1, jeśli nie znaleziono playlisty o podanej nazwie
}





//! -=-=-=-=- LIBRARY =-=-=-=-





let filterType = '';
let selectedFilter = "All";
const LibrarySongsList = document.getElementById('songs'); 
let AllsongToSelectInLibrary = [];

//Enables drop down filters
function toggleDropdown(which) {
    let dropdownContent = document.getElementById("dropdown-content" + which);
    selectedFilter = which
    if (dropdownContent.style.display === "none" || dropdownContent.style.display === "") {
        setTimeout(() => {
            dropdownContent.style.display = "block";
        }, 1);
    }
}


//hides the dropdown filters if clicked anywhere in the window
let dropdownContentClass = document.getElementsByClassName('dropdown-content');
ArtistSearchBar = false;
PlaylistSearchBar = false;
window.onclick = () => {
    if(!ArtistSearchBar && !PlaylistSearchBar){
        Array.from(dropdownContentClass).forEach(element => {
            if (element.style.display === "block") {
                element.style.display = "none";
            }
        });
    }
}


reloadResults()
//Sets the DropDown fields to the appropriate results
function reloadResults(){
    AllPlayLists = playingList.filter(playlist => playlist.name).map(playlist => playlist.name);
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
    }*/

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
    }

    //ToDO: zrobć to samo po w pozostałych tylko dla zakładki Genres

}

function showImg(paragraph) {
    const img = paragraph.querySelector('img');
    if (img) {
        img.style.visibility = 'visible';
    }
}

function hideImg(paragraph) {
    const img = paragraph.querySelector('img');
    if (img) {
        img.style.visibility = 'hidden';
    }
}


let filteredPlaylists = [];
// Playlist filtering function
function filterPlaylists() {
    const input = document.getElementById('PlaylistSerchBar');
    const filter = input.value.toLowerCase();

    const dropdownContent = document.getElementById('dropdown-content1');
    const paragraphs = dropdownContent.getElementsByClassName('PlayListParagraphs');

    filteredPlaylists = [];

    for (let i = 0; i < paragraphs.length; i++) {
        const txtValue = paragraphs[i].textContent || paragraphs[i].innerText;
        if (txtValue.toLowerCase().indexOf(filter) > -1) {
            paragraphs[i].style.display = "";  // Pokaż element
            filteredArtists.push(txtValue);    // Dodaj do przefiltrowanej listy
        } else {
            paragraphs[i].style.display = "none";  // Ukryj element
        }
    }
}


let filteredArtists = [];
// Artist filter function
function filterArtists() {
    const input = document.getElementById('ArtistSerchBar');
    const filter = input.value.toLowerCase();

    const dropdownContent = document.getElementById('dropdown-content2');
    const paragraphs = dropdownContent.getElementsByClassName('ArtistParagraphs');

    filteredArtists = [];

    for (let i = 1; i < paragraphs.length; i++) {
        const txtValue = paragraphs[i].textContent || paragraphs[i].innerText;
        if (txtValue.toLowerCase().indexOf(filter) > -1) {
            paragraphs[i].style.display = "";  // Pokaż element
            filteredArtists.push(txtValue);    // Dodaj do przefiltrowanej listy
        } else {
            paragraphs[i].style.display = "none";  // Ukryj element
        }
    }
}


//Filters the displayed songs according to the selected filter
const librarybtn = document.getElementsByClassName('librarybtn');
function filterChanged(){
    for(i = 1; i < 4; i++){
        let setto = ['☰ PlayLists', '☰ Artists', '☰ Genres']
        whichbtn = librarybtn[i];
        whichbtn.classList.remove('librarybtnMakeBigger');
        whichbtn.innerText = setto[i-1];

    }
    Array.from(librarybtn).forEach(element=>{
        element.style.backgroundColor = '#2c2c2c'
        if(selectedFilter == 'All'){
            showlibraryRightBar(false)
            whichbtnfunction(0);
        }

        if(selectedFilter == 1){
            whichbtnfunction(1);
        }
        if(AllPlayLists.includes(selectedFilter)){
            showlibraryRightBar(true)
            whichbtnfunction(1);
            SetNameTo(1, selectedFilter)
        }

        if(selectedFilter == 2){
            whichbtnfunction(2);
        }
        if(AllArtists.includes(selectedFilter)){
            showlibraryRightBar(false) //TODO: Dodać potem aby pokazywało i jako obrazek zdjęcie artysty bądź ikona kapeli a jako opis początek wiki na ich temet bądź ich konta opis
            whichbtnfunction(2);
            SetNameTo(2, selectedFilter)
        }

        if(selectedFilter == 3){
            whichbtnfunction(3);
        }
        if(AllGenres.includes(selectedFilter)){
            showlibraryRightBar(false) //TODO: Dodać potem bazę danych z gatunkami i obrazek z bazy danych tak samo opis (ale z wiki)
            whichbtnfunction(3);
            SetNameTo(3, selectedFilter)
        }

        if(selectedFilter == 'Offline'){
            showlibraryRightBar(false)
            whichbtnfunction(4);
        }

        if(selectedFilter == 'Rate'){
            showlibraryRightBar(false) //ToDO: tu też można potem pokazać np czy chcesz dodać tą piosenkę czy nie. Albo za ile wybrana piosenka się usunie
            whichbtnfunction(5);
        }
    })
    showSongsInLibraryWith();
    changelibraryRightBar();
}


//Sets the button with the selected filter to a lighter color
function whichbtnfunction(which){
    whichbtn = librarybtn[which];
    whichbtn.style.backgroundColor = '#444444';
}

//Sets the selected filter button to the appropriate text
function SetNameTo(which, What){
    whichbtn = librarybtn[which];
    whichbtn.innerText = What;
    whichbtn.classList.add('librarybtnMakeBigger')
}


function makeSongsDragable(){
    let songToSelectInLibrary = document.getElementsByClassName('songToSelectInLibrary');
    Array.from(songToSelectInLibrary).forEach(element => {
        if(SplitFullScreenLibrary == 'Full' && filterType == 'PlayLists'){
            element.draggable = true;
        }else{
            element.draggable = false;
        }
    });
}




// Funkcja do inicjalizacji funkcji drag-and-drop
function setupDragAndDropInPlaylistFilter() {
    let draggedElement = null;
    const songContainer = document.getElementById('songs');
    let initialY = 0;
    songContainer.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('songToSelectInLibrary')) {
            draggedElement = e.target;
            draggedElement.classList.add('dragging');
            draggedElement.style.zIndex = '1000'; // Ustaw z-index na wysoki, aby był nad innymi elementami
            initialY = e.clientY;
        }
    });

    songContainer.addEventListener('dragend', () => {
        if (draggedElement) {
            draggedElement.classList.remove('dragging');
            draggedElement.style.zIndex = ''; // Przywróć z-index do domyślnego
            draggedElement = null;
        }
    });

    songContainer.addEventListener('dragover', (e) => {
        e.preventDefault(); // Ważne, aby umożliwić upuszczanie
        if (e.target.classList.contains('songToSelectInLibrary')) {
            e.target.classList.add('drag-over');
        }
    });

    songContainer.addEventListener('dragleave', (e) => {
        e.target.classList.remove('drag-over');
    });

    songContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        if (e.target.classList.contains('songToSelectInLibrary') && e.target !== draggedElement) {
            e.target.classList.remove('drag-over');
            const targetElement = e.target;
            //const parent = targetElement.parentNode;
            const rect = targetElement.getBoundingClientRect();
            songContainer.insertBefore(draggedElement, targetElement)
            if (e.clientY < initialY) {
                songContainer.insertBefore(draggedElement, targetElement)
            } else {
                songContainer.insertBefore(targetElement, draggedElement)
            }

            updateSongOrder();

        }
    });
}
setupDragAndDropInPlaylistFilter()


function updateSongOrder() {
    saveArray = playingList[getPlaylistIndexWithName(selectedFilter)].songs
    playingList[getPlaylistIndexWithName(selectedFilter)].songs = []
    const container = document.getElementById('songs');
    for (let i = 0; i < saveArray.length; i++){
        playingList[getPlaylistIndexWithName(selectedFilter)].songs.push(Number(container.children[i].id));
    }
    showSongsInLibraryWith()
}


//Shows Songs in the library that match the selected filter
async function showSongsInLibraryWith(){
    deleteAllSongsFormLibrary()
    AllsongToSelectInLibrary = document.getElementsByClassName('songToSelectInLibrary');
    if(selectedFilter == 'All'){
        for(i = 1; i < AllSongs.length; i++){
            const newDiv = document.createElement('div');
            newDiv.classList = 'songToSelectInLibrary';
            newDiv.id = i;
            newDiv.onclick = () => {
                setupPlaylistZero('all', 'all')
                playPlaylist(0, true, newDiv.id -1, true);
            };
            let duration = await updateAudioDuration(AllSongs[i].audio);
            newDiv.innerHTML = `<div style="display: flex;"><img src="${'allResources/albumCover/' + AllSongs[i].icon}" style="height: 55px; padding-left: 10px; padding-right: 10px;" draggable="false"><div style="display: flex; flex-direction: column;"><p class="rightBarSongName" draggable="false">${AllSongs[i].name}</p> <p class="rightBarArtistName" draggable="false">${AllSongs[i].artist}</p></div></div><p class="songTime" draggable="false">${duration}</p>`;
            LibrarySongsList.appendChild(newDiv);
            if(SplitFullScreenLibrary == 'Full'){
                newDiv.style.width = '100%'
            }
        }
    }
    if(filterType == 'Artists' && selectedFilter != 'All'){
        for(i = 1; i < findArtistIndexes(selectedFilter).length+1; i++){
            const newDiv = document.createElement('div');
            newDiv.classList = 'songToSelectInLibrary';
            newDiv.id = i;
            newDiv.onclick = () => {
                console.log(filterType + ': ' + selectedFilter);
                setupPlaylistZero(filterType)
                playPlaylist(0, true, newDiv.id-1, true)
            };
            let duration = await updateAudioDuration(AllSongs[findArtistIndexes(selectedFilter)[i-1]].audio);
            newDiv.innerHTML = `<div style="display: flex;"><img src="${'allResources/albumCover/' + AllSongs[findArtistIndexes(selectedFilter)[i-1]].icon}" style="height: 55px; padding-left: 10px; padding-right: 10px;"><div style="display: flex; flex-direction: column;"><p class="rightBarSongName">${AllSongs[findArtistIndexes(selectedFilter)[i-1]].name}</p> <p class="rightBarArtistName">${AllSongs[findArtistIndexes(selectedFilter)[i-1]].artist}</p></div></div><p class="songTime">${duration}</p>`;
            LibrarySongsList.appendChild(newDiv);
            if(SplitFullScreenLibrary == 'Full'){
                newDiv.style.width = '100%'
            }
        }
    }
    if(filterType == 'PlayLists' && selectedFilter != 'All'){
        for(i = 1; i < findPlaylistIndexes(selectedFilter).length+1; i++){
            const newDiv = document.createElement('div');
            newDiv.classList = 'songToSelectInLibrary ' + i;
            newDiv.id = playingList[getPlaylistIndexWithName(selectedFilter)].songs[i-1];
            newDiv.onclick = () => {
                playPlaylist(getPlaylistIndexWithName(selectedFilter), true, newDiv.classList[1]-1, true)
                console.log(filterType + ': ' + selectedFilter);
            };
            let duration = await updateAudioDuration(AllSongs[findPlaylistIndexes(selectedFilter)[i-1]].audio);
            newDiv.innerHTML = `<div style="display: flex;"><img src="${'allResources/albumCover/' + AllSongs[findPlaylistIndexes(selectedFilter)[i-1]].icon}" style="height: 55px; padding-left: 10px; padding-right: 10px;"><div style="display: flex; flex-direction: column;"><p class="rightBarSongName">${AllSongs[findPlaylistIndexes(selectedFilter)[i-1]].name}</p> <p class="rightBarArtistName">${AllSongs[findPlaylistIndexes(selectedFilter)[i-1]].artist}</p></div></div><p class="songTime">${duration}</p>`;
            LibrarySongsList.appendChild(newDiv);
            if(SplitFullScreenLibrary == 'Full'){
                newDiv.style.width = '100%'
            }
        }
    }
}


function findArtistIndexes(artistName) {
    // Przefiltrować wszystkie elementy, gdzie artysta to `artistName`
    return AllSongs
        .map((song, index) => song.artist === artistName ? index : -1) // Mapowanie na indeksy
        .filter(index => index !== -1); // Usunięcie -1, które oznacza brak dopasowania
}


function findPlaylistIndexes(playlistName) {
    for (let item of playingList) {
        if (typeof item === 'object' && item.name === playlistName) {
            return item.songs;
        }
    }
    return 'Playlist not found';
}


function deleteAllSongsFormLibrary(){
    Array.from(AllsongToSelectInLibrary).forEach(element=>{
        element.remove();
    })
}


//Changes the arrangement of songs into two or one row
let SplitFullScreenLibrary = 'Split'
function ChangeFullSplit(){
    const Container = document.getElementById('songs');
    const SplitFullScreenLibraryImg = document.getElementById('split-full-screen-Library');
    const songToSelectInLibrary = document.getElementsByClassName('songToSelectInLibrary');
    if(SplitFullScreenLibrary == 'Split'){
        SplitFullScreenLibrary = 'Full';
        SplitFullScreenLibraryImg.src = 'allResources/icon/splitscreenLibrary.svg'
        Array.from(songToSelectInLibrary).forEach(element=>{
            element.style.width = '100%'
            element.style.borderRight = '0px'
        })
        Container.style.display = 'block'
    }else{
        SplitFullScreenLibrary = 'Split';
        SplitFullScreenLibraryImg.src = 'allResources/icon/FullScreenLibrary.svg'
        Array.from(songToSelectInLibrary).forEach(element=>{
            element.style.width = '50%'
            element.style.borderRight = 'solid 1px #2c2c2c';
        })
        Container.style.flexWrap = 'wrap';
        Container.style.display = 'flex'
    }
}


//The add song button, when clicked, opens the folder
const addSongBtn = document.getElementById('add-song');
addSongBtn.addEventListener('click',()=>{
    document.getElementById('fileInput').click();
})


function setupPlaylistZero(filter){
    if(filter == 'all'){
        playingList[0].songs = []
        for(i = 1; i < AllSongs.length; i++){
            playingList[0].songs.push(i);
        }
    };
    /*if(filter == 'PlayLists'){
        playingList[0].songs = []
        playingList[0].songs = findPlaylistIndexes(selectedFilter);
    };*/
    if(filter == 'Artists'){
        playingList[0].songs = []
        playingList[0].songs = findArtistIndexes(selectedFilter);
    };
    if(filter == 'localSongsOrderChanged'){
        playingList[0].songs = []
        const songToSelect = document.getElementsByClassName('songToSelect');
        Array.from(songToSelect).forEach(element=>{
            playingList[0].songs.push(element.classList[1]);
        })
    }
}

isMouseOnWindow = false;
//Show/hide popup
showPopupCreatePlaylist(false);
let createPlayListMenuVisible;
function showPopupCreatePlaylist(visible) {
    const popup = document.getElementById('popup');
    const window = document.getElementById('create-playlist-menu')
    popup.style.animation = 'none'; // Wyłączamy animację na początku
    window.style.animation = 'none'; // Wyłączamy animację na początku

    if (visible) {
        window.style.visibility = 'visible';
        createPlayListMenuVisible = true;
        animateText()
        popup.style.animation = 'show .4s forwards'; // Włączamy animację
        popup.style.visibility = 'visible';
        window.style.animation = 'fullscreenOn-AlbumCover .4s forwards'; // Włączamy animację
    } else {
        setTimeout(() => {
            popup.style.visibility = 'hidden';
            window.style.visibility = 'hidden';
        }, 400);
        window.style.animation = 'fullscreenOff-AlbumCover .4s forwards'; // Włączamy animację
        popup.style.animation = 'hide .4s forwards'; // Włączamy animację
    }
}
let editePlaylist;
showPopupEditPlaylist(false);
function showPopupEditPlaylist(visible, whichToEdit) {

    const popup = document.getElementById('popup');
    const window = document.getElementById('edit-playlist')
    popup.style.animation = 'none'; // Wyłączamy animację na początku
    window.style.animation = 'none'; // Wyłączamy animację na początku
    editePlaylist = whichToEdit; 
    if (visible) {
        setTimeout(() => {
            textChangedInEditPlaylist()
        }, 1);
        const playListNameInEditplaylist = document.getElementById('play-list-name-in-editplaylist');
        const editPlaylistImage = document.getElementById('edit-playlist-image');
        const playListDescriptionInEditplaylist = document.getElementById('play-list-description-in-editplaylist');
        const publicPrivateOption = document.getElementById('publicPrivateOption');
        playListNameInEditplaylist.value = whichToEdit;
        editPlaylistImage.src = 'allResources/albumCover/' + playingList[getPlaylistIndexWithName(editePlaylist)].icon;
        playListDescriptionInEditplaylist.value = playingList[getPlaylistIndexWithName(editePlaylist)].description;
        publicPrivateOption.value = playingList[getPlaylistIndexWithName(editePlaylist)].type;
        window.style.visibility = 'visible';
        popup.style.animation = 'show .4s forwards'; // Włączamy animację
        popup.style.visibility = 'visible';
        window.style.animation = 'fullscreenOn-AlbumCover .4s forwards'; // Włączamy animację
    } else {
        setTimeout(() => {
            popup.style.visibility = 'hidden';
            window.style.visibility = 'hidden';
        }, 400);
        window.style.animation = 'fullscreenOff-AlbumCover .4s forwards'; // Włączamy animację
        popup.style.animation = 'hide .4s forwards'; // Włączamy animację
    }
}


//ToDo: Naprawić animację
function animateText(){
    let text = document.getElementsByClassName('song-name-scroll');
    Array.from(text).forEach(element =>{
        const containerWidth = element.parentElement.offsetWidth;
        const textWidth = element.offsetWidth;

            animateText()
            function animateText() {
                setTimeout(() => {
                    element.style.transform = `translateX(-${textWidth-containerWidth}px)`;
                }, 5000);
                setTimeout(() => {
                    element.style.transform = `translateX(${0}px)`;
                }, 10000);
                if(createPlayListMenuVisible){
                    setTimeout(() => {
                        animateText();
                    }, 15000);
                }
            }
    })
}


let playlistnameinput = document.getElementById('play-list-name-input');
function createPlaylist(){
    let playlistdescriptioninput = document.getElementById('play-list-description-input');
    let publicPrivateOption = document.getElementById('public-private-create');
    if(playlistnameinput.value != ""){
        showPopupCreatePlaylist(false);
        createPlayListMenuVisible = false;
        playingList.push({name: playlistnameinput.value, description: playlistdescriptioninput.value = "" ? "-" : playlistdescriptioninput.value, icon: '-', songs: [], type: publicPrivateOption.value})
    }
}
function DisableButtonIfNeedTo(){
    let createPlaylistButton = document.getElementById('create-playlist');
    // Używamy trim(), aby usunąć białe znaki z początku i końca
    let trimmedValue = playlistnameinput.value.trim();
    
    if(trimmedValue === "" || playingList.some(playlist => playlist.name === trimmedValue || trimmedValue === "-" || trimmedValue.length > 32)){
        createPlaylistButton.disabled = true;
    } else {
        createPlaylistButton.disabled = false;
    }
}


//resize text based on the width of the entered text
function textChangedInEditPlaylist() {
    // Pobranie elementów
    const textinput = document.getElementById('play-list-name-in-editplaylist');
    const hiddenSpan = document.getElementById('hidden-span');

    // Ustawienie tekstu w ukrytym elemencie span
    hiddenSpan.textContent = textinput.value;

    // Pobranie szerokości tekstu z ukrytego span
    const textWidth = hiddenSpan.offsetWidth;

    // Ustalamy maksymalną szerokość
    const maxWidth = 700; // Maksymalna szerokość w px
    const minWidth = 100; // Minimalna szerokość w px (opcjonalne, dla lepszego wyglądu)

    // Ustawienie szerokości inputa na szerokość tekstu, ale nie przekraczając maxWidth
    textinput.style.width = `${Math.min(textWidth , maxWidth)}px`;

    // Opcjonalnie: Ustawienie minimalnej szerokości
    textinput.style.minWidth = `${minWidth}px`;
}


// Delete button animation
document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('deleteButton');
    const progressBar = document.querySelector('.progress-bar');
    let timer;
    const holdTime = 2000; // Czas trzymania w ms (2 sekundy)
  
    button.addEventListener('mousedown', () => {
      button.classList.remove('reset'); // Upewnij się, że nie jest w stanie resetowania
      progressBar.style.transition = 'transform 2s ease-out'; // Przywróć animację
      timer = setTimeout(() => {
        button.classList.add('active');
            playingList.splice(getPlaylistIndexWithName(editePlaylist), 1);
            showPopupEditPlaylist(false);
            selectedFilter = 'All';
            reloadResults();
            filterChanged();
      }, holdTime);
      progressBar.style.transform = 'scaleX(1)';
    });
  
    button.addEventListener('mouseup', () => {
      clearTimeout(timer);
      button.classList.add('reset'); // Dodaj klasę resetowania
      progressBar.style.transform = 'scaleX(0)';
    });
  
    button.addEventListener('mouseleave', () => {
      clearTimeout(timer);
      button.classList.add('reset'); // Dodaj klasę resetowania
      progressBar.style.transform = 'scaleX(0)';
    });
  });
  

function saveChangesForEditPlaylist(){
    let textinput = document.getElementById('play-list-name-in-editplaylist');
    let descriptioninput = document.getElementById('play-list-description-in-editplaylist');
    let publicPrivateOption = document.getElementById('publicPrivateOption');
    playingList[getPlaylistIndexWithName(editePlaylist)].description = descriptioninput.value
    playingList[getPlaylistIndexWithName(editePlaylist)].type = publicPrivateOption.value
    playingList[getPlaylistIndexWithName(editePlaylist)].name = textinput.value
    showPopupEditPlaylist(false);
    selectedFilter = textinput.value;
    reloadResults();
    filterChanged();
}

function saveButtonAnimation(){
    const textinput = document.getElementById('play-list-name-in-editplaylist');
    const saveButton = document.getElementById('save-button');
    
    // Użyj trim(), aby usunąć spacje z początku i końca ciągu znaków
    if (textinput.value.trim().length === 0) {
        saveButton.style.pointerEvents = 'none';
        saveButton.style.opacity = '0.5';
    } else {
        saveButton.style.pointerEvents = 'auto';
        saveButton.style.opacity = '1';
    }
}




document.getElementById('edit-playlist-image').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

//sets the playlist image to the one uploaded from files
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('edit-playlist-image').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});



function changelibraryRightBar(){
    if(filterType == 'PlayLists'){
        let img = document.getElementById('playlists-info-img');
        let imgBg = document.getElementById('playlists-info-img-blur');
        let title  = document.getElementById('rigth-bar-library-title');
        let description = document.getElementById('rigth-bar-library-description');
        img.src = `allResources/albumCover/${ playingList[getPlaylistIndexWithName(selectedFilter)].icon}`;
        imgBg.src = `allResources/albumCover/${ playingList[getPlaylistIndexWithName(selectedFilter)].icon}`;
        title.innerText = playingList[getPlaylistIndexWithName(selectedFilter)].name;
        description.innerText = playingList[getPlaylistIndexWithName(selectedFilter)].description;
    }
};

showlibraryRightBar(false)
function showlibraryRightBar(show){
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


//!Bug: jak wybierzesz playlistę i potem klikniesz aby znów wybierało playlistę i klikniesz posenkę to występuje bład!

//* To Do:
//naprawić że jak piszesz w text box to nie działają skruty klawiszowe
// Dodać włączanie i wyłączanie create playlist menu
// Naprawić playlisty
// Skończyć menu Create play list
// Dodać możliwość tworzenia playlist
// Zrobić aby przycisk dodaj do playlisty działał
// Naprawić aby drop down filtrów aby pokazywał twoje rzeczywiste wyniki i dodać do niektórych serchbar
// dodać rightbar przy bibliotece z nazwą i obrazkiem wybranego filtra
//ToDo: naprawić błąd z możliowącią kożystania z sktótów kiedy piszesz w input text
//ToDo: naprawić nazwy piosenek na hone aby jak jest za długa to nie przepychała innych piosenek i naprawić też przesuwanie się piosenek w CreatePlaylist kiedy spamisz włączy i czyłącz to dziwnie się zachowują nazwy piosenek
//ToDO: przekonwertoawć projekt na .exe i zrobić dodawanie piosenek do programu i gui kiedy je dodajesz z opcjami
//ToDo: Zrobić aby home działało tak jak ma działać
//ToDO: Dodać gatunki dla piosenek i żeby filtrowały się wedłud nich w bibliotece (api musicbrainz) 
//ToDo: Zaimplemętować Google drive apli i logowanie (parę dni)
//ToDo: Zrobić aby serchbar na górze działał
//ToDo: Małe Poprawki (parę dni) min. naprawić lokalne dragAndDrop (funkcja o nazwie setupDragAndDropRightBar() dokładniej to koniec tej funkcji)

//* To Do For mobile:
//Todo: Tą listę rzeczy do zrobienia  :> (pewnie react native)
