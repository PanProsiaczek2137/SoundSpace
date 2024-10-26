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

/*
async function getAlbumTracks(albumName, artistName, retryCount = 3) {
    const { MusicBrainzApi } = await loadMusicBrainzApi();

    const mbApi = new MusicBrainzApi({
        appName: 'SoundSpace',
        appVersion: '0.1.0',
        appContactInfo: 'user@mail.org',
    });

    async function performRequest() {
        try {
            // Search for the release-group (album) based on album name and artist name
            const releaseGroupList = await mbApi.search('release-group', {
                query: {
                    release: albumName,
                    artist: artistName
                }
            });

            // Find an exact match for the album
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

            // Fetch details for the release-group
            const releaseGroupDetails = await mbApi.lookup('release-group', matchingReleaseGroup.id, ['releases']);

            // Select the first release from the group
            const releaseId = releaseGroupDetails.releases[0].id;

            // Fetch details for the release, including the tracklist
            const releaseDetails = await mbApi.lookup('release', releaseId, ['recordings']);

            // Check if `media` exists and is an array
            if (!releaseDetails.media || !Array.isArray(releaseDetails.media)) {
                console.error('Invalid media data:', releaseDetails.media);
                return [];
            }

            // Collect all tracks
            const tracks = releaseDetails.media.flatMap(media =>
                media.tracks ? media.tracks.map(track => track.title) : []
            );

            if (!tracks.length) {
                console.error(`No tracks found in the media for "${albumName}" by "${artistName}".`);
                return [];
            }

            console.log(`Found ${tracks.length} tracks on album "${albumName}" by "${artistName}":`);
            return tracks;
        } catch (error) {
            if (error.response && error.response.status === 503 && retryCount > 0) {
                console.warn(`Error 503 encountered. Retrying in 10 seconds... (${retryCount} retries left)`);
                await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 10 seconds
                return getAlbumTracks(albumName, artistName, retryCount - 1); // Retry the request
            } else {
                console.error('Error fetching album tracks:', error);
                return [];
            }
        }
    }

    return performRequest();
}
*/

async function getAlbumTracks(albumName, artistName, retryCount = 3) {
    async function fetchFromMusicBrainz(endpoint, params = {}) {
        const baseURL = 'https://musicbrainz.org/ws/2/';
        const url = new URL(endpoint, baseURL);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    
        try {
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'SoundSpace/0.1.0 (user@mail.org)'  // Add your app name and contact info here
                }
            });
    
            if (response.status === 503 && retryCount > 0) {
                console.warn(`Received 503, retrying in 10 seconds... (${retryCount} retries left)`);
                await new Promise(resolve => setTimeout(resolve, 10000));
                return fetchFromMusicBrainz(endpoint, params);  // Retry request
            } else if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
    
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    async function performRequest() {
        // Step 1: Search for release-groups (albums, EPs, singles) by the artist and album name
        const releaseGroupSearch = await fetchFromMusicBrainz('release-group/', {
            query: `${albumName} AND artist:${artistName}`,
            fmt: 'json'
        });

        if (!releaseGroupSearch || !releaseGroupSearch['release-groups'] || releaseGroupSearch['release-groups'].length === 0) {
            console.log(`No albums or EPs found for "${albumName}" by "${artistName}".`);
            return [];
        }

        // Step 2: Find the most relevant release-group
        const matchingReleaseGroup = releaseGroupSearch['release-groups'].find(releaseGroup =>
            releaseGroup.title.toLowerCase() === albumName.toLowerCase()
        );

        if (!matchingReleaseGroup) {
            console.log(`No exact match for "${albumName}".`);
            return [];
        }

        // Step 3: Get releases for the release-group
        const releaseGroupId = matchingReleaseGroup.id;
        const releaseGroupDetails = await fetchFromMusicBrainz(`release-group/${releaseGroupId}`, { inc: 'releases', fmt: 'json' });

        if (!releaseGroupDetails || !releaseGroupDetails.releases || releaseGroupDetails.releases.length === 0) {
            console.log('No releases found for this release group.');
            return [];
        }

        // Step 4: Get tracks from the first release in the release-group
        const releaseId = releaseGroupDetails.releases[0].id;
        const releaseDetails = await fetchFromMusicBrainz(`release/${releaseId}`, { inc: 'recordings', fmt: 'json' });

        if (!releaseDetails || !releaseDetails.media || releaseDetails.media.length === 0) {
            console.log('No track information found for the selected release.');
            return [];
        }

        // Step 5: Extract the tracklist from the release
        const tracks = releaseDetails.media.flatMap(media =>
            media.tracks ? media.tracks.map(track => track.title) : []
        );

        if (tracks.length === 0) {
            console.log('No tracks found.');
        }

        return tracks;
    }

    return performRequest();
}



