let tab = 'Home';
let thisSongRating = 4.9;
let isPlaying = false;
let fullScreen = false;
let volume = 0.5;
let mute = false;
let audio;
let songPlayed = -1;
let songToSelect;
let AllPlayLists = ['PlayList1', 'PlayList2', 'PlayList3', 'PlayList4']
let AllArtists = ['Tame Impala', 'Pink Floyd', 'Led Zeppelin', 'Daft Punk',]
let AllGenres = ['Rock (Psychedelic)', 'Rock (Clasic)', 'Rock (Hard)', 'Indie']
let AllSongs = [{name: 'Welcome to SoundSpace', audio: 'WelcomeToSoundSpaceEcho.wav', artist: 'SoundSpace', album: '-', icon: 'NewUser.svg'},
                {name: 'Inside Out', audio: 'song.opus', artist: 'Pink Floyd', album: 'Devision Bell', icon: 'DivisionBell.webp'},
                {name: 'The Serpentine', audio: 'TheSerpentine.opus', artist: 'Tame Impala', album: '-', icon: 'Lonerism.jpg'},
                {name: 'COCOLINI', audio: 'COCOLINI - TEENZ.opus', artist: 'TEENZ', album: '-', icon: 'unnamed.jpg'}];

let playingSongFromPlaylist = -1;
let WhichPlaylistSelected = 0;
let playingList = [[1, 2, 3], [2,1,1,2,2,3]];


                audio = new Audio('allResources/audio/WelcomeToSoundSpaceEcho.wav')
                if ('mediaSession' in navigator) {
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: 'Witaj w soundSpace!',
                        artist: 'SounsSpace',
                        album: 'Witamy!',
                        artwork: [
                            { src: 'allResources/img/1.jpg', sizes: '512x512', type: 'image/svg' }
                        ]
                    });
                }

                setTimeout(() => {
                    playSingleSong(0, false, false);
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
    updateTimeBar();
    volumeBarUpdate();
    PlayAnotherSongIfPosibleUpdate();
    highlightTheSongOnRightBar();
    updateTimeLine();
}, 10);


function updateTimeBar(){
    let secondsCurrentTime = Math.floor(audio.currentTime) % 60
    let secondsDuration = Math.floor(audio.duration) % 60
    let minutsCurrentTime = audio.currentTime.toFixed(2) / 60
    let minutsDuration = audio.duration.toFixed(2) / 60
    songTimeElement.innerText = `${Math.floor(minutsCurrentTime) < 1 ? '0' : Math.floor(minutsCurrentTime)}:${secondsCurrentTime < 10 ? "0"+secondsCurrentTime : secondsCurrentTime} / ${Math.floor(minutsDuration)}:${secondsDuration < 10 ? "0"+secondsDuration : secondsDuration}`;
};


