<script lang="ts">
    import { get } from 'svelte/store';
    import { currentPlatform, selectedCategory, selectedPanel } from '../ts/store.svelte'
    import { onMount } from 'svelte';

    export let type: string; // Dodajemy typowanie dla większej przejrzystości

    const platform = get(currentPlatform);
    let thisElement: HTMLElement;
    let loading = true;

    onMount(async ()=>{
        if(platform() === "android" || platform() === "ios"){
            thisElement.style.width = "50%";
            thisElement.style.minWidth = "50%";
        }else{
            const style = document.createElement("style");
            style.innerHTML = `
                #settings-category{ width: 16.666666666666%;}
                
                @media (max-width: 680px){
                    #settings-category{
                        min-width: 150px;
                        width: 150px;
                    }
                    
                    #settings-category-container{
                        overflow-x: scroll;
                    }
                }
            `
            document.head.appendChild(style);
        }
        loading = false;
        selectedCategory.set("General");
        if(type == "General")
        thisElement.style.backgroundColor = "var(--ligth-black)"
    })

    selectedCategory.subscribe(value=>{
        if(loading == false)
        if(value == type){
            thisElement.style.backgroundColor = "var(--ligth-black)"
        }else{
            thisElement.style.backgroundColor = "var(--black)"
        }

    })

    selectedPanel.subscribe(value => {
        if(value != "settings"){
            loading = true;
        }
    })

</script>

<button bind:this={thisElement} id="settings-category" class="button" onclick={()=>{
    selectedCategory.set(type)
}}>
    <p>{type}</p>
</button>

<style>
    #settings-category{
        color: var(--white);
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--black);
    }

    #settings-category p{
        font-family: var(--font);
    }
</style>