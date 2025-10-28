import * as THREE from 'three';
import { equipmentSpecs } from './data.js';

export class HospitalView {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.hospitalGroup = new THREE.Group();
        this.equipmentObjects = [];
        this.animatedParts = [];
    }

    build(hospital) {
        this.clear();

        // Create hospital building structure
        this.createHospitalStructure();

        // Create rooms
        this.createRooms();

        // Add equipment
        hospital.equipment.forEach(equipment => {
            this.addEquipment(equipment);
        });

        // Add to scene
        this.sceneManager.addObject(this.hospitalGroup);
        this.sceneManager.showGround();
    }

    createHospitalStructure() {
        // Main hospital building (isometric style)
        const buildingWidth = 30;
        const buildingDepth = 30;
        const buildingHeight = 0.5;

        // Floor
        const floorGeometry = new THREE.BoxGeometry(buildingWidth, buildingHeight, buildingDepth);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0xe8f4f8,
            roughness: 0.7,
            metalness: 0.1
        });

        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.y = 0;
        floor.receiveShadow = true;
        this.hospitalGroup.add(floor);

        // Add grid lines on floor for isometric feel
        this.addFloorGrid(buildingWidth, buildingDepth);

        // Outer walls (transparent to see inside)
        this.createWalls(buildingWidth, buildingDepth);
    }

    addFloorGrid(width, depth) {
        const gridHelper = new THREE.GridHelper(
            Math.max(width, depth),
            20,
            0x6366f1,
            0x8b5cf6
        );
        gridHelper.position.y = 0.26;
        gridHelper.material.opacity = 0.2;
        gridHelper.material.transparent = true;
        this.hospitalGroup.add(gridHelper);
    }

    createWalls(width, depth) {
        const wallHeight = 5;
        const wallThickness = 0.3;
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0xecf0f1,
            transparent: true,
            opacity: 0.6,
            roughness: 0.8,
            side: THREE.DoubleSide
        });

        // North wall
        const northWall = new THREE.Mesh(
            new THREE.BoxGeometry(width, wallHeight, wallThickness),
            wallMaterial
        );
        northWall.position.set(0, wallHeight / 2, -depth / 2);
        northWall.castShadow = true;
        this.hospitalGroup.add(northWall);

        // South wall
        const southWall = new THREE.Mesh(
            new THREE.BoxGeometry(width, wallHeight, wallThickness),
            wallMaterial
        );
        southWall.position.set(0, wallHeight / 2, depth / 2);
        southWall.castShadow = true;
        this.hospitalGroup.add(southWall);

        // East wall
        const eastWall = new THREE.Mesh(
            new THREE.BoxGeometry(wallThickness, wallHeight, depth),
            wallMaterial
        );
        eastWall.position.set(width / 2, wallHeight / 2, 0);
        eastWall.castShadow = true;
        this.hospitalGroup.add(eastWall);

        // West wall
        const westWall = new THREE.Mesh(
            new THREE.BoxGeometry(wallThickness, wallHeight, depth),
            wallMaterial
        );
        westWall.position.set(-width / 2, wallHeight / 2, 0);
        westWall.castShadow = true;
        this.hospitalGroup.add(westWall);
    }

    createRooms() {
        // Create interior room dividers (like in Project Hospital)
        const roomDividerMaterial = new THREE.MeshStandardMaterial({
            color: 0xbdc3c7,
            transparent: true,
            opacity: 0.5,
            roughness: 0.9
        });

        const dividerHeight = 4;
        const dividerThickness = 0.2;

        // Vertical divider
        const verticalDivider = new THREE.Mesh(
            new THREE.BoxGeometry(dividerThickness, dividerHeight, 25),
            roomDividerMaterial
        );
        verticalDivider.position.set(0, dividerHeight / 2, 0);
        verticalDivider.castShadow = true;
        this.hospitalGroup.add(verticalDivider);

        // Horizontal divider
        const horizontalDivider = new THREE.Mesh(
            new THREE.BoxGeometry(25, dividerHeight, dividerThickness),
            roomDividerMaterial
        );
        horizontalDivider.position.set(0, dividerHeight / 2, 0);
        horizontalDivider.castShadow = true;
        this.hospitalGroup.add(horizontalDivider);

        // Add room labels
        this.addRoomLabels();
    }

    addRoomLabels() {
        const labels = [
            { text: 'MRI', position: new THREE.Vector3(-8, 0.3, -8) },
            { text: 'CT', position: new THREE.Vector3(8, 0.3, -8) },
            { text: 'X-Ray', position: new THREE.Vector3(-8, 0.3, 8) },
            { text: 'Ultrasound', position: new THREE.Vector3(8, 0.3, 8) }
        ];

        labels.forEach(label => {
            const labelGeometry = new THREE.PlaneGeometry(4, 1);
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 64;
            const context = canvas.getContext('2d');

            context.fillStyle = '#3498db';
            context.fillRect(0, 0, 256, 64);
            context.font = 'Bold 32px Arial';
            context.fillStyle = 'white';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(label.text, 128, 32);

            const texture = new THREE.CanvasTexture(canvas);
            const labelMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                side: THREE.DoubleSide
            });

            const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);
            labelMesh.position.copy(label.position);
            labelMesh.rotation.x = -Math.PI / 2;
            this.hospitalGroup.add(labelMesh);
        });
    }

    addEquipment(equipmentData) {
        const spec = equipmentSpecs[equipmentData.type];
        if (!spec) return;

        const equipment = this.createEquipmentModel(spec, equipmentData);
        equipment.position.set(
            equipmentData.position.x,
            spec.dimensions.height / 2 + 0.5,
            equipmentData.position.z
        );

        // Store equipment data
        equipment.userData = {
            id: equipmentData.id,
            type: equipmentData.type,
            spec: spec
        };

        this.hospitalGroup.add(equipment);
        this.equipmentObjects.push(equipment);
        this.sceneManager.addObject(equipment, true);
    }

    createEquipmentModel(spec, equipmentData) {
        const group = new THREE.Group();

        switch (equipmentData.type) {
            case 'MRI':
                return this.createMRIScanner(spec);
            case 'CT':
                return this.createCTScanner(spec);
            case 'X-Ray':
                return this.createXRayMachine(spec);
            case 'Ultrasound':
                return this.createUltrasoundMachine(spec);
            default:
                return this.createGenericEquipment(spec);
        }
    }

    createMRIScanner(spec) {
        const group = new THREE.Group();
        const material = new THREE.MeshStandardMaterial({
            color: spec.color,
            roughness: 0.2,
            metalness: 0.8,
            emissive: new THREE.Color(spec.color),
            emissiveIntensity: 0.1
        });

        // Main cylinder (bore)
        const boreGeometry = new THREE.CylinderGeometry(0.8, 0.8, spec.dimensions.depth, 32);
        const bore = new THREE.Mesh(boreGeometry, material);
        bore.rotation.z = Math.PI / 2;
        bore.castShadow = true;
        bore.name = 'mri_bore_animated';
        group.add(bore);

        // Patient table (animated moving in/out)
        const tableGeometry = new THREE.BoxGeometry(0.6, 0.1, spec.dimensions.depth + 1);
        const tableMaterial = new THREE.MeshStandardMaterial({
            color: 0x95a5a6,
            roughness: 0.4,
            metalness: 0.3
        });
        const table = new THREE.Mesh(tableGeometry, tableMaterial);
        table.position.y = -0.5;
        table.castShadow = true;
        table.name = 'mri_table_animated';
        group.add(table);

        // Store animated parts
        this.animatedParts.push({
            object: table,
            type: 'mri_table',
            initialZ: 0,
            time: Math.random() * 100
        });

        // Side panels
        this.addEquipmentDetails(group, spec.color);

        return group;
    }

    createCTScanner(spec) {
        const group = new THREE.Group();
        const material = new THREE.MeshStandardMaterial({
            color: spec.color,
            roughness: 0.2,
            metalness: 0.7,
            emissive: new THREE.Color(spec.color),
            emissiveIntensity: 0.15
        });

        // Main ring (gantry) - animated rotating
        const gantryGeometry = new THREE.TorusGeometry(0.9, 0.3, 16, 32);
        const gantry = new THREE.Mesh(gantryGeometry, material);
        gantry.rotation.y = Math.PI / 2;
        gantry.castShadow = true;
        gantry.name = 'ct_gantry_animated';
        group.add(gantry);

        // Store animated part
        this.animatedParts.push({
            object: gantry,
            type: 'ct_gantry',
            time: Math.random() * 100
        });

        // Patient table
        const tableGeometry = new THREE.BoxGeometry(0.5, 0.1, spec.dimensions.depth);
        const tableMaterial = new THREE.MeshStandardMaterial({
            color: 0x7f8c8d,
            roughness: 0.4,
            metalness: 0.3
        });
        const table = new THREE.Mesh(tableGeometry, tableMaterial);
        table.position.y = -0.5;
        table.castShadow = true;
        group.add(table);

        // Control panel
        this.addEquipmentDetails(group, spec.color);

        return group;
    }

    createXRayMachine(spec) {
        const group = new THREE.Group();
        const material = new THREE.MeshStandardMaterial({
            color: spec.color,
            roughness: 0.4,
            metalness: 0.5
        });

        // Vertical stand
        const standGeometry = new THREE.CylinderGeometry(0.1, 0.1, spec.dimensions.height, 16);
        const stand = new THREE.Mesh(standGeometry, material);
        stand.castShadow = true;
        group.add(stand);

        // X-ray head
        const headGeometry = new THREE.BoxGeometry(0.5, 0.4, 0.5);
        const head = new THREE.Mesh(headGeometry, material);
        head.position.y = spec.dimensions.height / 2;
        head.castShadow = true;
        group.add(head);

        // Detector plate
        const detectorGeometry = new THREE.BoxGeometry(0.8, 0.05, 1);
        const detectorMaterial = new THREE.MeshStandardMaterial({
            color: 0x34495e,
            roughness: 0.3
        });
        const detector = new THREE.Mesh(detectorGeometry, detectorMaterial);
        detector.position.y = -0.8;
        detector.castShadow = true;
        group.add(detector);

        return group;
    }

    createUltrasoundMachine(spec) {
        const group = new THREE.Group();
        const material = new THREE.MeshStandardMaterial({
            color: spec.color,
            roughness: 0.4,
            metalness: 0.3
        });

        // Main console
        const consoleGeometry = new THREE.BoxGeometry(
            spec.dimensions.width,
            spec.dimensions.height,
            spec.dimensions.depth
        );
        const console = new THREE.Mesh(consoleGeometry, material);
        console.castShadow = true;
        group.add(console);

        // Screen
        const screenGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.05);
        const screenMaterial = new THREE.MeshStandardMaterial({
            color: 0x2c3e50,
            roughness: 0.1,
            metalness: 0.8
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(0, 0.3, spec.dimensions.depth / 2);
        screen.castShadow = true;
        group.add(screen);

        return group;
    }

    createGenericEquipment(spec) {
        const geometry = new THREE.BoxGeometry(
            spec.dimensions.width,
            spec.dimensions.height,
            spec.dimensions.depth
        );
        const material = new THREE.MeshStandardMaterial({
            color: spec.color,
            roughness: 0.5,
            metalness: 0.5
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        return mesh;
    }

    addEquipmentDetails(group, baseColor) {
        // Add small detail boxes to make equipment look more realistic
        const detailMaterial = new THREE.MeshStandardMaterial({
            color: baseColor,
            roughness: 0.6,
            metalness: 0.4
        });

        const detail1 = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.3, 0.2),
            detailMaterial
        );
        detail1.position.set(0.8, 0, 0);
        detail1.castShadow = true;
        group.add(detail1);
    }

    update(deltaTime) {
        // Animate equipment parts
        this.animatedParts.forEach(part => {
            part.time += deltaTime;

            if (part.type === 'ct_gantry') {
                // Rotate CT gantry continuously
                part.object.rotation.y += deltaTime * 0.5;
            } else if (part.type === 'mri_table') {
                // Move MRI table in and out
                const offset = Math.sin(part.time * 0.3) * 0.5;
                part.object.position.z = part.initialZ + offset;
            }
        });
    }

    clear() {
        this.equipmentObjects.forEach(obj => {
            this.sceneManager.removeObject(obj);
        });

        this.hospitalGroup.children.forEach(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
        });

        this.hospitalGroup.clear();
        this.equipmentObjects = [];
        this.animatedParts = [];
    }

    getEquipmentObjects() {
        return this.equipmentObjects;
    }
}
