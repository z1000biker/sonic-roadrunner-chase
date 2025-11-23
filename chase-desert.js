// Desert Environment System
class DesertEnvironment {
    constructor(scene, terrain) {
        this.scene = scene;
        this.terrain = terrain;
        this.cacti = [];
        this.rocks = [];
        this.tumbleweeds = [];

        // Only populate last QUARTER of road (750 to 1000 units) for gradual transition
        this.populateDesert(750, 1000);
    }

    populateDesert(startZ, endZ) {
        // Create cacti only in desert zone
        for (let i = 0; i < 60; i++) {
            const x = (Math.random() - 0.5) * 80;
            const z = -Math.random() * (endZ - startZ) - startZ; // Within desert zone

            // Don't place cacti on the road
            if (Math.abs(x - Math.sin(z * 0.05) * 3) > 5) {
                if (Math.random() > 0.3) {
                    this.createCactus(x, z);
                } else {
                    this.createRock(x, z);
                }
            }
        }

        // Add tumbleweeds
        this.createTumbleweeds(startZ, endZ);
    }

    createCactus(x, z) {
        const cactusGroup = new THREE.Group();

        // Main trunk
        const trunkHeight = 2 + Math.random() * 2;
        const trunkRadius = 0.3;
        const trunkGeometry = new THREE.CylinderGeometry(trunkRadius, trunkRadius, trunkHeight, 12);
        const cactusMaterial = new THREE.MeshStandardMaterial({
            color: 0x3d7d3d,
            roughness: 0.85,
            metalness: 0.1
        });
        const trunk = new THREE.Mesh(trunkGeometry, cactusMaterial);
        trunk.position.y = trunkHeight / 2;
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        cactusGroup.add(trunk);

        // Arms (saguaro style)
        const armCount = Math.floor(Math.random() * 3);
        for (let i = 0; i < armCount; i++) {
            const armHeight = 1 + Math.random();
            const armGeometry = new THREE.CylinderGeometry(0.2, 0.2, armHeight, 12);
            const arm = new THREE.Mesh(armGeometry, cactusMaterial);

            const side = i % 2 === 0 ? 1 : -1;
            const yPos = trunkHeight * 0.4 + Math.random() * trunkHeight * 0.3;

            arm.position.set(side * 0.4, yPos, 0);
            arm.rotation.z = side * Math.PI / 2;
            arm.castShadow = true;
            cactusGroup.add(arm);

            // Vertical part of arm
            const armUpGeometry = new THREE.CylinderGeometry(0.2, 0.2, armHeight * 0.7, 12);
            const armUp = new THREE.Mesh(armUpGeometry, cactusMaterial);
            armUp.position.set(side * (0.4 + armHeight / 2), yPos + armHeight * 0.35, 0);
            armUp.castShadow = true;
            cactusGroup.add(armUp);
        }

        // Spines
        this.addCactusSpines(cactusGroup);

        cactusGroup.position.set(x, 0, z);
        this.scene.add(cactusGroup);
        this.cacti.push(cactusGroup);
    }

    addCactusSpines(group) {
        const spineGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.1, 4);
        const spineMaterial = new THREE.MeshStandardMaterial({
            color: 0xccccaa,
            roughness: 0.7
        });

        for (let i = 0; i < 20; i++) {
            const spine = new THREE.Mesh(spineGeometry, spineMaterial);
            const angle = (i / 20) * Math.PI * 2;
            const height = Math.random() * 2;
            spine.position.set(
                Math.cos(angle) * 0.35,
                height,
                Math.sin(angle) * 0.35
            );
            spine.rotation.z = angle;
            spine.rotation.x = Math.PI / 2;
            group.add(spine);
        }
    }

    createRock(x, z) {
        const rockGroup = new THREE.Group();

        // Create irregular rock shape
        const rockCount = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < rockCount; i++) {
            const size = 0.5 + Math.random() * 0.8;
            const rockGeometry = new THREE.SphereGeometry(size, 8, 6);

            // Deform for irregular shape
            const positions = rockGeometry.attributes.position;
            for (let j = 0; j < positions.count; j++) {
                const x = positions.getX(j);
                const y = positions.getY(j);
                const z = positions.getZ(j);
                positions.setX(j, x * (0.8 + Math.random() * 0.4));
                positions.setY(j, y * (0.8 + Math.random() * 0.4));
                positions.setZ(j, z * (0.8 + Math.random() * 0.4));
            }
            positions.needsUpdate = true;
            rockGeometry.computeVertexNormals();

            const rockMaterial = new THREE.MeshStandardMaterial({
                color: 0x8b7355,
                roughness: 0.95,
                metalness: 0.05
            });

            const rock = new THREE.Mesh(rockGeometry, rockMaterial);
            rock.position.set(
                (Math.random() - 0.5) * 0.5,
                size * 0.3,
                (Math.random() - 0.5) * 0.5
            );
            rock.castShadow = true;
            rock.receiveShadow = true;
            rockGroup.add(rock);
        }

        rockGroup.position.set(x, 0, z);
        rockGroup.rotation.y = Math.random() * Math.PI * 2;
        this.scene.add(rockGroup);
        this.rocks.push(rockGroup);
    }

    createTumbleweeds(startZ, endZ) {
        const tumbleweedGeometry = new THREE.SphereGeometry(0.4, 8, 8);
        const tumbleweedMaterial = new THREE.MeshStandardMaterial({
            color: 0xb8956a,
            roughness: 0.9,
            metalness: 0.05,
            wireframe: true
        });

        for (let i = 0; i < 10; i++) {
            const tumbleweed = new THREE.Mesh(tumbleweedGeometry, tumbleweedMaterial);
            const x = (Math.random() - 0.5) * 60;
            const z = -Math.random() * (endZ - startZ) - startZ;
            tumbleweed.position.set(x, 0.4, z);
            this.scene.add(tumbleweed);
            this.tumbleweeds.push(tumbleweed);
        }
    }

    update(deltaTime) {
        // Keep cacti static
    }
}
