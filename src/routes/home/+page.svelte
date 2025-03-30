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

  let list: { type: string, data: string, loading: boolean }[] = [];

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

    for (const key in parsedSongs) {
        const song = parsedSongs[key];
        if (song.artist) artistCounts[song.artist] = (artistCounts[song.artist] || 0) + 1;
        if (song.album) albumCounts[song.album] = (albumCounts[song.album] || 0) + 1;
    }

    const artistsWith10Songs = Object.keys(artistCounts).filter(artist => artistCounts[artist] >= 10);
    const albumsWith5Songs = Object.keys(albumCounts).filter(album => albumCounts[album] >= 5);

    let wasThereLong = false;
    for(let i = 0; i < 15; i++){
      const random = Math.floor(Math.random() * 10);
      if(random <= 2 && artistsWith10Songs.length) {
        const randomIndex = Math.floor(Math.random() * artistsWith10Songs.length);
        list.push({ type: "od artysty X", data: artistsWith10Songs[randomIndex], loading: true });
        artistsWith10Songs.splice(randomIndex, 1);
      }
      if(random >= 3 && random <= 5 && albumsWith5Songs.length) {
        const randomIndex = Math.floor(Math.random() * albumsWith5Songs.length);
        list.push({ type: "z albumu X", data: albumsWith5Songs[randomIndex], loading: true });
        albumsWith5Songs.splice(randomIndex, 1);
      }
      if(random >= 6 && random <= 7) {
        list.push({ type: "losowe utwory", data: "", loading: true });
      }
      if(random == 9) {
        if(wasThereLong) {
          list.push({ type: "losowe utwory", data: "", loading: true });
        } else {
          list.push({ type: "długie utwory", data: "", loading: true });
          wasThereLong = true;
        }
      }
    }

    for (let i = 0; i < list.length; i++) {
      setTimeout(() => {
        list[i].loading = false;
      }, i * 300); 
    }
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
  {#each list as data, index}
    {#if !data.loading}
      <HomeSectrion type={data.type} data={data.data}></HomeSectrion>
    {/if}
  {/each}
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
