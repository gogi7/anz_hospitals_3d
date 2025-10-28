import * as THREE from 'three';

export class SceneManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.setupRenderer();
        this.setupCamera();
        this.setupLights();
        this.setupEnvironment();

        this.objects = [];
        this.clickableObjects = [];

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x000000, 0);
    }

    setupCamera() {
        // Isometric camera setup
        const aspect = window.innerWidth / window.innerHeight;
        const frustumSize = 20;

        this.camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / -2,
            0.1,
            1000
        );

        // Position camera for isometric view (similar to Project Hospital)
        this.camera.position.set(20, 20, 20);
        this.camera.lookAt(0, 0, 0);

        // Store initial camera position
        this.initialCameraPosition = this.camera.position.clone();
    }

    setupLights() {
        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Main directional light (sun-like, for isometric look)
        this.mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
        this.mainLight.position.set(10, 20, 10);
        this.mainLight.castShadow = true;

        // Shadow settings
        this.mainLight.shadow.mapSize.width = 2048;
        this.mainLight.shadow.mapSize.height = 2048;
        this.mainLight.shadow.camera.near = 0.5;
        this.mainLight.shadow.camera.far = 500;
        this.mainLight.shadow.camera.left = -30;
        this.mainLight.shadow.camera.right = 30;
        this.mainLight.shadow.camera.top = 30;
        this.mainLight.shadow.camera.bottom = -30;

        this.scene.add(this.mainLight);

        // Fill light from opposite side
        const fillLight = new THREE.DirectionalLight(0x6495ED, 0.3);
        fillLight.position.set(-10, 10, -10);
        this.scene.add(fillLight);

        // Rim light for depth
        const rimLight = new THREE.DirectionalLight(0xffffff, 0.2);
        rimLight.position.set(0, 10, -20);
        this.scene.add(rimLight);
    }

    setupEnvironment() {
        // Add a subtle fog for depth
        this.scene.fog = new THREE.Fog(0x1a1a2e, 30, 100);

        // Ground plane (hidden initially)
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x2c3e50,
            roughness: 0.8,
            metalness: 0.2
        });

        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.position.y = -0.1;
        this.ground.receiveShadow = true;
        this.ground.visible = false;
        this.scene.add(this.ground);
    }

    addObject(object, clickable = false) {
        this.scene.add(object);
        this.objects.push(object);

        if (clickable) {
            this.clickableObjects.push(object);
        }
    }

    removeObject(object) {
        this.scene.remove(object);
        this.objects = this.objects.filter(obj => obj !== object);
        this.clickableObjects = this.clickableObjects.filter(obj => obj !== object);
    }

    clearScene() {
        // Remove all objects except lights and ground
        this.objects.forEach(obj => {
            this.scene.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(mat => mat.dispose());
                } else {
                    obj.material.dispose();
                }
            }
        });

        this.objects = [];
        this.clickableObjects = [];
    }

    showGround() {
        this.ground.visible = true;
    }

    hideGround() {
        this.ground.visible = false;
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
        const aspect = window.innerWidth / window.innerHeight;
        const frustumSize = 20;

        this.camera.left = frustumSize * aspect / -2;
        this.camera.right = frustumSize * aspect / 2;
        this.camera.top = frustumSize / 2;
        this.camera.bottom = frustumSize / -2;

        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Get mouse position in normalized device coordinates
    getMousePosition(event) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
            y: -((event.clientY - rect.top) / rect.height) * 2 + 1
        };
    }

    // Raycast to find intersected objects
    raycast(mousePosition) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mousePosition, this.camera);

        const intersects = raycaster.intersectObjects(this.clickableObjects, true);
        return intersects.length > 0 ? intersects[0] : null;
    }

    // Animation loop
    animate(callback) {
        const loop = () => {
            requestAnimationFrame(loop);

            if (callback) {
                callback();
            }

            this.render();
        };

        loop();
    }

    // Dispose of resources
    dispose() {
        this.clearScene();
        this.renderer.dispose();
    }
}
