const { loadMusicBrainzApi } = require('musicbrainz-api');
async function loadFetch() {
    const fetch = (await import('node-fetch')).default;
    return fetch;
}


async function getAlbumData(albumName, artistName) {
    const { MusicBrainzApi } = await loadMusicBrainzApi();

    const mbApi = new MusicBrainzApi({
        appName: 'SoundSpace',
        appVersion: '0.1.0',
        appContactInfo: 'user@mail.org',
    });

    // Wyszukiwanie albumu z podaną nazwą i artystą
    const releaseGroupList = await mbApi.search('release-group', {
        query: {
            release: albumName,
            artist: artistName
        }
    });

    // Przefiltrowanie wyników po dokładnym dopasowaniu nazwy albumu i artysty
    const matchingReleaseGroup = releaseGroupList['release-groups'].find(
        (releaseGroup) => 
            releaseGroup.title.toLowerCase() === albumName.toLowerCase() &&
            releaseGroup['artist-credit'] && 
            releaseGroup['artist-credit'][0].name.toLowerCase() === artistName.toLowerCase()
    );

    if (!matchingReleaseGroup) {
        console.log(`No albums found for "${albumName}" by "${artistName}".`);
        return null;
    }

    // Pobranie szczegółów release-group, które może zawierać relacje
    const releaseGroupDetails = await mbApi.lookup('release-group', matchingReleaseGroup.id, ['url-rels']);

    return releaseGroupDetails;
}

async function getAlbumDataWithExternalLinks(albumName, artistName) {
    const albumData = await getAlbumData(albumName, artistName);

    // Sprawdź, czy są dane
    if (!albumData) {
        return null;
    }

    let externalLinks = [];
    
    // Sprawdzanie relacji, takich jak Wikipedia, Wikidata, Official Homepage
    if (albumData.relations) {
        externalLinks = albumData.relations.filter(relation => 
            relation.type === 'wikipedia' || relation.type === 'wikidata' || relation.type === 'official homepage'
        );
    }

    // Zwrócenie danych albumu razem z linkami zewnętrznymi
    return {
        albumData,
        externalLinks: externalLinks.map(link => ({
            type: link.type,
            url: link.url.resource
        }))
    };
}

async function getAlbumTracks(albumName, artistName) {
    const { MusicBrainzApi } = await loadMusicBrainzApi();

    const mbApi = new MusicBrainzApi({
        appName: 'SoundSpace',
        appVersion: '0.1.0',
        appContactInfo: 'user@mail.org',
    });

    try {
        // Wyszukiwanie release-group (albumu) na podstawie albumu i artysty
        const releaseGroupList = await mbApi.search('release-group', {
            query: {
                release: albumName,
                artist: artistName
            }
        });

        // Znalezienie dokładnie pasującego albumu
        const matchingReleaseGroup = releaseGroupList['release-groups'].find(
            (releaseGroup) =>
                releaseGroup.title.toLowerCase() === albumName.toLowerCase() &&
                releaseGroup['artist-credit'] &&
                releaseGroup['artist-credit'][0].name.toLowerCase() === artistName.toLowerCase()
        );

        if (!matchingReleaseGroup) {
            console.log(`No albums found for "${albumName}" by "${artistName}".`);
            return [];
        }

        // Pobieranie szczegółowych informacji o release-group
        const releaseGroupDetails = await mbApi.lookup('release-group', matchingReleaseGroup.id, ['releases']);

        // Wybieranie pierwszego wydania (release) z grupy
        const releaseId = releaseGroupDetails.releases[0].id;

        // Pobieranie szczegółowych informacji o release, w tym o utworach (tracklist)
        const releaseDetails = await mbApi.lookup('release', releaseId, ['recordings']);

        // Zbieranie wszystkich utworów
        const tracks = releaseDetails.media.flatMap(media => 
            media.tracks.map(track => track.title)
        );

        console.log(`Found ${tracks.length} tracks on album "${albumName}" by "${artistName}":`);
        //console.log(tracks);

        return tracks;
    } catch (error) {
        console.error('Error fetching album tracks:', error);
        return [];
    }
}


