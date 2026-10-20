/**
 * BizVerse C-Suite Boardroom & Corporate Decision System
 * Executive AI Advisors, Strategic Dilemmas, and High-Yield B2B Enterprise Contracts.
 */

class BizBoardroom {
    constructor() {
        this.currentDilemma = null;
        this.dilemmaCooldown = 0;

        this.advisors = {
            cfo: {
                name: 'Elena Vance',
                title: 'Direktur Keuangan (CFO)',
                avatar: '👩‍💼',
                color: '#00f5a0',
                bio: 'Mantan mitra pengelola hedge fund Apex. Pakar manajemen likuiditas, restrukturisasi modal, dan ekspansi margin kas.',
                advice: [
                    'Cadangan kas kita sebaiknya selalu mencukupi biaya ekspansi minimal 5 menit ke depan. Jaga likuiditas!',
                    'Bursa Efek Apex memiliki volatilitas tinggi saat ini. Pertimbangkan mengambil untung pada aset teknologi.',
                    'Meningkatkan Menara Finansial memberikan dividen majemuk stabil yang menopang kas operasional.'
                ],
                actionName: 'Eksekusi Audit Finansial',
                actionCost: 10000,
                actionEffect: () => {
                    const bonus = Math.floor(window.bizEngine.state.cash * 0.08) + 5000;
                    window.bizEngine.state.cash += bonus;
                    return `Audit berhasil! Menemukan $${bonus.toLocaleString()} dari kredit pajak dan arbitrase kas!`;
                }
            },
            cto: {
                name: 'Dr. Kenji Sato',
                title: 'Direktur Teknologi (CTO)',
                avatar: '👨‍🔬',
                color: '#c084fc',
                bio: 'Mantan direktur laboratorium komputasi kuantum. Pelopor arsitektur jaringan saraf terdesentralisasi otonom.',
                advice: [
                    'Meningkatkan Matriks AI Kuantum membuka sinergi eksponensial di seluruh sektor operasional perusahaan.',
                    'Hambatan pengiriman data dapat diatasi dengan memperluas Megaplex Server Awan lebih dini.',
                    'Portofolio hak paten dan teknologi kita secara langsung melipatgandakan valuasi pasar konglomerat.'
                ],
                actionName: 'Overclock Pipeline AI',
                actionCost: 25000,
                actionEffect: () => {
                    window.bizEngine.state.buildings.rnd.baseRevenue += 35;
                    return `Optimalisasi pipeline saraf kuantum berhasil! Pendapatan basis AI meningkat permanen +$35/s!`;
                }
            },
            cmo: {
                name: 'Maya Lin',
                title: 'Direktur Pemasaran (CMO)',
                avatar: '👩‍🎤',
                color: '#ff007f',
                bio: 'Arsitek merek metaverse yang menghasilkan 400 juta impresi viral untuk konglomerat global.',
                advice: [
                    'Reputasi tinggi membuka akses ke kontrak pemerintah bernilai jutaan dollar. Jaga citra publik kita!',
                    'Momen Viral Blitz yang tepat saat puncak pasar dapat melipatgandakan arus kas masuk secara instan.',
                    'Gerai toko di Galleria Meta-Komersil merespons sangat positif kampanye iklan hologram berskala besar.'
                ],
                actionName: 'Kampanye PR Hologram Global',
                actionCost: 15000,
                actionEffect: () => {
                    window.bizEngine.state.reputation += 20;
                    window.bizEngine.activateBoost();
                    return `Tren global nomor 1 tercapai! Reputasi +20 dan pengali pendapatan 2.5x Viral Blitz aktif!`;
                }
            }
        };

        this.dilemmas = [
            {
                id: 'takeover_bid',
                title: 'Upaya Pengambilalihan Paksa (Hostile Takeover)',
                desc: 'Sebuah konglomerat saingan melancarkan tawaran tender terbuka agresif untuk membeli 15% saham Anda.',
                choiceA: {
                    text: 'Terapkan Pertahanan Poison Pill (Biaya $40,000)',
                    cost: 40000,
                    effect: (e) => {
                        e.state.reputation += 35;
                        return 'Upaya pengambilalihan paksa berhasil digagalkan! Otonomi korporat aman dan investor semakin percaya!';
                    }
                },
                choiceB: {
                    text: 'Terima Kompensasi Golden Parachute',
                    cost: 0,
                    effect: (e) => {
                        e.state.cash += 95000;
                        e.state.reputation -= 15;
                        return 'Melepas aset non-inti dan menerima $95,000 tunai, meskipun reputasi korporat sedikit menurun.';
                    }
                }
            },
            {
                id: 'quantum_breakthrough',
                title: 'Anomali Penemuan Kuantum',
                desc: 'Ilmuwan R&D Anda menemukan formula superkonduktivitas kuantum suhu ruang yang belum pernah ada sebelumnya.',
                choiceA: {
                    text: 'Patenkan & Monopoli Teknologi Secara Eksklusif (Biaya $20,000)',
                    cost: 20000,
                    effect: (e) => {
                        e.state.buildings.rnd.baseRevenue += 60;
                        return 'Paten eksklusif terdaftar! Pendapatan sektor AI Kuantum melonjak +$60/s!';
                    }
                },
                choiceB: {
                    text: 'Buka Sebagai Open-Source untuk Ekosistem Global',
                    cost: 0,
                    effect: (e) => {
                        e.state.reputation += 50;
                        e.state.cash += 30000;
                        return 'Komunitas metaverse memuji langkah Anda! Memperoleh hibah penelitian $30,000 dan reputasi +50!';
                    }
                }
            },
            {
                id: 'metaverse_hack',
                title: 'Peringatan Serangan Siber Ransomware',
                desc: 'Kelompok peretas desentralisasi mencoba menembus perimeter keamanan Megaplex Server Awan.',
                choiceA: {
                    text: 'Kerahkan Kontra-Intrusi White-Hat (Biaya $25,000)',
                    cost: 25000,
                    effect: (e) => {
                        e.state.reputation += 25;
                        return 'Peretas dinetralkan seketika! Seluruh data server aman tanpa gangguan operasional.';
                    }
                },
                choiceB: {
                    text: 'Isolasi Jaringan & Mulai Ulang Klaster Server',
                    cost: 0,
                    effect: (e) => {
                        const loss = Math.floor(e.state.cash * 0.05);
                        e.state.cash -= loss;
                        return `Mengalami friksi operasional $${loss.toLocaleString()} saat reboot server, tetapi terhindar dari kebocoran data.`;
                    }
                }
            }
        ];

        this.contracts = [
            { id: 'c1', title: 'Migrasi Sistem Inti Perbankan Global', client: 'Bank Sentral Aether', payout: 35000, reqValuation: 50000, reqStaff: 3, completed: false },
            { id: 'c2', title: 'Jaringan Manajemen Lalu Lintas Otonom', client: 'Pemerintah Kota Neo-Tokyo', payout: 120000, reqValuation: 200000, reqStaff: 8, completed: false },
            { id: 'c3', title: 'Firewall Satelit Pertahanan Orbital', client: 'Pakta Pertahanan Solaris', payout: 450000, reqValuation: 800000, reqStaff: 15, completed: false },
            { id: 'c4', title: 'Otomasi AI Rantai Pasok Antariksa', client: 'Konsorsium Logistik Antarbintang', payout: 1500000, reqValuation: 3000000, reqStaff: 25, completed: false }
        ];

        this.startDilemmaScheduler();
    }

