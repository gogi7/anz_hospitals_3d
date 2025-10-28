import * as THREE from 'three';

export class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.systems = [];
    }

    // Create data flow particles for active equipment
    createDataFlowParticles(equipment) {
        const particleCount = 50;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        // Initialize particle positions around equipment
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            // Start in a circle around equipment
            const angle = (i / particleCount) * Math.PI * 2;
            const radius = 2;

            positions[i3] = equipment.position.x + Math.cos(angle) * radius;
            positions[i3 + 1] = equipment.position.y + Math.random() * 3;
            positions[i3 + 2] = equipment.position.z + Math.sin(angle) * radius;

            // Color based on equipment type
            const color = new THREE.Color(equipment.userData.spec?.color || 0x6366f1);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            sizes[i] = Math.random() * 0.1 + 0.05;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Create material
        const material = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true
        });

        const particles = new THREE.Points(geometry, material);
        particles.userData = {
            equipment: equipment,
            type: 'dataFlow',
            time: 0,
            radius: 2
        };

        this.scene.add(particles);
        this.systems.push(particles);

        return particles;
    }

    // Create scanning beam effect
    createScanningBeam(equipment) {
        const geometry = new THREE.CylinderGeometry(0.1, 0.1, 4, 16);
        const material = new THREE.MeshBasicMaterial({
            color: equipment.userData.spec?.color || 0x6366f1,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });

        const beam = new THREE.Mesh(geometry, material);
        beam.position.copy(equipment.position);
        beam.position.y += 2;

        beam.userData = {
            equipment: equipment,
            type: 'scanningBeam',
            time: 0
        };

        this.scene.add(beam);
        this.systems.push(beam);

        return beam;
    }

    // Create ambient glow particles
    createAmbientGlow(equipment, color = 0x6366f1) {
        const particleCount = 20;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const glowColor = new THREE.Color(color);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const angle = Math.random() * Math.PI * 2;
            const radius = 0.5 + Math.random() * 1.5;
            const height = Math.random() * 2 - 1;

            positions[i3] = equipment.position.x + Math.cos(angle) * radius;
            positions[i3 + 1] = equipment.position.y + height;
            positions[i3 + 2] = equipment.position.z + Math.sin(angle) * radius;

            colors[i3] = glowColor.r;
            colors[i3 + 1] = glowColor.g;
            colors[i3 + 2] = glowColor.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const glow = new THREE.Points(geometry, material);
        glow.userData = {
            equipment: equipment,
            type: 'ambientGlow',
            time: 0,
            initialPositions: positions.slice()
        };

        this.scene.add(glow);
        this.systems.push(glow);

        return glow;
    }

    // Update all particle systems
    update(deltaTime) {
        this.systems.forEach(system => {
            system.userData.time += deltaTime;

            if (system.userData.type === 'dataFlow') {
                this.updateDataFlow(system, deltaTime);
            } else if (system.userData.type === 'scanningBeam') {
                this.updateScanningBeam(system, deltaTime);
            } else if (system.userData.type === 'ambientGlow') {
                this.updateAmbientGlow(system, deltaTime);
            }
        });
    }

    updateDataFlow(system, deltaTime) {
        const positions = system.geometry.attributes.position.array;
        const equipment = system.userData.equipment;
        const time = system.userData.time;

        for (let i = 0; i < positions.length / 3; i++) {
            const i3 = i * 3;

            // Spiral upward motion
            const angle = time * 2 + (i / (positions.length / 3)) * Math.PI * 2;
            const radius = system.userData.radius;

            positions[i3] = equipment.position.x + Math.cos(angle) * radius;
            positions[i3 + 1] += deltaTime * 0.5;
            positions[i3 + 2] = equipment.position.z + Math.sin(angle) * radius;

            // Reset if too high
            if (positions[i3 + 1] > equipment.position.y + 4) {
                positions[i3 + 1] = equipment.position.y;
            }
        }

        system.geometry.attributes.position.needsUpdate = true;
    }

    updateScanningBeam(system, deltaTime) {
        const time = system.userData.time;

        // Rotate beam
        system.rotation.y = time * 2;

        // Pulse opacity
        system.material.opacity = 0.2 + Math.sin(time * 3) * 0.15;
    }

    updateAmbientGlow(system, deltaTime) {
        const positions = system.geometry.attributes.position.array;
        const initialPositions = system.userData.initialPositions;
        const time = system.userData.time;

        for (let i = 0; i < positions.length / 3; i++) {
            const i3 = i * 3;

            // Gentle floating motion
            const offset = Math.sin(time * 2 + i * 0.5) * 0.2;
            positions[i3 + 1] = initialPositions[i3 + 1] + offset;
        }

        system.geometry.attributes.position.needsUpdate = true;
    }

    // Remove particles for equipment
    removeParticlesForEquipment(equipment) {
        const toRemove = this.systems.filter(
            system => system.userData.equipment === equipment
        );

        toRemove.forEach(system => {
            this.scene.remove(system);
            if (system.geometry) system.geometry.dispose();
            if (system.material) system.material.dispose();

            const index = this.systems.indexOf(system);
            if (index > -1) {
                this.systems.splice(index, 1);
            }
        });
    }

    // Clear all particles
    clearAll() {
        this.systems.forEach(system => {
            this.scene.remove(system);
            if (system.geometry) system.geometry.dispose();
            if (system.material) system.material.dispose();
        });

        this.systems = [];
    }

    setEnabled(enabled) {
        this.systems.forEach(system => {
            system.visible = enabled;
        });
    }
}
