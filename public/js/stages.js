/**
 * BizVerse 4-Stage Executive Roadmap & Progression System
 * Tahap 1: Gabung (Onboarding, Identitas & Modal Awal)
 * Tahap 2: Mendirikan Bisnis (Pondasi Sektor, Pulau Pribadi & Staf)
 * Tahap 3: Membuka Jaringan (Sosial, Pasar Pemain, Kontrak B2B & Aliansi)
 * Tahap 4: Bersaing (Peringkat Global Leaderboard, Perang Pasar & Dominasi)
 */

class BizStages {
    constructor() {
        this.saveKey = 'bizverse_stages_progression';

        this.currentStage = 1;

        this.stages = {
            1: {
                id: 1,
                title: 'Tahap 1: Gabung (Onboarding)',
                subtitle: 'Mendaftarkan Identitas & Klaim Modal Permulaan',
                icon: '🚀',
                desc: 'Langkah awal memasuki metaverse BizVerse, kustomisasi avatar Roblox 3D, menentukan nama konglomerat, dan mengklaim grant angel investor.',
                tasks: [
                    { id: 't1_profile', text: 'Kustomisasi Avatar & Profil CEO Anda', check: () => true },
                    { id: 't1_pitch', text: 'Lakukan Pitch Investor minimal 5 kali', check: (e) => e.state.stats.totalClicks >= 5 },
                    { id: 't1_capital', text: 'Kumpulkan kas operasional $20,000', check: (e) => e.state.cash >= 20000 }
                ],
                rewardCash: 15000,
                rewardTitle: 'Pendiri Bersertifikat'
            },
            2: {
                id: 2,
                title: 'Tahap 2: Mendirikan Bisnis',
                subtitle: 'Membangun Pondasi Sektor & Pulau Pribadi',
                icon: '🏗️',
                desc: 'Mendirikan pusat komando di Nexus HQ, membangun kavling bisnis pertama di Pulau Pribadi, dan merekrut staf kantor perdana.',
                tasks: [
                    { id: 't2_hq', text: 'Tingkatkan Markas Besar Nexus ke Tingkat 2', check: (e) => e.state.buildings.hq.level >= 2 },
                    { id: 't2_island', text: 'Bangun minimal 1 properti di Pulau Pribadi', check: () => window.bizIsland && Object.keys(window.bizIsland.placedBuildings).length >= 1 },
                    { id: 't2_staff', text: 'Rekrut minimal 2 staf di Kantor Virtual', check: () => window.bizOffice && window.bizOffice.getTotalStaffCount() >= 2 }
                ],
                rewardCash: 35000,
                rewardTitle: 'Pembangun Perusahaan'
            },
            3: {
                id: 3,
                title: 'Tahap 3: Membuka Jaringan',
                subtitle: 'Ekspansi B2B, Pasar Pemain & Diplomasi',
                icon: '🌐',
                desc: 'Membangun relasi antar-CEO di Obrolan Global, bertransaksi di Pasar Pemain P2P, dan menandatangani kontrak korporat bernilai tinggi.',
                tasks: [
                    { id: 't3_chat', text: 'Kirim pesan atau lakukan emotikon (/dance) di Obrolan Global', check: () => window.bizSocial && window.bizSocial.messages.some(m => m.isMe) },
                    { id: 't3_contract', text: 'Tandatangani minimal 1 Kontrak Proyek B2B', check: (e) => e.state.stats.contractsDone >= 1 },
                    { id: 't3_trade', text: 'Lakukan transaksi saham di Bursa Apex atau Pasar Pemain', check: (e) => e.state.stats.tradesExecuted >= 1 }
                ],
                rewardCash: 80000,
                rewardTitle: 'Mitra Sindikat Bisnis'
            },
            4: {
                id: 4,
                title: 'Tahap 4: Bersaing',
                subtitle: 'Dominasi Pasar & Puncak Leaderboard Global',
                icon: '👑',
                desc: 'Bertarung memperebutkan peringkat #1 di Papan Peringkat Dunia, mengakuisisi kompetitor, dan mencapai status Konglomerat Megacorp.',
                tasks: [
                    { id: 't4_valuation', text: 'Capai Valuasi Perusahaan $1,000,000 (Status Unicorn)', check: (e) => e.getValuation() >= 1000000 },
                    { id: 't4_megacorp', text: 'Miliki 4 sektor bisnis berbeda di Metropolis 3D', check: (e) => Object.values(e.state.buildings).filter(b => b.level >= 1).length >= 4 },
                    { id: 't4_top_rank', text: 'Masuk jajaran Top 3 Konglomerat di Papan Peringkat Dunia', check: () => true }
                ],
                rewardCash: 250000,
                rewardTitle: 'Penguasa Konglomerat Global'
            }
        };

        // Simulated Global Competitor Leaderboard
        this.leaderboard = [
            { rank: 1, name: 'CyberDyne Global', ceo: 'Viktor Kane', valuation: 85400000, tier: 'Sindikat Bisnis Antariksa', badge: '🥇' },
            { rank: 2, name: 'Titan Orbital Corp', ceo: 'Sarah Chen', valuation: 42100000, tier: 'Megacorp Multinasional', badge: '🥈' },
            { rank: 3, name: 'Aether Nexus Ltd', ceo: 'CryptoWhale_99', valuation: 18400000, tier: 'Konglomerat Blue-Chip', badge: '🥉' },
            { rank: 4, name: 'OmniNet Solutions', ceo: 'CyberTycoon_ID', valuation: 9200000, tier: 'Konglomerat Blue-Chip', badge: '#4' },
            { rank: 5, name: 'Quantum Leap Labs', ceo: 'Luna_Quantum', valuation: 5400000, tier: 'Korporasi Menengah', badge: '#5' },
            { rank: 6, name: 'OmniCorp Global (Anda)', ceo: 'Alex Mercer', valuation: 35000, tier: 'Perusahaan Rintisan', isPlayer: true, badge: '#6' }
        ];

        this.loadStages();
    }

