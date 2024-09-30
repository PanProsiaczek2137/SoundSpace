window.audio = '';
window.WhichPlaylistSelected = 0;
window.songPlayed = -1;
window.isPlaying = false;
window.fullScreen = false;
window.playedSongIndex = 0;
window.playingSongFromPlaylist = -1;



window.AllSongs = [{name: 'Welcome to SoundSpace', audio: 'WelcomeToSoundSpaceEcho.wav', artist: 'SoundSpace', album: '-', icon: 'NewUser.svg'},
    {name: 'Moonlight Sonata', audio: 'Beethoven - Moonlight Sonata.mp3', artist: 'Beethoven', album: '-', icon: 'beethoven.jpg'},
    {name: 'Nocturne', audio: 'Chopin - Nocturne.mp3', artist: 'Chopin', album: '-', icon: 'chopin.jpg'},
    {name: 'Eine Kleine Nachtmusik', audio: 'Mozart - Eine Kleine Nachtmusik.mp3', artist: 'Mozart', album: '-', icon: 'mozart.jpg'},
    {name: 'Lacrimosa', audio: 'Mozart - Lacrimosa.mp3', artist: 'Mozart', album: '-', icon: 'mozart.jpg'}];

window.playingList = [ {songs: [1, 2, 3]}, 
                    {name: 'aha', description: 'Normale piosenki dla normalnych ludzi', icon: 'beethoven.jpg', songs: [1,2,4], type: 'Private'},
                    {name: 'PlayList2', description: 'wszystkie piosenki i te normalne i ta dziwna', icon: 'chopin.jpg', songs: [3,1,2,3,3,4,1], type: 'PublicAdd'}];
