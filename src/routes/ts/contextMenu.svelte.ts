import { onMount } from "svelte";
import { canShowContextMenu, visibleContextMenu, selectedPanel } from './store.svelte'
import { get } from "svelte/store";
import { currentPlatform } from './store.svelte'
const platform = get(currentPlatform);


export function contextMenu(){
    let contextmenu:HTMLElement;
    onMount(()=>{
        if(platform() === "android" || platform() === "ios"){
            contextmenu = document.getElementById('contextmenu-phone') as HTMLElement;
        }else{
            contextmenu = document.getElementById('contextmenu') as HTMLElement;
        }

        window.addEventListener("contextmenu", event =>{
            event.preventDefault(); 
            if(get(canShowContextMenu)){
                if(!(platform() === "android" || platform() === "ios")){
                    contextmenu.style.top = event.clientY+"px";
                    contextmenu.style.left = event.clientX+"px";
                }
                contextmenu.style.display = 'block';
                visibleContextMenu.set(true);
            }else{
              contextmenu.style.display = 'none'
              visibleContextMenu.set(false);
            }
        })

        if(platform() === "android" || platform() === "ios"){
            const containerGlobal = document.getElementById("container") as HTMLElement;
            const bottomLibrary = document.getElementById("bottom-library") as HTMLElement;
            /*
            containerGlobal.addEventListener('scroll', ()=>{
                contextmenu.style.display = 'none'
                visibleContextMenu.set(false);
            })
            containerGlobal.addEventListener('scroll', ()=>{
                contextmenu.style.display = 'none'
                visibleContextMenu.set(false);
            })
            */
        }

        window.addEventListener('click', ()=>{
            setTimeout(() => {
                contextmenu.style.display = 'none'
                visibleContextMenu.set(false);
            }, 10);
        })


    })

    selectedPanel.subscribe(value=>{
      setTimeout(() => {

        if(value == "home" && !(platform() === "android" || platform() === "ios")){
            const bottomHome = document.getElementById("container-home");
            if(bottomHome)
            bottomHome.addEventListener("scroll", ()=>{
                setTimeout(() => {
                    contextmenu.style.display = 'none'
                    visibleContextMenu.set(false);
                }, 10);
            })
    
          }

        if(value == "library" && !(platform() === "android" || platform() === "ios")){
          const bottomLibrary = document.getElementById("bottom-library");
          if(bottomLibrary)
          bottomLibrary.addEventListener("scroll", ()=>{
            setTimeout(() => {
                contextmenu.style.display = 'none'
                visibleContextMenu.set(false);
            }, 10);
          })
        }
        
      }, 250);


    })

}