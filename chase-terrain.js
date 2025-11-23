// Terrain and Road System with INFINITE generation
class TerrainSystem {
    constructor(scene) {
        this.scene = scene;
        this.roadSegments = [];
        this.terrainSegments = [];
        this.roadLength = 1000; // Very long initial road
        this.segmentLength = 10;
        this.createRoad();
        this.createTerrain();
    }

    createRoad() {
        // Create a very long winding road
        const roadWidth = 4;
        const roadGeometry = new THREE.PlaneGeometry(roadWidth, this.roadLength, 100, 200);

        // Add curves and waves to the road
        const positions = roadGeometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);

            // Sine wave for road curves
            const curveX = Math.sin(y * 0.05) * 3;
            positions.setX(i, x + curveX);

            // Slight elevation changes
            const elevation = Math.sin(y * 0.1) * 0.5;
            positions.setZ(i, elevation);
        }
        positions.needsUpdate = true;
        roadGeometry.computeVertexNormals();

        // Road material - asphalt
        const roadMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.9,
            metalness: 0.1
        });

        this.road = new THREE.Mesh(roadGeometry, roadMaterial);
        this.road.rotation.x = -Math.PI / 2;
        this.road.receiveShadow = true;
        this.scene.add(this.road);

        // Road markings
        this.createRoadMarkings();
    }

    createRoadMarkings() {
        const markingGeometry = new THREE.PlaneGeometry(0.2, 2);
        const markingMaterial = new THREE.MeshStandardMaterial({
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 0.3,
            roughness: 0.7
        });

        for (let i = 0; i < this.roadLength; i += 5) {
            const marking = new THREE.Mesh(markingGeometry, markingMaterial);
            const curveX = Math.sin(i * 0.05) * 3;
            marking.position.set(curveX, 0.02, -i);
            marking.rotation.x = -Math.PI / 2;
            this.scene.add(marking);
        }
    }

    createTerrain() {
        // FOREST terrain - first half
        const terrainWidth = 100;
        const forestLength = this.roadLength / 2;

        const forestGeometry = new THREE.PlaneGeometry(terrainWidth, forestLength, 100, 100);

        // Add height variation for forest
        let positions = forestGeometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);

            const height = Math.sin(x * 0.1) * Math.cos(y * 0.08) * 2 +
                Math.sin(x * 0.05) * 1.5;
            positions.setZ(i, height);
        }
        positions.needsUpdate = true;
        forestGeometry.computeVertexNormals();

        // Forest terrain material - green
        const forestMaterial = new THREE.MeshStandardMaterial({
            color: 0x6b8e23,
            roughness: 0.95,
            metalness: 0.05
        });

        this.forestTerrain = new THREE.Mesh(forestGeometry, forestMaterial);
        this.forestTerrain.rotation.x = -Math.PI / 2;
        this.forestTerrain.position.y = -0.5;
        this.forestTerrain.position.z = -forestLength / 2;
        this.forestTerrain.receiveShadow = true;
        this.scene.add(this.forestTerrain);

        // DESERT terrain - second half
        this.createDesertTerrain();

        // TRANSITION zone - blend between forest and desert
        this.createTransitionZone();
    }

    createDesertTerrain() {
        const terrainWidth = 100;
        const desertLength = this.roadLength / 2;

        const desertGeometry = new THREE.PlaneGeometry(terrainWidth, desertLength, 100, 100);

        // Sand dunes
        const positions = desertGeometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);

            // Dune-like formations
            const height = Math.sin(x * 0.08) * Math.cos(y * 0.1) * 3 +
                Math.sin(x * 0.15) * 2;
            positions.setZ(i, height);
        }
        positions.needsUpdate = true;
        desertGeometry.computeVertexNormals();

        // Desert material - tan/gold
        const desertMaterial = new THREE.MeshStandardMaterial({
            color: 0xdaa520,
            roughness: 0.9,
            metalness: 0.05
        });

        this.desertTerrain = new THREE.Mesh(desertGeometry, desertMaterial);
        this.desertTerrain.rotation.x = -Math.PI / 2;
        this.desertTerrain.position.y = -0.5;
        this.desertTerrain.position.z = -this.roadLength * 0.75;
        this.desertTerrain.receiveShadow = true;
        this.scene.add(this.desertTerrain);
    }

    createTransitionZone() {
        // Create a blended transition zone between forest and desert
        const terrainWidth = 100;
        const transitionLength = 100; // 100 units of gradual transition

        const transitionGeometry = new THREE.PlaneGeometry(terrainWidth, transitionLength, 100, 50);

        // Add height variation
        const positions = transitionGeometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);

            // Blend between forest and desert heights
            const progress = (y + transitionLength / 2) / transitionLength; // 0 to 1
            const forestHeight = Math.sin(x * 0.1) * Math.cos(y * 0.08) * 2;
            const desertHeight = Math.sin(x * 0.08) * Math.cos(y * 0.1) * 3;
            const height = forestHeight * (1 - progress) + desertHeight * progress;
            positions.setZ(i, height);
        }
        positions.needsUpdate = true;
        transitionGeometry.computeVertexNormals();

        // Blended material - transitions from green to tan
        const transitionMaterial = new THREE.MeshStandardMaterial({
            color: 0x9a9a52, // Blend of green and tan
            roughness: 0.92,
            metalness: 0.05
        });

        this.transitionTerrain = new THREE.Mesh(transitionGeometry, transitionMaterial);
        this.transitionTerrain.rotation.x = -Math.PI / 2;
        this.transitionTerrain.position.y = -0.5;
        this.transitionTerrain.position.z = -this.roadLength / 2;
        this.transitionTerrain.receiveShadow = true;
        this.scene.add(this.transitionTerrain);
    }

    getRoadPosition(distance) {
        // Get position on road at given distance
        // ALWAYS return valid Y coordinate - never let characters fly
        const curveX = Math.sin(distance * 0.05) * 3;
        const elevation = Math.sin(distance * 0.1) * 0.5;

        // Keep characters on ground at Y = 0.5 (base terrain height)
        return new THREE.Vector3(curveX, 0.5, -distance);
    }

    update(cameraZ) {
        // Infinite terrain - could add dynamic loading/unloading here
        // For now, the very long terrain prevents flying
    }
}
