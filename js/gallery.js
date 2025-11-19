/**
 * gallery.js - Handles the Lightbox functionality for the E-Gallery
 */

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');

// Open Lightbox
function openLightbox(element) {
    const img = element.querySelector('img');
    const title = element.querySelector('.gallery-overlay span').innerText;

    lightbox.style.display = 'flex'; // Show modal
    lightboxImg.src = img.src;       // Set image
    lightboxCaption.innerText = title; // Set caption
    
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
}

// Close Lightbox
function closeLightbox() {
    lightbox.style.display = 'none';
    // Enable body scroll again
    document.body.style.overflow = 'auto';
}

// Close on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closeLightbox();
    }
});