import { listen } from '@tauri-apps/api/event';

export function runBlueTooth(){
    const test = document.getElementById('testtt') as HTMLParagraphElement;
    test.innerText = "dev mode on"

    listen('blec://input', (event) => {


        console.log('Odebrano zdarzenie BLE:', event.payload);
        
        if (event.payload === 'PLAY') {
            console.log('Odtwarzanie muzyki');
            const container = document.getElementById("container") as HTMLElement;
            container.style.backgroundColor = "red";
            // Wywołaj funkcję play/pause w odtwarzaczu
        } else if (event.payload === 'NEXT') {
            console.log('Następny utwór');
            // Przełącz na kolejny utwór
        } else if (event.payload === 'PREV') {
            console.log('Poprzedni utwór');
            // Przełącz na poprzedni utwór
        }

        setInterval(() => {
            test.innerText = JSON.stringify(event);
        }, 4000);
        
    });
    
}