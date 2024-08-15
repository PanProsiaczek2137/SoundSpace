let selectedItem = 1;  // Ta zmienna określa, który element jest wybrany

document.addEventListener('DOMContentLoaded', function() {
    const items = document.querySelectorAll('.item');

    function updateItems() {
      items.forEach(function(item, index) {
        const itemIndex = index + 1;
        const distance = Math.abs(itemIndex - selectedItem);

        let scale;
        let brightness;
        let zindex;

        if (distance === 0) {
          // Wybrany element
          scale = 1.5;
          brightness = 1.2;
          zindex = 3;
        } else if (distance === 1) {
          // Elementy sąsiadujące
          scale = 1.25;
          brightness = 1.0;
          zindex = 2;
        } else {
          // Pozostałe elementy
          scale = 1.0;
          brightness = 0.8;
          zindex = 1;
        }

        item.style.transform = `scale(${scale})`;
        item.style.filter = `brightness(${brightness})`;
        item.style.zIndex = zindex;
      });
    }

    // Ustawienie wybranego elementu
    function setSelectedItem(index) {
      selectedItem = index;
      updateItems();
    }

    setSelectedItem(1); // Początkowy wybór

    // Interaktywny wybór elementu co 3 sekundy
    window.addEventListener('wheel', function(event) {
        if (event.deltaY < 0) {
            setSelectedItem(selectedItem = selectedItem -1);
            console.log(selectedItem);
            // Tutaj możesz dodać kod, który wykona się podczas scrollowania w górę
        } else if (event.deltaY > 0) {
            setSelectedItem(selectedItem = selectedItem +1);
            console.log(selectedItem);
            // Tutaj możesz dodać kod, który wykona się podczas scrollowania w dół
        }
    });
    

    /*setInterval(() => {
      let index = parseInt(prompt('Który element wybrać? (1-5)'), 10);
      if (index >= 1 && index <= 5) {
        setSelectedItem(index);
      } else {
        alert('Proszę podać liczbę z przedziału 1-5.');
      }
    }, 3000); // Zmieniono czas na 3 sekundy dla lepszego doświadczenia*/
  });