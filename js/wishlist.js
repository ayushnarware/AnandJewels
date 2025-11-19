/**
 * wishlist.js - Logic for the dedicated Wishlist page
 *
 * 1. Fetches ALL products
 * 2. Gets wishlist IDs from localStorage
 * 3. Filters products to show only wishlisted items
 * 4. Renders the wishlisted items
 * 5. Handles removing items from the wishlist
 */

document.addEventListener('DOMContentLoaded', () => {
    
    const wishlistGrid = document.getElementById('wishlist-grid');
    const emptyMsg = document.getElementById('wishlist-empty-msg');
    
    let allProducts = [];

    // --- 1. Fetch All Products ---
    async function fetchAllProducts() {
        try {
            const response = await fetch('js/data/product-sample.json');
            if (!response.ok) throw new Error("Failed to fetch product data");
            allProducts = await response.json();
            
            // Once products are fetched, render the wishlist
            renderWishlist();
            
        } catch (error) {
            console.error("Error fetching products:", error);
            wishlistGrid.innerHTML = "<p>Could not load wishlist. Please try again later.</p>";
        }
    }

    // --- 2. Render Wishlist Items ---
    function renderWishlist() {
        const wishlist = getWishlist(); // from main.js
        
        if (wishlist.length === 0) {
            if (emptyMsg) emptyMsg.style.display = 'block';
            wishlistGrid.innerHTML = ''; // Clear any old items
            return;
        }

        if (emptyMsg) emptyMsg.style.display = 'none';
        
        // Filter the 'allProducts' array to find matches
        const wishlistProducts = allProducts.filter(product => wishlist.includes(product.id));
        
        wishlistGrid.innerHTML = ''; // Clear grid
        
        wishlistProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.setAttribute('id', `product-card-${product.id}`); // Add ID for easy removal
            productCard.innerHTML = `
                <div class="product-card__image-container">
                    <a href="product.html?id=${product.id}">
                        <img src="${product.imageUrl || 'assets/images/product-placeholder.png'}" alt="${product.name}" class="product-card__image" loading="lazy">
                    </a>
                </div>
                <div class="product-card__info">
                    <a href="product.html?id=${product.id}">
                        <h3 class="product-card__name">${product.name}</h3>
                    </a>
                    <p class="product-card__price">₹${product.price.toLocaleString('en-IN')}</p>
                </div>
                <button class="product-card__wishlist-btn active" data-product-id="${product.id}" aria-label="Remove from Wishlist">
                    <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </button>
            `;
            wishlistGrid.appendChild(productCard);
        });
        
        // Add event listeners
        addWishlistListeners();
    }
    
    // --- 3. Add Event Listeners ---
    function addWishlistListeners() {
        document.querySelectorAll('.product-card__wishlist-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = parseInt(btn.dataset.productId, 10);
                
                // Toggle the wishlist (it will be removed)
                toggleWishlist(productId); // from main.js
                
                // Remove the card from the DOM
                const cardToRemove = document.getElementById(`product-card-${productId}`);
                if (cardToRemove) {
                    cardToRemove.remove();
                }
                
                // Check if the wishlist is now empty
                if (getWishlist().length === 0) {
                    if (emptyMsg) emptyMsg.style.display = 'block';
                }
            });
        });
    }

    // --- Initialization ---
    fetchAllProducts();
});