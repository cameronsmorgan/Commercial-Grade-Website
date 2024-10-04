
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    const cardContainer = document.querySelector('.card-container');
    let cards = document.querySelectorAll('.card');
    
    let currentIndex = 0;                //init the index
    let maxIndex = cards.length - 3;     //subtracting 3 ensures 3 cards are always visible

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = maxIndex;    //loops around
        }
        updateCarousel();
    });

    nextButton.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
            currentIndex++;
        } else {
            currentIndex = 0;          //loop also
        }
        updateCarousel();
    });


    /*--> this function updates the positions of the card contrainer and lets it slide left or right
      -->  1st line: transformvalue comes from * the negative currentIndex by the width of a card
      -->  2nd line: moves it the container horizontally based on transformvValue*/
    function updateCarousel() {
        let transformValue = -currentIndex * (cards[0].offsetWidth + 20); 
        cardContainer.style.transform = `translateX(${transformValue}px)`;
    }

   // updateCarousel();
