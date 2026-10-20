/**
 * BizVerse Private Island (Pulau Pribadi) 3D World & Tycoon Estate
 * Customizable private paradise island with buildable business plots,
 * tropical beach, animated water, helipad, and tycoon structures.
 */

class BizIsland3D {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.avatar = null;
        this.plots = [];
        this.placedBuildings = {};
        this.saveKey = 'bizverse_private_island_data';

        // Buildable building templates
        this.templates = {
            villa: { id: 'villa', name: 'Villa Kaca CEO', cost: 15000, rps: 45, color: 0x38bdf8, icon: '🏰', desc: 'Mansion mewah tepi pantai dengan pemandangan metaverse eksklusif.' },
            crypto_mine: { id: 'crypto_mine', name: 'Rig Penambang Kuantum', cost: 35000, rps: 120, color: 0x00f5a0, icon: '⛏️', desc: 'Penambang aset digital kuantum berpendingin cairan air laut.' },
            retail_shop: { id: 'retail_shop', name: 'Butik Mewah Flagship', cost: 75000, rps: 280, color: 0xff007f, icon: '🛍️', desc: 'Toko barang mewah virtual melayani turis pulau berkocek tebal.' },
            helipad: { id: 'helipad', name: 'Helipad Eksekutif VIP', cost: 150000, rps: 600, color: 0xfbbf24, icon: '🚁', desc: 'Mendatangkan investor VIP global langsung ke pulau pribadi.' },
            mega_factory: { id: 'mega_factory', name: 'Pabrik Robotika Mikro', cost: 400000, rps: 1800, color: 0x9d4edd, icon: '🏭', desc: 'Pabrik robotika otonom menghasilkan komoditas ekspor antarpulau.' }
        };

