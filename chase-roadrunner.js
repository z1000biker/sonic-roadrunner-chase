// Road Runner 3D Model with EXTREME detail and correct orientation
class RoadRunnerCharacter {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.animationTime = 0;
        this.speed = 0;
        this.position = new THREE.Vector3(0, 0, 0);
        this.createRoadRunner();
        this.createDustCloud();
    }

    createRoadRunner() {
        // BODY - Horizontal elongated body (NO ROTATION - naturally horizontal)
        const bodyGeometry = new THREE.SphereGeometry(0.35, 48, 48);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x6a4c93,
            metalness: 0.3,
            roughness: 0.5
        });
        this.body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        this.body.position.set(0, 1.0, -0.2); // Positioned correctly
        this.body.scale.set(1.5, 1, 1); // Elongate horizontally
        this.body.castShadow = true;
        this.group.add(this.body);

        // CHEST/BELLY - Lighter colored
        const chestGeometry = new THREE.SphereGeometry(0.32, 32, 32);
        const chestMaterial = new THREE.MeshStandardMaterial({
            color: 0xd8c8e6,
            metalness: 0.2,
            roughness: 0.6
        });
        this.chest = new THREE.Mesh(chestGeometry, chestMaterial);
        this.chest.position.set(0, 0.95, 0.1); // Front of body
        this.chest.scale.set(1.2, 1.1, 0.9);
        this.chest.castShadow = true;
        this.group.add(this.chest);

        // NECK - Connecting body to head
        const neckGeometry = new THREE.CylinderGeometry(0.15, 0.18, 0.3, 16);
        const neckMaterial = new THREE.MeshStandardMaterial({
            color: 0x6a4c93,
            metalness: 0.3,
            roughness: 0.5
        });
        this.neck = new THREE.Mesh(neckGeometry, neckMaterial);
        this.neck.position.set(0, 1.25, 0.3);
        this.neck.rotation.x = 0.3;
        this.neck.castShadow = true;
        this.group.add(this.neck);

        // HEAD - Small head positioned FORWARD
        const headGeometry = new THREE.SphereGeometry(0.28, 48, 48);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: 0x5a3d7a,
            metalness: 0.2,
            roughness: 0.5
        });
        this.head = new THREE.Mesh(headGeometry, headMaterial);
        this.head.position.set(0, 1.45, 0.5); // Forward position
        this.head.castShadow = true;
        this.group.add(this.head);

        // CREST - Feathers on top of head
        this.createDetailedCrest();

        // BEAK - Long yellow beak pointing FORWARD
        const beakGeometry = new THREE.ConeGeometry(0.08, 0.5, 12);
        const beakMaterial = new THREE.MeshStandardMaterial({
            color: 0xffcc00,
            metalness: 0.4,
            roughness: 0.4
        });
        this.beak = new THREE.Mesh(beakGeometry, beakMaterial);
        this.beak.position.set(0, 1.45, 0.75); // Forward from head
        this.beak.rotation.x = Math.PI / 2; // Point forward
        this.beak.castShadow = true;
        this.group.add(this.beak);

        // Beak detail - upper part
        const upperBeakGeometry = new THREE.ConeGeometry(0.06, 0.15, 12);
        const upperBeak = new THREE.Mesh(upperBeakGeometry, beakMaterial);
        upperBeak.position.set(0, 1.5, 0.9);
        upperBeak.rotation.x = Math.PI / 2;
        this.group.add(upperBeak);

        // EYES - Large expressive eyes
        const eyeWhiteGeometry = new THREE.SphereGeometry(0.14, 32, 32);
        const eyeWhiteMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.7,
            roughness: 0.2
        });

        this.leftEyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
        this.leftEyeWhite.position.set(-0.12, 1.55, 0.6);
        this.leftEyeWhite.scale.set(1, 1.2, 0.8);
        this.group.add(this.leftEyeWhite);

        this.rightEyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
        this.rightEyeWhite.position.set(0.12, 1.55, 0.6);
        this.rightEyeWhite.scale.set(1, 1.2, 0.8);
        this.group.add(this.rightEyeWhite);

        // Pupils
        const pupilGeometry = new THREE.SphereGeometry(0.08, 24, 24);
        const pupilMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
            metalness: 0.9,
            roughness: 0.1
        });

        const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        leftPupil.position.set(-0.12, 1.55, 0.72);
        this.group.add(leftPupil);

        const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        rightPupil.position.set(0.12, 1.55, 0.72);
        this.group.add(rightPupil);

        // Eye highlights
        const highlightGeometry = new THREE.SphereGeometry(0.04, 16, 16);
        const highlightMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });

        const leftHighlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
        leftHighlight.position.set(-0.1, 1.6, 0.75);
        this.group.add(leftHighlight);

        const rightHighlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
        rightHighlight.position.set(0.14, 1.6, 0.75);
        this.group.add(rightHighlight);

        // TAIL FEATHERS - Colorful and detailed
        this.createDetailedTailFeathers();

        // WINGS
        this.createDetailedWings();

        // LEGS - Long thin legs
        this.createDetailedLegs();

        // Rotate entire group to face forward along -Z axis
        this.group.rotation.y = Math.PI;

        this.scene.add(this.group);
    }

    createDetailedCrest() {
        const crestGeometry = new THREE.ConeGeometry(0.12, 0.45, 12);
        const crestMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a2c6a,
            metalness: 0.3,
            roughness: 0.4
        });

        // 5 crest feathers for detail
        const positions = [
            { x: -0.15, y: 1.7, z: 0.45, rz: 0.3 },
            { x: -0.08, y: 1.75, z: 0.48, rz: 0.15 },
            { x: 0, y: 1.78, z: 0.5, rz: 0 },
            { x: 0.08, y: 1.75, z: 0.48, rz: -0.15 },
            { x: 0.15, y: 1.7, z: 0.45, rz: -0.3 }
        ];

        positions.forEach(pos => {
            const feather = new THREE.Mesh(crestGeometry, crestMaterial);
            feather.position.set(pos.x, pos.y, pos.z);
            feather.rotation.z = pos.rz;
            feather.rotation.x = -0.2;
            feather.castShadow = true;
            this.group.add(feather);
        });
    }

    createDetailedTailFeathers() {
        const featherGeometry = new THREE.ConeGeometry(0.08, 0.7, 12);
        const featherColors = [0x0066ff, 0x00aaff, 0x6a4c93, 0x8855dd];

        // 9 tail feathers for extreme detail
        const positions = [
            { x: 0, y: 1.1, z: -0.7, ry: 0, color: 0 },
            { x: -0.12, y: 1.15, z: -0.75, ry: -0.2, color: 1 },
            { x: 0.12, y: 1.15, z: -0.75, ry: 0.2, color: 1 },
            { x: -0.22, y: 1.08, z: -0.8, ry: -0.4, color: 2 },
            { x: 0.22, y: 1.08, z: -0.8, ry: 0.4, color: 2 },
            { x: -0.3, y: 1.0, z: -0.75, ry: -0.6, color: 3 },
            { x: 0.3, y: 1.0, z: -0.75, ry: 0.6, color: 3 },
            { x: -0.18, y: 1.2, z: -0.7, ry: -0.3, color: 1 },
            { x: 0.18, y: 1.2, z: -0.7, ry: 0.3, color: 1 }
        ];

        this.tailFeathers = [];
        positions.forEach(pos => {
            const material = new THREE.MeshStandardMaterial({
                color: featherColors[pos.color],
                metalness: 0.4,
                roughness: 0.4,
                emissive: featherColors[pos.color],
                emissiveIntensity: 0.15
            });
            const feather = new THREE.Mesh(featherGeometry, material);
            feather.position.set(pos.x, pos.y, pos.z);
            feather.rotation.y = pos.ry;
            feather.rotation.x = Math.PI / 2; // Point backward
            feather.castShadow = true;
            this.group.add(feather);
            this.tailFeathers.push(feather);
        });
    }

    createDetailedWings() {
        // Wing base
        const wingBaseGeometry = new THREE.SphereGeometry(0.15, 24, 24);
        const wingMaterial = new THREE.MeshStandardMaterial({
            color: 0x5a3d7a,
            metalness: 0.3,
            roughness: 0.4
        });

        // Wing feathers (multiple segments)
        const wingFeatherGeometry = new THREE.BoxGeometry(0.08, 0.6, 0.04);

        // Left wing
        this.leftWingBase = new THREE.Mesh(wingBaseGeometry, wingMaterial);
        this.leftWingBase.position.set(-0.4, 1.0, 0);
        this.leftWingBase.castShadow = true;
        this.group.add(this.leftWingBase);

        this.leftWingFeathers = [];
        for (let i = 0; i < 4; i++) {
            const feather = new THREE.Mesh(wingFeatherGeometry, wingMaterial);
            feather.position.set(-0.45 - (i * 0.08), 1.0 - (i * 0.1), -0.05 * i);
            feather.rotation.z = 0.3 + (i * 0.1);
            feather.castShadow = true;
            this.group.add(feather);
            this.leftWingFeathers.push(feather);
        }

        // Right wing
        this.rightWingBase = new THREE.Mesh(wingBaseGeometry, wingMaterial);
        this.rightWingBase.position.set(0.4, 1.0, 0);
        this.rightWingBase.castShadow = true;
        this.group.add(this.rightWingBase);

        this.rightWingFeathers = [];
        for (let i = 0; i < 4; i++) {
            const feather = new THREE.Mesh(wingFeatherGeometry, wingMaterial);
            feather.position.set(0.45 + (i * 0.08), 1.0 - (i * 0.1), -0.05 * i);
            feather.rotation.z = -0.3 - (i * 0.1);
            feather.castShadow = true;
            this.group.add(feather);
            this.rightWingFeathers.push(feather);
        }
    }

    createDetailedLegs() {
        // Upper leg (thigh)
        const upperLegGeometry = new THREE.CylinderGeometry(0.06, 0.05, 0.5, 12);
        const legMaterial = new THREE.MeshStandardMaterial({
            color: 0xffcc00,
            metalness: 0.3,
            roughness: 0.5
        });

        this.leftUpperLeg = new THREE.Mesh(upperLegGeometry, legMaterial);
        this.leftUpperLeg.position.set(-0.15, 0.5, 0);
        this.leftUpperLeg.castShadow = true;
        this.group.add(this.leftUpperLeg);

        this.rightUpperLeg = new THREE.Mesh(upperLegGeometry, legMaterial);
        this.rightUpperLeg.position.set(0.15, 0.5, 0);
        this.rightUpperLeg.castShadow = true;
        this.group.add(this.rightUpperLeg);

        // Lower leg (shin)
        const lowerLegGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 12);

        this.leftLowerLeg = new THREE.Mesh(lowerLegGeometry, legMaterial);
        this.leftLowerLeg.position.set(-0.15, 0.05, 0);
        this.leftLowerLeg.castShadow = true;
        this.group.add(this.leftLowerLeg);

        this.rightLowerLeg = new THREE.Mesh(lowerLegGeometry, legMaterial);
        this.rightLowerLeg.position.set(0.15, 0.05, 0);
        this.rightLowerLeg.castShadow = true;
        this.group.add(this.rightLowerLeg);

        // FEET - Three toes each with detail
        this.createDetailedFeet();
    }

    createDetailedFeet() {
        const toeGeometry = new THREE.CylinderGeometry(0.03, 0.015, 0.25, 12);
        const toeMaterial = new THREE.MeshStandardMaterial({
            color: 0xffcc00,
            metalness: 0.3,
            roughness: 0.5
        });

        // Toe claw
        const clawGeometry = new THREE.ConeGeometry(0.02, 0.08, 8);
        const clawMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            metalness: 0.5,
            roughness: 0.4
        });

        // Left foot - 3 toes
        const leftToePositions = [
            { x: -0.15, z: 0.15, angle: 0.5 },
            { x: -0.15, z: 0.25, angle: 0 },
            { x: -0.15, z: 0.05, angle: -0.5 }
        ];

        leftToePositions.forEach(pos => {
            const toe = new THREE.Mesh(toeGeometry, toeMaterial);
            toe.position.set(pos.x, -0.15, pos.z);
            toe.rotation.x = Math.PI / 3;
            toe.rotation.y = pos.angle;
            toe.castShadow = true;
            this.group.add(toe);

            // Add claw
            const claw = new THREE.Mesh(clawGeometry, clawMaterial);
            claw.position.set(pos.x, -0.25, pos.z + 0.15);
            claw.rotation.x = Math.PI / 2.5;
            claw.rotation.y = pos.angle;
            this.group.add(claw);
        });

        // Right foot - 3 toes
        const rightToePositions = [
            { x: 0.15, z: 0.15, angle: 0.5 },
            { x: 0.15, z: 0.25, angle: 0 },
            { x: 0.15, z: 0.05, angle: -0.5 }
        ];

        rightToePositions.forEach(pos => {
            const toe = new THREE.Mesh(toeGeometry, toeMaterial);
            toe.position.set(pos.x, -0.15, pos.z);
            toe.rotation.x = Math.PI / 3;
            toe.rotation.y = pos.angle;
            toe.castShadow = true;
            this.group.add(toe);

            // Add claw
            const claw = new THREE.Mesh(clawGeometry, clawMaterial);
            claw.position.set(pos.x, -0.25, pos.z + 0.15);
            claw.rotation.x = Math.PI / 2.5;
            claw.rotation.y = pos.angle;
            this.group.add(claw);
        });
    }

    createDustCloud() {
        this.dustParticles = [];
        const dustGeometry = new THREE.SphereGeometry(0.08, 12, 12);

        for (let i = 0; i < 20; i++) {
            const dustMaterial = new THREE.MeshBasicMaterial({
                color: 0xccaa88,
                transparent: true,
                opacity: 0.6 - (i * 0.025)
            });
            const dust = new THREE.Mesh(dustGeometry, dustMaterial);
            dust.visible = false;
            this.scene.add(dust);
            this.dustParticles.push(dust);
        }
    }

    update(deltaTime, speed) {
        this.animationTime += deltaTime * speed * 4;
        this.speed = speed;

        // Fast running animation - rapid leg movement
        const legSwing = Math.sin(this.animationTime * 18) * 0.7;
        this.leftUpperLeg.rotation.x = legSwing;
        this.rightUpperLeg.rotation.x = -legSwing;
        this.leftLowerLeg.rotation.x = Math.max(0, legSwing * 0.6);
        this.rightLowerLeg.rotation.x = Math.max(0, -legSwing * 0.6);

        // Wing flapping
        const wingFlap = Math.sin(this.animationTime * 15) * 0.6;
        this.leftWingFeathers.forEach((feather, i) => {
            feather.rotation.z = 0.3 + (i * 0.1) + wingFlap;
        });
        this.rightWingFeathers.forEach((feather, i) => {
            feather.rotation.z = -0.3 - (i * 0.1) - wingFlap;
        });

        // Body bobbing - more pronounced
        this.body.position.y = 1.0 + Math.abs(Math.sin(this.animationTime * 18)) * 0.12;
        this.neck.position.y = 1.25 + Math.abs(Math.sin(this.animationTime * 18)) * 0.1;
        this.head.position.y = 1.45 + Math.abs(Math.sin(this.animationTime * 18)) * 0.08;

        // Tail feather movement
        this.tailFeathers.forEach((feather, index) => {
            const wave = Math.sin(this.animationTime * 10 + index * 0.4) * 0.15;
            feather.rotation.z = wave;
        });

        // Lean forward when running
        this.group.rotation.x = -0.2;

        // Dust cloud effect
        if (speed > 0.5) {
            this.dustParticles.forEach((dust, index) => {
                dust.visible = true;
                const offset = index * 0.15;
                dust.position.copy(this.group.position);
                dust.position.z += offset; // Behind character
                dust.position.y = 0.1;
                dust.position.x += (Math.random() - 0.5) * 0.2;
            });
        } else {
            this.dustParticles.forEach(dust => dust.visible = false);
        }
    }

    setPosition(x, y, z) {
        this.group.position.set(x, y, z);
        this.position.set(x, y, z);
    }

    getPosition() {
        return this.group.position;
    }
}