    loadStages() {
        try {
            const data = localStorage.getItem(this.saveKey);
            if (data) {
                const parsed = JSON.parse(data);
                this.currentStage = parsed.currentStage || 1;
            }
        } catch (e) {}
    }

    saveStages() {
        try {
            localStorage.setItem(this.saveKey, JSON.stringify({ currentStage: this.currentStage }));
        } catch (e) {}
    }

    checkStageProgress() {
        if (!window.bizEngine) return;
        const currentData = this.stages[this.currentStage];
        if (!currentData) return;

        const allTasksDone = currentData.tasks.every(t => t.check(window.bizEngine));
        if (allTasksDone && this.currentStage < 4) {
            // Stage Complete! Advance to next stage
            const completedStageNum = this.currentStage;
            this.currentStage += 1;
            this.saveStages();

            window.bizEngine.state.cash += currentData.rewardCash;
            window.bizEngine.state.reputation += 40;

            if (window.bizAuth) {
                window.bizAuth.profile.title = currentData.rewardTitle;
                window.bizAuth.saveProfile();
                window.bizAuth.updateUI();
            }

            if (window.bizAudio) window.bizAudio.playUpgrade();
            if (window.confetti) window.confetti({ particleCount: 120, spread: 80 });

            if (window.bizApp) {
                window.bizApp.showToast(`🎉 SELAMAT! Anda Menyelesaikan ${currentData.title}! Hadiah: +$${currentData.rewardCash.toLocaleString()}`, 'success');
            }
        }

        // Live update player row in leaderboard
        const playerRow = this.leaderboard.find(x => x.isPlayer);
        if (playerRow && window.bizEngine && window.bizAuth) {
            playerRow.valuation = window.bizEngine.getValuation();
            playerRow.ceo = window.bizAuth.profile.username;
            playerRow.name = `${window.bizEngine.state.companyName} (Anda)`;
            playerRow.tier = window.bizEngine.getCorporateTier().name;

            // Sort leaderboard descending by valuation
            this.leaderboard.sort((a, b) => b.valuation - a.valuation);
            this.leaderboard.forEach((item, idx) => {
                item.rank = idx + 1;
                item.badge = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : `#${idx + 1}`));
            });
        }

        this.updateUI();
    }

    openStagesModal() {
        const modal = document.getElementById('stages-roadmap-modal');
        if (modal) {
            modal.classList.add('active');
            this.updateUI();
            if (window.bizAudio) window.bizAudio.playClick();
        }
    }

    closeStagesModal() {
        const modal = document.getElementById('stages-roadmap-modal');
        if (modal) modal.classList.remove('active');
    }

    launchTakeoverChallenge(competitorName) {
        if (!window.bizEngine) return;
        const myVal = window.bizEngine.getValuation();
        const cost = 50000;

        if (window.bizEngine.state.cash < cost) {
            if (window.bizApp) window.bizApp.showToast(`Butuh dana kas minimal $${cost.toLocaleString()} untuk melancarkan serangan takeover pasar!`, 'error');
            return;
        }

        window.bizEngine.state.cash -= cost;

        // Competitive takeover chance calculation
        const success = Math.random() < 0.65 || myVal > 500000;
        if (success) {
            const loot = 125000;
            window.bizEngine.state.cash += loot;
            window.bizEngine.state.reputation += 50;
            if (window.bizAudio) window.bizAudio.playUpgrade();
            if (window.confetti) window.confetti({ particleCount: 100, spread: 70 });
            if (window.bizApp) {
                window.bizApp.showToast(`🔥 KEMENANGAN TAKEOVER! Berhasil merebut pangsa pasar dari ${competitorName} dan meraup dividen $${loot.toLocaleString()}!`, 'success');
            }
        } else {
            if (window.bizAudio) window.bizAudio.playAlert();
            if (window.bizApp) {
                window.bizApp.showToast(`🛡️ ${competitorName} berhasil menangkis takeover dengan pertahanan Poison Pill! Kas serangan terpotong.`, 'info');
            }
        }

        this.checkStageProgress();
    }

    updateUI() {
        // Update top nav roadmap pill
        const pillText = document.getElementById('roadmap-stage-pill');
        if (pillText) {
            pillText.textContent = `Tahap ${this.currentStage}/4: ${this.stages[this.currentStage].title.split(':')[1]}`;
        }

        // Render 4 stages progression cards in the modal
        const container = document.getElementById('stages-cards-grid');
        if (container) {
            let html = '';
            for (let i = 1; i <= 4; i++) {
                const s = this.stages[i];
                const isCurrent = i === this.currentStage;
                const isPassed = i < this.currentStage;
                const isLocked = i > this.currentStage;

                html += `
                    <div class="stage-roadmap-card ${isCurrent ? 'current' : (isPassed ? 'completed' : 'locked')}">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 26px;">${s.icon}</span>
                                <div>
                                    <h4 style="font-family: var(--font-heading); font-size: 15px;">${s.title}</h4>
                                    <span style="font-size: 11px; color: var(--primary-cyan); font-weight: 600;">${s.subtitle}</span>
                                </div>
                            </div>
                            <span class="badge ${isPassed ? 'green' : (isCurrent ? 'cyan' : 'dim')}">
                                ${isPassed ? '✓ Selesai' : (isCurrent ? '▶ Sedang Aktif' : '🔒 Terkunci')}
                            </span>
                        </div>
                        <p style="font-size: 11px; color: var(--text-muted); line-height: 1.5; margin-bottom: 12px;">
                            ${s.desc}
                        </p>

                        <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; background: rgba(15, 23, 42, 0.5); padding: 10px; border-radius: 8px;">
                            <span style="font-size: 10px; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Misi Objektif:</span>
                            ${s.tasks.map(t => {
                                const done = isPassed || (window.bizEngine && t.check(window.bizEngine));
                                return `
                                    <div style="font-size: 11px; display: flex; align-items: center; gap: 6px; color: ${done ? 'var(--primary-emerald)' : 'var(--text-white)'};">
                                        <span>${done ? '✅' : '⚪'}</span>
                                        <span>${t.text}</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 8px; font-size: 11px;">
                            <span style="color: var(--text-muted);">Hadiah Kelulusan:</span>
                            <strong style="color: var(--accent-amber); font-family: var(--font-mono);">+$${s.rewardCash.toLocaleString()} Kas</strong>
                        </div>
                    </div>
                `;
            }
            container.innerHTML = html;
        }

        // Render Leaderboard table in Tab 4 / modal
        const lbTable = document.getElementById('global-leaderboard-tbody');
        if (lbTable) {
            let html = '';
            this.leaderboard.forEach(p => {
                html += `
                    <tr style="border-bottom: 1px solid var(--border-subtle); ${p.isPlayer ? 'background: rgba(0, 210, 255, 0.08);' : ''}">
                        <td style="padding: 10px 12px; font-weight: 800; font-size: 14px;">${p.badge}</td>
                        <td style="padding: 10px 12px;">
                            <div style="font-weight: 700; color: ${p.isPlayer ? 'var(--primary-cyan)' : '#ffffff'};">${p.name}</div>
                            <div style="font-size: 11px; color: var(--text-muted);">CEO: ${p.ceo}</div>
                        </td>
                        <td style="padding: 10px 12px; font-family: var(--font-mono); font-weight: 700; color: var(--primary-emerald); font-size: 14px;">
                            $${p.valuation.toLocaleString()}
                        </td>
                        <td style="padding: 10px 12px;">
                            <span class="badge ${p.isPlayer ? 'cyan' : 'dim'}">${p.tier}</span>
                        </td>
                        <td style="padding: 10px 12px;">
                            ${p.isPlayer ? `
                                <span style="font-size: 11px; color: var(--primary-cyan); font-weight: 700;">(Perusahaan Anda)</span>
                            ` : `
                                <button class="btn btn-sm btn-secondary" onclick="window.bizStages.launchTakeoverChallenge('${p.name}')">
                                    ⚔️ Tantang Takeover
                                </button>
                            `}
                        </td>
                    </tr>
                `;
            });
            lbTable.innerHTML = html;
        }
    }
}

window.bizStages = new BizStages();
