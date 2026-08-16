/**
 * EA FC 27 Web Edition - 3D Graphics Engine & Stadium Scene
 * Built with Three.js
 */

import { GAME_CONFIG } from './config.js';

export class Engine3D {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.lights = {};
        this.stadium = {};
        this.cameraMode = 'broadcast'; // broadcast, dynamic, endToEnd, goalReplay
        this.cameraTarget = new THREE.Vector3(0, 0, 0);
        this.cameraOffset = new THREE.Vector3(0, 32, 42);
        this.ledMaterials = [];
        this.clock = new THREE.Clock();

        this.init();
    }

    init() {
        const width = this.container.clientWidth || window.innerWidth;
        const height = this.container.clientHeight || window.innerHeight;

        // 1. Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a101d);
        this.scene.fog = new THREE.FogExp2(0x0a101d, 0.0055);

        // 2. Camera
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 500);
        this.camera.position.set(0, 32, 44);
        this.camera.lookAt(0, 0, 0);

        // 3. Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.15;
        this.container.appendChild(this.renderer.domElement);

        // 4. Lighting & Ambience
        this.setupLighting();

        // 5. Build Stadium, Pitch, Goals, Floodlights
        this.buildPitch();
        this.buildGoals();
        this.buildStadium();
        this.buildCornerFlags();

        // Window resize listener
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupLighting() {
        // Ambient Night Stadium Light
        const ambientLight = new THREE.AmbientLight(0xddeeff, 0.55);
        this.scene.add(ambientLight);

        // Main 4 Floodlights from 4 corners of stadium
        const lightIntensity = 1.2;
        const lightPositions = [
            { x: -58, y: 35, z: -40 },
            { x: 58, y: 35, z: -40 },
            { x: -58, y: 35, z: 40 },
            { x: 58, y: 35, z: 40 }
        ];

        this.floodlights = [];
        lightPositions.forEach((pos, idx) => {
            const spot = new THREE.SpotLight(0xffffff, lightIntensity);
            spot.position.set(pos.x, pos.y, pos.z);
            spot.target.position.set(pos.x * 0.3, 0, pos.z * 0.3);
            spot.angle = Math.PI / 3;
            spot.penumbra = 0.5;
            spot.decay = 1.2;
            spot.distance = 200;

            if (idx === 0 || idx === 3) {
                spot.castShadow = true;
                spot.shadow.mapSize.width = 1024;
                spot.shadow.mapSize.height = 1024;
                spot.shadow.camera.near = 10;
                spot.shadow.camera.far = 160;
                spot.shadow.bias = -0.001;
            }

            this.scene.add(spot);
            this.scene.add(spot.target);
            this.floodlights.push(spot);

            // Glowing light flare mesh on tower
            const flareGeo = new THREE.SphereGeometry(1.2, 16, 16);
            const flareMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const flareMesh = new THREE.Mesh(flareGeo, flareMat);
            flareMesh.position.set(pos.x, pos.y, pos.z);
            this.scene.add(flareMesh);
        });

        // Soft Directional Fill
        const dirLight = new THREE.DirectionalLight(0xaaccff, 0.4);
        dirLight.position.set(0, 50, 0);
        this.scene.add(dirLight);
    }

    buildPitch() {
        const L = GAME_CONFIG.PITCH_LENGTH;
        const W = GAME_CONFIG.PITCH_WIDTH;

        // 1. Procedural grass pitch with stripes
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        // Base green background
        ctx.fillStyle = '#1e7b28';
        ctx.fillRect(0, 0, 1024, 1024);

        // Lawn mower stripes (10 stripes along length)
        const stripeCount = 14;
        const stripeWidth = 1024 / stripeCount;
        for (let i = 0; i < stripeCount; i++) {
            ctx.fillStyle = i % 2 === 0 ? '#278b32' : '#1e7b28';
            ctx.fillRect(i * stripeWidth, 0, stripeWidth, 1024);
        }

        // Add subtle grass noise texture
        for (let x = 0; x < 1024; x += 4) {
            for (let y = 0; y < 1024; y += 4) {
                if (Math.random() > 0.6) {
                    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';
                    ctx.fillRect(x, y, 4, 4);
                }
            }
        }

        const grassTexture = new THREE.CanvasTexture(canvas);
        grassTexture.wrapS = THREE.RepeatWrapping;
        grassTexture.wrapT = THREE.RepeatWrapping;

        const pitchGeo = new THREE.PlaneGeometry(L + 12, W + 12);
        const pitchMat = new THREE.MeshStandardMaterial({
            map: grassTexture,
            roughness: 0.85,
            metalness: 0.05
        });
        const pitchMesh = new THREE.Mesh(pitchGeo, pitchMat);
        pitchMesh.rotation.x = -Math.PI / 2;
        pitchMesh.receiveShadow = true;
        this.scene.add(pitchMesh);

        // 2. Pitch Markings (Lines)
        this.drawPitchMarkings(L, W);
    }

    drawPitchMarkings(L, W) {
        const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff, depthWrite: false });
        const lineWidth = 0.22;
        const lineGroup = new THREE.Group();
        lineGroup.position.y = 0.02; // slightly above grass to prevent z-fighting

        const createRectLine = (w, h, x, z) => {
            const geo = new THREE.PlaneGeometry(w, h);
            const mesh = new THREE.Mesh(geo, lineMat);
            mesh.rotation.x = -Math.PI / 2;
            mesh.position.set(x, 0, z);
            lineGroup.add(mesh);
        };

        // Boundary lines
        createRectLine(L, lineWidth, 0, -W / 2); // Top touchline
        createRectLine(L, lineWidth, 0, W / 2);  // Bottom touchline
        createRectLine(lineWidth, W, -L / 2, 0); // Left goal line
        createRectLine(lineWidth, W, L / 2, 0);  // Right goal line

        // Halfway line
        createRectLine(lineWidth, W, 0, 0);

        // Center circle (Radius = 9.15m)
        const centerCircleGeo = new THREE.RingGeometry(9.05, 9.25, 48);
        const centerCircle = new THREE.Mesh(centerCircleGeo, lineMat);
        centerCircle.rotation.x = -Math.PI / 2;
        lineGroup.add(centerCircle);

        // Center spot
        const spotGeo = new THREE.CircleGeometry(0.35, 24);
        const centerSpot = new THREE.Mesh(spotGeo, lineMat);
        centerSpot.rotation.x = -Math.PI / 2;
        lineGroup.add(centerSpot);

        // Penalty boxes (16.5m depth x 40.32m width)
        const penBoxDepth = 16.5;
        const penBoxWidth = 40.32;
        // Left Penalty Box
        createRectLine(penBoxDepth, lineWidth, -L / 2 + penBoxDepth / 2, -penBoxWidth / 2);
        createRectLine(penBoxDepth, lineWidth, -L / 2 + penBoxDepth / 2, penBoxWidth / 2);
        createRectLine(lineWidth, penBoxWidth, -L / 2 + penBoxDepth, 0);

        // Right Penalty Box
        createRectLine(penBoxDepth, lineWidth, L / 2 - penBoxDepth / 2, -penBoxWidth / 2);
        createRectLine(penBoxDepth, lineWidth, L / 2 - penBoxDepth / 2, penBoxWidth / 2);
        createRectLine(lineWidth, penBoxWidth, L / 2 - penBoxDepth, 0);

        // Goal Areas (5.5m depth x 18.32m width)
        const goalBoxDepth = 5.5;
        const goalBoxWidth = 18.32;
        createRectLine(goalBoxDepth, lineWidth, -L / 2 + goalBoxDepth / 2, -goalBoxWidth / 2);
        createRectLine(goalBoxDepth, lineWidth, -L / 2 + goalBoxDepth / 2, goalBoxWidth / 2);
        createRectLine(lineWidth, goalBoxWidth, -L / 2 + goalBoxDepth, 0);

        createRectLine(goalBoxDepth, lineWidth, L / 2 - goalBoxDepth / 2, -goalBoxWidth / 2);
        createRectLine(goalBoxDepth, lineWidth, L / 2 - goalBoxDepth / 2, goalBoxWidth / 2);
        createRectLine(lineWidth, goalBoxWidth, L / 2 - goalBoxDepth, 0);

        // Penalty Spots (11m from goal line)
        const leftPenSpot = new THREE.Mesh(spotGeo, lineMat);
        leftPenSpot.rotation.x = -Math.PI / 2;
        leftPenSpot.position.set(-L / 2 + 11, 0, 0);
        lineGroup.add(leftPenSpot);

        const rightPenSpot = new THREE.Mesh(spotGeo, lineMat);
        rightPenSpot.rotation.x = -Math.PI / 2;
        rightPenSpot.position.set(L / 2 - 11, 0, 0);
        lineGroup.add(rightPenSpot);

        // Penalty arcs
        const leftArcGeo = new THREE.RingGeometry(9.05, 9.25, 32, 1, -Math.PI / 3.4, Math.PI / 1.7);
        const leftArc = new THREE.Mesh(leftArcGeo, lineMat);
        leftArc.rotation.x = -Math.PI / 2;
        leftArc.position.set(-L / 2 + 11, 0, 0);
        lineGroup.add(leftArc);

        const rightArcGeo = new THREE.RingGeometry(9.05, 9.25, 32, 1, Math.PI - Math.PI / 3.4, Math.PI / 1.7);
        const rightArc = new THREE.Mesh(rightArcGeo, lineMat);
        rightArc.rotation.x = -Math.PI / 2;
        rightArc.position.set(L / 2 - 11, 0, 0);
        lineGroup.add(rightArc);

        this.scene.add(lineGroup);
    }

    buildGoals() {
        const L = GAME_CONFIG.PITCH_LENGTH;
        const GW = GAME_CONFIG.GOAL_WIDTH;
        const GH = GAME_CONFIG.GOAL_HEIGHT;
        const GD = GAME_CONFIG.GOAL_DEPTH;

        const postMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.8 });
        const postRadius = 0.1;

        // Net canvas grid texture
        const netCanvas = document.createElement('canvas');
        netCanvas.width = 64;
        netCanvas.height = 64;
        const netCtx = netCanvas.getContext('2d');
        netCtx.strokeStyle = 'rgba(255,255,255,0.75)';
        netCtx.lineWidth = 2;
        netCtx.strokeRect(0, 0, 64, 64);
        const netTex = new THREE.CanvasTexture(netCanvas);
        netTex.wrapS = THREE.RepeatWrapping;
        netTex.wrapT = THREE.RepeatWrapping;
        netTex.repeat.set(16, 8);

        const netMat = new THREE.MeshStandardMaterial({
            map: netTex,
            transparent: true,
            opacity: 0.65,
            side: THREE.DoubleSide,
            roughness: 0.9
        });

        const createGoal = (side) => {
            const goalGroup = new THREE.Group();
            const posX = (L / 2) * side;

            // Upright Posts
            const postGeo = new THREE.CylinderGeometry(postRadius, postRadius, GH, 16);
            const post1 = new THREE.Mesh(postGeo, postMat);
            post1.position.set(0, GH / 2, -GW / 2);
            post1.castShadow = true;
            goalGroup.add(post1);

            const post2 = new THREE.Mesh(postGeo, postMat);
            post2.position.set(0, GH / 2, GW / 2);
            post2.castShadow = true;
            goalGroup.add(post2);

            // Crossbar
            const crossbarGeo = new THREE.CylinderGeometry(postRadius, postRadius, GW, 16);
            const crossbar = new THREE.Mesh(crossbarGeo, postMat);
            crossbar.rotation.x = Math.PI / 2;
            crossbar.position.set(0, GH, 0);
            crossbar.castShadow = true;
            goalGroup.add(crossbar);

            // Back Net Frames
            const backDepth = GD * side;
            const topBarGeo = new THREE.CylinderGeometry(postRadius * 0.7, postRadius * 0.7, GD, 12);
            const topSupport1 = new THREE.Mesh(topBarGeo, postMat);
            topSupport1.rotation.z = Math.PI / 2;
            topSupport1.position.set(backDepth / 2, GH, -GW / 2);
            goalGroup.add(topSupport1);

            const topSupport2 = new THREE.Mesh(topBarGeo, postMat);
            topSupport2.rotation.z = Math.PI / 2;
            topSupport2.position.set(backDepth / 2, GH, GW / 2);
            goalGroup.add(topSupport2);

            // Back net mesh box
            const netBackGeo = new THREE.PlaneGeometry(GW, GH);
            const netBack = new THREE.Mesh(netBackGeo, netMat);
            netBack.rotation.y = Math.PI / 2;
            netBack.position.set(backDepth, GH / 2, 0);
            goalGroup.add(netBack);

            const netTopGeo = new THREE.PlaneGeometry(GD, GW);
            const netTop = new THREE.Mesh(netTopGeo, netMat);
            netTop.rotation.x = Math.PI / 2;
            netTop.rotation.y = Math.PI / 2;
            netTop.position.set(backDepth / 2, GH, 0);
            goalGroup.add(netTop);

            const netSideGeo = new THREE.PlaneGeometry(GD, GH);
            const netSide1 = new THREE.Mesh(netSideGeo, netMat);
            netSide1.position.set(backDepth / 2, GH / 2, -GW / 2);
            goalGroup.add(netSide1);

            const netSide2 = new THREE.Mesh(netSideGeo, netMat);
            netSide2.position.set(backDepth / 2, GH / 2, GW / 2);
            goalGroup.add(netSide2);

            goalGroup.position.set(posX, 0, 0);
            this.scene.add(goalGroup);
        };

        // Create Left and Right Goals
        createGoal(-1);
        createGoal(1);
    }

    buildStadium() {
        const L = GAME_CONFIG.PITCH_LENGTH;
        const W = GAME_CONFIG.PITCH_WIDTH;

        // 1. Electronic LED Advertising Sideline Boards
        const createAdBoard = (w, x, z, rotY) => {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');

            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, 512, 64);
            ctx.fillStyle = '#00f59b';
            ctx.font = 'bold 26px sans-serif';
            ctx.fillText('EA SPORTS FC 27  ★  HYPERMOTION V  ★  FUT CHAMPIONS', 12, 42);

            const tex = new THREE.CanvasTexture(canvas);
            tex.wrapS = THREE.RepeatWrapping;
            tex.repeat.set(4, 1);
            this.ledMaterials.push(tex);

            const adGeo = new THREE.BoxGeometry(w, 1.2, 0.4);
            const adMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.3, emissive: 0x00f59b, emissiveIntensity: 0.25 });
            const adMesh = new THREE.Mesh(adGeo, adMat);
            adMesh.position.set(x, 0.6, z);
            adMesh.rotation.y = rotY;
            this.scene.add(adMesh);
        };

        // Long side LED boards
        createAdBoard(L + 6, 0, -(W / 2 + 3), 0);
        createAdBoard(L + 6, 0, (W / 2 + 3), 0);
        // Short side LED boards behind goals
        createAdBoard(W + 2, -(L / 2 + 4.5), 0, Math.PI / 2);
        createAdBoard(W + 2, (L / 2 + 4.5), 0, Math.PI / 2);

        // 2. Stadium Grandstands (Tiers)
        const standMat1 = new THREE.MeshStandardMaterial({ color: 0x18243b, roughness: 0.8 });
        const standMat2 = new THREE.MeshStandardMaterial({ color: 0x0e1726, roughness: 0.8 });

        // Tier construction helper
        const createGrandstand = (w, d, h, x, y, z, rotY) => {
            const standGroup = new THREE.Group();
            const steps = 14;
            const stepH = h / steps;
            const stepD = d / steps;

            for (let i = 0; i < steps; i++) {
                const stepGeo = new THREE.BoxGeometry(w, stepH, stepD * (steps - i));
                const mat = i % 2 === 0 ? standMat1 : standMat2;
                const step = new THREE.Mesh(stepGeo, mat);
                step.position.set(0, i * stepH + stepH / 2, (i * stepD) / 2);
                standGroup.add(step);

                // Add colored crowd dots
                if (i > 1) {
                    const crowdGeo = new THREE.BoxGeometry(w * 0.95, 0.6, stepD * 0.6);
                    const crowdColors = [0xef4444, 0x3b82f6, 0xffffff, 0xfacc15, 0x10b981];
                    const crowdMat = new THREE.MeshBasicMaterial({ color: crowdColors[i % crowdColors.length] });
                    const crowdMesh = new THREE.Mesh(crowdGeo, crowdMat);
                    crowdMesh.position.set(0, i * stepH + stepH + 0.3, i * stepD);
                    standGroup.add(crowdMesh);
                }
            }

            standGroup.position.set(x, y, z);
            standGroup.rotation.y = rotY;
            this.scene.add(standGroup);
        };

        // 4 Grandstands around stadium
        createGrandstand(L + 30, 24, 18, 0, 0, -(W / 2 + 18), 0);
        createGrandstand(L + 30, 24, 18, 0, 0, (W / 2 + 18), Math.PI);
        createGrandstand(W + 30, 24, 18, -(L / 2 + 18), 0, 0, Math.PI / 2);
        createGrandstand(W + 30, 24, 18, (L / 2 + 18), 0, 0, -Math.PI / 2);

        // 3. Floodlight Towers (4 steel lattice towers)
        const towerMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.3 });
        const towerPos = [
            { x: -58, z: -40 },
            { x: 58, z: -40 },
            { x: -58, z: 40 },
            { x: 58, z: 40 }
        ];

        towerPos.forEach(p => {
            const towerGeo = new THREE.CylinderGeometry(0.8, 2.2, 36, 8);
            const tower = new THREE.Mesh(towerGeo, towerMat);
            tower.position.set(p.x, 18, p.z);
            this.scene.add(tower);

            // Light rack on top
            const rackGeo = new THREE.BoxGeometry(6, 3, 2);
            const rack = new THREE.Mesh(rackGeo, towerMat);
            rack.position.set(p.x, 35, p.z);
            rack.lookAt(0, 0, 0);
            this.scene.add(rack);
        });
    }

    buildCornerFlags() {
        const L = GAME_CONFIG.PITCH_LENGTH;
        const W = GAME_CONFIG.PITCH_WIDTH;
        const corners = [
            { x: -L / 2, z: -W / 2 },
            { x: L / 2, z: -W / 2 },
            { x: -L / 2, z: W / 2 },
            { x: L / 2, z: W / 2 }
        ];

        const poleGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.5, 8);
        const poleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const flagGeo = new THREE.PlaneGeometry(0.5, 0.35);
        const flagMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide });

        corners.forEach(c => {
            const group = new THREE.Group();
            const pole = new THREE.Mesh(poleGeo, poleMat);
            pole.position.y = 0.75;
            group.add(pole);

            const flag = new THREE.Mesh(flagGeo, flagMat);
            flag.position.set(0.25, 1.3, 0);
            group.add(flag);

            group.position.set(c.x, 0, c.z);
            this.scene.add(group);
        });
    }

    updateCamera(ballPosition, activePlayerPosition, isReplay = false, replayAngle = 0) {
        if (!ballPosition) return;

        // Animate LED ads ticker
        const delta = this.clock.getDelta();
        this.ledMaterials.forEach(mat => {
            mat.offset.x += delta * 0.08;
        });

        if (isReplay) {
            // Cinematic Orbit Replay Cam
            const orbitRadius = 14;
            this.camera.position.x = ballPosition.x + Math.sin(replayAngle) * orbitRadius;
            this.camera.position.y = 5 + Math.cos(replayAngle * 0.5) * 3;
            this.camera.position.z = ballPosition.z + Math.cos(replayAngle) * orbitRadius;
            this.camera.lookAt(ballPosition.x, 1.0, ballPosition.z);
            return;
        }

        // Camera smoothing target
        const focusPoint = activePlayerPosition ? 
            new THREE.Vector3(
                ballPosition.x * 0.65 + activePlayerPosition.x * 0.35,
                0.5,
                ballPosition.z * 0.65 + activePlayerPosition.z * 0.35
            ) : new THREE.Vector3(ballPosition.x, 0.5, ballPosition.z);

        this.cameraTarget.lerp(focusPoint, 0.08);

        if (this.cameraMode === 'broadcast') {
            // EA FC Broadcast Cam (classic side TV view with smooth panning)
            const targetCamX = this.cameraTarget.x * 0.75;
            const targetCamY = 28 + Math.abs(this.cameraTarget.z) * 0.12;
            const targetCamZ = 38 + Math.abs(this.cameraTarget.z) * 0.25;

            this.camera.position.x += (targetCamX - this.camera.position.x) * 0.06;
            this.camera.position.y += (targetCamY - this.camera.position.y) * 0.06;
            this.camera.position.z += (targetCamZ - this.camera.position.z) * 0.06;

            this.camera.lookAt(this.cameraTarget.x, 1.2, this.cameraTarget.z * 0.5);
        } else if (this.cameraMode === 'dynamic') {
            // Dynamic close-action cam
            const targetCamX = this.cameraTarget.x * 0.85;
            const targetCamY = 18;
            const targetCamZ = this.cameraTarget.z + 24;

            this.camera.position.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), 0.08);
            this.camera.lookAt(this.cameraTarget.x, 1.5, this.cameraTarget.z);
        } else if (this.cameraMode === 'endToEnd') {
            // Behind the goal end-to-end cam
            this.camera.position.set(this.cameraTarget.x - 30, 20, this.cameraTarget.z * 0.4);
            this.camera.lookAt(this.cameraTarget.x + 15, 1.0, this.cameraTarget.z * 0.8);
        }
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        const width = this.container.clientWidth || window.innerWidth;
        const height = this.container.clientHeight || window.innerHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}
