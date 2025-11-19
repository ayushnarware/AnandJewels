/**
 * main.js - Global site scripts
 *
 * 1. Mobile Navigation (Toggle)
 * 2. Search Bar (Toggle)
 * 3. Wishlist Count (from localStorage)
 * 4. Theme Toggle (Light/Dark Mode)
 * 5. Global Search (Redirect on Enter) <-- (FIX: This part was missing)
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Navigation
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('active');
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    }

    // 2. Search Bar
    const searchBtn = document.getElementById('search-btn');
    const searchBar = document.getElementById('search-bar');
    const searchClose = document.getElementById('search-close');

    if (searchBtn) {
        // --- This code opens the search bar ---
        searchBtn.addEventListener('click', () => {
            if (searchBar) {
                searchBar.classList.add('active');
            }
            // Optional: auto-focus the input field
            const searchInput = document.getElementById('global-search-input');
            if (searchInput) {
                searchInput.focus();
            }
        });
    }

    if (searchClose) {
        // --- This code closes the search bar ---
        searchClose.addEventListener('click', () => {
            if (searchBar) {
                searchBar.classList.remove('active');
            }
        });
    }

    // 3. Wishlist Count
    updateWishlistCount();
    
    // 4. Theme Toggle
    initThemeToggle();

    // (FIX: This function call was missing)
    // 5. Global Search
    initGlobalSearch();

}); // End of DOMContentLoaded

/**
 * Retrieves the current wishlist from localStorage.
 * @returns {Array<number>} An array of product IDs.
 */
function getWishlist() {
    return JSON.parse(localStorage.getItem('wishlist') || '[]');
}

/**
 * Updates the wishlist count bubble in the header.
 */
function updateWishlistCount() {
    const wishlistCountEl = document.getElementById('wishlist-count');
    if (wishlistCountEl) {
        const wishlist = getWishlist();
        wishlistCountEl.textContent = wishlist.length;
    }
}

/**
 * Toggles a product in the wishlist.
 * @param {number} productId - The ID of the product to add/remove.
 * @returns {boolean} - Returns true if the item was added, false if removed.
 */
function toggleWishlist(productId) {
    let wishlist = getWishlist();
    const productIndex = wishlist.indexOf(productId);

    if (productIndex > -1) {
        // Item exists, remove it
        wishlist.splice(productIndex, 1);
    } else {
        // Item doesn't exist, add it
        wishlist.push(productId);
    }

    // Update localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    // Update header count
    updateWishlistCount();
    
    return productIndex === -1; // true if added
}


/**
 * Initializes the theme toggle functionality.
 * Checks localStorage and system preference.
 */
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const darkThemeClass = 'dark-theme';
    
    // Check for saved theme in localStorage
    let currentTheme = localStorage.getItem('theme');
    
    // If no theme in localStorage, check system preference
    if (!currentTheme) {
        currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    // Apply the theme
    if (currentTheme === 'dark') {
        document.body.classList.add(darkThemeClass);
    }

    // Add click listener to the toggle button
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            // Toggle the class on the body
            document.body.classList.toggle(darkThemeClass);
            
            // Update the theme in localStorage
            let themeToSave = document.body.classList.contains(darkThemeClass) ? 'dark' : 'light';
            localStorage.setItem('theme', themeToSave);
        });
    }
}

// (FIX: This entire function was missing)
/**
 * (THIS IS THE IMPORTANT FUNCTION FOR SEARCH)
 * Initializes the global search form listener.
 * Redirects any search to the collections page.
 */
function initGlobalSearch() {
    const searchForm = document.getElementById('global-search-form');
    const searchInput = document.getElementById('global-search-input');

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop the form from submitting normally
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm) {
                // Redirect to collections page with a search query
                window.location.href = `collections.html?search=${encodeURIComponent(searchTerm)}`;
            }
        });
    }
}