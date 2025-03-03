<script>
  import '../style/global.css';
  import Song from '../components/song.svelte';
  import { onMount } from 'svelte';

  onMount(()=>{
        document.querySelectorAll("button, input, a, textarea, select").forEach(el => {
            el.setAttribute("tabindex", "-1");
        });
  })
</script>

<div id="container" class="scrollY">
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
  
</div>

<style>
  #container {
    background-color: var(--black);
    margin-top: -5px;
    
  }
</style>
