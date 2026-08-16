/**
 * EA FC 27 Web Edition - 3D Player Rig, Animations, Physics & Skill Moves
 */

import { GAME_CONFIG } from './config.js';

export class Player {
    constructor(scene, team, data, isHome, initialPos) {
        this.scene = scene;
        this.team = team;
        this.data = data;
        this.isHome = isHome;
        this.role = data.role || 'CM';
        this.name = data.name;
        this.number = data.number;
        this.stats = {
            pace: data.pace || 75,
            shoot: data.shoot || 75,
            pass: data.pass || 75,
            dribble: data.dribble || 75,
            def: data.def || 75,
            phy: data.phy || 75
        };

        // Position & Movement
        this.position = new THREE.Vector3(initialPos.x, 0, initialPos.z);
        this.homePosition = new THREE.Vector3(initialPos.x, 0, initialPos.z);
        this.targetPosition = new THREE.Vector3(initialPos.x, 0, initialPos.z);
        this.rotation = isHome ? 0 : Math.PI; // Face opponent goal initially
        this.currentSpeed = 0;
        this.isSprinting = false;
        this.stamina = 100;
        this.isActive = false; // Controlled by human user

        // Action States
        this.isTackling = false;
        this.tackleTimer = 0;
        this.isKicking = false;
        this.kickTimer = 0;
        this.isDiving = false;
        this.diveTimer = 0;
        this.diveDirection = 1;
        this.isCelebrating = false;
        this.celebrateTimer = 0;
        this.skillMove = null; // 'roulette', 'stepover', 'rainbow'
        this.skillTimer = 0;

        // 3D Mesh Hierarchies
        this.group = new THREE.Group();
        this.bodyGroup = new THREE.Group();
        this.leftLegGroup = new THREE.Group();
        this.rightLegGroup = new THREE.Group();
        this.leftArmGroup = new THREE.Group();
        this.rightArmGroup = new THREE.Group();
        this.headMesh = null;
        this.indicatorMesh = null;
        this.staminaBarMesh = null;
        this.animTime = Math.random() * 10;

        this.initMesh();
    }