    startDilemmaScheduler() {
        // Trigger a random strategic corporate dilemma every 60-90 seconds
        setInterval(() => {
            if (!this.currentDilemma && Math.random() < 0.25) {
                this.triggerRandomDilemma();
            }
        }, 15000);
    }

    triggerRandomDilemma() {
        const item = this.dilemmas[Math.floor(Math.random() * this.dilemmas.length)];
        this.currentDilemma = item;
        if (window.bizAudio) window.bizAudio.playAlert();
        this.renderDilemmaModal();
    }

    renderDilemmaModal() {
        const modal = document.getElementById('dilemma-modal');
        if (!modal || !this.currentDilemma) return;

        const d = this.currentDilemma;
        document.getElementById('dilemma-title').textContent = d.title;
        document.getElementById('dilemma-desc').textContent = d.desc;
        document.getElementById('dilemma-choice-a').textContent = d.choiceA.text;
        document.getElementById('dilemma-choice-b').textContent = d.choiceB.text;

        modal.classList.add('active');
    }

    resolveDilemma(choiceKey) {
        if (!this.currentDilemma || !window.bizEngine) return;
        const choice = choiceKey === 'A' ? this.currentDilemma.choiceA : this.currentDilemma.choiceB;

        if (choice.cost && window.bizEngine.state.cash < choice.cost) {
            if (window.bizApp) window.bizApp.showToast('Insufficient cash for this strategic decision!', 'error');
            return;
        }

        if (choice.cost) {
            window.bizEngine.state.cash -= choice.cost;
        }

        const resultText = choice.effect(window.bizEngine);
        if (window.bizAudio) window.bizAudio.playCash();

        const modal = document.getElementById('dilemma-modal');
        if (modal) modal.classList.remove('active');
        this.currentDilemma = null;

        if (window.bizApp) {
            window.bizApp.showToast(resultText, 'success');
        }
    }

