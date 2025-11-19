/**
 * collections.js - Logic for the Collections page
 *
 * 1. Fetches products from JSON
 * 2. Renders products to the grid
 * 3. Handles all client-side filtering (category, metal, price, search)
 */

document.addEventListener('DOMContentLoaded', () => {
    let allProducts = []; // To store all fetched products
    const productGrid = document.getElementById('product-grid');
    const noResultsEl = document.getElementById('no-results');

    // Filter Elements
    const categoryFilters = document.querySelectorAll('#filter-category input[type="checkbox"]');
    const metalFilters = document.querySelectorAll('#filter-metal input[type="checkbox"]');
    const priceFilter = document.getElementById('filter-price');
    const priceValue = document.getElementById('price-value');
    const clearFiltersBtn = document.getElementById('clear-filters');
    
    // Note: searchInput is fetched inside applyFilters and fetchProducts

    // --- 1. Fetch Products ---
    async function fetchProducts() {
        try {
            const response = await fetch('js/data/product-sample.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allProducts = await response.json();
            
            // Check for URL category params
            applyUrlFilters();

            // Check for URL search param
            const params = new URLSearchParams(window.location.search);
            const searchTerm = params.get('search');
            const searchInput = document.getElementById('global-search-input');
            
            if (searchTerm && searchInput) {
                // 1. Put the term in the search bar
                searchInput.value = searchTerm;
            }

            // 2. Apply all filters (including the new search term)
            applyFilters(); 
            
        } catch (error) {
            console.error("Failed to fetch products:", error);
            if (productGrid) {
                productGrid.innerHTML = "<p>Error loading products. Please try again later.</p>";
            }
        }
    }

    // --- 2. Render Products ---
    function renderProducts(productsToRender) {
        if (!productGrid) return; 
        
        productGrid.innerHTML = ''; // Clear grid
        
        if (productsToRender.length === 0) {
            if (noResultsEl) noResultsEl.style.display = 'block';
            return;
        }
        
        if (noResultsEl) noResultsEl.style.display = 'none';

        const wishlist = getWishlist(); // from main.js

        productsToRender.forEach(product => {
            const isWishlisted = wishlist.includes(product.id);
            const productCard = document.createElement('div');
            productCard.className = 'product-card anim-fade-in'; // Added animation class
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
                <button class="product-card__wishlist-btn ${isWishlisted ? 'active' : ''}" data-product-id="${product.id}" aria-label="Toggle Wishlist">
                    <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </button>
            `;
            productGrid.appendChild(productCard);
        });

        addWishlistListeners();
    }

    // --- 3. Apply Filters ---
    function applyFilters() {
        let filteredProducts = [...allProducts];

        // (THIS IS THE FIX)
        // 1. Get the search input element
        const searchInput = document.getElementById('global-search-input');
        
        // 2. Get the search term *directly from the input's value*
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        
        // 3. Now, filter based on that term
        if (searchTerm) {
            filteredProducts = filteredProducts.filter(p => 
                p.name.toLowerCase().includes(searchTerm) || 
                p.category.toLowerCase().includes(searchTerm) ||
                p.metal.toLowerCase().includes(searchTerm)
            );
        }

        // Category
        const selectedCategories = getSelectedCheckboxes(categoryFilters);
        if (selectedCategories.length > 0) {
            filteredProducts = filteredProducts.filter(p => selectedCategories.includes(p.category));
        }

        // Metal
        const selectedMetals = getSelectedCheckboxes(metalFilters);
        if (selectedMetals.length > 0) {
            filteredProducts = filteredProducts.filter(p => selectedMetals.includes(p.metal));
        }

        // Price
        if (priceFilter) {
            const maxPrice = parseInt(priceFilter.value, 10);
            if (priceValue) priceValue.textContent = `₹${maxPrice.toLocaleString('en-IN')}`;
            filteredProducts = filteredProducts.filter(p => p.price <= maxPrice);
        }

        renderProducts(filteredProducts);
    }

    // Helper: Get selected checkbox values
    function getSelectedCheckboxes(checkboxes) {
        const values = [];
        let allChecked = false;
        checkboxes.forEach(cb => {
            if (cb.checked) {
                if (cb.value === 'all') allChecked = true;
                else values.push(cb.value);
            }
        });
        return allChecked ? [] : values;
    }
    
    // Helper: Logic for 'All' checkbox
    function setupCheckboxLogic(checkboxes) {
        if (checkboxes.length === 0) return;
        
        const allCheckbox = checkboxes[0];
        const otherCheckboxes = Array.from(checkboxes).slice(1);
        
        allCheckbox.addEventListener('change', () => {
            if (allCheckbox.checked) {
                otherCheckboxes.forEach(cb => cb.checked = false);
            }
            applyFilters();
        });
        
        otherCheckboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                if (cb.checked) {
                    allCheckbox.checked = false;
                }
                if (otherCheckboxes.every(c => !c.checked)) {
                    allCheckbox.checked = true;
                }
                applyFilters();
            });
        });
    }
    
    // Apply filters from URL parameters
    function applyUrlFilters() {
        const params = new URLSearchParams(window.location.search);
        const category = params.get('category');
        
        if (category) {
            categoryFilters.forEach(cb => {
                cb.checked = (cb.value === category);
                if (cb.value === 'all' && category) {
                    cb.checked = false;
                }
            });
        }
    }

    // --- 4. Event Listeners ---
    
    // Wishlist Buttons
    function addWishlistListeners() {
        document.querySelectorAll('.product-card__wishlist-btn').forEach(btn => {
            if (btn.dataset.listenerAttached) return;
            
            btn.addEventListener('click', () => {
                const productId = parseInt(btn.dataset.productId, 10);
                const added = toggleWishlist(productId); // from main.js
                btn.classList.toggle('active', added);
            });
            btn.dataset.listenerAttached = true;
        });
    }

    // Filters
    setupCheckboxLogic(categoryFilters);
    setupCheckboxLogic(metalFilters);
    if (priceFilter) priceFilter.addEventListener('input', applyFilters);
    
    // Listen for typing in the search bar
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            categoryFilters.forEach((cb, i) => cb.checked = (i === 0)); // Check 'All'
            metalFilters.forEach((cb, i) => cb.checked = (i === 0)); // Check 'All'
            if (priceFilter) priceFilter.value = priceFilter.max;
            if (searchInput) searchInput.value = '';
            applyFilters();
        });
    }

    // --- Initialization ---
    fetchProducts();
});