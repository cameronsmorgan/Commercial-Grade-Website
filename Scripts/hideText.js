document.addEventListener('DOMContentLoaded', function() {
    // Select all hide buttons
    const hideButtons = document.querySelectorAll('.hide-btn');

    hideButtons.forEach((btn) => {
        btn.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent page reload on link click

            const contentParagraph = this.previousElementSibling; // Get the text paragraph

            // Toggle the 'hidden' class to show/hide the text
            contentParagraph.classList.toggle('hidden');

            // Update the button text based on the visibility of the content
            if (contentParagraph.classList.contains('hidden')) {
                this.textContent = 'ShowText'; // Change the button text to ShowText
            } else {
                this.textContent = 'HideText'; // Change the button text to HideText
            }
        });
    });
});