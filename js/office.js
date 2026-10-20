/**
 * BizVerse 2.5D Virtual Office Metaverse
 * Simulated dynamic workplace with active wandering employees, speech bubbles,
 * hiring departments, and productivity perk upgrades.
 */

class BizOffice {
    constructor() {
        this.saveKey = 'bizverse_office_staff';
        this.canvas = null;
        this.ctx = null;
        this.staffList = [];
        this.speechBubbles = [];

        this.roles = {
            junior_dev: { id: 'junior_dev', name: 'Programmer Junior', cost: 2500, count: 0, rpsBonus: 15, icon: '💻', color: '#38bdf8' },
            quant_analyst: { id: 'quant_analyst', name: 'Analis Kuantitatif', cost: 7500, count: 0, rpsBonus: 55, icon: '📊', color: '#00f5a0' },
            ai_scientist: { id: 'ai_scientist', name: 'Ilmuwan Riset AI', cost: 22000, count: 0, rpsBonus: 190, icon: '🧠', color: '#c084fc' },
            growth_lead: { id: 'growth_lead', name: 'Manajer Pertumbuhan (Growth)', cost: 65000, count: 0, rpsBonus: 620, icon: '🚀', color: '#f43f5e' },
            executive_vp: { id: 'executive_vp', name: 'Wakil Presiden Eksekutif', cost: 200000, count: 0, rpsBonus: 2200, icon: '👑', color: '#fbbf24' }
        };

        this.perks = {
            coffee: { id: 'coffee', name: 'Bar Kopi Cold-Brew Kuantum', cost: 5000, purchased: false, bonus: 0.15, icon: '☕', desc: '+15% kecepatan kerja seluruh staf' },
            desks: { id: 'desks', name: 'Pod Kerja Ergonomis Gravitasi Nol', cost: 18000, purchased: false, bonus: 0.20, icon: '🪑', desc: '+20% produktivitas tenaga kerja' },
            fiber: { id: 'fiber', name: 'Jaringan Serat Optik Terabit', cost: 55000, purchased: false, bonus: 0.25, icon: '⚡', desc: '+25% efisiensi transmisi data bisnis' },
            penthouse: { id: 'penthouse', name: 'Taman Penthouse Puncak Menara', cost: 180000, purchased: false, bonus: 0.40, icon: '🌆', desc: '+40% moral dan prestise eksekutif' }
        };

        this.quotes = [
            'Menerapkan smart contract v4.2 ke blockchain... 💻',
            'Menutup transaksi B2B senilai $150k! 📈',
            'Akurasi model neural kuantum mencapai 99.4%! 🧠',
            'Menyeduh segelas nitro cold-brew di kafe kantor ☕',
            'Kampanye pemasaran kita menduduki peringkat #1 dunia! 🚀',
            'Peluang arbitrase likuiditas terdeteksi di Bursa Apex 📊',
            'Optimalisasi komputasi server untuk latensi nol detik ⚡',
            'Rapat direksi terjadwal dengan konsorsium investor 💼'
        ];

        this.loadSave();
    }

    initCanvas(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Spawn initial visual avatars if empty
        const totalEmployees = this.getTotalStaffCount();
        const visualCount = Math.min(25, Math.max(4, totalEmployees));
        this.staffList = [];
        for (let i = 0; i < visualCount; i++) {
            this.spawnAvatar();
        }

        this.startOfficeLoop();
    }

    resizeCanvas() {
        if (!this.canvas) return;
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = 340;
    }

    spawnAvatar() {
        const rolesKeys = Object.keys(this.roles);
        const randomRole = this.roles[rolesKeys[Math.floor(Math.random() * rolesKeys.length)]];
        this.staffList.push({
            x: Math.random() * (this.canvas ? this.canvas.width - 60 : 400) + 30,
            y: Math.random() * 160 + 100,
            targetX: Math.random() * (this.canvas ? this.canvas.width - 60 : 400) + 30,
            targetY: Math.random() * 160 + 100,
            speed: Math.random() * 0.8 + 0.4,
            color: randomRole.color,
            icon: randomRole.icon,
            roleName: randomRole.name,
            state: 'working',
            timer: Math.random() * 100 + 50,
            facing: Math.random() > 0.5 ? 1 : -1
        });
    }

