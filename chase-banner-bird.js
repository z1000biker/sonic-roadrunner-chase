// Banner Bird - Flies across screen with Greek text banner
class BannerBird {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.bannerMesh = null;
        this.bannerVertices = [];
        this.time = 0;
        this.active = true;

        this.createBird();
        this.createBanner();

        // Position bird off-screen to the right
        this.group.position.set(150, 40, 0);
        this.group.rotation.y = Math.PI; // Face left

        scene.add(this.group);
    }

    createBird() {
        const birdGroup = new THREE.Group();

        // Body (yellow, chubby)
        const bodyGeometry = new THREE.SphereGeometry(2, 16, 16);
        bodyGeometry.scale(1, 0.8, 1.2);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0xFFDD00,
            flatShading: true
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        birdGroup.add(body);

        // Head (bigger, rounder - funny proportions)
        const headGeometry = new THREE.SphereGeometry(1.5, 16, 16);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.set(0, 1.5, 1);
        birdGroup.add(head);

        // Beak (orange, silly looking)
        const beakGeometry = new THREE.ConeGeometry(0.4, 1.2, 8);
        const beakMaterial = new THREE.MeshPhongMaterial({ color: 0xFF6600 });
        const beak = new THREE.Mesh(beakGeometry, beakMaterial);
        beak.rotation.x = Math.PI / 2;
        beak.position.set(0, 1.3, 2.2);
        birdGroup.add(beak);

        // Eyes (big, googly, cross-eyed for stupid look)
        const eyeGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const eyeWhiteMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });

        const leftEye = new THREE.Mesh(eyeGeometry, eyeWhiteMaterial);
        leftEye.position.set(-0.5, 1.8, 1.8);
        birdGroup.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeWhiteMaterial);
        rightEye.position.set(0.5, 1.8, 1.8);
        birdGroup.add(rightEye);

        // Pupils (looking in silly directions)
        const pupilGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const pupilMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

        const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        leftPupil.position.set(-0.6, 1.7, 2.1); // Cross-eyed
        birdGroup.add(leftPupil);

        const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        rightPupil.position.set(0.6, 1.9, 2.1); // Looking up
        birdGroup.add(rightPupil);

        // Tongue sticking out (silly!)
        const tongueGeometry = new THREE.BoxGeometry(0.3, 0.15, 0.8);
        const tongueMaterial = new THREE.MeshPhongMaterial({ color: 0xFF3366 });
        const tongue = new THREE.Mesh(tongueGeometry, tongueMaterial);
        tongue.position.set(0, 1.0, 2.5);
        tongue.rotation.x = 0.3;
        birdGroup.add(tongue);

        // Wings (flapping)
        const wingGeometry = new THREE.BoxGeometry(2, 0.2, 1.5);
        wingGeometry.translate(1, 0, 0);
        const wingMaterial = new THREE.MeshPhongMaterial({ color: 0xFFCC00 });

        const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
        leftWing.position.set(-1.5, 0, 0);
        birdGroup.add(leftWing);
        this.leftWing = leftWing;

        const rightWing = new THREE.Mesh(wingGeometry.clone(), wingMaterial);
        rightWing.position.set(1.5, 0, 0);
        rightWing.rotation.y = Math.PI;
        birdGroup.add(rightWing);
        this.rightWing = rightWing;

        // Tail feathers
        const tailGeometry = new THREE.ConeGeometry(0.8, 2, 8);
        const tailMaterial = new THREE.MeshPhongMaterial({ color: 0xFFAA00 });
        const tail = new THREE.Mesh(tailGeometry, tailMaterial);
        tail.rotation.x = Math.PI / 2;
        tail.position.set(0, 0, -2);
        birdGroup.add(tail);

        this.group.add(birdGroup);
        this.birdGroup = birdGroup;
    }

    createBanner() {
        // Create canvas for text
        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // White background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Red text - Greek: "Β ΠΛΗΡΟΦΟΡΙΚΗ"
        ctx.fillStyle = '#FF0000';
        ctx.font = 'bold 180px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Β ΠΛΗΡΟΦΟΡΙΚΗ', canvas.width / 2, canvas.height / 2);

        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;

        // Create banner mesh with segments for wind effect
        const segmentsX = 40;
        const segmentsY = 8;
        const bannerGeometry = new THREE.PlaneGeometry(20, 5, segmentsX, segmentsY);

        const bannerMaterial = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: false
        });

        this.bannerMesh = new THREE.Mesh(bannerGeometry, bannerMaterial);
        this.bannerMesh.position.set(-12, 0, 0); // Behind the bird

        // Store original vertices for wave animation
        const positions = bannerGeometry.attributes.position;
        this.bannerVertices = [];
        for (let i = 0; i < positions.count; i++) {
            this.bannerVertices.push({
                x: positions.getX(i),
                y: positions.getY(i),
                z: positions.getZ(i)
            });
        }

        this.group.add(this.bannerMesh);
        this.bannerGeometry = bannerGeometry;
    }

    update(deltaTime, playerPosition) {
        if (!this.active) return;

        this.time += deltaTime;

        // Deactivate after 10 seconds
        if (this.time > 10) {
            this.active = false;
            this.group.visible = false;
            return;
        }

        // Move bird from right to left RELATIVE TO PLAYER
        const flySpeed = 30; // Units per second
        const startOffset = 60; // Start 60 units to the right

        // Calculate X position based on time
        const currentXOffset = startOffset - (this.time * flySpeed);

        // Update position relative to player
        // Keep Z aligned with player so it doesn't get left behind
        // Add slight Z offset to be in front of camera
        this.group.position.x = playerPosition.x + currentXOffset;
        this.group.position.y = playerPosition.y + 15 + Math.sin(this.time * 3) * 0.5; // Bobbing
        this.group.position.z = playerPosition.z - 5; // Slightly ahead of Sonic

        // Flap wings
        const flapAngle = Math.sin(this.time * 15) * 0.6; // Faster flapping
        this.leftWing.rotation.z = flapAngle;
        this.rightWing.rotation.z = -flapAngle;

        // Animate banner with wind/whirl effects
        this.animateBanner();

        // Remove from scene when off-screen (far left)
        if (currentXOffset < -60) {
            this.active = false;
            this.group.visible = false;
        }
    }

    animateBanner() {
        const positions = this.bannerGeometry.attributes.position;
        const segmentsX = 40;
        const segmentsY = 8;

        for (let i = 0; i < this.bannerVertices.length; i++) {
            const vertex = this.bannerVertices[i];
            const x = vertex.x;
            const y = vertex.y;

            // Calculate wave based on position along banner
            const waveX = (x + 10) / 20; // Normalize to 0-1

            // Multiple wave frequencies for complex motion
            const wave1 = Math.sin(this.time * 4 + waveX * Math.PI * 3) * 0.3;
            const wave2 = Math.sin(this.time * 6 + waveX * Math.PI * 5) * 0.15;
            const wave3 = Math.cos(this.time * 8 + waveX * Math.PI * 4) * 0.1;

            // Vertical wave (fluttering)
            const verticalWave = (wave1 + wave2) * (waveX * waveX); // More wave at the end

            // Horizontal whirl effect
            const whirlZ = wave3 * waveX * 2;

            // Apply waves
            positions.setY(i, vertex.y + verticalWave);
            positions.setZ(i, vertex.z + whirlZ);
        }

        positions.needsUpdate = true;
        this.bannerGeometry.computeVertexNormals();
    }
}

// Export for use in main scene
window.BannerBird = BannerBird;
