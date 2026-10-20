/**
 * BizVerse Business Simulation Engine
 * Manages economy, buildings, income calculations, boosts, upgrades, milestones
 */

class BizEngine {
    constructor() {
        this.saveKey = 'bizverse_save_data_v1';
        this.listeners = {};
        
        // Default initial state
        this.state = {
            cash: 15000,
            totalEarned: 15000,
            prestige: 1,
            reputation: 25,
            companyName: 'OmniCorp Global',
            ceoName: 'Alex Mercer',
            lastTickTime: Date.now(),
            clickPower: 50,
            isBoosted: false,
            boostTimeRemaining: 0,
            boostMultiplier: 2.5,
            boostCooldown: 0,
            stats: {
                totalClicks: 0,
                contractsDone: 0,
                tradesExecuted: 0,
                upgradesPurchased: 0,
                startedAt: Date.now()
            },
            buildings: {
                hq: {
                    id: 'hq',
                    name: 'Markas Besar Nexus',
                    tag: 'Pusat Komando Korporat',
                    level: 1,
                    baseCost: 2000,
                    costMult: 1.25,
                    baseRevenue: 25,
                    desc: 'Pusat saraf kekaisaran bisnis global Anda. Memberikan peningkatan total pendapatan perusahaan sebesar +10% per tingkat.',
                    color: '#00d2ff',
                    icon: 'building'
                },
                finance: {
                    id: 'finance',
                    name: 'Menara Finansial Apex',
                    tag: 'Modal Finansial Frekuensi Tinggi',
                    level: 0,
                    baseCost: 5000,
                    costMult: 1.28,
                    baseRevenue: 80,
                    desc: 'Perdagangan algoritmik dan manajemen kekayaan korporat. Menghasilkan dividen compound otomatis.',
                    color: '#00f5a0',
                    icon: 'trending-up'
                },
                rnd: {
                    id: 'rnd',
                    name: 'Matriks AI Kuantum',
                    tag: 'Laboratorium Deep Tech & AI',
                    level: 0,
                    baseCost: 18000,
                    costMult: 1.30,
                    baseRevenue: 240,
                    desc: 'Mengembangkan terobosan saraf digital dan algoritma kuantum berlisensi paten bernilai tinggi.',
                    color: '#9d4edd',
                    icon: 'cpu'
                },
                commerce: {
                    id: 'commerce',
                    name: 'Galleria Meta-Komersil',
                    tag: 'Pusat Ritel Digital Metaverse',
                    level: 0,
                    baseCost: 65000,
                    costMult: 1.32,
                    baseRevenue: 750,
                    desc: 'Pasar virtual omnichannel yang menyalurkan arus belanja konsumen langsung ke kas perusahaan.',
                    color: '#ff007f',
                    icon: 'shopping-bag'
                },
                logistics: {
                    id: 'logistics',
                    name: 'Pusat Logistik Otonom',
                    tag: 'Armada Pengiriman Drone',
                    level: 0,
                    baseCost: 220000,
                    costMult: 1.35,
                    baseRevenue: 2200,
                    desc: 'Koridor drone otomatis dan pelabuhan peti kemas robotik yang memangkas biaya distribusi ekspor.',
                    color: '#ffaa00',
                    icon: 'truck'
                },
                cloud: {
                    id: 'cloud',
                    name: 'Megaplex Server Awan',
                    tag: 'Infrastruktur Komputasi Skala Besar',
                    level: 0,
                    baseCost: 750000,
                    costMult: 1.38,
                    baseRevenue: 6800,
                    desc: 'Klaster server berpendingin cairan sub-zero yang menyewakan daya komputasi ke perusahaan Fortune 500.',
                    color: '#00e5ff',
                    icon: 'server'
                }
            },
            unlockedAchievements: []
        };

        this.achievements = [
            { id: 'first_blood', title: 'Venture Perdana', desc: 'Kumpulkan kas kasir $25,000', req: (s) => s.cash >= 25000, reward: 5000 },
            { id: 'six_figures', title: 'Centurion Bisnis', desc: 'Kumpulkan kas operasional $100,000', req: (s) => s.cash >= 100000, reward: 20000 },
            { id: 'millionaire', title: 'Status Unicorn', desc: 'Capai valuasi perusahaan sebesar $1,000,000', req: (s) => this.getValuation() >= 1000000, reward: 150000 },
            { id: 'all_sectors', title: 'Konglomerat Multi-Sektor', desc: 'Miliki minimal 1 gedung di setiap sektor kota', req: (s) => Object.values(s.buildings).every(b => b.level >= 1), reward: 50000 },
            { id: 'tech_titan', title: 'Raja Teknologi Kuantum', desc: 'Tingkatkan Matriks AI Kuantum ke Tingkat 5', req: (s) => s.buildings.rnd.level >= 5, reward: 100000 },
            { id: 'market_shark', title: 'Legenda Pasar Modal', desc: 'Eksekusi minimal 10 transaksi jual beli saham', req: (s) => s.stats.tradesExecuted >= 10, reward: 35000 }
        ];

        this.loadSave();
        this.startLoop();
    }

    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
        }
    }

    startLoop() {
        // High frequency game tick (100ms) for smooth animation, 1s for economy
        let lastSecond = Date.now();
        setInterval(() => {
            const now = Date.now();
            const deltaSec = (now - this.state.lastTickTime) / 1000;
            this.state.lastTickTime = now;

            // Handle active boost
            if (this.state.isBoosted) {
                this.state.boostTimeRemaining -= deltaSec;
                if (this.state.boostTimeRemaining <= 0) {
                    this.state.isBoosted = false;
                    this.state.boostTimeRemaining = 0;
                    this.state.boostCooldown = 45; // 45s cooldown
                    this.emit('boostEnd');
                }
            } else if (this.state.boostCooldown > 0) {
                this.state.boostCooldown = Math.max(0, this.state.boostCooldown - deltaSec);
            }

            // Calculate revenue this tick
            const rps = this.getRevenuePerSecond();
            const earnings = rps * deltaSec;
            if (earnings > 0) {
                this.state.cash += earnings;
                this.state.totalEarned += earnings;
            }

            // Check achievements
            this.checkAchievements();

            this.emit('tick', {
                deltaSec,
                cash: this.state.cash,
                rps,
                valuation: this.getValuation()
            });

            // Save every 5 seconds
            if (now - lastSecond >= 5000) {
                lastSecond = now;
                this.saveGame();
            }
        }, 100);
    }

    getRevenuePerSecond() {
        let baseRps = 0;
        for (const key in this.state.buildings) {
            const b = this.state.buildings[key];
            if (b.level > 0) {
                // Each level adds baseRevenue * level * scale
                baseRps += b.baseRevenue * b.level * (1 + (b.level - 1) * 0.15);
            }
        }

        // HQ synergy: each HQ level adds 10% to all output
        const hqBonus = 1 + (this.state.buildings.hq.level * 0.10);
        
        // Office staff perk bonus if office engine is loaded
        const officeMult = window.bizOffice ? window.bizOffice.getStaffBonus() : 1;

        // Private island business revenue
        const islandRps = window.bizIsland ? window.bizIsland.getIslandRevenuePerSec() : 0;

        let total = (baseRps * hqBonus * officeMult) + islandRps;

        if (this.state.isBoosted) {
            total *= this.state.boostMultiplier;
        }

        return total;
    }

    getBuildingUpgradeCost(buildingId) {
        const b = this.state.buildings[buildingId];
        if (!b) return Infinity;
        return Math.floor(b.baseCost * Math.pow(b.costMult, b.level));
    }

    upgradeBuilding(buildingId) {
        const b = this.state.buildings[buildingId];
        if (!b) return false;

        const cost = this.getBuildingUpgradeCost(buildingId);
        if (this.state.cash >= cost) {
            this.state.cash -= cost;
            b.level += 1;
            this.state.stats.upgradesPurchased += 1;

            if (window.bizAudio) window.bizAudio.playUpgrade();
            this.emit('buildingUpgraded', { buildingId, newLevel: b.level, cost });
            this.saveGame();
            return true;
        }
        return false;
    }

    venturePitchClick() {
        // Manual click power scales with HQ level and Valuation
        const hqLevel = this.state.buildings.hq.level;
        const clickValue = Math.max(50, Math.floor(50 * Math.pow(1.35, hqLevel - 1) * (this.state.isBoosted ? 2.5 : 1)));
        
        this.state.cash += clickValue;
        this.state.totalEarned += clickValue;
        this.state.stats.totalClicks += 1;

        if (window.bizAudio) window.bizAudio.playCash();
        this.emit('clickReward', { amount: clickValue });
        return clickValue;
    }

    activateBoost() {
        if (this.state.isBoosted || this.state.boostCooldown > 0) return false;
        this.state.isBoosted = true;
        this.state.boostTimeRemaining = 20; // 20 seconds duration
        if (window.bizAudio) window.bizAudio.playUpgrade();
        this.emit('boostStart');
        return true;
    }

    getValuation() {
        // Valuation = Cash + Portfolio Value + Asset Value of Buildings + Intellectual Property
        let buildingAssets = 0;
        for (const key in this.state.buildings) {
            const b = this.state.buildings[key];
            if (b.level > 0) {
                buildingAssets += b.baseCost * b.level * 2.2;
            }
        }

        let portfolioValue = 0;
        if (window.bizMarket) {
            portfolioValue = window.bizMarket.getPortfolioValue();
        }

        const ipValuation = (this.state.buildings.rnd.level * 45000) + (this.state.reputation * 1200);
        return Math.floor(this.state.cash + buildingAssets + portfolioValue + ipValuation);
    }

    getCorporateTier() {
        const val = this.getValuation();
        if (val < 50000) return { name: 'Perusahaan Rintisan (Startup)', tier: 1, badge: 'Startup', color: '#94a3b8' };
        if (val < 250000) return { name: 'Scaleup Modal Ventura', tier: 2, badge: 'Scaleup', color: '#38bdf8' };
        if (val < 1500000) return { name: 'Korporasi Menengah (Enterprise)', tier: 3, badge: 'Enterprise', color: '#4ade80' };
        if (val < 10000000) return { name: 'Konglomerat Blue-Chip', tier: 4, badge: 'Konglomerat', color: '#a855f7' };
        if (val < 50000000) return { name: 'Megacorp Multinasional', tier: 5, badge: 'Megacorp', color: '#f59e0b' };
        return { name: 'Sindikat Bisnis Antariksa', tier: 6, badge: 'Sindikat', color: '#f43f5e' };
    }

    checkAchievements() {
        this.achievements.forEach(ach => {
            if (!this.state.unlockedAchievements.includes(ach.id) && ach.req(this.state)) {
                this.state.unlockedAchievements.push(ach.id);
                this.state.cash += ach.reward;
                this.state.reputation += 15;
                if (window.bizAudio) window.bizAudio.playUpgrade();
                if (window.confetti) {
                    window.confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
                }
                this.emit('achievementUnlocked', ach);
            }
        });
    }

    saveGame() {
        try {
            localStorage.setItem(this.saveKey, JSON.stringify(this.state));
        } catch (e) {
            console.error('Save failed', e);
        }
    }

    loadSave() {
        try {
            const data = localStorage.getItem(this.saveKey);
            if (data) {
                const parsed = JSON.parse(data);
                // Deep merge to preserve schema updates
                this.state.cash = parsed.cash ?? this.state.cash;
                this.state.totalEarned = parsed.totalEarned ?? this.state.totalEarned;
                this.state.reputation = parsed.reputation ?? this.state.reputation;
                this.state.companyName = parsed.companyName ?? this.state.companyName;
                this.state.unlockedAchievements = parsed.unlockedAchievements ?? [];
                
                if (parsed.stats) {
                    this.state.stats = { ...this.state.stats, ...parsed.stats };
                }

                if (parsed.buildings) {
                    for (const key in this.state.buildings) {
                        if (parsed.buildings[key]) {
                            this.state.buildings[key].level = parsed.buildings[key].level ?? 0;
                        }
                    }
                }

                // Calculate offline progress
                const offlineSec = Math.min(86400 * 2, (Date.now() - (parsed.lastTickTime || Date.now())) / 1000);
                if (offlineSec > 10) {
                    const rps = this.getRevenuePerSecond();
                    const offlineEarnings = Math.floor(rps * offlineSec * 0.75); // 75% efficiency while away
                    if (offlineEarnings > 0) {
                        this.state.cash += offlineEarnings;
                        this.state.totalEarned += offlineEarnings;
                        setTimeout(() => {
                            this.emit('offlineGains', { seconds: Math.floor(offlineSec), amount: offlineEarnings });
                        }, 1200);
                    }
                }
            }
        } catch (e) {
            console.warn('Could not load previous save, using fresh state', e);
        }
    }

    resetGame() {
        localStorage.removeItem(this.saveKey);
        localStorage.removeItem('bizverse_market_portfolio');
        localStorage.removeItem('bizverse_office_staff');
        location.reload();
    }
}

window.bizEngine = new BizEngine();
