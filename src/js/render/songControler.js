import { playSong, pauseSong, setTime, setVolume, setSong, playedPlaylistTrack, playingPlaylist } from '../modules/soundSystem.js';

const stopPlay = document.getElementById('play-stop');
let isPlaying = false;
export function pauseResumeSong(pauseResume){
    if(pauseResume === 'pause'){
        isPlaying = false
        pauseSong()
        stopPlay.src = "./allResources/icon/playArrow.svg"
    }else{
        isPlaying = true
        playSong()
        stopPlay.src = "./allResources/icon/pause.svg"
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





const TimeLine = document.getElementById('time-line');

TimeLine.addEventListener('input', checkValueChange);
let oldValue = TimeLine.value;
function checkValueChange() {
    if (TimeLine.value != oldValue) {
        oldValue = TimeLine.value;
        pauseSong()
        setTime(TimeLine.value);
    }
};


TimeLine.addEventListener('mouseup', ()=>{
    if(isPlaying){
        playSong()
    }
});



let volume = 0.5
let mute = false;

const volumeBar = document.getElementById('volume-bar');
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
        setVolume(volume);
        mute = false;
        volumeBarUpdate()
    }else{
        volumeBar.value = 0;
        setVolume(0);
        mute = true;
        volumeBarUpdate()
    }
})
volumeBar.addEventListener('input', function(event){
    volume = Number(event.target.value /100);
    setVolume(volume);
    volumeBarUpdate()
});



function volumeBarUpdate(){
    if(mute && volumeBar.value != 0){
        volumeBar.value = volume * 100;
        setVolume(volume);
        mute = false
    }
    if(!mute){
        setVolume(volume);
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
        setVolume(0);
    }
};



window.api.onPreviousTrack(() => {

        if(playedPlaylistTrack > 0){
            setSong(playingPlaylist[playedPlaylistTrack-1]);
            setTimeout(() => {
                setTime(0);
                pauseResumeSong('resume');
            }, 100);
        }
        
});
  

window.api.onNextTrack(() => {

        if(playedPlaylistTrack != playingPlaylist.length -1){
            setSong(playingPlaylist[playedPlaylistTrack+1]);
            setTimeout(() => {
                setTime(0);
                pauseResumeSong('resume');
            }, 100);
        }

});

  
window.api.onStopPlayTrack(() => {
    if(isPlaying){
        pauseResumeSong('pause');
    }else{
        pauseResumeSong('resume');
    }
});




const skipNext = document.getElementById('skipNext');
const skipPrevious = document.getElementById('skipPrevious');

skipNext.addEventListener('click', ()=>{
    if(playedPlaylistTrack != playingPlaylist.length -1){
        setSong(playingPlaylist[playedPlaylistTrack+1]);
        setTimeout(() => {
            setTime(0);
            pauseResumeSong('resume');
        }, 100);
    }
});


skipPrevious.addEventListener('click', ()=>{
    if(playedPlaylistTrack > 0){
        setSong(playingPlaylist[playedPlaylistTrack-1]);
        setTimeout(() => {
            setTime(0);
            pauseResumeSong('resume');
        }, 100);
    }
})




//Animations
skipNext.addEventListener('mouseenter', ()=>{
    if(playingPlaylist < playingPlaylist.length -1){
        skipNext.style.animation = 'none';
        skipNext.style.animation = 'mauseOn 0.25s forwards';
    }
})

skipNext.addEventListener('mouseleave', ()=>{
    skipNext.style.animation = 'mauseOut 0.25s forwards';   
})


skipPrevious.addEventListener('mouseenter', ()=>{
    if(playingPlaylist > 0){
        skipPrevious.style.animation = 'none';
        skipPrevious.style.animation = 'mauseOn 0.25s forwards';
    }
})

skipPrevious.addEventListener('mouseleave', ()=>{
    skipPrevious.style.animation = 'mauseOut 0.25s forwards';   
})