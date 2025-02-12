<script>
  import '../style/global.css';
  import Song from '../components/song.svelte';
</script>

<div id="container">
  <div id="songs">
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
    overflow: hidden;
  }
</style>
