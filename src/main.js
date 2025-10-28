import { SceneManager } from './sceneManager.js';
import { MapView } from './mapView.js';
import { HospitalView } from './hospitalView.js';
import { InteractionManager } from './interactions.js';
import { AnimationManager } from './animations.js';
import { DataPanel } from './dataPanel.js';
import { PostProcessingManager } from './postprocessing.js';
import { ParticleSystem } from './particles.js';
import {
    ToastManager,
    ThemeManager,
    SettingsManager,
    LoadingManager,
    BreadcrumbManager,
    StatsHUD,
    FullscreenManager
} from './uiUtils.js';

class App {
    constructor() {
        this.state = {
            currentView: 'map', // 'map' or 'hospital'
            selectedHospital: null,
            selectedEquipment: null
        };

        this.init();
    }

    init() {
        // Initialize UI utilities first
        this.toast = new ToastManager();
        this.theme = new ThemeManager();
        this.loading = new LoadingManager();
        this.breadcrumb = new BreadcrumbManager();
        this.statsHUD = new StatsHUD();
        this.fullscreen = new FullscreenManager();

        // Show loading
        this.loading.show('Initializing 3D environment...');
        this.loading.setProgress(10);

        // Initialize canvas and scene
        const canvas = document.getElementById('canvas3d');
        this.sceneManager = new SceneManager(canvas);
        this.loading.setProgress(30);

        // Initialize post-processing
        try {
            this.postProcessing = new PostProcessingManager(
                this.sceneManager.renderer,
                this.sceneManager.scene,
                this.sceneManager.camera
            );
            this.loading.setProgress(40);
        } catch (error) {
            console.warn('Post-processing not available:', error);
            this.postProcessing = null;
        }

        // Initialize particle system
        this.particleSystem = new ParticleSystem(this.sceneManager.scene);
        this.loading.setProgress(50);

        // Initialize map view
        const mapSvg = document.getElementById('map-overlay');
        this.mapView = new MapView(mapSvg, (hospital) => this.handleHospitalSelect(hospital));
        this.loading.setProgress(60);

        // Initialize hospital view
        this.hospitalView = new HospitalView(this.sceneManager);
        this.loading.setProgress(70);

        // Initialize interaction manager
        this.interactionManager = new InteractionManager(this.sceneManager, canvas);
        this.interactionManager.setEquipmentClickCallback((equipment) => {
            this.handleEquipmentClick(equipment);
        });
        this.loading.setProgress(80);

        // Initialize animation manager
        this.animationManager = new AnimationManager(this.sceneManager);

        // Initialize data panel
        this.dataPanel = new DataPanel(() => this.handleDataPanelClose());

        // Initialize settings (must be last)
        this.settings = new SettingsManager(this);
        this.loading.setProgress(90);

        // Setup UI event listeners
        this.setupUIListeners();

        // Start render loop
        this.sceneManager.animate(() => this.update());

        // Show initial view (map)
        this.showMapView();

        this.loading.setProgress(100);
        setTimeout(() => {
            this.loading.hide();
            this.toast.success('Dashboard loaded successfully!', 2000);
        }, 500);

        console.log('Australian Hospitals 3D Dashboard initialized!');
    }

