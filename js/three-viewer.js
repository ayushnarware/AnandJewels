// 3D viewer module (three-viewer) 
/**
 * three-viewer.js - 3D मॉडल रेंडरिंग मॉड्यूल (Three.js)
 *
 * यह 'initThreeViewer' फंक्शन एक्सपोर्ट करता है (ग्लोबल स्कोप पर)
 * जिसे product.js द्वारा कॉल किया जाता है।
 */

// सुनिश्चित करें कि Three.js लाइब्रेरी लोड हो चुकी है
if (typeof THREE === 'undefined') {
    console.error("Three.js is not loaded. 3D viewer will not work.");
}

function initThreeViewer(modelUrl, container) {
    
    // --- 1. बेसिक सेटअप ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf9f9f9); // बैकग्राउंड कलर

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 2.5; // कैमरा की दूरी (मॉडल के साइज़ पर निर्भर)

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.innerHTML = ''; // लोडिंग स्पिनर हटाएं
    container.appendChild(renderer.domElement);
    
    // --- 2. लोडर (GLTF/GLB) ---
    const loader = new THREE.GLTFLoader();
    loader.load(
        modelUrl,
        // ऑन-लोड
        function (gltf) {
            const model = gltf.scene;
            
            // मॉडल को सेंटर करें (वैकल्पिक, लेकिन उपयोगी)
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center); // सेंटर पर लाएं
            
            scene.add(model);
            
            // लोडिंग खत्म होने पर स्पिनर हटा दें (अगर कोई है)
            const spinner = container.querySelector('.loading-spinner');
            if (spinner) spinner.style.display = 'none';
        },
        // ऑन-प्रोग्रेस (वैकल्पिक)
        function (xhr) {
            // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        // ऑन-एरर
        function (error) {
            console.error('An error happened while loading the 3D model:', error);
            container.innerHTML = '<p>Could not load 3D model.</p>';
        }
    );

    // --- 3. लाइटिंग ---
    // एम्बिएंट लाइट (चारों ओर)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // डायरेक्शनल लाइट (सूरज जैसी)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // --- 4. कंट्रोल्स (OrbitControls) ---
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // स्मूथ मूवमेंट
    controls.dampingFactor = 0.05;
    controls.autoRotate = true; // ऑटो-रोटेट
    controls.autoRotateSpeed = 1.0;
    controls.enableZoom = true;

    // --- 5. रेंडर लूप ---
    function animate() {
        requestAnimationFrame(animate);

        controls.update(); // कंट्रोल्स अपडेट करें
        renderer.render(scene, camera);
    }
    
    animate();

    // --- 6. रेस्पॉन्सिव हैंडलिंग ---
    window.addEventListener('resize', () => {
        if (container.clientWidth > 0 && container.clientHeight > 0) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    });
}