    startOfficeLoop() {
        setInterval(() => {
            // Chance to pop quote
            if (this.staffList.length > 0 && Math.random() < 0.35 && this.speechBubbles.length < 3) {
                const avatar = this.staffList[Math.floor(Math.random() * this.staffList.length)];
                const quote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
                this.speechBubbles.push({
                    x: avatar.x,
                    y: avatar.y - 28,
                    text: quote,
                    alpha: 1.0,
                    life: 140
                });
            }
        }, 1500);

        const render = () => {
            this.drawOffice();
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
    }

    drawOffice() {
        if (!this.ctx || !this.canvas) return;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Clear background: Futuristic modern office floor
        ctx.fillStyle = '#0a0f1d';
        ctx.fillRect(0, 0, w, h);

        // Grid floor tiles with perspective
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.07)';
        ctx.lineWidth = 1;
        const gridSize = 40;
        for (let x = 0; x < w; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 70);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 70; y < h; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Draw back wall
        const wallGrad = ctx.createLinearGradient(0, 0, 0, 70);
        wallGrad.addColorStop(0, '#060913');
        wallGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = wallGrad;
        ctx.fillRect(0, 0, w, 70);

        // Neon glowing division line
        ctx.strokeStyle = '#00d2ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 70);
        ctx.lineTo(w, 70);
        ctx.stroke();

        // Draw office furniture: Desks and Workstations
        const deskCount = Math.floor(w / 140);
        for (let i = 0; i < deskCount; i++) {
            const dx = 40 + i * 140;
            const dy = 140;

            // Desk
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(dx, dy, 70, 24);
            ctx.fillStyle = '#334155';
            ctx.fillRect(dx + 4, dy + 24, 6, 18);
            ctx.fillRect(dx + 60, dy + 24, 6, 18);

            // Computer monitor with glow
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(dx + 22, dy - 18, 26, 18);
            ctx.fillStyle = '#00f5a0';
            ctx.fillRect(dx + 24, dy - 16, 22, 14);
        }

        // Coffee Machine / Break Area on the left
        ctx.fillStyle = '#3b1c1c';
        ctx.fillRect(15, 80, 45, 45);
        ctx.fillStyle = '#f59e0b';
        ctx.font = '16px monospace';
        ctx.fillText('☕', 28, 110);

        // Server rack on the far right
        ctx.fillStyle = '#0b132b';
        ctx.fillRect(w - 65, 80, 50, 55);
        ctx.fillStyle = '#00f5a0';
        ctx.fillRect(w - 55, 90, 8, 4);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(w - 55, 100, 8, 4);
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(w - 55, 110, 8, 4);

        // Update & Render wandering staff avatars
        this.staffList.forEach(av => {
            av.timer--;
            if (av.timer <= 0) {
                av.timer = Math.random() * 150 + 60;
                av.targetX = Math.random() * (w - 80) + 40;
                av.targetY = Math.random() * 150 + 90;
                av.facing = av.targetX > av.x ? 1 : -1;
            }

            // Move towards target
            const dx = av.targetX - av.x;
            const dy = av.targetY - av.y;
            const dist = Math.hypot(dx, dy);
            if (dist > 3) {
                av.x += (dx / dist) * av.speed;
                av.y += (dy / dist) * av.speed;
            }

            // Draw avatar body
            ctx.save();
            ctx.translate(av.x, av.y);

            // Shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.beginPath();
            ctx.ellipse(0, 4, 10, 4, 0, 0, Math.PI * 2);
            ctx.fill();

            // Head
            ctx.fillStyle = '#fed7aa';
            ctx.beginPath();
            ctx.arc(0, -18, 6, 0, Math.PI * 2);
            ctx.fill();

            // Suit body with role color
            ctx.fillStyle = av.color;
            ctx.fillRect(-6, -12, 12, 14);

            // Legs
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(-5, 2, 4, 6);
            ctx.fillRect(1, 2, 4, 6);

            // Icon above head
            ctx.font = '12px sans-serif';
            ctx.fillText(av.icon, -6, -26);

            ctx.restore();
        });

        // Update & Render speech bubbles
        for (let i = this.speechBubbles.length - 1; i >= 0; i--) {
            const b = this.speechBubbles[i];
            b.life--;
            b.y -= 0.15;
            if (b.life < 30) {
                b.alpha = b.life / 30;
            }

            ctx.save();
            ctx.globalAlpha = Math.max(0, b.alpha);
            ctx.font = '11px "Plus Jakarta Sans", sans-serif';
            const metrics = ctx.measureText(b.text);
            const pad = 8;
            const bw = metrics.width + pad * 2;
            const bh = 22;

            // Bubble background
            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            ctx.strokeStyle = '#00d2ff';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(b.x - bw / 2, b.y - bh, bw, bh, 6);
            ctx.fill();
            ctx.stroke();

            // Text
            ctx.fillStyle = '#ffffff';
            ctx.fillText(b.text, b.x - bw / 2 + pad, b.y - 7);
            ctx.restore();

            if (b.life <= 0) {
                this.speechBubbles.splice(i, 1);
            }
        }
    }

