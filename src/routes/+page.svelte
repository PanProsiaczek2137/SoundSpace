<script>
  import './style/global.css';
  import Song from'./components/song.svelte'
</script>

<div id="container">
  <div id="songs">
    <div class="test scroll-container">
      <Song name="Nothing That Has Happened So Far Has Been Anything We Could Control" image="Lonerism.png" album="Lonerism" artist="Tame Impala"></Song>
      <Song name="I Want It All" image="AM.png" album="AM" artist="Arctic Monkeys"></Song>
      <Song name="keep on lying" image="Lonerism.png" album="Lonerism" artist="Tame Impala"></Song>
      <Song></Song>
      <Song></Song>
      <Song></Song>
      <Song></Song>
    </div>

    
  </div>
</div>

<style>
  .test{
    margin-bottom: 100px;
    overflow-y: auto;
    display: flex;
  }
  #container{
    margin-left: 250px;
    background-color: var(--black);
    width: calc(100% - 250px);
    right: 0px;
  }
  #songs{
    overflow-y: auto;
    background-color: var(--black);
    height: 100%;
  }
  .test:last-child{
    margin-bottom: 75px;
  }

  
  @media (width < 650px) {
    #container{
      width: calc(100% - 100px);
      margin-left: 100px;
    }
  }

</style>
