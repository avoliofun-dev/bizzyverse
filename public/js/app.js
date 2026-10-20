/**
 * BizVerse Main Application Orchestrator
 * Coordinates UI navigation, Building Inspector Drawer, Modals,
 * Language Switching (ID / EN), Floating Click Particles, and Toasts.
 */

class BizApp {
    constructor() {
        this.currentTab = 'city';
        this.lang = localStorage.getItem('bizverse_lang') || 'id'; // default ID (Indonesian) as requested!
        this.activeBuildingId = null;

        this.translations = {
            id: {
                appName: 'BIZVERSE',
                appTag: 'Dunia Bisnis Virtual & Simulasi Metaverse',
                treasury: 'Kas Perusahaan',
                valuation: 'Valuasi Pasar',
                revenue: 'Arus Kas',
                workforce: 'Tenaga Kerja',
                prestige: 'Reputasi',
                pitchBtn: '🚀 Pitch Investor (+$$)',
                boostBtn: '⚡ Viral Blitz',
                tabCity: '🏙️ Metropolis 3D',
                tabMarket: '📈 Bursa Apex',
                tabOffice: '🏢 Kantor Virtual',
                tabBoardroom: '👔 Dewan Direksi & Kontrak',
                tabLedger: '📊 Laporan Keuangan',
                inspectTitle: 'Inspeksi Sektor Bisnis',
                upgradeBtn: 'Tingkatkan Sektor',
                level: 'Tingkat',
                currentRev: 'Pendapatan Saat Ini',
                nextRev: 'Setelah Upgrade',
                cost: 'Biaya Upgrade',
                close: 'Tutup',
                dayNight: 'Mode Siang/Malam',
                autoRotate: 'Putar Otomatis',
                resetCam: 'Reset Kamera',
                newsTitle: 'WARTA PASAR TERKINI',
                buy: 'Beli',
                sell: 'Jual',
                sharesOwned: 'Saham Dimiliki',
                avgCost: 'Harga Rata-rata',
                unrealizedPnl: 'Keuntungan / Kerugian',
                advisorsTitle: 'Penasihat Eksekutif AI (C-Suite)',
                contractsTitle: 'Kontrak Bisnis B2B',
                offlineWelcome: 'Selamat datang kembali, CEO! Bisnis Anda terus berjalan saat Anda offline:',
                collectGains: 'Klaim Pendapatan'
            },
            en: {
                appName: 'BIZVERSE',
                appTag: 'Virtual Business World & Metaverse Tycoon',
                treasury: 'Treasury Cash',
                valuation: 'Market Valuation',
                revenue: 'Cash Velocity',
                workforce: 'Workforce',
                prestige: 'Prestige',
                pitchBtn: '🚀 Investor Pitch (+$$)',
                boostBtn: '⚡ Viral Blitz',
                tabCity: '🏙️ 3D Metropolis',
                tabMarket: '📈 Apex Exchange',
                tabOffice: '🏢 Virtual Office',
                tabBoardroom: '👔 C-Suite & Contracts',
                tabLedger: '📊 Financial Ledger',
                inspectTitle: 'Sector Inspector',
                upgradeBtn: 'Upgrade Sector',
                level: 'Level',
                currentRev: 'Current Revenue',
                nextRev: 'Post-Upgrade',
                cost: 'Upgrade Cost',
                close: 'Close',
                dayNight: 'Day/Night Mode',
                autoRotate: 'Auto Rotate',
                resetCam: 'Reset Camera',
                newsTitle: 'LIVE MARKET WIRE',
                buy: 'Buy',
                sell: 'Sell',
                sharesOwned: 'Shares Owned',
                avgCost: 'Average Cost',
                unrealizedPnl: 'Unrealized P&L',
                advisorsTitle: 'Executive AI C-Suite Advisors',
                contractsTitle: 'B2B Enterprise Contracts',
                offlineWelcome: 'Welcome back, CEO! Your enterprise generated revenue while you were away:',
                collectGains: 'Claim Earnings'
            }
        };

        this.init();
    }

