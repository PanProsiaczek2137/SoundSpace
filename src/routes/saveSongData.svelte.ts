
import { platform } from '@tauri-apps/plugin-os';
import { BaseDirectory, create, readTextFile, readFile, writeTextFile, exists, readDir, watchImmediate, mkdir, remove  } from '@tauri-apps/plugin-fs';
import * as mm from 'music-metadata';
import { audioDir, join, appLocalDataDir } from '@tauri-apps/api/path';
import { showLoadingFiles } from './+layout.svelte';
export let songsProgress = $state({value: 0});
export let songsToProcess = $state({value: 0});

const allowedExtensions = ['mp3', 'aac', 'wav', 'ogg', 'opus', 'flac', 'm4a', 'webm'];

interface SongMetaData {
    title: string;
    artist: string;
    genre: string | null;
    picture: string | null;
    date: number;
    album: string;
    duration: number;
    filePath: string;
    fileName: string;
}

type SongsMetaData = Record<string, SongMetaData>;


const currentPlatform = platform();

    async function createTextFile(){ //Only main
        try {
            const file = await create('songsMetaData.json', { baseDir: BaseDirectory.AppLocalData });
            await file.close()
            console.log('plik storzono!')
            alert('stworzono')
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    async function createBinaryFile(data: Uint8Array, name: string){ //Only main
        try {
            const imageData = new Uint8Array([...data]);

            const file = await create(name, { baseDir: BaseDirectory.AppLocalData });

            await file.write(imageData);

            await file.close();

            return join(await appLocalDataDir(), name);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    async function readTheFile(main: boolean, name: string){ //main or music
        try {
            if(main){
                const file = await readTextFile('songsMetaData.json', { baseDir: BaseDirectory.AppLocalData });
                return file
            }else{
                let filePath = "";

                // For mobile (Android/iOS)
                if (currentPlatform === "android" || currentPlatform === "ios") {
                    filePath = '/storage/emulated/0/Music/' + name; // Mobile device storage
                } else {
                    // For desktop (adjust as necessary)
                    const audio = await audioDir();
                    filePath = await join(audio, name);  // Adjust this path to where you store assets on desktop
                }
        
                // Ensure that the file exists and can be read
                const content = await readFile(filePath, { baseDir: BaseDirectory.Audio });
                const blob = new Blob([content], { type: 'audio/mpeg' });
        
                return URL.createObjectURL(blob); // Return a valid URL for the audio source
            }
        } catch (error) {
            console.error('Błąd przy odczycie pliku1:', error);  
            alert(error)
        }
    }

    async function writeTheFile(what: string) {  // Only main
        try {
            await writeTextFile("songsMetaData.json", what, { 
                baseDir: BaseDirectory.AppLocalData 
            });
        } catch (error) {
            console.error('Błąd przy zapisie pliku:', error);
            alert('Błąd przy zapisie pliku: ' + error);
        }
    }

    async function existsTheFile(main: boolean, name: string){  //main or music
        try {
            if(main){
                return await exists('songsMetaData.json', { baseDir: BaseDirectory.AppLocalData });
            }else{
                if (currentPlatform === "android" || currentPlatform === "ios") {
                    const customPath = '/storage/emulated/0/Music/' + name;
                    return await exists(customPath);
                }else{
                    return await exists(name, { baseDir: BaseDirectory.Audio });
                }
            }
        } catch (error) {
            console.error('Błąd przy odczycie pliku2:', error);  
            alert(error)
        }
    }

    async function getContentOfMusicFolder() {
        try {
            let theAudioDir;
            if (currentPlatform === "android" || currentPlatform === "ios") {
                const customPath = '/storage/emulated/0/Music/';
                theAudioDir = await readDir( customPath );
                theAudioDir = theAudioDir.filter(item => item.name !== ".thumbnails");
            }else{
                const audioDirPath = await audioDir();
                theAudioDir = await readDir( audioDirPath );
                theAudioDir = theAudioDir.filter(item => item.name !== "desktop.ini");
            }
            return theAudioDir;
        } catch (error) {
            console.error('Błąd przy odczycie pliku3:', error);  
            alert(error)
        }
    }
    
    async function returnSongMetadata(name: string) {
        try {
            const fileContent = await readTheFile(false, name);
            if (fileContent) {
                const fileBuffer = await fetch(fileContent).then(res => res.arrayBuffer());
                const uint8Array = new Uint8Array(fileBuffer);
                const metadata = await mm.parseBuffer(uint8Array);

                console.log('Metadane utworu:', metadata);
                return metadata;
            }
        } catch (error) {
            console.error('Błąd podczas ładowania metadanych:', error);
            return null;
        }
    }

    async function createFolder(named: string){ //Only main
        try {
            await mkdir(named, {
                baseDir: BaseDirectory.AppLocalData,
              });
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    async function existsTheFolder(named: string){ //Only main
        try {
            return await exists(named, {
                baseDir: BaseDirectory.AppLocalData,
            });
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    async function removeTheFile(name: string){ //main or music
        try {
            await remove(name, { baseDir: BaseDirectory.AppLocalData });
        } catch (error) {
            console.error('Błąd przy odczycie pliku1:', error);  
            alert(error)
        }
    }

    async function countSpecificAlbum(album: string) {
        let count = 0;
    
        // Pobierz dane i obsłuż sytuację, gdy są `undefined`
        const songsMetaDataString = await readTheFile(true, '');
        if (!songsMetaDataString) {
            throw new Error('Nie udało się odczytać danych z pliku.');
        }
    
        // Sparsuj dane na obiekt
        const songsMetaData: SongsMetaData = JSON.parse(songsMetaDataString);
    
        // Iteracja przez obiekty
        for (const songKey in songsMetaData) {
            if (songsMetaData[songKey].album === album) {
                count++;
            }
        }
    
        return count;
    }
    
    async function mainLogic() {

        //Delete Files
        songsProgress.value = 0;
        songsToProcess.value = 0;

        if (!(await existsTheFile(true, ""))) {
            await createTextFile();
            await writeTheFile('{}');
        }
    
        let mainFileContent = (await readTheFile(true, '')) ?? '{}';
        let mainFile: SongsMetaData = JSON.parse(mainFileContent);

        if (!(await existsTheFolder('albumCovers'))) {
            await createFolder('albumCovers');
            /*
            let path = await appLocalDataDir()
            path = await join(path, 'albumCovers')
            const file = await create(path);
            const contents = new Uint8Array(); 
            await file.write(contents);
            await file.close();
            */
        }
   
        const keys = Object.keys(mainFile);
        for (let i = 0; i < keys.length; i++) {
            const filePath = keys[i];
            const fileData = mainFile[filePath];
            const exists = await existsTheFile(false, fileData.fileName);
    
            if (!exists) {
                console.log(`Plik nie istnieje: ${filePath}. Usuwam z listy.`);
                console.log(fileData.album +": "+ await countSpecificAlbum(fileData.album));
                if(await countSpecificAlbum(fileData.album) == 1){
                    removeTheFile(`albumCovers/${fileData.album}.png`);
                }
                delete mainFile[filePath];
            }
        }
        console.log('Zaktualizowano plik!!!');
        await writeTheFile(JSON.stringify(mainFile, null, 2));


        //Add Files
        
        const musicFiles = await getContentOfMusicFolder();
        console.log(musicFiles)
        if(musicFiles){
        
            const mainFolder = await readTheFile(true, '')
            if(mainFolder)
            if(musicFiles.length !== mainFolder.length){
                showLoadingFiles(true);
            }
            songsToProcess.value = musicFiles.filter(file => !file.isDirectory && file.isFile).length;
            for (const file of musicFiles) {
                songsProgress.value++;
                if(file.isDirectory == false){
                    if (!allowedExtensions.includes(file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase())) {
                        console.log('wykryto nieobsługiwany format pliku: ' + file.name);
                    } else {
                        if (file.name in mainFile) {
                            console.log(' - zawiera: ' + file.name);
                        } else {
                            console.log('nie zawiera: ' + file.name + " ~ Dodajemy!");
                    
                            // Zbuduj pełną ścieżkę do pliku
                            let filePath = "";
                            if (currentPlatform === "android" || currentPlatform === "ios") {
                                filePath = '/storage/emulated/0/Music/' + file.name; // Ścieżka do pliku na urządzeniach mobilnych
                            } else {
                                const audioDirPath = await audioDir(); // Katalog z muzyką w systemie
                                filePath = await join(audioDirPath, file.name); // Pełna ścieżka pliku na desktopie
                            }
                    
                            const thisSongMetaData = await returnSongMetadata(file.name); // Przekazujemy pełną ścieżkę do metadanych
                            if (thisSongMetaData) {
                                let pathToImg: string | null = null;
                    
                                if (thisSongMetaData.common.picture?.[0]?.data) {
                                    const imageName = thisSongMetaData.common.album
                                        ? `${thisSongMetaData.common.album}.png`
                                        : `${thisSongMetaData.format.duration}.png`;
                    
                                    // @ts-ignore
                                    pathToImg = await createBinaryFile(thisSongMetaData.common.picture[0].data, `albumCovers/${imageName}`);
                                } else {
                                    console.log('Brak album cover dla: ' + file.name);
                                }
                    
                                // Tworzenie obiektu z metadanymi piosenki
                                const songMetaData: SongMetaData = {
                                    title: thisSongMetaData.common.title || file.name,
                                    artist: thisSongMetaData.common.artist || 'Unknown Artist',
                                    genre: thisSongMetaData.common.genre?.[0] || null,
                                    picture: pathToImg, // Ustawiamy `null`, jeśli brak obrazka
                                    date: thisSongMetaData.common.year || new Date().getFullYear(),
                                    album: thisSongMetaData.common.album || 'Unknown Album',
                                    duration: thisSongMetaData.format.duration || 0,
                                    filePath: filePath, // Używamy zbudowanej ścieżki
                                    fileName: file.name,
                                };
                    
                                // Dodajemy metadane piosenki do obiektu `mainFile`
                                mainFile[file.name] = songMetaData;
                    
                                // Zapisz zaktualizowane dane do pliku
                                await writeTheFile(JSON.stringify(mainFile, null, 2));
                                console.log('Dodano piosenkę: ' + file.name);
                            }
                        }
                    }
                }
                //mainFile
            }
            showLoadingFiles(false)
        }
    }
    
    export async function getDataOfFile() {
        try {
            const fileContent = await readTheFile(true, "");
            if (fileContent) {
                let mainFile = JSON.parse(fileContent);
                //console.log('dane pliku:')
                //console.log(mainFile)
                return mainFile
            } else {
                console.error("File content is undefined.");
            }
        } catch (error) {
            console.error("Error reading the file:", error);
        }
    }

    mainLogic()

    export async function readTheImgFile(named: any){
        try {
            if(named !== null){
            const fileBuffer = await readFile(named);

            // Tworzenie Blob
            const blob = new Blob([fileBuffer], { type: 'image/png' }); // Zmień typ MIME, jeśli to inny format obrazka
            const blobUrl = URL.createObjectURL(blob);
            
            return blobUrl;
            }
        } catch (error) {
            console.error('Błąd przy odczycie pliku:', error);  
            alert(error)
        }
    }

    async function watchDirectoryImmediate() {
        const path = await audioDir();
        console.log('Ścieżka do folderu:', path);
        
        const debouncedMainLogic = debounce(() => {
            mainLogic().catch(console.error);
        }, 2000); // 2 sekundy cooldown
    
        try {
            await watchImmediate(
                path,  // Ścieżka do folderu
                () => {
                    debouncedMainLogic();
                    console.log('Zmiana w folderze!');
                },
                {
                    baseDir: BaseDirectory.AppLocalData,  // Wybór folderu aplikacji
                    recursive: true,  // Monitorowanie podfolderów
                }
            );
        } catch (error) {
            console.error('Błąd podczas nasłuchiwania na zmiany:', error);
        }
    }
    
    // Funkcja debounce do opóźniania wywołania funkcji
    function debounce(func: any, delay: any) {
        let timer: any;
        return function (...args: any) {
            clearTimeout(timer); // Usuwamy poprzednie wywołanie
            timer = setTimeout(() => {
                func(...args); // Wywołujemy funkcję po upływie delay
            }, delay);
        };
    }
    
    watchDirectoryImmediate();