async function getSongTags(artist, title) {
    const fetch = await loadFetch(); // Ładujemy fetch

    const searchUrl = `https://musicbrainz.org/ws/2/recording/?query=artist:${encodeURIComponent(artist)}%20AND%20recording:${encodeURIComponent(title)}&fmt=json`;

    let success = false;
    let data;

    while (!success) {
        try {
            console.log(`Fetching ${searchUrl}`);
            const response = await fetch(searchUrl);

            if (!response.ok) {
                if (response.status === 503) {
                    // Jeśli status 503, czekaj 5 sekund i ponów próbę
                    console.warn(`Received 503 error. Retrying after 5 seconds...`);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    continue; // Ponów próbę
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            data = await response.json();
            success = true; // Jeśli się uda, przerywamy pętlę

        } catch (error) {
            console.error('Wystąpił błąd podczas pobierania tagów:', error);
            console.log('Retrying in 10 seconds...');
            await new Promise(resolve => setTimeout(resolve, 10000)); // Jeśli inny błąd, czekaj 10s i ponów próbę
        }
    }

    // Przetwarzanie danych
    let whichOneIsIt = 0;
    let howManyElements = 0;
    for (let i = 0; i < data.recordings.length; i++) {
        if (data.recordings[i].tags !== undefined && data.recordings[i].tags.length > howManyElements) {
            howManyElements = data.recordings[i].tags.length;
            whichOneIsIt = i;
        }
    }

    if (howManyElements === 0) {
        console.warn('No tags found');
        return null;
    }

    const sortedTags = data.recordings[whichOneIsIt].tags.sort((a, b) => b.count - a.count);
    
    // Lista preferowanych gatunków i ich podgatunków
    const genreMap = {
        rock: ["classic rock", "hard rock", "alternative rock", "gothic rock", "progressive rock", "psychedelic rock", "symphonic rock", "slow rock", "punk rock", "indie rock", "garage rock"],
        metal: ["death metal", "thrash metal", "heavy metal", "black metal"],
        hiphop: ["gangsta", "christian rap", "rap", "christian gangsta rap"],
        techno: ["euro-techno", "techno-industrial", "hardcore techno"],
        jazz: ["acid jazz", "jazz & funk", "bebop", "swing", "avantgarde"],
        electronic: ["downtempo", "dubstep", "idm", "electro", "electroclash", "ebm", "psytrance"],
        pop: ["synthpop", "pop-folk", "eurodance"],
        reggae: ["dance hall"],
    };

    // Wyszukujemy bardziej szczegółowe tagi
    let selectedTag = null;
    let baseTag = null;

    for (const tag of sortedTags) {
        const tagName = tag.name.toLowerCase();
        
        // Sprawdzamy dla każdego gatunku głównego
        for (const [genre, subgenres] of Object.entries(genreMap)) {
            if (tagName === genre) {
                baseTag = tag.name; // Zachowujemy ogólny tag
            } else if (subgenres.includes(tagName)) {
                selectedTag = tag.name; // Preferujemy bardziej szczegółowy tag
                break; // Znalezienie bardziej szczegółowego tagu przerywa pętlę
            }
        }

        // Jeśli znaleźliśmy bardziej szczegółowy tag, przerywamy pętlę główną
        if (selectedTag) break;
    }

    // Jeśli nie znaleziono bardziej szczegółowego tagu, zwracamy ogólny lub pierwszy dostępny tag
    return selectedTag || baseTag || sortedTags[0].name;
}


// Przykład użycia
//getSongTags('Golden Slumbers (Remastered 2009)', 'The Beatles').then(tags => {
//    console.log('ok:', tags);
//});

/*
async function getAlbumReleaseDate(artist, album) {
    const fetch = await loadFetch(); // Ładujemy fetch

    try {
        // Wyszukaj utwór w MusicBrainz
        const searchUrl = `https://musicbrainz.org/ws/2/recording/?query=artist:${encodeURIComponent(artist)}%20AND%20album:${encodeURIComponent(album)}&fmt=json`;
        console.log(`https://musicbrainz.org/ws/2/recording/?query=artist:${encodeURIComponent(artist)}%20AND%20album:${encodeURIComponent(album)}&fmt=json`)
        const response = await fetch(searchUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return data.recordings[0]['first-release-date']
    } catch (error) {
        console.error('Wystąpił błąd podczas pobierania tagów:', error);
        return [];
    }
}


setTimeout(() => {
    getAlbumReleaseDate('tame impala', 'lonerism').then(tags => {
        console.log(tags);
    });
}, 3000);
*/






async function getWikipediaTitleFromWikidata(wikidataUrl) {
    // Pobieranie identyfikatora WikiData z URL (np. Q19824616)
    const wikidataId = wikidataUrl.split('/').pop();
    const url = `https://www.wikidata.org/wiki/Special:EntityData/${wikidataId}.json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const entities = data.entities[wikidataId];
        
        // Sprawdzenie, czy istnieje artykuł na angielskiej Wikipedii
        if (entities.sitelinks && entities.sitelinks.enwiki) {
            return entities.sitelinks.enwiki.title;  // Zwraca tytuł artykułu na angielskiej Wikipedii
        } else {
            console.error('Nie znaleziono artykułu na angielskiej Wikipedii.');
            return null;
        }
    } catch (error) {
        console.error('Błąd podczas pobierania danych z WikiData:', error);
        return null;
    }
}

async function getWikipediaIntroFromWikidata(wikidataUrl) {
    // Uzyskaj tytuł artykułu z WikiData
    const wikipediaTitle = await getWikipediaTitleFromWikidata(wikidataUrl);

    if (wikipediaTitle) {
        // Jeśli tytuł artykułu został znaleziony, pobierz wstęp z Wikipedii
        const intro = await getWikipediaIntro(wikipediaTitle);
        if (intro) {
            return intro;  // Zwróć wstęp artykułu
        } else {
            console.error('Nie udało się pobrać wprowadzenia z Wikipedii.');
            return null;
        }
    } else {
        console.error('Nie znaleziono tytułu artykułu na Wikipedii.');
        return null;
    }
}

//WIKI
async function getWikipediaIntro(title) {
    // Zastąp spacje podkreśleniami
    const formattedTitle = title.split(' ').join('_');
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(formattedTitle)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.extract;  // Zwróć wprowadzenie do artykułu
    } catch (error) {
        console.error('Błąd podczas pobierania artykułu:', error);
        return null;
    }
}





/*(async () => {
    const data = await getAlbumDataWithExternalLinks('i robot', 'the alan parsons project');

    if (data) {
        console.log('Album Data:', data.albumData);
        //if (data.externalLinks.length > 0) {
            console.log('External Links:', data.externalLinks);
            const intro = await getWikipediaIntroFromWikidata(data.externalLinks[0].url);
            if (intro) {
                console.log('Wikipedia Introduction:', intro);
            }
        //} else {
            //console.log('No external links found.');
        //}
    }
})();*/

module.exports = { getWikipediaIntroFromWikidata, getAlbumDataWithExternalLinks, getAlbumTracks, getSongTags };









/*
// Wywołanie funkcji z nazwą albumu i artysty
(async () => {
    const albumName = 'currents';
    const artistName = 'Tame Impala';
    const data = await getAlbumDataWithExternalLinks(albumName, artistName);

    if (data) {
        console.log('Album Data:', data.albumData);
        if (data.externalLinks.length > 0) {
            console.log('External Links:', data.externalLinks);
        } else {
            console.log('No external links found.');
        }
    }
})();
// Przykład użycia funkcji
(async () => {
    const wikidataUrl = 'https://www.wikidata.org/wiki/Q19824616';
    const intro = await getWikipediaIntroFromWikidata(wikidataUrl);
    
    if (intro) {
        console.log('Wikipedia Introduction:', intro);
    }
})();
*/