    initMesh() {
        const primaryColor = new THREE.Color(this.team.colorPrimary);
        const secondaryColor = new THREE.Color(this.team.colorSecondary);
        const skinColor = new THREE.Color(this.data.skin || '#f1c27d');
        const hairColor = new THREE.Color(this.data.hair || '#2b1d0c');

        const kitMat = new THREE.MeshStandardMaterial({ color: primaryColor, roughness: 0.6 });
        const shortsMat = new THREE.MeshStandardMaterial({ color: secondaryColor, roughness: 0.6 });
        const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.8 });
        const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.9 });
        const bootMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.4 });
        const socksMat = new THREE.MeshStandardMaterial({ color: primaryColor, roughness: 0.7 });

        // 1. Torso / Jersey
        const torsoGeo = new THREE.BoxGeometry(0.55, 0.7, 0.28);
        const torsoMesh = new THREE.Mesh(torsoGeo, kitMat);
        torsoMesh.position.y = 1.15;
        torsoMesh.castShadow = true;
        this.bodyGroup.add(torsoMesh);

        // 2. Shorts
        const shortsGeo = new THREE.BoxGeometry(0.52, 0.35, 0.26);
        const shortsMesh = new THREE.Mesh(shortsGeo, shortsMat);
        shortsMesh.position.y = 0.72;
        shortsMesh.castShadow = true;
        this.bodyGroup.add(shortsMesh);

        // 3. Head & Hair
        const headGeo = new THREE.SphereGeometry(0.18, 16, 16);
        this.headMesh = new THREE.Mesh(headGeo, skinMat);
        this.headMesh.position.y = 1.65;
        this.headMesh.castShadow = true;
        this.bodyGroup.add(this.headMesh);

        const hairGeo = new THREE.SphereGeometry(0.19, 12, 12, 0, Math.PI * 2, 0, Math.PI / 1.7);
        const hairMesh = new THREE.Mesh(hairGeo, hairMat);
        hairMesh.position.y = 1.68;
        this.bodyGroup.add(hairMesh);

        // 4. Arms (Left & Right)
        const armGeo = new THREE.BoxGeometry(0.14, 0.55, 0.14);

        // Left Arm
        this.leftArmGroup.position.set(-0.35, 1.45, 0);
        const leftArmMesh = new THREE.Mesh(armGeo, kitMat);
        leftArmMesh.position.y = -0.25;
        leftArmMesh.castShadow = true;
        this.leftArmGroup.add(leftArmMesh);
        this.bodyGroup.add(this.leftArmGroup);

        // Right Arm
        this.rightArmGroup.position.set(0.35, 1.45, 0);
        const rightArmMesh = new THREE.Mesh(armGeo, kitMat);
        rightArmMesh.position.y = -0.25;
        rightArmMesh.castShadow = true;
        this.rightArmGroup.add(rightArmMesh);
        this.bodyGroup.add(this.rightArmGroup);

        // 5. Legs & Boots (Left & Right)
        const legGeo = new THREE.BoxGeometry(0.18, 0.52, 0.18);
        const bootGeo = new THREE.BoxGeometry(0.19, 0.14, 0.32);

        // Left Leg
        this.leftLegGroup.position.set(-0.16, 0.55, 0);
        const leftLegMesh = new THREE.Mesh(legGeo, socksMat);
        leftLegMesh.position.y = -0.22;
        leftLegMesh.castShadow = true;
        this.leftLegGroup.add(leftLegMesh);

        const leftBoot = new THREE.Mesh(bootGeo, bootMat);
        leftBoot.position.set(0, -0.48, 0.06);
        leftBoot.castShadow = true;
        this.leftLegGroup.add(leftBoot);
        this.group.add(this.leftLegGroup);

        // Right Leg
        this.rightLegGroup.position.set(0.16, 0.55, 0);
        const rightLegMesh = new THREE.Mesh(legGeo, socksMat);
        rightLegMesh.position.y = -0.22;
        rightLegMesh.castShadow = true;
        this.rightLegGroup.add(rightLegMesh);

        const rightBoot = new THREE.Mesh(bootGeo, bootMat);
        rightBoot.position.set(0, -0.48, 0.06);
        rightBoot.castShadow = true;
        this.rightLegGroup.add(rightBoot);
        this.group.add(this.rightLegGroup);

        this.group.add(this.bodyGroup);

        // 6. Active Indicator Ring (Neon Triangle/Ring)
        const indicatorGeo = new THREE.RingGeometry(0.7, 0.85, 32);
        const indicatorMat = new THREE.MeshBasicMaterial({
            color: this.isHome ? 0x00f59b : 0xef4444,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        this.indicatorMesh = new THREE.Mesh(indicatorGeo, indicatorMat);
        this.indicatorMesh.rotation.x = -Math.PI / 2;
        this.indicatorMesh.position.y = 0.03;
        this.indicatorMesh.visible = false;
        this.group.add(this.indicatorMesh);

        // 7. Overhead Name & Number Tag
        this.createFloatingTag();

        this.group.position.copy(this.position);
        this.scene.add(this.group);
    }

    createFloatingTag() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        // Background pill
        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        ctx.beginPath();
        ctx.roundRect(10, 8, 236, 48, 24);
        ctx.fill();

        ctx.strokeStyle = this.isHome ? '#00f59b' : '#38bdf8';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.number} ${this.name}`, 128, 40);

        const tex = new THREE.CanvasTexture(canvas);
        const tagGeo = new THREE.PlaneGeometry(1.6, 0.4);
        const tagMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false });
        this.tagMesh = new THREE.Mesh(tagGeo, tagMat);
        this.tagMesh.position.y = 2.2;
        this.group.add(this.tagMesh);
    }

    setActive(active) {
        this.isActive = active;
        if (this.indicatorMesh) {
            this.indicatorMesh.visible = active;
        }
    }

    move(dirX, dirZ, isSprinting, dt) {
        const isMoving = Math.abs(dirX) > 0.05 || Math.abs(dirZ) > 0.05;

        // Stamina logic
        if (isSprinting && isMoving && this.stamina > 10) {
            this.isSprinting = true;
            this.stamina = Math.max(0, this.stamina - 15 * dt);
        } else {
            this.isSprinting = false;
            this.stamina = Math.min(100, this.stamina + 8 * dt);
        }

        const basePace = 4.5 + (this.stats.pace / 100) * 4.0;
        const sprintMultiplier = this.isSprinting ? 1.45 : 1.0;
        const targetSpeed = isMoving ? basePace * sprintMultiplier : 0;

        // Smooth acceleration
        this.currentSpeed += (targetSpeed - this.currentSpeed) * 12 * dt;

        if (isMoving) {
            const angle = Math.atan2(dirX, dirZ);
            // Smooth rotation towards move direction
            let diff = angle - this.rotation;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            this.rotation += diff * 14 * dt;

            // Move position
            this.position.x += Math.sin(this.rotation) * this.currentSpeed * dt;
            this.position.z += Math.cos(this.rotation) * this.currentSpeed * dt;
        }

        // Clamp to pitch bounds
        const L = GAME_CONFIG.PITCH_LENGTH / 2 + 1;
        const W = GAME_CONFIG.PITCH_WIDTH / 2 + 1;
        this.position.x = Math.max(-L, Math.min(L, this.position.x));
        this.position.z = Math.max(-W, Math.min(W, this.position.z));
    }

    triggerSlideTackle() {
        if (this.isTackling) return;
        this.isTackling = true;
        this.tackleTimer = 0.65; // Duration of slide
    }

    triggerKick() {
        this.isKicking = true;
        this.kickTimer = 0.25;
    }

    triggerDive(direction = 1) {
        if (this.isDiving) return;
        this.isDiving = true;
        this.diveTimer = 0.8;
        this.diveDirection = direction;
    }

    triggerCelebration() {
        this.isCelebrating = true;
        this.celebrateTimer = 3.5;
    }

    triggerSkill(type = 'roulette') {
        this.skillMove = type;
        this.skillTimer = 0.55;
    }

    update(dt) {
        this.animTime += dt * (this.currentSpeed * 2.2 + 1.0);

        // Update Timers
        if (this.isTackling) {
            this.tackleTimer -= dt;
            if (this.tackleTimer <= 0) this.isTackling = false;
        }

        if (this.isKicking) {
            this.kickTimer -= dt;
            if (this.kickTimer <= 0) this.isKicking = false;
        }

        if (this.isDiving) {
            this.diveTimer -= dt;
            if (this.diveTimer <= 0) this.isDiving = false;
        }

        if (this.isCelebrating) {
            this.celebrateTimer -= dt;
            if (this.celebrateTimer <= 0) this.isCelebrating = false;
        }

        if (this.skillMove) {
            this.skillTimer -= dt;
            if (this.skillTimer <= 0) this.skillMove = null;
        }

        // Animate Player Rigs
        this.animateMesh();

        // Sync position & rotation
        this.group.position.copy(this.position);
        this.group.rotation.y = this.rotation;

        // Keep name tag facing camera
        if (this.tagMesh) {
            this.tagMesh.rotation.y = -this.rotation;
        }

        // Animate indicator pulsing
        if (this.indicatorMesh && this.isActive) {
            const scale = 1.0 + Math.sin(this.animTime * 6) * 0.08;
            this.indicatorMesh.scale.set(scale, scale, scale);
        }
    }

    animateMesh() {
        if (this.isCelebrating) {
            // Hands up jump celebration
            this.leftArmGroup.rotation.x = Math.PI * 0.85;
            this.rightArmGroup.rotation.x = Math.PI * 0.85;
            this.leftLegGroup.rotation.x = 0;
            this.rightLegGroup.rotation.x = 0;
            this.bodyGroup.position.y = Math.sin(this.animTime * 8) * 0.3;
            return;
        }

        if (this.isDiving) {
            // Goalkeeper diving sideways
            const progress = (0.8 - this.diveTimer) / 0.8;
            this.bodyGroup.rotation.z = this.diveDirection * (Math.PI / 2.2);
            this.bodyGroup.position.y = Math.sin(progress * Math.PI) * 0.8 - 0.4;
            this.leftArmGroup.rotation.z = this.diveDirection * 1.2;
            this.rightArmGroup.rotation.z = this.diveDirection * 1.2;
            return;
        }

        if (this.isTackling) {
            // Slide tackle animation
            this.bodyGroup.rotation.x = -Math.PI / 2.8;
            this.bodyGroup.position.y = -0.4;
            this.leftLegGroup.rotation.x = Math.PI / 2.2;
            this.rightLegGroup.rotation.x = -Math.PI / 4;
            this.leftArmGroup.rotation.x = -Math.PI / 3;
            this.rightArmGroup.rotation.x = Math.PI / 3;
            return;
        }

        if (this.skillMove === 'roulette') {
            // 360 Spin
            const spinProgress = (0.55 - this.skillTimer) / 0.55;
            this.rotation += Math.PI * 4 * (1 - spinProgress);
        }

        // Normal Running / Idle Animation Cycle
        const runFactor = Math.min(1.0, this.currentSpeed / 5.0);
        const legSwing = Math.sin(this.animTime * 6) * 0.75 * runFactor;
        const armSwing = Math.cos(this.animTime * 6) * 0.65 * runFactor;

        this.leftLegGroup.rotation.x = legSwing;
        this.rightLegGroup.rotation.x = -legSwing;

        if (this.isKicking) {
            // Kicking windup and follow-through
            this.rightLegGroup.rotation.x = -Math.PI / 2.5;
            this.leftArmGroup.rotation.x = Math.PI / 3;
            this.rightArmGroup.rotation.x = -Math.PI / 3;
        } else {
            this.leftArmGroup.rotation.x = -armSwing;
            this.rightArmGroup.rotation.x = armSwing;
        }

        // Reset base body orientation
        this.bodyGroup.rotation.x = runFactor * 0.15; // Lean forward while running
        this.bodyGroup.rotation.z = 0;
        this.bodyGroup.position.y = Math.abs(Math.sin(this.animTime * 6)) * 0.08 * runFactor;
    }
}
