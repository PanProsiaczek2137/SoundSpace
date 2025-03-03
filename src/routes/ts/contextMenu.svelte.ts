import { onMount } from "svelte";


export function main(){


  /*
    //Blokowanie DevTools
    window.addEventListener("keydown", (event) => {
        if (event.key === "F12" || (event.ctrlKey && event.shiftKey && event.key === "I")) {
          event.preventDefault();
          console.log("DevTools są zablokowane!");
        }
    });

    //Zablokowanie odświerzania (F5)
    window.addEventListener("keydown", (event) => {
        if (event.key === "F5") {
          event.preventDefault();
          console.log(`${event.key} jest zablokowane!`);
        }
    });

    //Zablokowanie wyszukiwania (F3)
    window.addEventListener("keydown", (event) => {
        if (event.key === "F3") {
          event.preventDefault();
          console.log(`${event.key} jest zablokowane!`);
        }
    });
      
    //Blokowanie F7 (przeglądanie z użyciem kursora)
    window.addEventListener("keydown", (event) => {
        if (event.key === "F7") {
          event.preventDefault();
          console.log("Przeglądanie z użyciem kursora (F7) jest zablokowane!");
        }
    });

    //Zablokowanie info pobieranych plików
    window.addEventListener("keydown", (event) => {
        if (event.ctrlKey && event.key.toLowerCase() === "j") {
          event.preventDefault();
          console.log("Ctrl + J jest zablokowane!");
        }
    });    
    
    //Zablokować trzeba też: ctr+p, ctr+u, ctr+r, ctr+f, ctr+g, ctr+shift+i, ctr+shift+p, ctr+shift+g, ctr+shift+c, ctr+shift+s
    */
    



    onMount(()=>{
        const contextmenu = document.getElementById('contextmenu') as HTMLElement;

        window.addEventListener("contextmenu", event =>{
            event.preventDefault();
            contextmenu.style.top = event.clientY+"px";
            contextmenu.style.left = event.clientX+"px";
            contextmenu.style.display = 'block';
        })
        window.addEventListener('click', ()=>{
            contextmenu.style.display = 'none'
        })
    })


}
