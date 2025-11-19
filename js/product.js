/**
 * product.js - प्रोडक्ट डिटेल पेज का लॉजिक
 *
 * 1. URL से प्रोडक्ट ID पाना
 * 2. JSON से उस प्रोडक्ट का डेटा फ़ेच करना
 * 3. पेज पर डिटेल्स रेंडर करना
 * 4. 3D व्यूअर (Three.js) को इनिशियलाइज़ करना या फॉलबैक इमेज दिखाना
 * 5. "Add to Wishlist" बटन का लॉजिक
 * 6. "Contact to Buy" फॉर्म (Modal) का लॉजिक
 */

document.addEventListener('DOMContentLoaded', () => {
    const productDetailContainer = document.getElementById('product-detail-container');
    const modal = document.getElementById('contact-to-buy-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const enquiryForm = document.getElementById('enquiry-form');

    let currentProduct = null; // वर्तमान प्रोडक्ट का डेटा स्टोर करने के लिए

    // --- 1. & 2. ID पाना और डेटा फ़ेच करना ---
    async function loadProduct() {
        const params = new URLSearchParams(window.location.search);
        const productId = parseInt(params.get('id'), 10);

        if (!productId) {
            productDetailContainer.innerHTML = "<p>Product not found. <a href='collections.html'>Go back to collections</a>.</p>";
            return;
        }

        try {
            const response = await fetch('js/data/product-sample.json');
            const products = await response.json();
            currentProduct = products.find(p => p.id === productId);

            if (!currentProduct) {
                throw new Error('Product not found in data');
            }

            renderProduct(currentProduct);

        } catch (error) {
            console.error("Failed to load product:", error);
            productDetailContainer.innerHTML = "<p>Error loading product details. Please try again.</p>";
        }
    }

    // --- 3. पेज रेंडर करना ---
    function renderProduct(product) {
        document.title = `${product.name} - Anand Jewels`; // पेज टाइटल अपडेट करें
        
        const wishlist = getWishlist(); // main.js से
        const isWishlisted = wishlist.includes(product.id);

        productDetailContainer.innerHTML = `
            <div class="product-viewer" id="product-viewer-container">
                <div class="loading-spinner"></div>
            </div>
            
            <div class="product-info">
                <h1>${product.name}</h1>
                <span class="product-info__sku">SKU: ${product.sku}</span>
                <p class="product-info__price">₹${product.price.toLocaleString('en-IN')}</p>
                <p class="product-info__description">${product.description}</p>
                
                <div class="product-info__actions">
                    <button class="btn btn-secondary" id="wishlist-toggle-btn" data-product-id="${product.id}">
                        ${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    </button>
                    <button class="btn btn-primary" id="contact-to-buy-btn">Contact to Buy</button>
                </div>
            </div>
        `;

        // --- 4. 3D व्यूअर या फॉलबैक ---
        const viewerContainer = document.getElementById('product-viewer-container');
        if (product.modelUrl && typeof initThreeViewer === 'function') {
            // three-viewer.js से फंक्शन कॉल करें
            try {
                initThreeViewer(product.modelUrl, viewerContainer);
            } catch (error) {
                console.error("3D Viewer Error:", error);
                // 3D फेल होने पर फॉलबैक
                showFallbackImage(product, viewerContainer);
            }
        } else {
            // 3D मॉडल नहीं है, फॉलबैक इमेज दिखाएं
            showFallbackImage(product, viewerContainer);
        }

        // --- 5. & 6. इवेंट लिसनर्स ---
        addPageListeners(product);
    }
    
    // फॉलबैक इमेज दिखाने के लिए हेल्पर
    function showFallbackImage(product, container) {
        container.innerHTML = `<img src="${product.imageUrl || 'assets/images/product-placeholder.png'}" alt="${product.name}" class="product-viewer-fallback">`;
    }

    // पेज के बटन्स के लिए लिसनर्स
    function addPageListeners(product) {
        // विशलिस्ट
        const wishlistBtn = document.getElementById('wishlist-toggle-btn');
        wishlistBtn.addEventListener('click', () => {
            const added = toggleWishlist(product.id); // main.js से
            wishlistBtn.textContent = added ? 'Remove from Wishlist' : 'Add to Wishlist';
        });

        // "Contact to Buy" Modal
        const contactBtn = document.getElementById('contact-to-buy-btn');
        contactBtn.addEventListener('click', () => {
            document.getElementById('enquiry-product-name').textContent = product.name;
            document.getElementById('enquiry-sku').value = product.sku;
            modal.classList.add('active');
        });
    }

    // Modal बंद करने के लिसनर्स
    modalCloseBtn.addEventListener('click', () => modal.classList.remove('active'));
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Enquiry फॉर्म वैलिडेशन (contact.js जैसा)
    enquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // (यहाँ सिम्पल वैलिडेशन, आप चाहें तो contact.js से रियूज़ कर सकते हैं)
        const name = document.getElementById('enquiry-name');
        const email = document.getElementById('enquiry-email');
        const successMsg = document.getElementById('enquiry-success');
        
        if (name.value.trim() === '' || email.value.trim() === '') {
            alert('Please fill in Name and Email.');
            return;
        }
        
        // डेमो: सबमिट होने पर
        enquiryForm.style.display = 'none';
        successMsg.style.display = 'block';
        
        // 2 सेकंड बाद Modal बंद करें
        setTimeout(() => {
            modal.classList.remove('active');
            enquiryForm.style.display = 'block';
            successMsg.style.display = 'none';
            enquiryForm.reset();
        }, 2000);
    });

    // इनिशियलाइज़ेशन
    loadProduct();
});