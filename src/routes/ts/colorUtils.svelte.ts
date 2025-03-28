// colorUtils.ts
export function adjustBrightness(hex: string, percent: number) {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    r = Math.min(255, Math.max(0, r + (255 - r) * percent));
    g = Math.min(255, Math.max(0, g + (255 - g) * percent));
    b = Math.min(255, Math.max(0, b + (255 - b) * percent));

    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

export function adjustDarkness(hex: string, percent: number) {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    r = Math.min(255, Math.max(0, r - (r * percent)));
    g = Math.min(255, Math.max(0, g - (g * percent)));
    b = Math.min(255, Math.max(0, b - (b * percent)));

    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

export function isDarkColor(hex: string): boolean {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    let brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
    return brightness < 0.5; // Jeśli jasność < 0.5, uznajemy kolor za ciemny
}

export function updateColors(color: string, shadeFactor: number) {
    const darkMode = isDarkColor(color);

    const whiteColor = darkMode ? "#FFFFFF" : "#000000";
    const darkWhiteColor = adjustDarkness(whiteColor, shadeFactor); // Ciemniejszy od white
    const lightBlackColor = darkMode ? adjustBrightness(color, shadeFactor) : adjustDarkness(color, shadeFactor); // Rozjaśnianie lub ściemnianie

    // Zapisywanie ustawień do localStorage
    localStorage.setItem('color', color);
    localStorage.setItem('shadeFactor', String(shadeFactor));

    document.documentElement.style.setProperty("--black", color);
    document.documentElement.style.setProperty("--ligth-black", lightBlackColor);
    document.documentElement.style.setProperty("--white", whiteColor);
    document.documentElement.style.setProperty("--dark-white", darkWhiteColor);
}




export function showScroll(show: string) {
    let styleTag = document.getElementById('dynamicStyles');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'dynamicStyles';
        document.head.appendChild(styleTag);
    }

    if (show == "true") {
        // Kiedy checkbox jest zaznaczony, włącz pasek przewijania
        styleTag.innerHTML = `
            .scrollY {
                overflow-y: auto;
                scrollbar-width: thin;
                scrollbar-color: var(--dark-white) var(--black);
            }
            .scrollY::-webkit-scrollbar {
                width: 8px;
            }
            .scrollY::-webkit-scrollbar-track {
                background: #ccc;
            }
            .scrollY::-webkit-scrollbar-thumb {
                background-color: #888;
            }
            .scrollY::-webkit-scrollbar-button {
                display: none !important;
            }
            .scrollY::-webkit-scrollbar-button:start,
            .scrollY::-webkit-scrollbar-button:end {
                display: none !important;
            }
            .scrollY {
                -ms-overflow-style: none;
            }

            .scrollX {
                overflow-x: auto;
                scrollbar-width: thin;
                scrollbar-color: var(--dark-white) var(--black);
            }
            .scrollX::-webkit-scrollbar {
                height: 8px;
            }
            .scrollX::-webkit-scrollbar-track {
                background: #ccc;
            }
            .scrollX::-webkit-scrollbar-thumb {
                background-color: #888;
            }
            .scrollX::-webkit-scrollbar-button {
                display: none !important;
            }
            .scrollX::-webkit-scrollbar-button:start,
            .scrollX::-webkit-scrollbar-button:end {
                display: none !important;
            }
            .scrollX {
                -ms-overflow-style: none;
            }
        `;
    } else {
        // Kiedy checkbox jest odznaczony, ukryj paski przewijania
        styleTag.innerHTML = `
            .scrollY::-webkit-scrollbar {
                width: 0 !important; /* Ukryj suwak */
            }
            .scrollX::-webkit-scrollbar {
                height: 0 !important; /* Ukryj suwak */
            }

            .scrollY {
                overflow-y: scroll !important; /* Pozostaw przewijanie, ale ukryj suwak */
                scrollbar-color: transparent transparent !important; /* Zrób suwak niewidoczny */
            }

            .scrollX {
                overflow-x: scroll !important; /* Pozostaw przewijanie, ale ukryj suwak */
                scrollbar-color: transparent transparent !important; /* Zrób suwak niewidoczny */
            }
        `;
    }
}