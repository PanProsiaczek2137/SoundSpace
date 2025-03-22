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
