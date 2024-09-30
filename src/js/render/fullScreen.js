//import { setPlaylist } from '../modules/soundSystem.js';

const fullScreenButton = document.getElementById('fullScreen-button');
const fullScreenDiv = document.getElementById('fullScreen');
const RightBar = document.getElementById('next-songs-list');
const albumCover = document.getElementById('album-image-fullScreen');
const albumCoverBlur = document.getElementById('album-blure-fullScreen');
let fullScreen = false;

fullScreenButton.addEventListener('click', ()=>{
    if(fullScreen){ 
        fullScreenOnOff(false)
    }else{
        fullScreenOnOff(true)
    }
});

export function fullScreenOnOff(fullScreenOnOff){
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


setTimeout(() => {
    //setPlaylist('all');
}, 3000);

/*
    let songToSelect = document.getElementsByClassName('songToSelect');

    Array.from(songToSelect).forEach((songElement) =>{
        songElement.addEventListener('mousedown', (event) => {
            console.log('Kliknięto element', songElement);
        })
    })
*/