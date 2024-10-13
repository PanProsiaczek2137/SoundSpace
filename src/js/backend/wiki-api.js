const { loadMusicBrainzApi } = require('musicbrainz-api');

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

module.exports = { getWikipediaIntroFromWikidata, getAlbumDataWithExternalLinks };









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