function setTab(to){
    tab = to
    const homeContent = document.getElementById('home-content');
    const libraryContent = document.getElementById('library-content');
    if(to == 'Home'){
        buttonHome.style.backgroundColor = "#161616"
        iconHome.src = "allResources/icon/home-filld.svg"
        homeContent.style.visibility = 'visible'
        fullScreenOnOff(false);
        deleteAllSongsFormLibrary()
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
    tabTitle.innerText = tab + ":"
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
            if(playingSongFromPlaylist > playingList[WhichPlaylistSelected].length){
                playingSongFromPlaylist = -1
            }else{
                playingSongFromPlaylist++
                setSongTo(playingList[WhichPlaylistSelected][playingSongFromPlaylist], false, WhichPlaylistSelected);
            }
        }
    }
}


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
    newDiv.classList = 'songToSelect';
    newDiv.id = id;
    newDiv.innerHTML = `<div style="display: flex;"><img src="${icon}" style="height: 55px; padding-left: 10px; padding-right: 10px;"><div style="display: flex; flex-direction: column;"><p class="rightBarSongName">${name}</p> <p class="rightBarArtistName">${artist}</p></div></div><p class="songTime">${time}</p>`;
    RightBar.appendChild(newDiv);
    songToSelect = document.getElementsByClassName('songToSelect');
    if (fullScreen && playingSongFromPlaylist != -1) {
        // Dodajemy nasłuchiwacz bezpośrednio do nowo stworzonego elementu
        newDiv.addEventListener('click', () => {
            setSongTo(playingList[WhichPlaylistSelected][newDiv.id], true, WhichPlaylistSelected);
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



function playPlaylist(whichOne, withFullScreen, startForm, playOnStart){
    WhichPlaylistSelected = whichOne;
    setSongTo(playingList[WhichPlaylistSelected][startForm], withFullScreen, playOnStart);
    newSelected('playlist');
    playingSongFromPlaylist = startForm;
}

function playSingleSong(whichOne, withFullScreen, playOnStart){
    setSongTo(whichOne, withFullScreen, playOnStart);
    newSelected('song');
    playingSongFromPlaylist = -1;
}


function setSongTo(Song, withFullScreen, playOnStart){
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

    albumImage.src = 'allResources/img/' + AllSongs[Song].icon;
    songName.innerText = AllSongs[Song].name;
    albumImageFull.src = 'allResources/img/'+AllSongs[Song].icon;
    albumBlurFull.src = 'allResources/img/'+AllSongs[Song].icon;
    artistAndAlbumName.innerText = AllSongs[Song].album == '-' ? AllSongs[Song].artist : AllSongs[Song].artist + " ∙ " + AllSongs[Song].album;

    audio = new Audio('allResources/audio/'+ AllSongs[Song].audio)

    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: AllSongs[Song].name,
            artist: AllSongs[Song].artist,
            album: AllSongs[Song].album,
            artwork: [
                { src: 'allResources/img/' + AllSongs[Song].icon, sizes: '512x512', type: 'image/jpg' }
            ]
        });
    }

    setTimeout(() => {
        TimeLine.max = Math.floor(audio.duration);
    }, 10);
    

    if(playOnStart){
        audio.play();
        isPlaying = true
    }else{
        
    }
    stopPlay.src = "allResources/icon/pause.svg"
    if(withFullScreen){
        fullScreenOnOff(true)
    }
}


//Skip By button on keybord and button in program
navigator.mediaSession.setActionHandler('previoustrack', () => {
    if(playingSongFromPlaylist > 0){
        playingSongFromPlaylist--
        setSongTo(playingList[WhichPlaylistSelected][playingSongFromPlaylist], false);
    }
});

navigator.mediaSession.setActionHandler('nexttrack', () => {
    if(playingSongFromPlaylist < playingList[WhichPlaylistSelected].length-1 && playingSongFromPlaylist != -1){
        playingSongFromPlaylist++
        setSongTo(playingList[WhichPlaylistSelected][playingSongFromPlaylist], false);
    }
});

skipNext.addEventListener('click', ()=>{
    if(playingSongFromPlaylist < playingList[WhichPlaylistSelected].length-1 && playingSongFromPlaylist != -1){
        playingSongFromPlaylist++
        setSongTo(playingList[WhichPlaylistSelected][playingSongFromPlaylist], false);
    }
});

skipPrevious.addEventListener('click', ()=>{
    if(playingSongFromPlaylist > 0){
        playingSongFromPlaylist--
        setSongTo(playingList[WhichPlaylistSelected][playingSongFromPlaylist], false);
    }
})

