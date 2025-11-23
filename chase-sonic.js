// Sonic the Hedgehog 3D Model with EXTREME detail and proper orientation
class SonicCharacter {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.animationTime = 0;
        this.speed = 0;
        this.position = new THREE.Vector3(0, 0, 0);
        this.createSonic();
        this.createSpeedTrail();
    }

    createSonic() {
        // BODY - Detailed torso with segments
        const bodyGeometry = new THREE.SphereGeometry(0.6, 64, 64);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x0055dd,
            metalness: 0.2,
            roughness: 0.6,
            emissive: 0x001144,
            emissiveIntensity: 0.1
        });
        this.body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        this.body.position.set(0, 0.8, 0);
        this.body.castShadow = true;
        this.body.receiveShadow = true;
        this.group.add(this.body);

        // CHEST - Tan/beige colored
        const chestGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const chestMaterial = new THREE.MeshStandardMaterial({
            color: 0xffcc99,
            metalness: 0.1,
            roughness: 0.8
        });
        this.chest = new THREE.Mesh(chestGeometry, chestMaterial);
        this.chest.position.set(0, 0.8, 0.3);
        this.chest.scale.set(0.9, 1, 0.7);
        this.chest.castShadow = true;
        this.group.add(this.chest);

        // HEAD - Large sphere positioned FORWARD
        const headGeometry = new THREE.SphereGeometry(0.7, 64, 64);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: 0x0055dd,
            metalness: 0.2,
            roughness: 0.5
        });
        this.head = new THREE.Mesh(headGeometry, headMaterial);
        this.head.position.set(0, 1.6, 0.2);
        this.head.castShadow = true;
        this.group.add(this.head);

        // MUZZLE - Tan colored, positioned FORWARD
        const muzzleGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const muzzleMaterial = new THREE.MeshStandardMaterial({
            color: 0xffcc99,
            metalness: 0.1,
            roughness: 0.8
        });
        this.muzzle = new THREE.Mesh(muzzleGeometry, muzzleMaterial);
        this.muzzle.position.set(0, 1.5, 0.7);
        this.muzzle.scale.set(1.2, 0.7, 0.9);
        this.muzzle.castShadow = true;
        this.group.add(this.muzzle);

        // NOSE - Black button nose
        const noseGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const noseMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
            metalness: 0.5,
            roughness: 0.3
        });
        const nose = new THREE.Mesh(noseGeometry, noseMaterial);
        nose.position.set(0, 1.55, 0.95);
        this.group.add(nose);

        // EYES - Large green eyes with detail
        const eyeWhiteGeometry = new THREE.SphereGeometry(0.28, 32, 32);
        const eyeWhiteMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.7,
            roughness: 0.2
        });

        this.leftEyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
        this.leftEyeWhite.position.set(-0.22, 1.7, 0.55);
        this.leftEyeWhite.scale.set(1, 1.1, 0.8);
        this.group.add(this.leftEyeWhite);

        this.rightEyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
        this.rightEyeWhite.position.set(0.22, 1.7, 0.55);
        this.rightEyeWhite.scale.set(1, 1.1, 0.8);
        this.group.add(this.rightEyeWhite);

        // Green iris
        const irisGeometry = new THREE.SphereGeometry(0.18, 32, 32);
        const irisMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            metalness: 0.6,
            roughness: 0.3,
            emissive: 0x00ff00,
            emissiveIntensity: 0.2
        });

        const leftIris = new THREE.Mesh(irisGeometry, irisMaterial);
        leftIris.position.set(-0.22, 1.7, 0.7);
        this.group.add(leftIris);

        const rightIris = new THREE.Mesh(irisGeometry, irisMaterial);
        rightIris.position.set(0.22, 1.7, 0.7);
        this.group.add(rightIris);

        // Black pupils
        const pupilGeometry = new THREE.SphereGeometry(0.1, 24, 24);
        const pupilMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
            metalness: 0.9,
            roughness: 0.1
        });

        const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        leftPupil.position.set(-0.22, 1.7, 0.82);
        this.group.add(leftPupil);

        const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        rightPupil.position.set(0.22, 1.7, 0.82);
        this.group.add(rightPupil);

        // Eye highlights
        const highlightGeometry = new THREE.SphereGeometry(0.05, 16, 16);
        const highlightMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });

        const leftHighlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
        leftHighlight.position.set(-0.18, 1.75, 0.85);
        this.group.add(leftHighlight);

        const rightHighlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
        rightHighlight.position.set(0.26, 1.75, 0.85);
        this.group.add(rightHighlight);

        // SPIKES - Iconic quills pointing BACKWARD
        this.createDetailedSpikes();

        // EARS
        this.createEars();

        // ARMS with CONNECTED segments
        this.createConnectedArms();

        // LEGS with detail
        this.createDetailedLegs();

        // SHOES - Iconic red shoes with buckles
        this.createDetailedShoes();

        // Rotate entire group to face forward along -Z axis
        this.group.rotation.y = Math.PI;

        this.scene.add(this.group);
    }

    createDetailedSpikes() {
        const spikeGeometry = new THREE.ConeGeometry(0.22, 1.0, 12);
        const spikeMaterial = new THREE.MeshStandardMaterial({
            color: 0x0044cc,
            metalness: 0.3,
            roughness: 0.4
        });

        // Back spikes - 7 spikes for detail
        const positions = [
            { x: 0, y: 2.0, z: -0.4, rx: Math.PI * 0.4, ry: 0 },
            { x: -0.25, y: 1.95, z: -0.5, rx: Math.PI * 0.35, ry: -0.4 },
            { x: 0.25, y: 1.95, z: -0.5, rx: Math.PI * 0.35, ry: 0.4 },
            { x: -0.45, y: 1.8, z: -0.55, rx: Math.PI * 0.3, ry: -0.6 },
            { x: 0.45, y: 1.8, z: -0.55, rx: Math.PI * 0.3, ry: 0.6 },
            { x: -0.6, y: 1.6, z: -0.5, rx: Math.PI * 0.25, ry: -0.8 },
            { x: 0.6, y: 1.6, z: -0.5, rx: Math.PI * 0.25, ry: 0.8 }
        ];

        positions.forEach(pos => {
            const spike = new THREE.Mesh(spikeGeometry, spikeMaterial);
            spike.position.set(pos.x, pos.y, pos.z);
            spike.rotation.x = pos.rx;
            spike.rotation.y = pos.ry;
            spike.castShadow = true;
            this.group.add(spike);
        });
    }

    createEars() {
        const earGeometry = new THREE.ConeGeometry(0.15, 0.4, 12);
        const earMaterial = new THREE.MeshStandardMaterial({
            color: 0x0055dd,
            metalness: 0.2,
            roughness: 0.5
        });

        const leftEar = new THREE.Mesh(earGeometry, earMaterial);
        leftEar.position.set(-0.5, 2.0, 0);
        leftEar.rotation.z = -0.3;
        leftEar.castShadow = true;
        this.group.add(leftEar);

        const rightEar = new THREE.Mesh(earGeometry, earMaterial);
        rightEar.position.set(0.5, 2.0, 0);
        rightEar.rotation.z = 0.3;
        rightEar.castShadow = true;
        this.group.add(rightEar);
    }

    createConnectedArms() {
        const armMaterial = new THREE.MeshStandardMaterial({
            color: 0x0055dd,
            metalness: 0.2,
            roughness: 0.5
        });

        const gloveMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.1,
            roughness: 0.7
        });

        // LEFT ARM - Hierarchical structure
        const shoulderGeometry = new THREE.SphereGeometry(0.16, 16, 16);
        this.leftShoulder = new THREE.Mesh(shoulderGeometry, armMaterial);
        this.leftShoulder.position.set(-0.6, 1.0, 0);
        this.leftShoulder.castShadow = true;
        this.group.add(this.leftShoulder);

        const upperArmGeometry = new THREE.CylinderGeometry(0.14, 0.12, 0.5, 16);
        this.leftUpperArm = new THREE.Mesh(upperArmGeometry, armMaterial);
        this.leftUpperArm.position.set(0, -0.25, 0);
        this.leftUpperArm.castShadow = true;
        this.leftShoulder.add(this.leftUpperArm);

        const elbowGeometry = new THREE.SphereGeometry(0.12, 16, 16);
        this.leftElbow = new THREE.Mesh(elbowGeometry, armMaterial);
        this.leftElbow.position.set(0, -0.25, 0);
        this.leftElbow.castShadow = true;
        this.leftUpperArm.add(this.leftElbow);

        const forearmGeometry = new THREE.CylinderGeometry(0.12, 0.11, 0.4, 16);
        this.leftForearm = new THREE.Mesh(forearmGeometry, armMaterial);
        this.leftForearm.position.set(0, -0.2, 0);
        this.leftForearm.castShadow = true;
        this.leftElbow.add(this.leftForearm);

        const wristGeometry = new THREE.SphereGeometry(0.11, 16, 16);
        this.leftWrist = new THREE.Mesh(wristGeometry, armMaterial);
        this.leftWrist.position.set(0, -0.2, 0);
        this.leftWrist.castShadow = true;
        this.leftForearm.add(this.leftWrist);

        const gloveGeometry = new THREE.SphereGeometry(0.18, 24, 24);
        this.leftGlove = new THREE.Mesh(gloveGeometry, gloveMaterial);
        this.leftGlove.position.set(0, -0.15, 0);
        this.leftGlove.scale.set(1, 0.9, 1.1);
        this.leftGlove.castShadow = true;
        this.leftWrist.add(this.leftGlove);

        const cuffGeometry = new THREE.CylinderGeometry(0.19, 0.14, 0.12, 16);
        const cuffMaterial = new THREE.MeshStandardMaterial({
            color: 0xeeeeee,
            metalness: 0.2,
            roughness: 0.6
        });
        const leftCuff = new THREE.Mesh(cuffGeometry, cuffMaterial);
        leftCuff.position.set(0, 0.12, 0);
        this.leftGlove.add(leftCuff);

        // RIGHT ARM - Hierarchical structure
        this.rightShoulder = new THREE.Mesh(shoulderGeometry, armMaterial);
        this.rightShoulder.position.set(0.6, 1.0, 0);
        this.rightShoulder.castShadow = true;
        this.group.add(this.rightShoulder);

        this.rightUpperArm = new THREE.Mesh(upperArmGeometry, armMaterial);
        this.rightUpperArm.position.set(0, -0.25, 0);
        this.rightUpperArm.castShadow = true;
        this.rightShoulder.add(this.rightUpperArm);

        this.rightElbow = new THREE.Mesh(elbowGeometry, armMaterial);
        this.rightElbow.position.set(0, -0.25, 0);
        this.rightElbow.castShadow = true;
        this.rightUpperArm.add(this.rightElbow);

        this.rightForearm = new THREE.Mesh(forearmGeometry, armMaterial);
        this.rightForearm.position.set(0, -0.2, 0);
        this.rightForearm.castShadow = true;
        this.rightElbow.add(this.rightForearm);

        this.rightWrist = new THREE.Mesh(wristGeometry, armMaterial);
        this.rightWrist.position.set(0, -0.2, 0);
        this.rightWrist.castShadow = true;
        this.rightForearm.add(this.rightWrist);

        this.rightGlove = new THREE.Mesh(gloveGeometry, gloveMaterial);
        this.rightGlove.position.set(0, -0.15, 0);
        this.rightGlove.scale.set(1, 0.9, 1.1);
        this.rightGlove.castShadow = true;
        this.rightWrist.add(this.rightGlove);

        const rightCuff = new THREE.Mesh(cuffGeometry, cuffMaterial);
        rightCuff.position.set(0, 0.12, 0);
        this.rightGlove.add(rightCuff);
    }

    createDetailedLegs() {
        const thighGeometry = new THREE.CylinderGeometry(0.18, 0.16, 0.5, 16);
        const legMaterial = new THREE.MeshStandardMaterial({
            color: 0x0055dd,
            metalness: 0.2,
            roughness: 0.5
        });

        this.leftThigh = new THREE.Mesh(thighGeometry, legMaterial);
        this.leftThigh.position.set(-0.25, 0.2, 0);
        this.leftThigh.castShadow = true;
        this.group.add(this.leftThigh);

        this.rightThigh = new THREE.Mesh(thighGeometry, legMaterial);
        this.rightThigh.position.set(0.25, 0.2, 0);
        this.rightThigh.castShadow = true;
        this.group.add(this.rightThigh);

        const lowerLegGeometry = new THREE.CylinderGeometry(0.14, 0.16, 0.4, 16);

        this.leftLowerLeg = new THREE.Mesh(lowerLegGeometry, legMaterial);
        this.leftLowerLeg.position.set(-0.25, -0.15, 0);
        this.leftLowerLeg.castShadow = true;
        this.group.add(this.leftLowerLeg);

        this.rightLowerLeg = new THREE.Mesh(lowerLegGeometry, legMaterial);
        this.rightLowerLeg.position.set(0.25, -0.15, 0);
        this.rightLowerLeg.castShadow = true;
        this.group.add(this.rightLowerLeg);
    }

    createDetailedShoes() {
        const shoeGeometry = new THREE.BoxGeometry(0.32, 0.25, 0.55);
        const shoeMaterial = new THREE.MeshStandardMaterial({
            color: 0xdd0000,
            metalness: 0.5,
            roughness: 0.4
        });

        this.leftShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
        this.leftShoe.position.set(-0.25, -0.45, 0.15);
        this.leftShoe.castShadow = true;
        this.group.add(this.leftShoe);

        this.rightShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
        this.rightShoe.position.set(0.25, -0.45, 0.15);
        this.rightShoe.castShadow = true;
        this.group.add(this.rightShoe);

        const toeGeometry = new THREE.SphereGeometry(0.16, 16, 16);

        const leftToe = new THREE.Mesh(toeGeometry, shoeMaterial);
        leftToe.position.set(-0.25, -0.45, 0.4);
        leftToe.scale.set(1, 0.8, 1.2);
        leftToe.castShadow = true;
        this.group.add(leftToe);

        const rightToe = new THREE.Mesh(toeGeometry, shoeMaterial);
        rightToe.position.set(0.25, -0.45, 0.4);
        rightToe.scale.set(1, 0.8, 1.2);
        rightToe.castShadow = true;
        this.group.add(rightToe);

        const stripeGeometry = new THREE.BoxGeometry(0.33, 0.12, 0.56);
        const stripeMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.3,
            roughness: 0.5
        });

        const leftStripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        leftStripe.position.set(-0.25, -0.45, 0.15);
        this.group.add(leftStripe);

        const rightStripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        rightStripe.position.set(0.25, -0.45, 0.15);
        this.group.add(rightStripe);

        const buckleGeometry = new THREE.BoxGeometry(0.08, 0.15, 0.02);
        const buckleMaterial = new THREE.MeshStandardMaterial({
            color: 0xffdd00,
            metalness: 0.8,
            roughness: 0.2
        });

        const leftBuckle = new THREE.Mesh(buckleGeometry, buckleMaterial);
        leftBuckle.position.set(-0.25, -0.45, 0.43);
        this.group.add(leftBuckle);

        const rightBuckle = new THREE.Mesh(buckleGeometry, buckleMaterial);
        rightBuckle.position.set(0.25, -0.45, 0.43);
        this.group.add(rightBuckle);

        const soleGeometry = new THREE.BoxGeometry(0.34, 0.08, 0.6);
        const soleMaterial = new THREE.MeshStandardMaterial({
            color: 0xeeeeee,
            metalness: 0.1,
            roughness: 0.9
        });

        const leftSole = new THREE.Mesh(soleGeometry, soleMaterial);
        leftSole.position.set(-0.25, -0.58, 0.15);
        leftSole.castShadow = true;
        this.group.add(leftSole);

        const rightSole = new THREE.Mesh(soleGeometry, soleMaterial);
        rightSole.position.set(0.25, -0.58, 0.15);
        rightSole.castShadow = true;
        this.group.add(rightSole);
    }

    createSpeedTrail() {
        this.speedTrails = [];
        const trailGeometry = new THREE.SphereGeometry(0.12, 12, 12);

        for (let i = 0; i < 15; i++) {
            const trailMaterial = new THREE.MeshBasicMaterial({
                color: 0x00aaff,
                transparent: true,
                opacity: 0.7 - (i * 0.04)
            });
            const trail = new THREE.Mesh(trailGeometry, trailMaterial);
            trail.visible = false;
            this.scene.add(trail);
            this.speedTrails.push(trail);
        }
    }

    update(deltaTime, speed) {
        this.animationTime += deltaTime * speed * 3;
        this.speed = speed;

        // Running animation - leg cycling
        const legSwing = Math.sin(this.animationTime * 12) * 0.6;
        this.leftThigh.rotation.x = legSwing;
        this.rightThigh.rotation.x = -legSwing;
        this.leftLowerLeg.rotation.x = Math.max(0, legSwing * 0.5);
        this.rightLowerLeg.rotation.x = Math.max(0, -legSwing * 0.5);
        this.leftShoe.rotation.x = legSwing;
        this.rightShoe.rotation.x = -legSwing;

        // Arm swinging - now properly connected
        const armSwing = Math.sin(this.animationTime * 12) * 0.5;
        this.leftShoulder.rotation.x = -armSwing;
        this.rightShoulder.rotation.x = armSwing;
        this.leftElbow.rotation.x = -armSwing * 0.3;
        this.rightElbow.rotation.x = armSwing * 0.3;

        // Body bobbing
        this.body.position.y = 0.8 + Math.abs(Math.sin(this.animationTime * 12)) * 0.08;
        this.head.position.y = 1.6 + Math.abs(Math.sin(this.animationTime * 12)) * 0.08;

        // Lean forward when running
        this.group.rotation.x = -0.15;

        // Speed trail effect
        if (speed > 0.5) {
            this.speedTrails.forEach((trail, index) => {
                trail.visible = true;
                const offset = index * 0.25;
                trail.position.copy(this.group.position);
                trail.position.z += offset;
                trail.position.y += 0.4;
            });
        } else {
            this.speedTrails.forEach(trail => trail.visible = false);
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
