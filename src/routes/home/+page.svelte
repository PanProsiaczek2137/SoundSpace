<script lang="ts">
  import '../style/global.css';
  import Song from '../components/song.svelte';
  import { onMount } from 'svelte';
  import { readTheFile } from '../ts/saveSongData.svelte'
  import HomeSectrion from '../components/homeSectrion.svelte';

  onMount(()=>{
        document.querySelectorAll("button, input, a, textarea, select").forEach(el => {
            el.setAttribute("tabindex", "-1");
        });
  })

  let loading = true;
  let list:any = [];
  onMount(async () => {
    const allSongs = await readTheFile(true, "");

    if (!allSongs) {
        console.warn("Plik nie zawiera danych lub nie istnieje.");
        return;
    }

    let parsedSongs: Record<string, any>;
    try {
        parsedSongs = JSON.parse(allSongs);
    } catch (error) {
        console.error("Błąd parsowania JSON:", error);
        return;
    }

    const artistCounts: Record<string, number> = {};
    const albumCounts: Record<string, number> = {};

    // Zliczanie utworów dla każdego artysty i albumu
    for (const key in parsedSongs) {
        const song = parsedSongs[key];

        // Liczenie piosenek dla artystów
        if (song.artist) {
            if (!artistCounts[song.artist]) {
                artistCounts[song.artist] = 0;
            }
            artistCounts[song.artist]++;
        }

        // Liczenie piosenek dla albumów
        if (song.album) {
            if (!albumCounts[song.album]) {
                albumCounts[song.album] = 0;
            }
            albumCounts[song.album]++;
        }
    }

    // Filtracja artystów z min. 10 utworami
    const artistsWith10Songs = Object.keys(artistCounts).filter(artist => artistCounts[artist] >= 10);

    // Filtracja albumów z min. 5 utworami
    const albumsWith5Songs = Object.keys(albumCounts).filter(album => albumCounts[album] >= 5);

    console.log("Artyści z więcej niż 10 piosenkami:", artistsWith10Songs);
    console.log("Albumy z więcej niż 5 piosenkami:", albumsWith5Songs);

    let wasThereLong = false;
    for(let i = 0; i < 15; i++){
      const random = Math.floor(Math.random() * 10);
      if(random == 0 || random == 1 || random == 2 ){
        const randomArtist = Math.floor(Math.random() * artistsWith10Songs.length);
        list.push({type: "od artysty X", data: artistsWith10Songs[randomArtist]})
        artistsWith10Songs.slice(randomArtist, 1);
      }
      if(random == 3 || random == 4 || random == 5 ){
        const randomAlbum = Math.floor(Math.random() * albumsWith5Songs.length);
        list.push({type: "z albumu X", data: albumsWith5Songs[randomAlbum]})
        albumsWith5Songs.slice(randomAlbum, 1);
      }
      if(random == 6 || random == 7){
        list.push({type: "losowe utwory", data: ""})
      }
      if(random == 9){
        if(wasThereLong){
          list.push({type: "losowe utwory", data: ""})
        }else{
          list.push({type: "długie utwory", data: ""})
          wasThereLong = true;
        }
      }
    }
    loading = false;
  });


  /*
  WSZYSTKIE MOŻLIWE

  od artysty X
  z albumu X
  z gatunki X
  z lat X - X
  losowe utwory
  losowa playlista
  któtkie utwory
  długie utwory
  najczęściej odtwarzane
  żadko odtwarzane
  nowo dodane
  dodane dawno temu
  Często pomijane
  live
  specjalne wystąpienia (feat. X)
  ostatnio odtwarzane


  Aktualnie do zrobienia!
  $ od artysty X
  $ z albumu X
  $ losowa playlista
  $ losowe utwory
  długie utwory
  */

  



</script>

<div id="container-home" class="scrollY">



  <HomeSectrion type="losowa playlista" data=""></HomeSectrion>
  {#if loading == false}
    {#each list as data, index}
      <HomeSectrion type={data.type} data={data.data}></HomeSectrion>
    {/each}
  {/if}

  <!--
  <HomeSectrion type="od artysty X" data="The Alan Parsons Project"></HomeSectrion>
  <HomeSectrion type="z albumu X" data="The Wall"></HomeSectrion>
  <HomeSectrion type="losowe utwory" data=""></HomeSectrion>
  <HomeSectrion type="długie utwory" data=""></HomeSectrion>
  -->
  
  <!--
  <div id="songs">
    <div class="test scroll-container">
      <Song name="Nothing That Has Happened So Far Has Been Anything We Could Control" 
            image="Lonerism.png" 
            album="Lonerism" 
            artist="Tame Impala" />
    </div>
    <div class="test scroll-container">
      <Song name="Nothing That Has Happened So Far Has Been Anything We Could Control" 
            image="Lonerism.png" 
            album="Lonerism" 
            artist="Tame Impala" />
    </div>
    <div class="test scroll-container">
      <Song name="Nothing That Has Happened So Far Has Been Anything We Could Control" 
            image="Lonerism.png" 
            album="Lonerism" 
            artist="Tame Impala" />
    </div>
    <div class="test scroll-container">
      <Song name="Nothing That Has Happened So Far Has Been Anything We Could Control" 
            image="Lonerism.png" 
            album="Lonerism" 
            artist="Tame Impala" />
    </div>
    <div class="test scroll-container">
      <Song name="Nothing That Has Happened So Far Has Been Anything We Could Control" 
            image="Lonerism.png" 
            album="Lonerism" 
            artist="Tame Impala" />
    </div>
    <div class="test scroll-container">
      <Song name="Nothing That Has Happened So Far Has Been Anything We Could Control" 
            image="Lonerism.png" 
            album="Lonerism" 
            artist="Tame Impala" />
    </div>
  </div>
  -->
</div>

<style>
  #container-home {
    background-color: var(--black);
    margin-top: -5px;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>