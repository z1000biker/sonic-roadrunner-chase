// Visual Effects System
class EffectsSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.createSkyDome();
        this.createSun();
    }

    createSkyDome() {
        // Sky gradient
        const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
        const skyMaterial = new THREE.ShaderMaterial({
            uniforms: {
                topColor: { value: new THREE.Color(0x0077ff) },
                bottomColor: { value: new THREE.Color(0x89cff0) },
                offset: { value: 33 },
                exponent: { value: 0.6 }
            },
            vertexShader: `
                varying vec3 vWorldPosition;
                void main() {
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 topColor;
                uniform vec3 bottomColor;
                uniform float offset;
                uniform float exponent;
                varying vec3 vWorldPosition;
                void main() {
                    float h = normalize(vWorldPosition + offset).y;
                    gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
                }
            `,
            side: THREE.BackSide
        });

        this.sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(this.sky);
    }

    createSun() {
        // Sun sphere
        const sunGeometry = new THREE.SphereGeometry(20, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00
        });
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.sun.position.set(100, 150, -200);
        this.scene.add(this.sun);

        // Sun glow
        const glowGeometry = new THREE.SphereGeometry(25, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.copy(this.sun.position);
        this.scene.add(glow);
    }

    createParticleSystem(position, color, count = 20) {
        // Generic particle system for effects
        const particles = [];
        const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.8
        });

        for (let i = 0; i < count; i++) {
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.copy(position);
            particle.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.2,
                Math.random() * 0.3,
                (Math.random() - 0.5) * 0.2
            );
            particle.life = 1.0;
            this.scene.add(particle);
            particles.push(particle);
        }

        this.particles.push(...particles);
    }

    update(deltaTime) {
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];

            if (particle.velocity) {
                particle.position.add(particle.velocity.clone().multiplyScalar(deltaTime));
                particle.velocity.y -= 0.5 * deltaTime; // Gravity
                particle.life -= deltaTime;
                particle.material.opacity = particle.life;

                if (particle.life <= 0) {
                    this.scene.remove(particle);
                    this.particles.splice(i, 1);
                }
            }
        }
    }

    addSpeedLines(position, direction) {
        // Motion blur effect
        const lineGeometry = new THREE.BufferGeometry();
        const points = [];

        for (let i = 0; i < 5; i++) {
            const offset = direction.clone().multiplyScalar(-i * 0.5);
            points.push(position.clone().add(offset));
        }

        lineGeometry.setFromPoints(points);
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00aaff,
            transparent: true,
            opacity: 0.5
        });

        const line = new THREE.Line(lineGeometry, lineMaterial);
        this.scene.add(line);

        // Auto-remove after short time
        setTimeout(() => {
            this.scene.remove(line);
        }, 100);
    }
}

// Camera Controller
class CameraController {
    constructor(camera, target) {
        this.camera = camera;
        this.target = target;
        this.offset = new THREE.Vector3(0, 8, 15);
        this.lookAtOffset = new THREE.Vector3(0, 2, -10);
        this.cameraMode = 0; // 0: behind, 1: side, 2: front
    }

    update(deltaTime) {
        // Smooth camera follow
        const targetPosition = this.target.clone().add(this.offset);
        this.camera.position.lerp(targetPosition, 0.1);

        const lookAtPosition = this.target.clone().add(this.lookAtOffset);
        this.camera.lookAt(lookAtPosition);
    }

    toggleMode() {
        this.cameraMode = (this.cameraMode + 1) % 4;

        switch (this.cameraMode) {
            case 0: // Behind
                this.offset.set(0, 8, 15);
                this.lookAtOffset.set(0, 2, -10);
                break;
            case 1: // Side
                this.offset.set(12, 6, 5);
                this.lookAtOffset.set(-5, 2, -5);
                break;
            case 2: // Front
                this.offset.set(0, 5, -15);
                this.lookAtOffset.set(0, 2, 10);
                break;
            case 3: // Wide Side (Shows both)
                this.offset.set(25, 8, -5); // Side and slightly back from midpoint
                this.lookAtOffset.set(0, 2, -5); // Look at midpoint between Sonic (0) and RR (-10)
                break;
        }
    }
}
