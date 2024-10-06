import { fullScreenOnOff } from './fullScreen.js';


/*setTimeout(() => {
    window.api.getAudioFiles().then((files) => {
        //console.log(files);

        setSong("Apocalypse Dreams.mp3")
        //playSong();
    }).catch(err => console.error('Błąd:', err));
}, 1000);

setTimeout(() => {
    console.log(songDuration, songCurrentTime);
}, 4000);*/

/*window.api.getAllAudioFileNames().then((files) => {
    for(let i = 0; i < files.length; i++){
        window.api.getSpecificAudioFile(files[i]).then((file) => {
            console.log(file);
        }).catch(err => console.error('Błąd:', err));
    }
}).catch(err => console.error('Błąd:', err));*/

const buttonHome = document.getElementById('Home');
const buttonLibrary = document.getElementById('Library');
const buttonMedia = document.getElementById('Media');
const iconHome = document.getElementById('home-icon');
const iconLibrary = document.getElementById('library-icon');
const iconMedia = document.getElementById('media-icon');
const homeContent = document.getElementById('home-content');
const libraryContent = document.getElementById('library-content');

buttonHome.addEventListener('click', ()=>{
    buttonHome.style.backgroundColor = "#161616"
    buttonLibrary.style.backgroundColor = ""
    iconHome.src = "allResources/icon/home-filld.svg"
    iconLibrary.src = "allResources/icon/library.svg"
    homeContent.style.visibility = 'visible'
    libraryContent.style.visibility = 'hidden'
    fullScreenOnOff(false);
    //deleteAllSongsFormLibrary()
    //showlibraryRightBar(false)
})


buttonLibrary.addEventListener('click', ()=>{
    buttonHome.style.backgroundColor = ""
    buttonLibrary.style.backgroundColor = "#161616"
iconHome.src = "allResources/icon/home.svg"
    iconLibrary.src = "allResources/icon/library-filld.svg"
    homeContent.style.visibility = 'hidden'
    libraryContent.style.visibility = 'visible'

    fullScreenOnOff(false);
    //showSongsInLibraryWith()
    /*if(filterType == 'PlayLists'){
        showlibraryRightBar(true);   
    }*/
})

function setTab(to){
    if(to == 'Home'){
        buttonHome.style.backgroundColor = "#161616"
        iconHome.src = ".../allResources/icon/home-filld.svg"
        homeContent.style.visibility = 'visible'
        fullScreenOnOff(false);
        deleteAllSongsFormLibrary()
        showlibraryRightBar(false)
    }else{
        //buttonHome.style.backgroundColor = ''
        //iconHome.src = ".../allResources/icon/home.svg"
        homeContent.style.visibility = 'hidden'
    }

    if(to == 'Library'){
        buttonLibrary.style.backgroundColor = "#161616"
        iconLibrary.src = ".../allResources/icon/library-filld.svg"
        libraryContent.style.visibility = 'visible'
        fullScreenOnOff(false);
        //showSongsInLibraryWith()
        /*if(filterType == 'PlayLists'){
            showlibraryRightBar(true);   
        }*/
    }else{
        buttonLibrary.style.backgroundColor = ''
        iconLibrary.src = ".../"
        libraryContent.style.visibility = 'hidden'
    }

    if(to == 'Media'){
        buttonMedia.style.backgroundColor = "#161616"
        //iconMedia.src = ".../allResources/icon/media-filld.svg"
    }else{
        //buttonMedia.style.backgroundColor = ''
        //iconMedia.src = ".../allResources/icon/media.svg"
    }
    
    tabTitle.innerText = to + ":"
};





//? Pełne ścieżki wszystkich plików w folderze muzyka
window.api.getAllAudioFilePaths().then((files) => {
    console.log(files);
}).catch(err => console.error('Błąd:', err));

//? Meta dane wybranego pliku (po nazwie)

window.api.getSpecificAudioFile("C:\\Users\\Mateusz\\Music\\She Just Won't Believe Me.mp3").then((file) => {
    console.log(file)
    const img = document.getElementById('testowe');
    img.src = `data:image/png;base64,${file.artistPicture}`
}).catch(err => console.error('Błąd:', err));


