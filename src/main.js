import { SceneManager } from './sceneManager.js';
import { MapView } from './mapView.js';
import { HospitalView } from './hospitalView.js';
import { InteractionManager } from './interactions.js';
import { AnimationManager } from './animations.js';
import { DataPanel } from './dataPanel.js';

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
        // Initialize canvas and scene
        const canvas = document.getElementById('canvas3d');
        this.sceneManager = new SceneManager(canvas);

        // Initialize map view
        const mapSvg = document.getElementById('map-overlay');
        this.mapView = new MapView(mapSvg, (hospital) => this.handleHospitalSelect(hospital));

        // Initialize hospital view
        this.hospitalView = new HospitalView(this.sceneManager);

        // Initialize interaction manager
        this.interactionManager = new InteractionManager(this.sceneManager, canvas);
        this.interactionManager.setEquipmentClickCallback((equipment) => {
            this.handleEquipmentClick(equipment);
        });

        // Initialize animation manager
        this.animationManager = new AnimationManager(this.sceneManager);

        // Initialize data panel
        this.dataPanel = new DataPanel(() => this.handleDataPanelClose());

        // Setup UI event listeners
        this.setupUIListeners();

        // Start render loop
        this.sceneManager.animate(() => this.update());

        // Show initial view (map)
        this.showMapView();

        console.log('Australian Hospitals 3D Dashboard initialized!');
    }

    setupUIListeners() {
        // Back button
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.backToMap());
        }

        // Window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    handleHospitalSelect(hospital) {
        console.log('Hospital selected:', hospital.name);

        this.state.selectedHospital = hospital;
        this.state.currentView = 'hospital';

        // Show loading
        this.animationManager.showLoading();

        // Hide map view
        this.mapView.hide();

        // Transition camera to hospital view
        this.animationManager.transitionToHospital(() => {
            // Build hospital
            this.hospitalView.build(hospital);

            // Update info panel
            this.updateInfoPanel(hospital);

            // Show back button
            const backBtn = document.getElementById('back-btn');
            if (backBtn) {
                backBtn.classList.remove('hidden');
            }

            // Hide loading
            this.animationManager.hideLoading();

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

        // Hide info panel
        this.animationManager.hidePanel('#info-panel');

        // Hide back button
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.classList.add('hidden');
        }

        // Clear hospital view
        this.hospitalView.clear();
        this.sceneManager.hideGround();

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
        });
    }

    showMapView() {
        this.state.currentView = 'map';
        this.mapView.show();
        this.sceneManager.hideGround();

        // Hide back button
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.classList.add('hidden');
        }
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

    handleResize() {
        // Managers handle their own resize
        // This is just for any app-level resize logic
    }

    update() {
        // This runs every frame
        // Add any per-frame updates here if needed

        // For example, you could add gentle camera rotation or equipment animations
        if (this.state.currentView === 'hospital') {
            // Subtle animations could go here
        }
    }
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new App());
} else {
    new App();
}
