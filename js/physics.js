/**
 * EA FC 27 Web Edition - Ball Physics & Goal Detection Engine
 */

import { GAME_CONFIG } from './config.js';
import { soundEngine } from './audio.js';

export class Ball {
    constructor(scene) {
        this.scene = scene;
        this.radius = GAME_CONFIG.BALL_RADIUS;
        this.position = new THREE.Vector3(0, this.radius, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.spin = new THREE.Vector3(0, 0, 0); // Curl / Magnus effect
        this.owner = null; // Player currently holding the ball
        this.lastKicker = null; // Last player who touched/kicked the ball
        this.isFree = true;
        this.mesh = null;
        this.shadowMesh = null;

        this.initMesh();
    }

    initMesh() {
        // High quality classic 32-panel soccer ball texture on canvas
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        // White base
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, 512, 256);

        // Black/Volt geometric patterns
        ctx.fillStyle = '#0f172a';
        for (let x = 32; x < 512; x += 128) {
            for (let y = 32; y < 256; y += 128) {
                ctx.beginPath();
                ctx.arc(x, y, 28, 0, Math.PI * 2);
                ctx.fill();

                // Neon volt EA FC accent line
                ctx.strokeStyle = '#00f59b';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(x + 20, y + 20, 32, 0, Math.PI * 1.5);
                ctx.stroke();
            }
        }

        const ballTex = new THREE.CanvasTexture(canvas);
        const ballGeo = new THREE.SphereGeometry(this.radius, 32, 32);
        const ballMat = new THREE.MeshStandardMaterial({
            map: ballTex,
            roughness: 0.35,
            metalness: 0.15
        });

        this.mesh = new THREE.Mesh(ballGeo, ballMat);
        this.mesh.castShadow = true;
        this.mesh.position.copy(this.position);
        this.scene.add(this.mesh);

        // Soft dynamic ground shadow
        const shadowGeo = new THREE.CircleGeometry(this.radius * 1.2, 16);
        const shadowMat = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.45,
            depthWrite: false
        });
        this.shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
        this.shadowMesh.rotation.x = -Math.PI / 2;
        this.shadowMesh.position.y = 0.02;
        this.scene.add(this.shadowMesh);
    }

    kick(direction, power, heightRatio = 0.2, spinAngle = 0, kicker = null) {
        this.owner = null;
        this.isFree = true;
        this.lastKicker = kicker;

        const forward = direction.clone().normalize();
        const horizSpeed = power;
        const vertSpeed = power * heightRatio;

        this.velocity.x = forward.x * horizSpeed;
        this.velocity.z = forward.z * horizSpeed;
        this.velocity.y = vertSpeed;

        // Magnus effect curl spin
        this.spin.set(0, spinAngle * 12, 0);

        soundEngine.playKick(Math.min(power / 30, 1.0));
    }

    update(dt) {
        if (this.owner) {
            // Attached to dribbler player
            const dribbleDist = 0.65;
            const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.owner.rotation);
            this.position.x = this.owner.position.x + forward.x * dribbleDist;
            this.position.z = this.owner.position.z + forward.z * dribbleDist;
            this.position.y = this.radius;
            this.velocity.set(0, 0, 0);

            // Ball roll rotation
            const speed = this.owner.currentSpeed || 0;
            this.mesh.rotation.x += speed * dt * 4;
        } else {
            // Physics simulation in flight / roll
            // 1. Gravity
            this.velocity.y -= GAME_CONFIG.GRAVITY * dt * 1.5;

            // 2. Air Drag & Magnus Effect (Spin Curve)
            const speedSq = this.velocity.lengthSq();
            const airDrag = 0.992;
            this.velocity.x *= airDrag;
            this.velocity.z *= airDrag;

            if (this.spin.y !== 0) {
                // Apply perpendicular force to velocity
                const perpX = -this.velocity.z * this.spin.y * 0.04;
                const perpZ = this.velocity.x * this.spin.y * 0.04;
                this.velocity.x += perpX * dt;
                this.velocity.z += perpZ * dt;
                this.spin.y *= 0.98; // Spin dampens
            }

            // 3. Move
            this.position.x += this.velocity.x * dt;
            this.position.y += this.velocity.y * dt;
            this.position.z += this.velocity.z * dt;

            // 4. Ground Collision & Friction
            if (this.position.y <= this.radius) {
                this.position.y = this.radius;

                // Bounce
                if (Math.abs(this.velocity.y) > 0.8) {
                    this.velocity.y = -this.velocity.y * 0.65; // restitution
                } else {
                    this.velocity.y = 0;
                }

                // Grass rolling friction
                this.velocity.x *= 0.978;
                this.velocity.z *= 0.978;

                if (this.velocity.lengthSq() < 0.01) {
                    this.velocity.set(0, 0, 0);
                }
            }

            // 5. Goal Post & Crossbar Collision Check
            this.checkPostCollisions();

            // 6. Net Collision Check
            this.checkNetCollisions();

            // 7. Visual rotation from linear speed
            const horizSpeed = Math.sqrt(this.velocity.x ** 2 + this.velocity.z ** 2);
            if (horizSpeed > 0.1) {
                this.mesh.rotation.x += this.velocity.z * dt * 3;
                this.mesh.rotation.z -= this.velocity.x * dt * 3;
            }
        }

        // Sync 3D mesh
        this.mesh.position.copy(this.position);

        // Sync ground shadow
        this.shadowMesh.position.x = this.position.x;
        this.shadowMesh.position.z = this.position.z;
        const shadowScale = Math.max(0.2, 1 - (this.position.y - this.radius) * 0.12);
        this.shadowMesh.scale.set(shadowScale, shadowScale, shadowScale);
        this.shadowMesh.material.opacity = Math.max(0.1, 0.45 - (this.position.y - this.radius) * 0.05);
    }

    checkPostCollisions() {
        const L = GAME_CONFIG.PITCH_LENGTH;
        const GW = GAME_CONFIG.GOAL_WIDTH;
        const GH = GAME_CONFIG.GOAL_HEIGHT;
        const postRadius = 0.12;

        const goals = [
            { x: -L / 2, side: -1 },
            { x: L / 2, side: 1 }
        ];

        goals.forEach(goal => {
            const posts = [
                new THREE.Vector3(goal.x, 0, -GW / 2),
                new THREE.Vector3(goal.x, 0, GW / 2)
            ];

            // Upright posts
            posts.forEach(post => {
                const dist2D = Math.hypot(this.position.x - post.x, this.position.z - post.z);
                if (dist2D < this.radius + postRadius && this.position.y <= GH) {
                    // Collision with post!
                    const normal = new THREE.Vector3(this.position.x - post.x, 0, this.position.z - post.z).normalize();
                    this.velocity.reflect(normal).multiplyScalar(0.75);
                    this.position.x = post.x + normal.x * (this.radius + postRadius + 0.05);
                    this.position.z = post.z + normal.z * (this.radius + postRadius + 0.05);
                    soundEngine.playPostHit();
                }
            });

            // Crossbar
            if (Math.abs(this.position.x - goal.x) < this.radius + postRadius &&
                Math.abs(this.position.z) <= GW / 2 &&
                Math.abs(this.position.y - GH) < this.radius + postRadius) {
                // Collision with crossbar!
                this.velocity.y = -Math.abs(this.velocity.y) * 0.75;
                this.velocity.x *= -0.7;
                soundEngine.playPostHit();
            }
        });
    }

    checkNetCollisions() {
        const L = GAME_CONFIG.PITCH_LENGTH;
        const GW = GAME_CONFIG.GOAL_WIDTH;
        const GH = GAME_CONFIG.GOAL_HEIGHT;
        const GD = GAME_CONFIG.GOAL_DEPTH;

        // Inside left goal net
        if (this.position.x < -L / 2 && this.position.x > -(L / 2 + GD) && Math.abs(this.position.z) < GW / 2 && this.position.y < GH) {
            this.velocity.multiplyScalar(0.85); // net absorbs energy
        }
        // Inside right goal net
        if (this.position.x > L / 2 && this.position.x < (L / 2 + GD) && Math.abs(this.position.z) < GW / 2 && this.position.y < GH) {
            this.velocity.multiplyScalar(0.85);
        }
    }

    checkGoal() {
        const L = GAME_CONFIG.PITCH_LENGTH;
        const GW = GAME_CONFIG.GOAL_WIDTH;
        const GH = GAME_CONFIG.GOAL_HEIGHT;

        // Goal on Right Side (Scored by Left/Home Team)
        if (this.position.x > L / 2 + this.radius && Math.abs(this.position.z) < GW / 2 - 0.2 && this.position.y < GH) {
            return 'home'; // Scored into away goal
        }

        // Goal on Left Side (Scored by Right/Away Team)
        if (this.position.x < -L / 2 - this.radius && Math.abs(this.position.z) < GW / 2 - 0.2 && this.position.y < GH) {
            return 'away'; // Scored into home goal
        }

        return null;
    }

    reset(x = 0, z = 0) {
        this.position.set(x, this.radius, z);
        this.velocity.set(0, 0, 0);
        this.spin.set(0, 0, 0);
        this.owner = null;
        this.isFree = true;
    }
}