async function getSongTags(artist, title, album) {
    const fetch = await loadFetch(); // Ładujemy fetch

    // Funkcja do pobierania tagów
    async function fetchTags(url) {
        let success = false;
        let data;
        while (!success) {
            try {
                console.log(`Fetching ${url}`);
                const response = await fetch(url);

                if (!response.ok) {
                    if (response.status === 503) {
                        console.warn(`Received 503 error. Retrying after 10 seconds...`);
                        await new Promise(resolve => setTimeout(resolve, 10000));
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
        return data;
    }

    // Szukanie tagów dla utworu
    const songSearchUrl = `https://musicbrainz.org/ws/2/recording/?query=artist:${encodeURIComponent(artist)}%20AND%20(recording:${encodeURIComponent(title)}%20OR%20title:${encodeURIComponent(title)})&fmt=json`;
    let data = await fetchTags(songSearchUrl);
    let songTags = findBestTags(data, 'recordings', artist);
    if (songTags) {
        return songTags;
    }

    // Szukanie tagów dla albumu, jeśli brak tagów dla utworu
    console.warn('No song tags found, searching for album tags...');
    const albumSearchUrl = `https://musicbrainz.org/ws/2/release-group/?query=artist:${encodeURIComponent(artist)}%20AND%20release:${encodeURIComponent(album)}&fmt=json`;
    data = await fetchTags(albumSearchUrl);
    let albumTags = findBestTags(data, 'release-groups');
    if (albumTags) {
        return albumTags;
    }

    // Szukanie tagów dla wykonawcy, jeśli brak tagów dla albumu
    console.warn('No album tags found, searching for artist tags...');
    const artistSearchUrl = `https://musicbrainz.org/ws/2/artist/?query=artist:${encodeURIComponent(artist)}&fmt=json`;
    data = await fetchTags(artistSearchUrl);
    let artistTags = findBestTags(data, 'artists');
    if (artistTags) {
        return artistTags;
    }

    // Jeśli nie znaleziono żadnych tagów
    console.warn('No artist tags found');
    return null;
}

// Funkcja do wyszukiwania najlepszych tagów
function findBestTags(data, type, artist) {
    let whichOneIsIt = 0;
    let howManyElements = 0;

    for (let i = 0; i < data[type].length; i++) {

        if(type == 'recordings'){
            if (data[type][i].tags !== undefined && data[type][i].tags.length > howManyElements) {
                for(let j = 0; j < data[type][i]["artist-credit"].length; j++){
                    if(data[type][i]["artist-credit"][j].name == artist){
                        howManyElements = data[type][i].tags.length;
                        whichOneIsIt = i;
                    }
                }
            }

        }else{
            if (data[type][i].tags !== undefined && data[type][i].tags.length > howManyElements) {
                howManyElements = data[type][i].tags.length;
                whichOneIsIt = i;
            }
        }
    }

    if (howManyElements === 0) {
        return null;
    }

    const sortedTags = data[type][whichOneIsIt].tags.sort((a, b) => b.count - a.count);
    console.log('................');
    console.log(sortedTags);
    console.log('................');

    // Zwracamy najbardziej popularny tag
    return sortedTags[0].name;
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