//Animations
skipNext.addEventListener('mouseenter', ()=>{
    if(playingSongFromPlaylist < playingList[WhichPlaylistSelected].length-1 && playingSongFromPlaylist != -1){
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


TimeLine.addEventListener('input', checkValueChange);
let oldValue = TimeLine.value; // Inicjalizuj z początkową wartością
function checkValueChange() {
    if (TimeLine.value != oldValue) {
        oldValue = TimeLine.value; // Zaktualizuj oldValue
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
})


//Adds a playlist or a single song to the rightBar
async function newSelected(PlaylisySong) {
    if (PlaylisySong == 'playlist') {
        deleteAllSongsFromRightBar();
        playingSongFromPlaylist = 0;
        for (let i = 0; i < playingList[WhichPlaylistSelected].length; i++) {
            const song = AllSongs[playingList[WhichPlaylistSelected][i]];
            const duration = await updateAudioDuration(song.audio);
            setRightBarSong(i, 'allResources/img/' + song.icon, song.name, song.artist, duration);
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
            setRightBarSong(0, 'allResources/img/' + song.icon, song.name, song.artist, duration);
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
        let temporaryAudio = new Audio('allResources/audio/' + fileName);
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
        console.error('Wystąpił błąd:', error);
        return '';
    }
}




// -=-=-=-=- LIBRARY =-=-=-=-


let selectedFilter = "All";
const LibrarySongsList = document.getElementById('songs'); 
let AllsongToSelectInLibrary = [];

//Enables drop down
function toggleDropdown(which) {
    let dropdownContent = document.getElementById("dropdown-content" + which);
    selectedFilter = which
    if (dropdownContent.style.display === "none" || dropdownContent.style.display === "") {
        setTimeout(() => {
            dropdownContent.style.display = "block";
        }, 1);
    }
}


//hides the dropdown if clicked anywhere in the window
let dropdownContentClass = document.getElementsByClassName('dropdown-content');
window.onclick = () => {
    Array.from(dropdownContentClass).forEach(element => {
        if (element.style.display === "block") {  // Użyj '===' do porównania
            element.style.display = "none";
        }
    });
}


//Sets the DropDown fields to the appropriate results
const PlayListParagraphs = document.getElementsByClassName('PlayListParagraphs');
const ArtistParagraphs = document.getElementsByClassName('ArtistParagraphs');
const GenreParagraphs = document.getElementsByClassName('GenreParagraphs');
for(i = 0; i<4; i++){
    PlayListParagraphs[i].innerText = AllPlayLists[i];
}
for(i = 0; i<4; i++){
    ArtistParagraphs[i].innerText = AllArtists[i];
}
for(i = 0; i<4; i++){
    GenreParagraphs[i].innerText = AllGenres[i];
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
            whichbtnfunction(0);
        }

        if(selectedFilter == 1){
            whichbtnfunction(1);
        }
        if(AllPlayLists.includes(selectedFilter)){
            whichbtnfunction(1);
            SetNameTo(1, selectedFilter)
        }

        if(selectedFilter == 2){
            whichbtnfunction(2);
        }
        if(AllArtists.includes(selectedFilter)){
            whichbtnfunction(2);
            SetNameTo(2, selectedFilter)
        }

        if(selectedFilter == 3){
            whichbtnfunction(3);
        }
        if(AllGenres.includes(selectedFilter)){
            whichbtnfunction(3);
            SetNameTo(3, selectedFilter)
        }

        if(selectedFilter == 'Offline'){
            whichbtnfunction(4);
        }

        if(selectedFilter == 'Rate'){
            whichbtnfunction(5);
        }
    })
    showSongsInLibraryWith()
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
                setSongTo(newDiv.id, true);
                newSelected('playList')
                playingSongFromPlaylist = newDiv.id -1;
            };
            let duration = await updateAudioDuration(AllSongs[i].audio);
            newDiv.innerHTML = `<div style="display: flex;"><img src="${'allResources/img/' + AllSongs[i].icon}" style="height: 55px; padding-left: 10px; padding-right: 10px;"><div style="display: flex; flex-direction: column;"><p class="rightBarSongName">${AllSongs[i].name}</p> <p class="rightBarArtistName">${AllSongs[i].artist}</p></div></div><p class="songTime">${duration}</p>`;
            LibrarySongsList.appendChild(newDiv);
            if(SplitFullScreenLibrary == 'Full'){
                newDiv.style.width = '100%'
            }
        }
    }
    if(AllSongs.some(song => song.artist === selectedFilter)){
        for(i = 1; i < findArtistIndexes(selectedFilter).length+1; i++){
            const newDiv = document.createElement('div');
            newDiv.classList = 'songToSelectInLibrary';
            newDiv.id = findArtistIndexes(selectedFilter);
            newDiv.onclick = () => {
                setSongTo(newDiv.id, true);
                newSelected('song')
                playingSongFromPlaylist = -1;
            };
            let duration = await updateAudioDuration(AllSongs[findArtistIndexes(selectedFilter)].audio);
            newDiv.innerHTML = `<div style="display: flex;"><img src="${'allResources/img/' + AllSongs[findArtistIndexes(selectedFilter)].icon}" style="height: 55px; padding-left: 10px; padding-right: 10px;"><div style="display: flex; flex-direction: column;"><p class="rightBarSongName">${AllSongs[findArtistIndexes(selectedFilter)].name}</p> <p class="rightBarArtistName">${AllSongs[findArtistIndexes(selectedFilter)].artist}</p></div></div><p class="songTime">${duration}</p>`;
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