    init() {
        // Setup tabs
        document.querySelectorAll('.nav-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = btn.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });

        // Initialize 3D City
        window.bizCity = new BizCity3D('metropolis-canvas-container');

        // Initialize Private Island on demand
        setTimeout(() => {
            if (!window.bizIsland && document.getElementById('island-canvas-container')) {
                window.bizIsland = new BizIsland3D('island-canvas-container');
                window.bizIsland.updateUI();
            }
        }, 300);

        // Setup Engine Tick Listener for UI updates
        if (window.bizEngine) {
            window.bizEngine.on('tick', (data) => this.onTick(data));
            window.bizEngine.on('clickReward', (data) => this.onClickReward(data));
            window.bizEngine.on('boostStart', () => this.onBoostStart());
            window.bizEngine.on('boostEnd', () => this.onBoostEnd());
            window.bizEngine.on('offlineGains', (data) => this.showOfflineModal(data));
            window.bizEngine.on('achievementUnlocked', (ach) => {
                this.showToast(`🏆 Milestone Unlocked: ${ach.title}! (+$${ach.reward.toLocaleString()})`, 'success');
            });
        }

        // Apply localization
        this.applyLanguage();

        // Initialize Market, Office, Boardroom, Social, P2P once DOM is ready
        setTimeout(() => {
            if (window.bizMarket) {
                window.bizMarket.initChart('stock-price-chart');
                window.bizMarket.updateUI();
            }
            if (window.bizOffice) {
                window.bizOffice.initCanvas('office-canvas');
                window.bizOffice.updateUI();
            }
            if (window.bizBoardroom) {
                window.bizBoardroom.updateUI();
            }
            if (window.bizSocial) {
                window.bizSocial.updateUI();
            }
            if (window.bizP2PMarket) {
                window.bizP2PMarket.updateUI();
            }
            if (window.bizAuth) {
                window.bizAuth.updateUI();
            }
        }, 200);

        // Setup global chat submit listener
        const chatForm = document.getElementById('form-global-chat');
        if (chatForm) {
            chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const input = document.getElementById('input-chat-message');
                if (input && input.value) {
                    window.bizSocial.sendMessage(input.value);
                    input.value = '';
                }
            });
        }
    }

    switchTab(tabId) {
        if (this.currentTab === tabId) return;
        this.currentTab = tabId;

        if (window.bizAudio) window.bizAudio.playClick();

        document.querySelectorAll('.nav-tab-btn').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-tab') === tabId);
        });

        document.querySelectorAll('.tab-view-panel').forEach(p => {
            p.classList.toggle('active', p.id === `view-${tabId}`);
        });

        // Resize 3D City or Island canvas depending on active tab
        if (tabId === 'city' && window.bizCity) {
            window.bizCity.onWindowResize();
        }
        if (tabId === 'island') {
            if (window.bizIsland) {
                window.bizIsland.onWindowResize();
                window.bizIsland.updateUI();
            }
        }
        if (tabId === 'social' && window.bizSocial) {
            window.bizSocial.updateUI();
        }
        if (tabId === 'p2p' && window.bizP2PMarket) {
            window.bizP2PMarket.updateUI();
        }
        if (tabId === 'office' && window.bizOffice) {
            window.bizOffice.resizeCanvas();
        }

        // Close sidebar upon selecting tab for distraction-free view
        this.closeSidebar();
    }

    toggleSidebar() {
        const sidebar = document.getElementById('left-app-sidebar');
        const overlay = document.getElementById('sidebar-backdrop');
        if (!sidebar) return;
        const isOpen = sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('active', isOpen);
        if (window.bizAudio) window.bizAudio.playClick();
    }

    closeSidebar() {
        const sidebar = document.getElementById('left-app-sidebar');
        const overlay = document.getElementById('sidebar-backdrop');
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
    }

    toggleFullscreen() {
        const btn = document.getElementById('btn-fullscreen-toggle');
        if (!document.fullscreenElement) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().then(() => {
                    if (btn) btn.innerHTML = '🗗 <span>Layar Normal</span>';
                    this.showToast('Mode Layar Penuh Diaktifkan', 'info');
                }).catch(() => {});
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().then(() => {
                    if (btn) btn.innerHTML = '⛶ <span>Layar Penuh</span>';
                }).catch(() => {});
            }
        }
    }

    toggleLanguage() {
        this.lang = this.lang === 'id' ? 'en' : 'id';
        localStorage.setItem('bizverse_lang', this.lang);
        this.applyLanguage();
        if (window.bizAudio) window.bizAudio.playClick();
    }

    applyLanguage() {
        const t = this.translations[this.lang];
        const langBtn = document.getElementById('btn-lang-toggle');
        if (langBtn) langBtn.textContent = this.lang === 'id' ? '🇮🇩 ID' : '🇺🇸 EN';

        // Apply text to data-i18n elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) {
                el.textContent = t[key];
            }
        });
    }

    onTick(data) {
        // Smoothly format top telemetry
        const cashEl = document.getElementById('stat-cash');
        const valEl = document.getElementById('stat-valuation');
        const revEl = document.getElementById('stat-rev');
        const tierEl = document.getElementById('stat-tier');

        if (cashEl) cashEl.textContent = `$${Math.floor(data.cash).toLocaleString()}`;
        if (valEl) valEl.textContent = `$${Math.floor(data.valuation).toLocaleString()}`;
        if (revEl) {
            const sign = data.rps >= 0 ? '+' : '';
            revEl.textContent = `${sign}$${Math.floor(data.rps).toLocaleString()}/s`;
        }

        if (tierEl && window.bizEngine) {
            const tier = window.bizEngine.getCorporateTier();
            tierEl.textContent = tier.name;
            tierEl.style.color = tier.color;
        }

        // Update boost button timer if cooling down or running
        const boostBtn = document.getElementById('btn-viral-boost');
        if (boostBtn && window.bizEngine) {
            if (window.bizEngine.state.isBoosted) {
                boostBtn.disabled = true;
                boostBtn.classList.add('boost-active');
                boostBtn.textContent = `⚡ 2.5x (${Math.ceil(window.bizEngine.state.boostTimeRemaining)}s)`;
            } else if (window.bizEngine.state.boostCooldown > 0) {
                boostBtn.disabled = true;
                boostBtn.classList.remove('boost-active');
                boostBtn.textContent = `⏳ CD (${Math.ceil(window.bizEngine.state.boostCooldown)}s)`;
            } else {
                boostBtn.disabled = false;
                boostBtn.classList.remove('boost-active');
                boostBtn.textContent = this.translations[this.lang].boostBtn;
            }
        }

        // If building inspector is currently open, live update its button and metrics
        if (this.activeBuildingId) {
            this.refreshBuildingInspector();
        }

        // Live update financial ledger if open or on periodic tick
        this.updateLedgerAndAchievements();

        // Live track 4-Stage Executive Roadmap progress
        if (window.bizStages) {
            window.bizStages.checkStageProgress();
        }
    }

    updateLedgerAndAchievements() {
        if (!window.bizEngine) return;
        const s = window.bizEngine.state;

        const lCash = document.getElementById('ledger-cash');
        const lPort = document.getElementById('ledger-portfolio');
        const lBldg = document.getElementById('ledger-buildings');
        const lIp = document.getElementById('ledger-ip');
        const lTotal = document.getElementById('ledger-total-val');

        let bldgVal = 0;
        for (const k in s.buildings) {
            bldgVal += s.buildings[k].baseCost * s.buildings[k].level * 2.2;
        }

        const portVal = window.bizMarket ? window.bizMarket.getPortfolioValue() : 0;
        const ipVal = (s.buildings.rnd.level * 45000) + (s.reputation * 1200);
        const totalVal = window.bizEngine.getValuation();

        if (lCash) lCash.textContent = `$${Math.floor(s.cash).toLocaleString()}`;
        if (lPort) lPort.textContent = `$${portVal.toLocaleString()}`;
        if (lBldg) lBldg.textContent = `$${Math.floor(bldgVal).toLocaleString()}`;
        if (lIp) lIp.textContent = `$${ipVal.toLocaleString()}`;
        if (lTotal) lTotal.textContent = `$${totalVal.toLocaleString()}`;

        // Render milestones
        const mList = document.getElementById('milestones-list');
        if (mList && mList.childElementCount === 0) {
            let html = '';
            window.bizEngine.achievements.forEach(ach => {
                const unlocked = s.unlockedAchievements.includes(ach.id);
                html += `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: rgba(30, 41, 59, 0.4); border: 1px solid var(--border-subtle); border-radius: 8px;">
                        <div>
                            <div style="font-weight: 700; font-size: 13px; color: ${unlocked ? 'var(--primary-emerald)' : 'var(--text-muted)'};">
                                ${unlocked ? '🏆' : '🔒'} ${ach.title}
                            </div>
                            <div style="font-size: 11px; color: var(--text-dim);">${ach.desc}</div>
                        </div>
                        <span style="font-family: var(--font-mono); font-size: 12px; color: ${unlocked ? 'var(--primary-emerald)' : 'var(--accent-amber)'}; font-weight: 700;">
                            ${unlocked ? '✓ Unlocked' : `+$${ach.reward.toLocaleString()}`}
                        </span>
                    </div>
                `;
            });
            mList.innerHTML = html;
        }
    }

    onClickReward(data) {
        // Floating +$$$ particle at cursor
        const particle = document.createElement('div');
        particle.className = 'floating-cash-particle';
        particle.textContent = `+$${data.amount.toLocaleString()}`;
        
        // Center near pitch button or screen center
        const pitchBtn = document.getElementById('btn-pitch');
        const rect = pitchBtn ? pitchBtn.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2 };
        const randX = (Math.random() - 0.5) * 80;
        particle.style.left = `${rect.left + 50 + randX}px`;
        particle.style.top = `${rect.top - 10}px`;

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 900);
    }

    onBoostStart() {
        this.showToast('🚀 VIRAL BLITZ ACTIVATED! 2.5x Global Revenue!', 'success');
        document.body.classList.add('blitz-mode');
    }

    onBoostEnd() {
        this.showToast('Viral Blitz expired. Cooling down systems.', 'info');
        document.body.classList.remove('blitz-mode');
    }

    openBuildingInspector(buildingId) {
        this.activeBuildingId = buildingId;
        const drawer = document.getElementById('building-inspector-drawer');
        if (!drawer) return;

        this.refreshBuildingInspector();
        drawer.classList.add('open');
    }

    closeBuildingInspector() {
        this.activeBuildingId = null;
        const drawer = document.getElementById('building-inspector-drawer');
        if (drawer) drawer.classList.remove('open');
    }

    refreshBuildingInspector() {
        if (!this.activeBuildingId || !window.bizEngine) return;
        const b = window.bizEngine.state.buildings[this.activeBuildingId];
        if (!b) return;

        const cost = window.bizEngine.getBuildingUpgradeCost(this.activeBuildingId);
        const canAfford = window.bizEngine.state.cash >= cost;
        const currentRev = b.level * b.baseRevenue;
        const nextRev = (b.level + 1) * b.baseRevenue;

        document.getElementById('inspector-building-name').textContent = b.name;
        document.getElementById('inspector-building-tag').textContent = b.tag;
        document.getElementById('inspector-building-desc').textContent = b.desc;
        document.getElementById('inspector-level').textContent = `Lvl ${b.level}`;
        document.getElementById('inspector-current-rev').textContent = `+$${currentRev.toLocaleString()}/s`;
        document.getElementById('inspector-next-rev').textContent = `+$${nextRev.toLocaleString()}/s`;
        document.getElementById('inspector-cost').textContent = `$${cost.toLocaleString()}`;

        const upgradeBtn = document.getElementById('btn-inspector-upgrade');
        if (upgradeBtn) {
            upgradeBtn.disabled = !canAfford;
            upgradeBtn.className = `btn btn-lg ${canAfford ? 'btn-primary' : 'btn-disabled'}`;
        }
    }

    upgradeActiveBuilding() {
        if (!this.activeBuildingId || !window.bizEngine) return;
        const success = window.bizEngine.upgradeBuilding(this.activeBuildingId);
        if (success) {
            this.refreshBuildingInspector();
            this.showToast(`${window.bizEngine.state.buildings[this.activeBuildingId].name} Upgraded!`, 'success');
        } else {
            this.showToast('Dana kas tidak mencukupi!', 'error');
        }
    }

    showOfflineModal(data) {
        const modal = document.getElementById('offline-modal');
        if (!modal) return;
        const t = this.translations[this.lang];
        document.getElementById('offline-amount').textContent = `+$${data.amount.toLocaleString()}`;
        document.getElementById('offline-time').textContent = `${Math.floor(data.seconds / 60)} minutes`;
        modal.classList.add('active');
    }

    closeOfflineModal() {
        const modal = document.getElementById('offline-modal');
        if (modal) modal.classList.remove('active');
        if (window.bizAudio) window.bizAudio.playCash();
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `biz-toast ${type}`;
        toast.textContent = message;

        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            setTimeout(() => toast.remove(), 400);
        }, 3200);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.bizApp = new BizApp();
});
