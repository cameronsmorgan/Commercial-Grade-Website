const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

// Add click event to each card image to open in lightbox
document.querySelectorAll('.card-image').forEach(image => {
    image.addEventListener('click', () => {
        lightbox.style.display = 'flex';  // Show the lightbox
        lightboxImg.src = image.src;      // Set the clicked image as the lightbox image
    });
});

// Add click event to close the lightbox when clicking outside the image
lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg) {       // Ensure only background clicks close it
        lightbox.style.display = 'none';  // Hide the lightbox
    }
});