        this.init();
    }

    init() {
        const width = this.container.clientWidth || 800;
        const height = this.container.clientHeight || 500;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0284c7); // Azure sky
        this.scene.fog = new THREE.FogExp2(0x38bdf8, 0.008);

        this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        this.camera.position.set(0, 10, 20);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);

        this.setupLights();
        this.buildIslandTerrain();
        this.setupPlots();

        // Spawn Roblox 3D Avatar on the Island
        this.avatar = new BizAvatar3D(this.scene, this.camera, this.renderer.domElement);
        this.avatar.position.set(0, 0, 10);

        this.loadIslandData();

        window.addEventListener('resize', () => this.onWindowResize());

        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    setupLights() {
        const ambient = new THREE.AmbientLight(0xffffff, 1.4);
        this.scene.add(ambient);

        const sun = new THREE.DirectionalLight(0xfff7ed, 2.0);
        sun.position.set(40, 60, 30);
        sun.castShadow = true;
        sun.shadow.mapSize.width = 2048;
        sun.shadow.mapSize.height = 2048;
        this.scene.add(sun);
    }

    buildIslandTerrain() {
        // Ocean plane
        const oceanGeo = new THREE.PlaneGeometry(300, 300, 32, 32);
        const oceanMat = new THREE.MeshStandardMaterial({
            color: 0x0284c7,
            roughness: 0.1,
            metalness: 0.8,
            transparent: true,
            opacity: 0.88
        });
        const ocean = new THREE.Mesh(oceanGeo, oceanMat);
        ocean.rotation.x = -Math.PI / 2;
        ocean.position.y = -0.6;
        ocean.receiveShadow = true;
        this.scene.add(ocean);

        // Island Sand Beach (Base cylinder)
        const beachGeo = new THREE.CylinderGeometry(36, 40, 2, 32);
        const beachMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.9 });
        const beach = new THREE.Mesh(beachGeo, beachMat);
        beach.position.y = -0.5;
        beach.receiveShadow = true;
        this.scene.add(beach);

        // Island Lush Green Hilltop
        const grassGeo = new THREE.CylinderGeometry(30, 33, 1.5, 32);
        const grassMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.8 });
        const grass = new THREE.Mesh(grassGeo, grassMat);
        grass.position.y = 0.5;
        grass.receiveShadow = true;
        this.scene.add(grass);

        // Decorative palm trees
        const palmCoords = [
            [-18, -12], [18, -10], [-20, 14], [22, 12], [-14, -22], [14, -20]
        ];
        palmCoords.forEach(([x, z]) => {
            this.createPalmTree(x, z);
        });
    }

    createPalmTree(x, z) {
        const trunkGeo = new THREE.CylinderGeometry(0.3, 0.5, 5, 6);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.set(x, 3.2, z);
        trunk.rotation.z = (Math.random() - 0.5) * 0.2;
        trunk.castShadow = true;
        this.scene.add(trunk);

        // Leaves
        const leafGeo = new THREE.ConeGeometry(2.5, 1.2, 5);
        const leafMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });
        const leaves = new THREE.Mesh(leafGeo, leafMat);
        leaves.position.set(x, 5.8, z);
        leaves.castShadow = true;
        this.scene.add(leaves);
    }

    setupPlots() {
        // 6 distinct construction plots on the private island
        const plotCoords = [
            { id: 'plot_1', x: -10, z: -8, name: 'Kavling Pantai Barat' },
            { id: 'plot_2', x: 10, z: -8, name: 'Kavling Pantai Timur' },
            { id: 'plot_3', x: -10, z: 6, name: 'Kavling Dermaga Selatan' },
            { id: 'plot_4', x: 10, z: 6, name: 'Kavling Perbukitan' },
            { id: 'plot_5', x: 0, z: -16, name: 'Kavling Mercusuar Utara' },
            { id: 'plot_6', x: 0, z: 14, name: 'Kavling Plaza Tengah' }
        ];

        plotCoords.forEach(p => {
            const plotGroup = new THREE.Group();
            plotGroup.position.set(p.x, 1.26, p.z);
            plotGroup.userData = { id: p.id, name: p.name };

            // Base border marker pad
            const padGeo = new THREE.BoxGeometry(6, 0.15, 6);
            const padMat = new THREE.MeshStandardMaterial({
                color: 0x1e293b,
                roughness: 0.4,
                metalness: 0.6
            });
            const pad = new THREE.Mesh(padGeo, padMat);
            pad.receiveShadow = true;
            plotGroup.add(pad);

            // Glowing border
            const lineGeo = new THREE.EdgesGeometry(padGeo);
            const lineMat = new THREE.LineBasicMaterial({ color: 0x00d2ff });
            const line = new THREE.LineSegments(lineGeo, lineMat);
            plotGroup.add(line);

            this.scene.add(plotGroup);
            this.plots.push({ group: plotGroup, ...p });
        });
    }

    buildOnPlot(plotId, templateId) {
        const plot = this.plots.find(p => p.id === plotId);
        const template = this.templates[templateId];
        if (!plot || !template || !window.bizEngine) return false;

        if (window.bizEngine.state.cash < template.cost) {
            if (window.bizApp) window.bizApp.showToast('Dana kas tidak mencukupi untuk proyek pulau!', 'error');
            return false;
        }

        window.bizEngine.state.cash -= template.cost;

        // Clear existing structure if replacing
        if (this.placedBuildings[plotId]) {
            plot.group.remove(this.placedBuildings[plotId].mesh);
        }

        // Spawn 3D Structure on Plot
        let mesh;
        if (templateId === 'villa') {
            const geo = new THREE.BoxGeometry(4.5, 3.5, 4.5);
            const mat = new THREE.MeshStandardMaterial({ color: template.color, metalness: 0.5, roughness: 0.2 });
            mesh = new THREE.Mesh(geo, mat);
            mesh.position.y = 1.8;
            mesh.castShadow = true;

            // Glass balcony
            const bGeo = new THREE.BoxGeometry(4.7, 0.4, 4.7);
            const bMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
            const b = new THREE.Mesh(bGeo, bMat);
            b.position.y = 2.4;
            mesh.add(b);

        } else if (templateId === 'helipad') {
            const geo = new THREE.CylinderGeometry(2.4, 2.4, 0.4, 16);
            const mat = new THREE.MeshStandardMaterial({ color: 0x111827 });
            mesh = new THREE.Mesh(geo, mat);
            mesh.position.y = 0.3;

            // Yellow 'H'
            const hGeo = new THREE.BoxGeometry(1.4, 0.1, 0.3);
            const hMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
            const h = new THREE.Mesh(hGeo, hMat);
            h.position.y = 0.25;
            mesh.add(h);

        } else {
            // General modern cyber enterprise structure
            const geo = new THREE.BoxGeometry(4, 4.5, 4);
            const mat = new THREE.MeshStandardMaterial({ color: template.color, metalness: 0.7, roughness: 0.3 });
            mesh = new THREE.Mesh(geo, mat);
            mesh.position.y = 2.3;
            mesh.castShadow = true;
        }

        plot.group.add(mesh);
        this.placedBuildings[plotId] = {
            templateId,
            level: 1,
            mesh
        };

        if (window.bizAudio) window.bizAudio.playUpgrade();
        if (window.confetti) window.confetti({ particleCount: 50, spread: 60 });
        if (window.bizApp) window.bizApp.showToast(`Berhasil Membangun ${template.name} di ${plot.name}!`, 'success');

        this.saveIslandData();
        this.updateUI();
        return true;
    }

    getIslandRevenuePerSec() {
        let total = 0;
        for (const pId in this.placedBuildings) {
            const b = this.placedBuildings[pId];
            const tmpl = this.templates[b.templateId];
            if (tmpl) {
                total += tmpl.rps * b.level;
            }
        }
        return total;
    }

    saveIslandData() {
        try {
            const data = {};
            for (const pId in this.placedBuildings) {
                data[pId] = {
                    templateId: this.placedBuildings[pId].templateId,
                    level: this.placedBuildings[pId].level
                };
            }
            localStorage.setItem(this.saveKey, JSON.stringify(data));
        } catch (e) {}
    }

    loadIslandData() {
        try {
            const raw = localStorage.getItem(this.saveKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                for (const pId in parsed) {
                    const item = parsed[pId];
                    const plot = this.plots.find(p => p.id === pId);
                    const template = this.templates[item.templateId];
                    if (plot && template) {
                        const geo = new THREE.BoxGeometry(4, 4, 4);
                        const mat = new THREE.MeshStandardMaterial({ color: template.color });
                        const mesh = new THREE.Mesh(geo, mat);
                        mesh.position.y = 2;
                        mesh.castShadow = true;
                        plot.group.add(mesh);
                        this.placedBuildings[pId] = {
                            templateId: item.templateId,
                            level: item.level || 1,
                            mesh
                        };
                    }
                }
            }
        } catch (e) {}
    }

    updateUI() {
        const container = document.getElementById('island-plots-container');
        if (!container) return;

        let html = '';
        this.plots.forEach(p => {
            const placed = this.placedBuildings[p.id];
            const tmpl = placed ? this.templates[placed.templateId] : null;

            html += `
                <div class="island-plot-card ${placed ? 'occupied' : 'empty'}">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <strong style="font-size: 13px;">${p.name}</strong>
                        <span class="badge ${placed ? 'green' : 'dim'}">${placed ? '✓ Beroperasi' : 'Kosong'}</span>
                    </div>

                    ${placed ? `
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                            <span style="font-size: 24px;">${tmpl.icon}</span>
                            <div>
                                <div style="font-weight: 700;">${tmpl.name} (Lvl ${placed.level})</div>
                                <div style="font-size: 11px; color: var(--primary-emerald);">+$${tmpl.rps * placed.level}/s Arus Kas</div>
                            </div>
                        </div>
                    ` : `
                        <p style="font-size: 11px; color: var(--text-muted); margin-bottom: 10px;">
                            Kavling siap bangun untuk ekspansi bisnis pulau pribadi Anda.
                        </p>
                        <select id="select-build-${p.id}" class="select-input" style="width: 100%; margin-bottom: 8px;">
                            ${Object.values(this.templates).map(t => `
                                <option value="${t.id}">${t.icon} ${t.name} - $${t.cost.toLocaleString()}</option>
                            `).join('')}
                        </select>
                        <button class="btn btn-sm btn-primary" style="width: 100%;" 
                                onclick="const sel = document.getElementById('select-build-${p.id}').value; window.bizIsland.buildOnPlot('${p.id}', sel);">
                            Bangun Sektor Ini
                        </button>
                    `}
                </div>
            `;
        });
        container.innerHTML = html;

        // Island stats
        const revEl = document.getElementById('island-stat-rev');
        if (revEl) revEl.textContent = `+$${this.getIslandRevenuePerSec().toLocaleString()}/s`;
    }

    onWindowResize() {
        if (!this.container || !this.renderer || !this.camera) return;
        const width = this.container.clientWidth || 800;
        const height = this.container.clientHeight || 500;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(this.animate);
        const delta = 0.016;

        if (this.avatar) {
            this.avatar.update(delta);
        }

        this.renderer.render(this.scene, this.camera);
    }
}

window.BizIsland3D = BizIsland3D;