    hireStaff(roleId) {
        const role = this.roles[roleId];
        if (!role || !window.bizEngine) return false;

        const cost = Math.floor(role.cost * Math.pow(1.22, role.count));
        if (window.bizEngine.state.cash >= cost) {
            window.bizEngine.state.cash -= cost;
            role.count += 1;

            if (window.bizAudio) window.bizAudio.playCash();
            this.spawnAvatar();
            this.saveSave();
            this.updateUI();

            if (window.bizApp) {
                window.bizApp.showToast(`Hired ${role.name}!`, 'success');
            }
            return true;
        }
        return false;
    }

    buyPerk(perkId) {
        const perk = this.perks[perkId];
        if (!perk || perk.purchased || !window.bizEngine) return false;

        if (window.bizEngine.state.cash >= perk.cost) {
            window.bizEngine.state.cash -= perk.cost;
            perk.purchased = true;

            if (window.bizAudio) window.bizAudio.playUpgrade();
            this.saveSave();
            this.updateUI();

            if (window.bizApp) {
                window.bizApp.showToast(`Upgraded: ${perk.name}!`, 'success');
            }
            return true;
        }
        return false;
    }

    getStaffBonus() {
        let mult = 1.0;
        for (const pid in this.perks) {
            if (this.perks[pid].purchased) {
                mult += this.perks[pid].bonus;
            }
        }
        return mult;
    }

    getTotalStaffCount() {
        let total = 0;
        for (const rid in this.roles) {
            total += this.roles[rid].count;
        }
        return total;
    }

    saveSave() {
        try {
            const data = {
                roles: this.roles,
                perks: this.perks
            };
            localStorage.setItem(this.saveKey, JSON.stringify(data));
        } catch (e) {}
    }

    loadSave() {
        try {
            const data = localStorage.getItem(this.saveKey);
            if (data) {
                const parsed = JSON.parse(data);
                if (parsed.roles) {
                    for (const k in this.roles) {
                        if (parsed.roles[k]) {
                            this.roles[k].count = parsed.roles[k].count ?? 0;
                        }
                    }
                }
                if (parsed.perks) {
                    for (const k in this.perks) {
                        if (parsed.perks[k]) {
                            this.perks[k].purchased = !!parsed.perks[k].purchased;
                        }
                    }
                }
            }
        } catch (e) {}
    }

    updateUI() {
        // Render roles hiring list
        const rolesEl = document.getElementById('office-roles-list');
        if (rolesEl) {
            let html = '';
            for (const rid in this.roles) {
                const r = this.roles[rid];
                const cost = Math.floor(r.cost * Math.pow(1.22, r.count));
                const canAfford = window.bizEngine && window.bizEngine.state.cash >= cost;
                html += `
                    <div class="office-role-card">
                        <div class="role-icon-box" style="border-color: ${r.color}">
                            <span>${r.icon}</span>
                        </div>
                        <div class="role-info">
                            <div class="role-name">${r.name}</div>
                            <div class="role-stats">Count: <strong>${r.count}</strong> | +$${r.rpsBonus}/s each</div>
                        </div>
                        <button class="btn btn-sm ${canAfford ? 'btn-primary' : 'btn-disabled'}" 
                                onclick="window.bizOffice.hireStaff('${rid}')">
                            Hire $${cost.toLocaleString()}
                        </button>
                    </div>
                `;
            }
            rolesEl.innerHTML = html;
        }

        // Render office perks
        const perksEl = document.getElementById('office-perks-list');
        if (perksEl) {
            let html = '';
            for (const pid in this.perks) {
                const p = this.perks[pid];
                const canAfford = !p.purchased && window.bizEngine && window.bizEngine.state.cash >= p.cost;
                html += `
                    <div class="office-perk-card ${p.purchased ? 'purchased' : ''}">
                        <div class="perk-icon-box">${p.icon}</div>
                        <div class="perk-info">
                            <div class="perk-name">${p.name}</div>
                            <div class="perk-desc">${p.desc}</div>
                        </div>
                        <button class="btn btn-sm ${p.purchased ? 'btn-success' : (canAfford ? 'btn-secondary' : 'btn-disabled')}"
                                ${p.purchased ? 'disabled' : ''}
                                onclick="window.bizOffice.buyPerk('${pid}')">
                            ${p.purchased ? '✓ Active' : `Unlock $${p.cost.toLocaleString()}`}
                        </button>
                    </div>
                `;
            }
            perksEl.innerHTML = html;
        }

        // Update employee top counter
        const countEl = document.getElementById('stat-workforce-count');
        if (countEl) {
            countEl.textContent = `${this.getTotalStaffCount()} Staff`;
        }
    }
}

window.bizOffice = new BizOffice();
