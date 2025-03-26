<script>
  import '../style/global.css';
  import Song from '../components/song.svelte';
  import { onMount } from 'svelte';
  import HomeSectrion from '../components/homeSectrion.svelte';

  onMount(()=>{
        document.querySelectorAll("button, input, a, textarea, select").forEach(el => {
            el.setAttribute("tabindex", "-1");
        });
  })

  /*
  WSZYSTKIE MOŻLIWE

  od artysty X
  od albumu X
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
  od artysty X
  od albumu X
  $ losowa playlista
  losowe utwory
  długie utwory
  */



</script>

<div id="container" class="scrollY">


  
  <HomeSectrion type="losowa playlista" data=""></HomeSectrion>
  <HomeSectrion type="od artysty X" data="Tame Impala"></HomeSectrion>

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
  #container {
    background-color: var(--black);
    margin-top: -5px;
    
  }
</style>