
import { platform } from '@tauri-apps/plugin-os';
import { BaseDirectory, create, readTextFile, readFile, writeTextFile, exists, readDir, watchImmediate, mkdir, remove  } from '@tauri-apps/plugin-fs';
import * as mm from 'music-metadata';
import { audioDir, join, appLocalDataDir } from '@tauri-apps/api/path';
//import { showLoadingFiles } from './+layout.svelte';
//import { metaDataFolderContent } from './ts/store.svelte';
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


export async function readSongsMetaDataFile(songName: string) {
    try {
        const file = await readTextFile('songsMetaData.json', { baseDir: BaseDirectory.AppLocalData });
        const jsonData = JSON.parse(file); // Parsowanie całego pliku do JSON

        if (jsonData[songName]) {
            return jsonData[songName]; // Zwracamy bez ponownego parsowania
        }

        return null; // Jeśli nie znaleziono utworu
    } catch (error) {
        console.error('Błąd przy odczycie pliku:', error);
        alert('Błąd przy odczycie pliku: ' + error);
        return null;
    }
}



//const currentPlatform = platform();

    /*

    async function createTextFile(){ //Only main
        try {
            const file = await create('songsMetaData.json', { baseDir: BaseDirectory.AppLocalData });
            await file.close()
            console.log('plik storzono!')
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

    mainLogic()
    async function mainLogic() {

        if (!(await existsTheFile(true, ""))) {
            await createTextFile();
            await writeTheFile('{}');
        }
    
        let mainFileContent = (await readTheFile(true, '')) ?? '{}';
        let mainFile: SongsMetaData = JSON.parse(mainFileContent);

        if (!(await existsTheFolder('albumCovers'))) {
            await createFolder('albumCovers');
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

    }
    
    async function getDataOfFile() {
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
    //metaDataFolderContent.set(await getDataOfFile())


    //mainLogic()

    async function readTheImgFile(named: any){
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
        
        const debouncedMainLogic = debounce(async () => {
            //reload!
            //metaDataFolderContent.set(await getDataOfFile())
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

*/