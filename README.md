# SoundSpace 🎶
SoundSpace to open-source'owy odtwarzacz muzyki na **Androida** i **Desktop**. Prosty, szybki i łatwy w użyciu, obsługujący lokalne pliki muzyczne. wciąż w fazie rozwoju!

<h2> Instalacja </h2>
<h3>Desctop</h3>
<h4>Upewnij się, że masz zainstalowane następujące narzędzia:</h4>
Node.js, Rust, Cargo, Tauri CLI
<h4>sklonuj repozytorium</h4>
git clone https://github.com/PanProsiaczek2137/SoundSpace.git
<h4>Zainstaluj zależności NPM</h4>
npm install
<h4>budowanie aplikacji</h4>
tauri dev
<h4>skompiluj aplikację</h4>
tauri build

<h3>Android</h3>
<h4>Upewnij się, że masz zainstalowane następujące narzędzia:</h4>
Node.js, Rust, Cargo, Tauri CLI, Android Studio, Java Development Kit (JDK), Gradle
<h4>Zainstaluj zależności NPM i zainicjuj aplikację android</h4>
npm install
tauri android init
<h4>zbuduj aplikację</h4>
tauri android build
<h4>nie zapomnij jej podpisać</h4>
używając keytool dostarczonego przez JDK

## Do zrobienia
 ✔ odczytywanie i zapizywanie metadanych plików<br>
 ✔ podświetlenie się granego utworu i możliwość scrolowania z trzymaniem utworu<br>
 ✔ sktóry klawiszowe<br>
 ✔ naprawienie że jak klikasz na utwór w bibliotece i niema filtra to ci go weźmie do odtwarzania<br>
 ✔ nie można wybrać nowej piosenki kiedy dropdown bądź context menu jest włączone<br>
 ✔ naprawienie filtrów na telefonie<br>
 ✔ naprawienie przesuwania piosenek na telefonie<br>
 ✔ dodanie wszystkich działającuch opcji do contextMenu i poprawienie wyglądu na telefonie<br>
 ✔ po kliknięciu przesuwa na górę bądź na dół<br>
 ✔ stworzenie i działanie zakładki settings (zakładki: Ogólne, Wygląd, Sktóty Klawiszowe, Odtwarzanie, Informacje, Rozszerzenia)<br>
 ✔ jak zmienisz kolejność piosenek to czas odtwarzanej zostaje taki sam<br>
 ✔ zrobić ładny ekran ładowanie się matadanych i włanczania aplikacji<br>
 ✔ zrobić aby home działo<br>
 ✔ przesuwanie piosenek na telefonie i ogłulnie porawki aby nie wkurzało z korzystania<br>
 ✔ szukanie w filtrze<br>
 ✔ zoptymalizowanie debugowanie dopieszczenie i częściowe odspagetytyfikowanie kodu<br>
 ✨ cieszenie się że już nie muszę się męczyć z tym ciągnącym się projektem<br>

## Do zrobienia kiedyś
 - menu bar do skipowania stopoawnia i sprawdzania czasu jako powiadomienie na telefonie<br>
 - ustawienie wielkości textu i czy ma być bold<br>
 - dodawanie do playlist<br>
 - przyśpieszyć przesuwanie sticky scroll<br>

## Licencja
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
