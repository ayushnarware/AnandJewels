# Anand Jewels - Vanilla JS Website Project

This is a fully-functional, responsive, multi-page jewellery website for 'Anand Jewels', built with pure HTML, CSS, and JavaScript. It features a design inspired by premium stores, supports a 3D/360° product view using Three.js, and now includes a Light/Dark theme toggle.

## 🚀 How to Run

No server is required to run this project.

1.  Save this entire folder structure to your local machine.
2.  Open the `index.html` file in your preferred web browser (like Chrome or Firefox).
3.  You can now browse the website, navigate between pages, filter products, and toggle the theme.

## 🛠️ Customization

### 1. Logo
1.  Rename your logo image (e.g., `image_5562ca.png`) to `logo.png`.
2.  Place it in the `/assets/images/` folder, replacing the placeholder if one exists.

### 2. Product Data
1.  All demo products are located in `js/data/product-sample.json`.
2.  Modify this JSON file to add new products or edit existing ones. Ensure the `imageUrl` and `modelUrl` paths are correct.

### 3. 3D Models
1.  This project uses Three.js to load `.glb` or `.gltf` 3D model files.
2.  Place your 3D models into the `/assets/models/` folder.
3.  Update the `modelUrl` path in `product-sample.json` for your product (e.g., `"modelUrl": "assets/models/your-new-ring.glb"`).
4.  If `modelUrl` is `null` or empty for a product, the website will automatically display the static `imageUrl` as a fallback.

## 🎨 Design Choices

* **Fonts**:
    * Headings: 'Cormorant Garamond' (An elegant serif font)
    * Body: 'Montserrat' (A clean, modern sans-serif font)
* **Color Palette (Themeable)**:
    * `--primary-color`: `#bb282e` (The new brand red)
    * `--text-color`: Defined for light/dark modes.
    * `--bg-color`: Defined for light/dark modes.
    * `--card-bg-color`: Defined for light/dark modes.

## 📚 External Libraries

This project uses only **Three.js** for 3D rendering, loaded via CDN in `product.html`:

* `three.min.js` (Core library)
* `GLTFLoader.js` (To load 3D models)
* `OrbitControls.js` (To rotate/zoom the model)"# AnandJewels" 
