// Forest Environment System
class ForestEnvironment {
    constructor(scene, terrain) {
        this.scene = scene;
        this.terrain = terrain;
        this.trees = [];
        this.grass = [];
        this.bushes = [];

        // Only populate first QUARTER of road (0 to 250 units) for gradual transition
        this.populateForest(0, 250);
    }

    populateForest(startZ, endZ) {
        // Create trees only in forest zone
        for (let i = 0; i < 80; i++) {
            const x = (Math.random() - 0.5) * 80;
            const z = -Math.random() * (endZ - startZ) - startZ; // Within forest zone

            // Don't place trees on the road
            if (Math.abs(x - Math.sin(z * 0.05) * 3) > 5) {
                this.createTree(x, z);
            }
        }

        // Add grass and undergrowth
        this.createFoliage(startZ, endZ);
    }

    createTree(x, z) {
        const treeGroup = new THREE.Group();

        // Trunk
        const trunkHeight = 3 + Math.random() * 2;
        const trunkRadius = 0.3 + Math.random() * 0.2;
        const trunkGeometry = new THREE.CylinderGeometry(trunkRadius, trunkRadius * 1.2, trunkHeight, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a3728,
            roughness: 0.9,
            metalness: 0.1
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = trunkHeight / 2;
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        treeGroup.add(trunk);

        // Foliage - multiple layers
        const foliageLayers = 3;
        for (let i = 0; i < foliageLayers; i++) {
            const foliageSize = 2 - (i * 0.3);
            const foliageGeometry = new THREE.ConeGeometry(foliageSize, foliageSize * 1.5, 8);
            const foliageMaterial = new THREE.MeshStandardMaterial({
                color: i === 0 ? 0x228b22 : (i === 1 ? 0x2d5016 : 0x1a3d0a),
                roughness: 0.8,
                metalness: 0.1
            });
            const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
            foliage.position.y = trunkHeight + (i * 1.2);
            foliage.castShadow = true;
            foliage.receiveShadow = true;
            treeGroup.add(foliage);
        }

        treeGroup.position.set(x, 0, z);
        treeGroup.rotation.y = Math.random() * Math.PI * 2;
        this.scene.add(treeGroup);
        this.trees.push(treeGroup);
    }

    createFoliage(startZ, endZ) {
        // Grass patches
        const grassGeometry = new THREE.ConeGeometry(0.1, 0.5, 4);
        const grassMaterial = new THREE.MeshStandardMaterial({
            color: 0x3a7d44,
            roughness: 0.9,
            metalness: 0.05
        });

        for (let i = 0; i < 200; i++) {
            const x = (Math.random() - 0.5) * 80;
            const z = -Math.random() * (endZ - startZ) - startZ;

            // Don't place grass on the road
            if (Math.abs(x - Math.sin(z * 0.05) * 3) > 3) {
                const grass = new THREE.Mesh(grassGeometry, grassMaterial);
                grass.position.set(x, 0, z);
                grass.rotation.y = Math.random() * Math.PI * 2;
                grass.scale.set(1 + Math.random(), 1 + Math.random() * 0.5, 1 + Math.random());
                this.scene.add(grass);
                this.grass.push(grass);
            }
        }

        // Bushes
        const bushGeometry = new THREE.SphereGeometry(0.5, 8, 8);
        const bushMaterial = new THREE.MeshStandardMaterial({
            color: 0x2d5016,
            roughness: 0.85,
            metalness: 0.1
        });

        for (let i = 0; i < 50; i++) {
            const x = (Math.random() - 0.5) * 70;
            const z = -Math.random() * (endZ - startZ) - startZ;

            if (Math.abs(x - Math.sin(z * 0.05) * 3) > 4) {
                const bush = new THREE.Mesh(bushGeometry, bushMaterial);
                bush.position.set(x, 0.3, z);
                bush.scale.set(1 + Math.random(), 0.8 + Math.random() * 0.4, 1 + Math.random());
                bush.castShadow = true;
                this.scene.add(bush);
                this.bushes.push(bush);
            }
        }
    }

    update(deltaTime) {
        // Gentle swaying animation for trees
        this.trees.forEach((tree, index) => {
            const sway = Math.sin(Date.now() * 0.001 + index) * 0.02;
            tree.rotation.z = sway;
        });

        // Grass swaying
        this.grass.forEach((grass, index) => {
            const sway = Math.sin(Date.now() * 0.002 + index * 0.1) * 0.05;
            grass.rotation.z = sway;
        });
    }
}
