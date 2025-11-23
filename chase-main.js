// Main Application
let scene, camera, renderer;
let sonic, roadRunner, terrain, forest, desert, effects;
let cameraController;
let chaseDistance = 10;
let currentDistance = 0;
let clock;

function init() {
    try {
        // Check if THREE.js is loaded
        if (typeof THREE === 'undefined') {
            console.error('THREE.js is not loaded!');
            updateLoadingProgress(0, "Error: THREE.js not loaded");
            return;
        }

        // Update loading progress
        updateLoadingProgress(10, "Creating scene...");

        // Scene setup
        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x89cff0, 50, 200);

        // Camera
        camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 8, 15);

        // Renderer
        renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('canvas3d'),
            antialias: true,
            alpha: false
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;

        updateLoadingProgress(20, "Building terrain...");

        // Create terrain and road
        terrain = new TerrainSystem(scene);

        updateLoadingProgress(35, "Growing forest...");

        // Create environments
        forest = new ForestEnvironment(scene, terrain);

        updateLoadingProgress(50, "Creating desert...");

        desert = new DesertEnvironment(scene, terrain);

        updateLoadingProgress(65, "Spawning Sonic...");

        // Create characters
        sonic = new SonicCharacter(scene);
        sonic.setPosition(0, 1, 5);

        updateLoadingProgress(75, "Spawning Road Runner...");

        roadRunner = new RoadRunnerCharacter(scene);
        roadRunner.setPosition(0, 1, -5);

        updateLoadingProgress(85, "Adding effects...");

        // Effects
        effects = new EffectsSystem(scene);

        // Lighting
        setupLighting();

        updateLoadingProgress(95, "Finalizing...");

        // Camera controller
        cameraController = new CameraController(camera, sonic.getPosition());

        // Clock for delta time
        clock = new THREE.Clock();

        // Event listeners
        window.addEventListener('resize', onWindowResize);
        window.addEventListener('keydown', onKeyDown);

        updateLoadingProgress(100, "Ready!");

        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
            animate();
        }, 500);
    } catch (error) {
        console.error('Error initializing scene:', error);
        updateLoadingProgress(0, "Error: " + error.message);
    }
}

function setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Hemisphere light for natural outdoor lighting
    const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x6b8e23, 0.6);
    scene.add(hemisphereLight);

    // Directional light (sun)
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
    sunLight.position.set(100, 150, -200);
    sunLight.castShadow = true;

    // Shadow settings
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 500;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;

    scene.add(sunLight);
}

function updateLoadingProgress(percent, text) {
    const progressBar = document.getElementById('loading-progress');
    const loadingText = document.getElementById('loading-text');

    if (progressBar) {
        progressBar.style.width = percent + '%';
    }
    if (loadingText) {
        loadingText.textContent = text;
    }
}

function animate() {
    requestAnimationFrame(animate);

    const deltaTime = clock.getDelta();
    const speed = 1.0;

    // Update chase distance
    currentDistance += deltaTime * 15;

    // Get road positions
    const roadRunnerPos = terrain.getRoadPosition(currentDistance);
    const sonicPos = terrain.getRoadPosition(currentDistance - chaseDistance);

    // Update Road Runner - use terrain height directly
    roadRunner.setPosition(roadRunnerPos.x, roadRunnerPos.y, roadRunnerPos.z);
    roadRunner.update(deltaTime, speed);

    // Update Sonic - use terrain height directly
    sonic.setPosition(sonicPos.x, sonicPos.y, sonicPos.z);
    sonic.update(deltaTime, speed);

    // Update environments
    forest.update(deltaTime);
    desert.update(deltaTime);
    effects.update(deltaTime);

    // Update camera
    cameraController.target.copy(sonic.getPosition());
    cameraController.update(deltaTime);

    // Update fog based on environment
    if (currentDistance > 100) {
        // Desert fog (warmer, hazier)
        scene.fog.color.setHex(0xdaa588);
    } else {
        // Forest fog (cooler)
        scene.fog.color.setHex(0x89cff0);
    }

    // Render
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(event) {
    if (event.code === 'Space') {
        event.preventDefault();
        cameraController.toggleMode();
    }
}

// Start the application
window.addEventListener('load', init);
