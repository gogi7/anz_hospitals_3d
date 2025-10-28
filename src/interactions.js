import * as THREE from 'three';

export class InteractionManager {
    constructor(sceneManager, canvas) {
        this.sceneManager = sceneManager;
        this.canvas = canvas;
        this.hoveredObject = null;
        this.selectedObject = null;
        this.onEquipmentClick = null;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Mouse move for hover effects
        this.canvas.addEventListener('mousemove', (event) => {
            this.handleMouseMove(event);
        });

        // Click for selection
        this.canvas.addEventListener('click', (event) => {
            this.handleClick(event);
        });

        // Update cursor style
        this.canvas.style.cursor = 'default';
    }

    handleMouseMove(event) {
        const mousePos = this.sceneManager.getMousePosition(event);
        const intersect = this.sceneManager.raycast(mousePos);

        // Reset previous hover
        if (this.hoveredObject && this.hoveredObject !== this.selectedObject) {
            this.resetObjectHighlight(this.hoveredObject);
        }

        if (intersect && intersect.object.userData.id) {
            // Found an equipment object
            const object = intersect.object;
            this.hoveredObject = object;
            this.highlightObject(object, 0xffffff, 0.3);
            this.canvas.style.cursor = 'pointer';
        } else {
            this.hoveredObject = null;
            this.canvas.style.cursor = 'default';
        }
    }

    handleClick(event) {
        const mousePos = this.sceneManager.getMousePosition(event);
        const intersect = this.sceneManager.raycast(mousePos);

        if (intersect && intersect.object.userData.id) {
            // Reset previous selection
            if (this.selectedObject && this.selectedObject !== intersect.object) {
                this.resetObjectHighlight(this.selectedObject);
            }

            const object = intersect.object;
            this.selectedObject = object;
            this.highlightObject(object, 0x3498db, 0.5);

            // Trigger callback
            if (this.onEquipmentClick) {
                this.onEquipmentClick(object.userData);
            }
        }
    }

    highlightObject(object, color, intensity) {
        // Add or update emissive color for highlight effect
        if (object.material) {
            if (Array.isArray(object.material)) {
                object.material.forEach(mat => {
                    mat.emissive = new THREE.Color(color);
                    mat.emissiveIntensity = intensity;
                });
            } else {
                object.material.emissive = new THREE.Color(color);
                object.material.emissiveIntensity = intensity;
            }
        }

        // Highlight all children
        object.traverse((child) => {
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(mat => {
                        mat.emissive = new THREE.Color(color);
                        mat.emissiveIntensity = intensity;
                    });
                } else {
                    child.material.emissive = new THREE.Color(color);
                    child.material.emissiveIntensity = intensity;
                }
            }
        });
    }

    resetObjectHighlight(object) {
        if (object.material) {
            if (Array.isArray(object.material)) {
                object.material.forEach(mat => {
                    mat.emissive = new THREE.Color(0x000000);
                    mat.emissiveIntensity = 0;
                });
            } else {
                object.material.emissive = new THREE.Color(0x000000);
                object.material.emissiveIntensity = 0;
            }
        }

        object.traverse((child) => {
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(mat => {
                        mat.emissive = new THREE.Color(0x000000);
                        mat.emissiveIntensity = 0;
                    });
                } else {
                    child.material.emissive = new THREE.Color(0x000000);
                    child.material.emissiveIntensity = 0;
                }
            }
        });
    }

    reset() {
        if (this.selectedObject) {
            this.resetObjectHighlight(this.selectedObject);
            this.selectedObject = null;
        }

        if (this.hoveredObject) {
            this.resetObjectHighlight(this.hoveredObject);
            this.hoveredObject = null;
        }

        this.canvas.style.cursor = 'default';
    }

    setEquipmentClickCallback(callback) {
        this.onEquipmentClick = callback;
    }
}
