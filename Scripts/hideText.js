const hideButtons = document.querySelectorAll('.hide-btn');

hideButtons.forEach((btn) => {
    btn.addEventListener('click', function(e) {   // e refers to the event
        e.preventDefault(); // Prevent page reload on link click

        let contentParagraph = this.previousElementSibling; // Get the paragraph 

        
        contentParagraph.classList.toggle('hidden');

        
        if (contentParagraph.classList.contains('hidden')) {
            this.textContent = 'ShowText'; 
        } else {
            this.textContent = 'HideText'; 
        }
    });
});
