import anime from 'animejs';

export class AnimationManager {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.currentAnimation = null;
    }

    // Animate camera transition from map view to hospital view
    transitionToHospital(onComplete) {
        if (this.currentAnimation) {
            this.currentAnimation.pause();
        }

        const camera = this.sceneManager.camera;
        const targetPosition = { x: 15, y: 15, z: 15 };
        const targetLookAt = { x: 0, y: 0, z: 0 };

        // Animate camera position
        this.currentAnimation = anime({
            targets: camera.position,
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 1500,
            easing: 'easeInOutCubic',
            complete: () => {
                camera.lookAt(targetLookAt.x, targetLookAt.y, targetLookAt.z);
                if (onComplete) onComplete();
            }
        });

        // Fade in hospital view
        this.fadeIn('.hospital-view', 1000);
    }

    // Animate camera transition from hospital back to map view
    transitionToMap(onComplete) {
        if (this.currentAnimation) {
            this.currentAnimation.pause();
        }

        const camera = this.sceneManager.camera;
        const initialPosition = this.sceneManager.initialCameraPosition;

        // Animate camera back to initial position
        this.currentAnimation = anime({
            targets: camera.position,
            x: initialPosition.x,
            y: initialPosition.y,
            z: initialPosition.z,
            duration: 1500,
            easing: 'easeInOutCubic',
            complete: () => {
                camera.lookAt(0, 0, 0);
                if (onComplete) onComplete();
            }
        });
    }

    // Zoom into selected equipment
    zoomToEquipment(equipment, onComplete) {
        const camera = this.sceneManager.camera;
        const equipmentPos = equipment.position;

        // Calculate camera position relative to equipment
        const offset = { x: 5, y: 5, z: 5 };
        const targetPosition = {
            x: equipmentPos.x + offset.x,
            y: equipmentPos.y + offset.y,
            z: equipmentPos.z + offset.z
        };

        anime({
            targets: camera.position,
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 800,
            easing: 'easeOutQuad',
            complete: () => {
                camera.lookAt(equipmentPos.x, equipmentPos.y, equipmentPos.z);
                if (onComplete) onComplete();
            }
        });
    }

    // Zoom back out from equipment
    zoomOutFromEquipment(onComplete) {
        const camera = this.sceneManager.camera;
        const targetPosition = { x: 15, y: 15, z: 15 };

        anime({
            targets: camera.position,
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 800,
            easing: 'easeOutQuad',
            complete: () => {
                camera.lookAt(0, 0, 0);
                if (onComplete) onComplete();
            }
        });
    }

    // Panel animations
    showPanel(selector, delay = 0) {
        const element = document.querySelector(selector);
        if (!element) return;

        element.classList.remove('hidden');

        anime({
            targets: element,
            opacity: [0, 1],
            translateY: [-20, 0],
            duration: 600,
            delay: delay,
            easing: 'easeOutCubic'
        });
    }

    hidePanel(selector, onComplete) {
        const element = document.querySelector(selector);
        if (!element) return;

        anime({
            targets: element,
            opacity: [1, 0],
            translateY: [0, -20],
            duration: 400,
            easing: 'easeInCubic',
            complete: () => {
                element.classList.add('hidden');
                if (onComplete) onComplete();
            }
        });
    }

    // Fade animations
    fadeIn(selector, duration = 600) {
        const element = document.querySelector(selector);
        if (!element) return;

        element.classList.remove('hidden');

        anime({
            targets: element,
            opacity: [0, 1],
            duration: duration,
            easing: 'easeOutCubic'
        });
    }

    fadeOut(selector, duration = 400, onComplete) {
        const element = document.querySelector(selector);
        if (!element) return;

        anime({
            targets: element,
            opacity: [1, 0],
            duration: duration,
            easing: 'easeInCubic',
            complete: () => {
                element.classList.add('hidden');
                if (onComplete) onComplete();
            }
        });
    }

    // Rotate equipment continuously
    rotateEquipment(equipment, speed = 0.01) {
        const rotate = () => {
            if (equipment) {
                equipment.rotation.y += speed;
                requestAnimationFrame(rotate);
            }
        };
        rotate();
    }

    // Pulse animation for highlighting
    pulseObject(object, scale = 1.1, duration = 1000) {
        const originalScale = { x: object.scale.x, y: object.scale.y, z: object.scale.z };

        anime({
            targets: object.scale,
            x: [originalScale.x, scale, originalScale.x],
            y: [originalScale.y, scale, originalScale.y],
            z: [originalScale.z, scale, originalScale.z],
            duration: duration,
            easing: 'easeInOutSine',
            loop: true
        });
    }

    // Loading animation
    showLoading() {
        this.fadeIn('#loading', 300);
    }

    hideLoading() {
        this.fadeOut('#loading', 300);
    }

    // Stagger animation for multiple elements
    staggerIn(selector, delay = 100) {
        const elements = document.querySelectorAll(selector);

        anime({
            targets: elements,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 500,
            delay: anime.stagger(delay),
            easing: 'easeOutCubic'
        });
    }

    // Scale animation
    scaleIn(element, onComplete) {
        anime({
            targets: element,
            scale: [0, 1],
            opacity: [0, 1],
            duration: 600,
            easing: 'easeOutElastic(1, .6)',
            complete: onComplete
        });
    }

    scaleOut(element, onComplete) {
        anime({
            targets: element,
            scale: [1, 0],
            opacity: [1, 0],
            duration: 400,
            easing: 'easeInBack',
            complete: onComplete
        });
    }

    // Stop all animations
    stopAll() {
        if (this.currentAnimation) {
            this.currentAnimation.pause();
        }
    }
}