    consultAdvisor(advisorKey) {
        const adv = this.advisors[advisorKey];
        if (!adv || !window.bizEngine) return;

        if (window.bizEngine.state.cash >= adv.actionCost) {
            window.bizEngine.state.cash -= adv.actionCost;
            const res = adv.actionEffect();
            if (window.bizAudio) window.bizAudio.playUpgrade();
            if (window.bizApp) window.bizApp.showToast(res, 'success');
            this.updateUI();
        } else {
            if (window.bizApp) window.bizApp.showToast(`Requires $${adv.actionCost.toLocaleString()} to authorize!`, 'error');
        }
    }

    executeContract(contractId) {
        const c = this.contracts.find(x => x.id === contractId);
        if (!c || c.completed || !window.bizEngine) return;

        const val = window.bizEngine.getValuation();
        const staff = window.bizOffice ? window.bizOffice.getTotalStaffCount() : 0;

        if (val < c.reqValuation || staff < c.reqStaff) {
            if (window.bizApp) window.bizApp.showToast('Requirements not met for this enterprise contract!', 'error');
            return;
        }

        c.completed = true;
        window.bizEngine.state.cash += c.payout;
        window.bizEngine.state.reputation += 30;
        window.bizEngine.state.stats.contractsDone += 1;

        if (window.bizAudio) window.bizAudio.playUpgrade();
        if (window.confetti) window.confetti({ particleCount: 70, spread: 70 });
        if (window.bizApp) window.bizApp.showToast(`Contract Fulfilled! Earned $${c.payout.toLocaleString()}`, 'success');

        this.updateUI();
    }

    updateUI() {
        // Render advisors cards
        const advContainer = document.getElementById('advisors-grid');
        if (advContainer) {
            let html = '';
            for (const k in this.advisors) {
                const a = this.advisors[k];
                const quote = a.advice[Math.floor(Math.random() * a.advice.length)];
                const canAfford = window.bizEngine && window.bizEngine.state.cash >= a.actionCost;
                html += `
                    <div class="advisor-card" style="border-top-color: ${a.color}">
                        <div class="advisor-header">
                            <div class="advisor-avatar">${a.avatar}</div>
                            <div>
                                <h4 class="advisor-name">${a.name}</h4>
                                <div class="advisor-role" style="color: ${a.color}">${a.title}</div>
                            </div>
                        </div>
                        <p class="advisor-quote">"${quote}"</p>
                        <button class="btn btn-sm ${canAfford ? 'btn-primary' : 'btn-disabled'}"
                                onclick="window.bizBoardroom.consultAdvisor('${k}')">
                            ${a.actionName} ($${a.actionCost.toLocaleString()})
                        </button>
                    </div>
                `;
            }
            advContainer.innerHTML = html;
        }

        // Render corporate contracts
        const contractsEl = document.getElementById('contracts-list');
        if (contractsEl) {
            let html = '';
            const currentVal = window.bizEngine ? window.bizEngine.getValuation() : 0;
            const currentStaff = window.bizOffice ? window.bizOffice.getTotalStaffCount() : 0;

            this.contracts.forEach(c => {
                const ready = currentVal >= c.reqValuation && currentStaff >= c.reqStaff;
                html += `
                    <div class="contract-card ${c.completed ? 'completed' : ''}">
                        <div class="contract-header">
                            <div>
                                <span class="contract-client">${c.client}</span>
                                <h4 class="contract-title">${c.title}</h4>
                            </div>
                            <div class="contract-payout">+$${c.payout.toLocaleString()}</div>
                        </div>
                        <div class="contract-reqs">
                            <span class="${currentVal >= c.reqValuation ? 'req-met' : 'req-unmet'}">Valuation: $${c.reqValuation.toLocaleString()}</span>
                            <span class="${currentStaff >= c.reqStaff ? 'req-met' : 'req-unmet'}">Workforce: ${c.reqStaff} Staff</span>
                        </div>
                        <button class="btn btn-sm ${c.completed ? 'btn-success' : (ready ? 'btn-primary' : 'btn-disabled')}"
                                ${c.completed ? 'disabled' : ''}
                                onclick="window.bizBoardroom.executeContract('${c.id}')">
                            ${c.completed ? '✓ Fulfilled' : (ready ? 'Sign Contract' : 'Requirements Incomplete')}
                        </button>
                    </div>
                `;
            });
            contractsEl.innerHTML = html;
        }
    }
}

window.bizBoardroom = new BizBoardroom();
