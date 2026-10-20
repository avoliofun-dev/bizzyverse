/**
 * BizVerse 3D Virtual City Metropolis
 * Built with Three.js with procedural futuristic architecture, flying drones,
 * glowing cyber grids, raycasting inspection, and smooth camera controls.
 */

class BizCity3D {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.buildings = {};
        this.buildingMeshes = [];
        this.hoveredBuilding = null;
        this.drones = [];
        this.trafficTrails = [];
        this.isNightMode = true;
        this.autoRotate = true;
        this.tooltipEl = document.getElementById('city-3d-tooltip');

        this.init();
    }

    init() {
        const width = this.container.clientWidth || window.innerWidth || 1200;
        const height = this.container.clientHeight || (window.innerHeight - 56) || 700;

        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x070a12);
        this.scene.fog = new THREE.FogExp2(0x070a12, 0.012);

        // Camera
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.set(45, 38, 48);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // OrbitControls
        if (THREE.OrbitControls) {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.maxPolarAngle = Math.PI / 2.05; // Don't go below ground
            this.controls.minDistance = 15;
            this.controls.maxDistance = 110;
            this.controls.target.set(0, 4, 0);
            this.controls.autoRotate = this.autoRotate;
            this.controls.autoRotateSpeed = 0.6;
        }

        // Lighting
        this.setupLights();

        // City Ground & Cyber Grid
        this.setupEnvironment();

        // Spawn Corporate Skyscrapers
        this.buildMetropolis();

        // Spawn Autonomous Drones & Traffic
        this.setupDronesAndTraffic();

        // Event Listeners
        window.addEventListener('resize', () => this.onWindowResize());
        this.renderer.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.renderer.domElement.addEventListener('click', (e) => this.onMouseClick(e));

        // Listen to engine upgrades to dynamically evolve buildings
        if (window.bizEngine) {
            window.bizEngine.on('buildingUpgraded', (data) => {
                this.onBuildingUpgraded(data.buildingId, data.newLevel);
            });
        }

        // Animation loop
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    setupLights() {
        this.ambientLight = new THREE.AmbientLight(0x182642, 1.2);
        this.scene.add(this.ambientLight);

        this.dirLight = new THREE.DirectionalLight(0x00d2ff, 1.5);
        this.dirLight.position.set(30, 50, 25);
        this.dirLight.castShadow = true;
        this.dirLight.shadow.mapSize.width = 2048;
        this.dirLight.shadow.mapSize.height = 2048;
        this.dirLight.shadow.camera.near = 10;
        this.dirLight.shadow.camera.far = 150;
        this.dirLight.shadow.camera.left = -40;
        this.dirLight.shadow.camera.right = 40;
        this.dirLight.shadow.camera.top = 40;
        this.dirLight.shadow.camera.bottom = -40;
        this.scene.add(this.dirLight);

        // Secondary cyan/magenta accent lights
        this.accentLight1 = new THREE.PointLight(0x00f5a0, 2, 40);
        this.accentLight1.position.set(-15, 12, -10);
        this.scene.add(this.accentLight1);

        this.accentLight2 = new THREE.PointLight(0x8a2be2, 2.5, 45);
        this.accentLight2.position.set(15, 15, 15);
        this.scene.add(this.accentLight2);
    }

    setupEnvironment() {
        // Futuristic floating hexagonal/square platform
        const platformGeo = new THREE.CylinderGeometry(36, 38, 2.5, 8);
        const platformMat = new THREE.MeshStandardMaterial({
            color: 0x0c111e,
            roughness: 0.3,
            metalness: 0.8
        });
        const platform = new THREE.Mesh(platformGeo, platformMat);
        platform.position.y = -1.25;
        platform.receiveShadow = true;
        this.scene.add(platform);

        // Glowing border ring
        const ringGeo = new THREE.RingGeometry(35.8, 36.3, 8);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0x00d2ff,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = 0.05;
        this.scene.add(ring);

        // Cyber Grid on the surface
        const gridHelper = new THREE.GridHelper(64, 32, 0x00d2ff, 0x172554);
        gridHelper.position.y = 0.02;
        this.scene.add(gridHelper);

        // Starfield particles in the background
        const starGeo = new THREE.BufferGeometry();
        const starCount = 1200;
        const starPositions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount * 3; i += 3) {
            starPositions[i] = (Math.random() - 0.5) * 300;
            starPositions[i + 1] = Math.random() * 120 + 10;
            starPositions[i + 2] = (Math.random() - 0.5) * 300;
        }
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const starMat = new THREE.PointsMaterial({
            color: 0x88ccff,
            size: 0.8,
            transparent: true,
            opacity: 0.7
        });
        this.starField = new THREE.Points(starGeo, starMat);
        this.scene.add(this.starField);

        // Decorative highway tracks with glowing pulses
        this.createHighways();
    }

    createHighways() {
        const curve1 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-25, 1.5, -20),
            new THREE.Vector3(0, 3.5, -25),
            new THREE.Vector3(25, 2.0, -10),
            new THREE.Vector3(22, 1.5, 18),
            new THREE.Vector3(-15, 2.5, 22),
            new THREE.Vector3(-25, 1.5, -20)
        ]);

        const tubeGeo = new THREE.TubeGeometry(curve1, 64, 0.25, 8, true);
        const tubeMat = new THREE.MeshStandardMaterial({
            color: 0x111e38,
            roughness: 0.4,
            metalness: 0.9
        });
        const highway = new THREE.Mesh(tubeGeo, tubeMat);
        this.scene.add(highway);

        // Glowing light strip along highway
        const stripGeo = new THREE.TubeGeometry(curve1, 64, 0.08, 4, true);
        const stripMat = new THREE.MeshBasicMaterial({ color: 0x00f5a0 });
        const strip = new THREE.Mesh(stripGeo, stripMat);
        this.scene.add(strip);
    }

    buildMetropolis() {
        // Definitions for the 6 primary business structures
        const buildingConfigs = [
            { id: 'hq', name: 'Markas Besar Nexus', x: 0, z: 0, color: 0x00d2ff, accentColor: 0x38bdf8 },
            { id: 'finance', name: 'Menara Finansial Apex', x: -14, z: -10, color: 0x00f5a0, accentColor: 0x10b981 },
            { id: 'rnd', name: 'Matriks AI Kuantum', x: 14, z: -12, color: 0x9d4edd, accentColor: 0xc084fc },
            { id: 'commerce', name: 'Galleria Meta-Komersil', x: -15, z: 12, color: 0xff007f, accentColor: 0xf43f5e },
            { id: 'logistics', name: 'Pusat Logistik Otonom', x: 15, z: 13, color: 0xffaa00, accentColor: 0xf59e0b },
            { id: 'cloud', name: 'Megaplex Server Awan', x: 0, z: 20, color: 0x00e5ff, accentColor: 0x06b6d4 }
        ];

        buildingConfigs.forEach(cfg => {
            const group = new THREE.Group();
            group.position.set(cfg.x, 0, cfg.z);
            group.userData = { id: cfg.id, name: cfg.name, config: cfg };

            let mainMesh;
            const engineBuilding = window.bizEngine ? window.bizEngine.state.buildings[cfg.id] : null;
            const level = engineBuilding ? engineBuilding.level : (cfg.id === 'hq' ? 1 : 0);

            // Specific architectural shapes based on role
            if (cfg.id === 'hq') {
                // Tiered crystal monolith with antenna spire
                const baseGeo = new THREE.BoxGeometry(6.5, 18, 6.5);
                const baseMat = new THREE.MeshStandardMaterial({
                    color: 0x0a192f,
                    metalness: 0.85,
                    roughness: 0.2
                });
                mainMesh = new THREE.Mesh(baseGeo, baseMat);
                mainMesh.position.y = 9;
                mainMesh.castShadow = true;
                mainMesh.receiveShadow = true;
                group.add(mainMesh);

                // Neon glowing vertical edges
                const edgeGeo = new THREE.BoxGeometry(6.7, 18.2, 0.4);
                const edgeMat = new THREE.MeshBasicMaterial({ color: cfg.color });
                const edgeMesh = new THREE.Mesh(edgeGeo, edgeMat);
                edgeMesh.position.y = 9;
                group.add(edgeMesh);

                // Spire on top
                const spireGeo = new THREE.CylinderGeometry(0.1, 0.8, 7, 8);
                const spireMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9 });
                const spire = new THREE.Mesh(spireGeo, spireMat);
                spire.position.y = 21.5;
                group.add(spire);

                // Rotating holographic halo beacon
                const haloGeo = new THREE.TorusGeometry(3.8, 0.12, 8, 24);
                const haloMat = new THREE.MeshBasicMaterial({ color: cfg.accentColor, wireframe: true });
                const halo = new THREE.Mesh(haloGeo, haloMat);
                halo.rotation.x = Math.PI / 2;
                halo.position.y = 23;
                group.add(halo);
                group.userData.rotatingHalo = halo;

            } else if (cfg.id === 'finance') {
                // Curved twin towers with golden/green LED wrap
                const towerGeo = new THREE.BoxGeometry(4.2, 14, 4.2);
                const towerMat = new THREE.MeshStandardMaterial({ color: 0x0d2818, metalness: 0.9, roughness: 0.2 });
                mainMesh = new THREE.Mesh(towerGeo, towerMat);
                mainMesh.position.set(-2, 7, 0);
                mainMesh.castShadow = true;
                group.add(mainMesh);

                const tower2 = mainMesh.clone();
                tower2.position.set(2, 9, 0);
                tower2.scale.set(0.9, 1.25, 0.9);
                group.add(tower2);

                // Bridge connecting towers
                const bridgeGeo = new THREE.BoxGeometry(4, 1.2, 2);
                const bridgeMat = new THREE.MeshBasicMaterial({ color: cfg.color });
                const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
                bridge.position.set(0, 10, 0);
                group.add(bridge);

            } else if (cfg.id === 'rnd') {
                // Cyber Pyramidal complex with hovering quantum core
                const pyramidGeo = new THREE.ConeGeometry(5.5, 10, 4);
                const pyramidMat = new THREE.MeshStandardMaterial({
                    color: 0x1a0b2e,
                    metalness: 0.8,
                    roughness: 0.3,
                    flatShading: true
                });
                mainMesh = new THREE.Mesh(pyramidGeo, pyramidMat);
                mainMesh.position.y = 5;
                mainMesh.rotation.y = Math.PI / 4;
                mainMesh.castShadow = true;
                group.add(mainMesh);

                // Levitating glowing orb core
                const orbGeo = new THREE.IcosahedronGeometry(1.6, 2);
                const orbMat = new THREE.MeshBasicMaterial({ color: 0xc084fc, wireframe: true });
                const orb = new THREE.Mesh(orbGeo, orbMat);
                orb.position.y = 12.5;
                group.add(orb);
                group.userData.levitatingOrb = orb;

            } else if (cfg.id === 'commerce') {
                // Futuristic cylindrical atrium with ring balconies
                const cylGeo = new THREE.CylinderGeometry(4.8, 5.2, 9, 16);
                const cylMat = new THREE.MeshStandardMaterial({ color: 0x2b092b, metalness: 0.85, roughness: 0.25 });
                mainMesh = new THREE.Mesh(cylGeo, cylMat);
                mainMesh.position.y = 4.5;
                mainMesh.castShadow = true;
                group.add(mainMesh);

                // Neon rings
                [3, 6, 9].forEach(y => {
                    const rGeo = new THREE.TorusGeometry(5.3, 0.1, 6, 24);
                    const rMat = new THREE.MeshBasicMaterial({ color: cfg.color });
                    const r = new THREE.Mesh(rGeo, rMat);
                    r.rotation.x = Math.PI / 2;
                    r.position.y = y;
                    group.add(r);
                });

            } else if (cfg.id === 'logistics') {
                // Tech depot with landing pad & crane towers
                const depotGeo = new THREE.BoxGeometry(8, 4, 7);
                const depotMat = new THREE.MeshStandardMaterial({ color: 0x241400, metalness: 0.7, roughness: 0.4 });
                mainMesh = new THREE.Mesh(depotGeo, depotMat);
                mainMesh.position.y = 2;
                mainMesh.castShadow = true;
                group.add(mainMesh);

                // Landing pad on roof
                const padGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.2, 12);
                const padMat = new THREE.MeshBasicMaterial({ color: cfg.color });
                const pad = new THREE.Mesh(padGeo, padMat);
                pad.position.y = 4.15;
                group.add(pad);

            } else {
                // Cloud Data Megaplex: Dual server monoliths with pulsating arrays
                const sGeo = new THREE.BoxGeometry(3.5, 12, 5);
                const sMat = new THREE.MeshStandardMaterial({ color: 0x051923, metalness: 0.9, roughness: 0.2 });
                mainMesh = new THREE.Mesh(sGeo, sMat);
                mainMesh.position.set(-2.5, 6, 0);
                mainMesh.castShadow = true;
                group.add(mainMesh);

                const sMesh2 = mainMesh.clone();
                sMesh2.position.set(2.5, 6, 0);
                group.add(sMesh2);

                // Cooling conduit
                const pipeGeo = new THREE.CylinderGeometry(0.3, 0.3, 5, 8);
                const pipeMat = new THREE.MeshBasicMaterial({ color: cfg.color });
                const pipe = new THREE.Mesh(pipeGeo, pipeMat);
                pipe.rotation.z = Math.PI / 2;
                pipe.position.y = 8;
                group.add(pipe);
            }

            // Save reference and hit targets for raycasting
            mainMesh.userData = { parentId: cfg.id };
            this.buildingMeshes.push(mainMesh);
            this.buildings[cfg.id] = group;
            this.scene.add(group);

            // Set initial visual appearance based on level
            this.applyBuildingLevelStyle(cfg.id, level);
        });

        // Add some ambient surrounding filler futuristic buildings (mini skyline)
        this.buildFillerArchitecture();
    }

    buildFillerArchitecture() {
        const fillerCoords = [
            [-8, -20], [8, -22], [-22, -2], [22, -3], [-10, 24], [10, 23],
            [-22, -16], [22, -18], [-22, 18], [22, 16]
        ];

        fillerCoords.forEach(([x, z]) => {
            const h = Math.random() * 6 + 4;
            const w = Math.random() * 3 + 2.5;
            const geo = new THREE.BoxGeometry(w, h, w);
            const mat = new THREE.MeshStandardMaterial({
                color: 0x090e18,
                metalness: 0.8,
                roughness: 0.3
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(x, h / 2, z);
            mesh.castShadow = true;
            this.scene.add(mesh);

            // Roof antenna
            const antGeo = new THREE.CylinderGeometry(0.05, 0.05, 2, 4);
            const antMat = new THREE.MeshBasicMaterial({ color: 0x00d2ff });
            const ant = new THREE.Mesh(antGeo, antMat);
            ant.position.set(x, h + 1, z);
            this.scene.add(ant);
        });
    }

    setupDronesAndTraffic() {
        // Spawn autonomous flying cyber drones
        const droneCount = 10;
        for (let i = 0; i < droneCount; i++) {
            const droneGroup = new THREE.Group();

            // Drone body
            const bodyGeo = new THREE.BoxGeometry(0.8, 0.25, 0.8);
            const bodyMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9 });
            const body = new THREE.Mesh(bodyGeo, bodyMat);
            droneGroup.add(body);

            // Glowing headlight
            const lightGeo = new THREE.SphereGeometry(0.12, 6, 6);
            const lightMat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x00f5a0 : 0x00d2ff });
            const light = new THREE.Mesh(lightGeo, lightMat);
            light.position.set(0, -0.1, 0.4);
            droneGroup.add(light);

            const radius = Math.random() * 22 + 10;
            const speed = (Math.random() * 0.008 + 0.004) * (Math.random() > 0.5 ? 1 : -1);
            const height = Math.random() * 12 + 6;
            const angle = Math.random() * Math.PI * 2;

            droneGroup.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);

            this.scene.add(droneGroup);
            this.drones.push({
                mesh: droneGroup,
                radius,
                speed,
                height,
                angle
            });
        }
    }

    applyBuildingLevelStyle(buildingId, level) {
        const group = this.buildings[buildingId];
        if (!group) return;

        // If level is 0, give a semi-transparent dormant hologram look
        if (level === 0) {
            group.traverse(child => {
                if (child.isMesh && child.material) {
                    child.material.transparent = true;
                    child.material.opacity = 0.45;
                }
            });
        } else {
            // Active, scale slightly with level progression
            const scaleY = 1 + (level - 1) * 0.08;
            group.scale.set(1, Math.min(scaleY, 1.8), 1);
            group.traverse(child => {
                if (child.isMesh && child.material) {
                    child.material.transparent = false;
                    child.material.opacity = 1.0;
                }
            });
        }
    }

    onBuildingUpgraded(buildingId, newLevel) {
        this.applyBuildingLevelStyle(buildingId, newLevel);

        // Create a golden shockwave ring expanding from building base
        const group = this.buildings[buildingId];
        if (group) {
            const shockGeo = new THREE.RingGeometry(1, 1.5, 24);
            const shockMat = new THREE.MeshBasicMaterial({
                color: 0xffd700,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.9
            });
            const shock = new THREE.Mesh(shockGeo, shockMat);
            shock.rotation.x = -Math.PI / 2;
            shock.position.set(group.position.x, 0.2, group.position.z);
            this.scene.add(shock);

            // Animate expansion
            let scale = 1;
            const anim = setInterval(() => {
                scale += 0.35;
                shock.scale.set(scale, scale, 1);
                shock.material.opacity -= 0.04;
                if (shock.material.opacity <= 0) {
                    clearInterval(anim);
                    this.scene.remove(shock);
                    shock.geometry.dispose();
                    shock.material.dispose();
                }
            }, 30);
        }
    }

    onMouseMove(e) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.buildingMeshes);

        if (intersects.length > 0) {
            const hitMesh = intersects[0].object;
            const parentId = hitMesh.userData.parentId;
            const buildingGroup = this.buildings[parentId];

            if (this.hoveredBuilding !== buildingGroup) {
                this.hoveredBuilding = buildingGroup;
                this.renderer.domElement.style.cursor = 'pointer';
                if (window.bizAudio) window.bizAudio.playClick();
            }

            // Update tooltip position and content
            if (this.tooltipEl && buildingGroup) {
                const bData = window.bizEngine ? window.bizEngine.state.buildings[parentId] : null;
                const cost = window.bizEngine ? window.bizEngine.getBuildingUpgradeCost(parentId) : 0;
                
                this.tooltipEl.style.display = 'block';
                this.tooltipEl.style.left = `${e.clientX + 16}px`;
                this.tooltipEl.style.top = `${e.clientY + 16}px`;
                this.tooltipEl.innerHTML = `
                    <div class="tooltip-header" style="color: ${bData ? bData.color : '#00d2ff'}">
                        <strong>${buildingGroup.userData.name}</strong>
                    </div>
                    <div class="tooltip-tag">${bData ? bData.tag : ''}</div>
                    <div class="tooltip-stats">
                        <span>Tingkat: <strong>${bData ? bData.level : 1}</strong></span>
                        <span>Arus Kas: <strong>+$${bData ? (bData.level * bData.baseRevenue).toLocaleString() : 0}/s</strong></span>
                    </div>
                    <div class="tooltip-hint">Klik untuk inspeksi & tingkatkan sektor</div>
                `;
            }
        } else {
            if (this.hoveredBuilding) {
                this.hoveredBuilding = null;
                this.renderer.domElement.style.cursor = 'default';
            }
            if (this.tooltipEl) {
                this.tooltipEl.style.display = 'none';
            }
        }
    }

    onMouseClick(e) {
        if (!this.hoveredBuilding) return;

        const buildingId = this.hoveredBuilding.userData.id;
        if (window.bizAudio) window.bizAudio.playClick();

        // Focus camera towards target building smoothly
        if (this.controls) {
            const targetPos = this.hoveredBuilding.position;
            this.smoothLookAt(targetPos.x, targetPos.y + 4, targetPos.z);
        }

        // Open building drawer/modal in UI
        if (window.bizApp) {
            window.bizApp.openBuildingInspector(buildingId);
        }
    }

    smoothLookAt(x, y, z) {
        if (!this.controls) return;
        const startTarget = this.controls.target.clone();
        const endTarget = new THREE.Vector3(x, y, z);
        let progress = 0;

        const anim = () => {
            progress += 0.05;
            this.controls.target.lerpVectors(startTarget, endTarget, progress);
            if (progress < 1) {
                requestAnimationFrame(anim);
            }
        };
        anim();
    }

    resetCamera() {
        if (!this.controls) return;
        this.camera.position.set(45, 38, 48);
        this.controls.target.set(0, 4, 0);
        this.controls.update();
    }

    toggleDayNight() {
        this.isNightMode = !this.isNightMode;
        if (this.isNightMode) {
            this.scene.background.set(0x070a12);
            this.scene.fog.color.set(0x070a12);
            this.ambientLight.color.set(0x182642);
            this.ambientLight.intensity = 1.2;
            this.dirLight.color.set(0x00d2ff);
            this.starField.visible = true;
        } else {
            // Solar Corporate daylight
            this.scene.background.set(0x87ceeb);
            this.scene.fog.color.set(0xb0e0e6);
            this.ambientLight.color.set(0xffffff);
            this.ambientLight.intensity = 2.0;
            this.dirLight.color.set(0xfff5e6);
            this.dirLight.intensity = 2.2;
            this.starField.visible = false;
        }
        return this.isNightMode;
    }

    toggleAutoRotate() {
        this.autoRotate = !this.autoRotate;
        if (this.controls) {
            this.controls.autoRotate = this.autoRotate;
        }
        return this.autoRotate;
    }

    onWindowResize() {
        if (!this.container || !this.renderer || !this.camera) return;
        const width = this.container.clientWidth || window.innerWidth || 1200;
        const height = this.container.clientHeight || (window.innerHeight - 56) || 700;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(this.animate);

        // Update OrbitControls
        if (this.controls) {
            this.controls.update();
        }

        // Animate drones
        this.drones.forEach(d => {
            d.angle += d.speed;
            d.mesh.position.x = Math.cos(d.angle) * d.radius;
            d.mesh.position.z = Math.sin(d.angle) * d.radius;
            d.mesh.rotation.y = -d.angle + Math.PI / 2;
        });

        // Animate decorative components on buildings
        if (this.buildings.hq && this.buildings.hq.userData.rotatingHalo) {
            this.buildings.hq.userData.rotatingHalo.rotation.z += 0.02;
        }

        if (this.buildings.rnd && this.buildings.rnd.userData.levitatingOrb) {
            const orb = this.buildings.rnd.userData.levitatingOrb;
            orb.rotation.y += 0.03;
            orb.rotation.x += 0.015;
            orb.position.y = 12.5 + Math.sin(Date.now() * 0.003) * 0.6;
        }

        // Render
        this.renderer.render(this.scene, this.camera);
    }
}