    setupUIListeners() {
        // Back button
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.backToMap());
        }

        // Theme toggle
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                const newTheme = this.theme.toggle();
                this.toast.info(`Switched to ${newTheme} theme`, 1500);
            });
        }

        // Settings button
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.settings.toggle();
            });
        }

        // Fullscreen button
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                this.fullscreen.toggle();
            });
        }

        // Window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    handleHospitalSelect(hospital) {
        console.log('Hospital selected:', hospital.name);

        this.state.selectedHospital = hospital;
        this.state.currentView = 'hospital';

        // Show loading
        this.loading.show('Loading hospital...');
        this.loading.setProgress(0);

        // Hide map view
        this.mapView.hide();

        // Update breadcrumb
        this.breadcrumb.set(['Map View', hospital.name]);

        // Transition camera to hospital view
        this.animationManager.transitionToHospital(() => {
            this.loading.setProgress(30);

            // Build hospital
            this.hospitalView.build(hospital);
            this.loading.setProgress(60);

            // Create particles for equipment
            const equipmentObjects = this.hospitalView.getEquipmentObjects();
            equipmentObjects.forEach(equipment => {
                if (this.settings.get('particles')) {
                    this.particleSystem.createDataFlowParticles(equipment);
                    this.particleSystem.createAmbientGlow(equipment, equipment.userData.spec?.color);
                }
            });
            this.loading.setProgress(80);

            // Update info panel
            this.updateInfoPanel(hospital);

            // Update stats HUD
            this.updateStatsHUD(hospital);
            this.statsHUD.show();

            // Show back button
            const backBtn = document.getElementById('back-btn');
            if (backBtn) {
                backBtn.classList.remove('hidden');
            }

            this.loading.setProgress(100);
            setTimeout(() => {
                this.loading.hide();
                this.toast.success(`${hospital.name} loaded!`, 2000);
            }, 300);

            // Show info panel
            this.animationManager.showPanel('#info-panel', 300);
        });
    }

    handleEquipmentClick(equipment) {
        console.log('Equipment clicked:', equipment.id, equipment.type);

        this.state.selectedEquipment = equipment;

        // Show data panel
        this.dataPanel.show(equipment);

        // Animate panel in
        this.animationManager.showPanel('#equipment-panel');

        // Toast notification
        this.toast.info(`Viewing ${equipment.type} Scanner`, 1500);
    }

    handleDataPanelClose() {
        console.log('Data panel closed');

        this.state.selectedEquipment = null;

        // Reset interaction highlights
        this.interactionManager.reset();
    }

    backToMap() {
        console.log('Back to map');

        // Hide equipment panel if open
        if (this.dataPanel.isVisible()) {
            this.dataPanel.hide();
        }

        // Hide stats HUD
        this.statsHUD.hide();

        // Hide info panel
        this.animationManager.hidePanel('#info-panel');

        // Hide back button
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.classList.add('hidden');
        }

        // Clear particles
        this.particleSystem.clearAll();

        // Clear hospital view
        this.hospitalView.clear();
        this.sceneManager.hideGround();

        // Update breadcrumb
        this.breadcrumb.set(['Map View']);

        // Transition camera back to map
        this.animationManager.transitionToMap(() => {
            // Show map view
            this.mapView.show();

            // Reset state
            this.state.currentView = 'map';
            this.state.selectedHospital = null;
            this.state.selectedEquipment = null;

            // Reset interactions
            this.interactionManager.reset();

            this.toast.info('Returned to map view', 1500);
        });
    }

    showMapView() {
        this.state.currentView = 'map';
        this.mapView.show();
        this.sceneManager.hideGround();

        // Update breadcrumb
        this.breadcrumb.set(['Map View']);

        // Hide back button
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.classList.add('hidden');
        }

        // Hide stats HUD
        this.statsHUD.hide();
    }

    updateInfoPanel(hospital) {
        const nameElement = document.getElementById('hospital-name');
        const locationElement = document.getElementById('hospital-location');

        if (nameElement) {
            nameElement.textContent = hospital.name;
        }

        if (locationElement) {
            locationElement.textContent = `${hospital.city}, ${hospital.state} - ${hospital.equipment.length} Medical Scanners`;
        }
    }

    updateStatsHUD(hospital) {
        const stats = {
            active: hospital.equipment.length,
            operational: Math.floor(hospital.equipment.length * 0.85),
            warnings: Math.floor(hospital.equipment.length * 0.15)
        };

        this.statsHUD.update(stats);
    }

    applySettings(settings) {
        // Apply quality settings
        if (this.postProcessing) {
            this.postProcessing.setQuality(settings.quality);
            this.postProcessing.setEnabled(settings.postProcessing);
        }

        // Apply shadows
        this.sceneManager.setShadowsEnabled(settings.shadows);

        // Apply particles
        this.particleSystem.setEnabled(settings.particles);

        console.log('Settings applied:', settings);
    }

    handleResize() {
        if (this.postProcessing) {
            this.postProcessing.setSize(window.innerWidth, window.innerHeight);
        }
    }

    update() {
        const deltaTime = this.sceneManager.getDeltaTime();

        // Update particles
        if (this.state.currentView === 'hospital') {
            this.particleSystem.update(deltaTime);

            // Update animated equipment
            this.hospitalView.update(deltaTime);
        }

        // Render with or without post-processing
        if (this.postProcessing && this.settings.get('postProcessing')) {
            this.postProcessing.render(deltaTime);
        } else {
            this.sceneManager.render();
        }
    }
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new App());
} else {
    new App();
}
