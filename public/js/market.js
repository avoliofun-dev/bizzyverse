/**
 * BizVerse Apex Financial Exchange & Stock Market Engine
 * Real-time asset simulation with live Chart.js rendering, order execution,
 * portfolio tracking, and market news flash triggers.
 */

class BizMarket {
    constructor() {
        this.saveKey = 'bizverse_market_portfolio';
        this.selectedSymbol = 'NRTX';
        this.chart = null;

        this.stocks = {
            NRTX: {
                symbol: 'NRTX',
                name: 'NeuroTech Bio-AI',
                sector: 'Komputasi Saraf & Bioteknologi',
                price: 142.50,
                basePrice: 140.00,
                history: [138, 139, 141, 140, 143, 142, 144, 142.5],
                volatility: 0.025,
                color: '#00f5a0',
                change24h: 3.2
            },
            HYPR: {
                symbol: 'HYPR',
                name: 'Hyperion Fusion',
                sector: 'Energi Bersih & Propulsi Fusi',
                price: 310.20,
                basePrice: 300.00,
                history: [298, 302, 305, 309, 312, 310, 311, 310.2],
                volatility: 0.035,
                color: '#38bdf8',
                change24h: 1.8
            },
            AETR: {
                symbol: 'AETR',
                name: 'Aether Cloud Grid',
                sector: 'Jaringan Server Awan Terdesentralisasi',
                price: 88.40,
                basePrice: 85.00,
                history: [82, 84, 86, 85, 87, 89, 88.4],
                volatility: 0.04,
                color: '#c084fc',
                change24h: -1.2
            },
            QNTM: {
                symbol: 'QNTM',
                name: 'Quantum Freight',
                sector: 'Rantai Pasok Kuantum Otonom',
                price: 45.60,
                basePrice: 44.00,
                history: [42, 43, 44, 43.5, 45, 46, 45.6],
                volatility: 0.02,
                color: '#fbbf24',
                change24h: 4.5
            },
            SOLA: {
                symbol: 'SOLA',
                name: 'Solaris Orbital',
                sector: 'Manufaktur & Energi Antariksa',
                price: 520.00,
                basePrice: 500.00,
                history: [490, 505, 510, 515, 522, 518, 520.0],
                volatility: 0.045,
                color: '#f43f5e',
                change24h: 6.1
            }
        };

        this.portfolio = {
            NRTX: { shares: 0, avgPrice: 0 },
            HYPR: { shares: 0, avgPrice: 0 },
            AETR: { shares: 0, avgPrice: 0 },
            QNTM: { shares: 0, avgPrice: 0 },
            SOLA: { shares: 0, avgPrice: 0 }
        };

        this.newsHeadlines = [
            { text: 'Aether Cloud mengumumkan protokol Enkripsi Kuantum untuk perbankan korporat', impactSymbol: 'AETR', impact: 0.06 },
            { text: 'Hyperion Fusion mencapai pencapaian fusi bersih di fasilitas Antartika', impactSymbol: 'HYPR', impact: 0.08 },
            { text: 'Regulator menyetujui uji coba chip saraf NeuroTech; saham melonjak naik', impactSymbol: 'NRTX', impact: 0.05 },
            { text: 'Quantum Freight mengerahkan 5.000 drone kargo otonom di koridor pasifik', impactSymbol: 'QNTM', impact: 0.05 },
            { text: 'Solaris Orbital memenangkan kontrak penambangan asteroid senilai $1.2B', impactSymbol: 'SOLA', impact: 0.09 },
            { text: 'Bank Sentral memangkas suku bunga diskonto virtual; aset teknologi menguat', impactSymbol: 'HYPR', impact: 0.03 }
        ];

        this.loadPortfolio();
        this.startMarketLoop();
    }

    loadPortfolio() {
        try {
            const data = localStorage.getItem(this.saveKey);
            if (data) {
                const parsed = JSON.parse(data);
                for (const sym in this.portfolio) {
                    if (parsed[sym]) {
                        this.portfolio[sym] = parsed[sym];
                    }
                }
            }
        } catch (e) {}
    }

    savePortfolio() {
        try {
            localStorage.setItem(this.saveKey, JSON.stringify(this.portfolio));
        } catch (e) {}
    }

    getPortfolioValue() {
        let total = 0;
        for (const sym in this.portfolio) {
            const p = this.portfolio[sym];
            const stock = this.stocks[sym];
            if (p.shares > 0 && stock) {
                total += p.shares * stock.price;
            }
        }
        return Math.floor(total);
    }

    startMarketLoop() {
        // Ticking every 2.5 seconds
        setInterval(() => {
            for (const sym in this.stocks) {
                const s = this.stocks[sym];
                // Stochastic Brownian walk
                const delta = (Math.random() - 0.49) * s.volatility * s.price;
                s.price = Math.max(5.00, +(s.price + delta).toFixed(2));
                s.history.push(s.price);
                if (s.history.length > 20) s.history.shift();

                // Compute 24h change
                const openPrice = s.history[0];
                s.change24h = +(((s.price - openPrice) / openPrice) * 100).toFixed(2);
            }

            // Random market news flash every ~25 ticks
            if (Math.random() < 0.08) {
                this.triggerRandomNews();
            }

            this.updateUI();
        }, 2500);
    }

    triggerRandomNews() {
        const item = this.newsHeadlines[Math.floor(Math.random() * this.newsHeadlines.length)];
        const stock = this.stocks[item.impactSymbol];
        if (stock) {
            stock.price = +(stock.price * (1 + item.impact)).toFixed(2);
            stock.history.push(stock.price);
            if (stock.history.length > 20) stock.history.shift();
        }

        const newsEl = document.getElementById('market-news-ticker');
        if (newsEl) {
            newsEl.innerHTML = `<span class="news-tag">BREAKING NEWS</span> ${item.text}`;
            newsEl.classList.remove('pulse-news');
            void newsEl.offsetWidth; // re-trigger animation
            newsEl.classList.add('pulse-news');
        }
    }

    selectStock(symbol) {
        if (!this.stocks[symbol]) return;
        this.selectedSymbol = symbol;
        if (window.bizAudio) window.bizAudio.playClick();
        this.renderChart();
        this.updateUI();
    }

    buyStock(symbol, amount) {
        const stock = this.stocks[symbol];
        if (!stock || !window.bizEngine) return false;

        const maxAffordable = Math.floor(window.bizEngine.state.cash / stock.price);
        let qty = amount === 'max' ? maxAffordable : parseInt(amount, 10);
        if (qty <= 0) return false;

        const totalCost = qty * stock.price;
        if (window.bizEngine.state.cash >= totalCost) {
            window.bizEngine.state.cash -= totalCost;
            
            const current = this.portfolio[symbol];
            const currentTotalVal = current.shares * current.avgPrice;
            const newTotalVal = currentTotalVal + totalCost;
            current.shares += qty;
            current.avgPrice = +(newTotalVal / current.shares).toFixed(2);

            window.bizEngine.state.stats.tradesExecuted += 1;
            if (window.bizAudio) window.bizAudio.playTrade(true);
            this.savePortfolio();
            this.updateUI();
            return true;
        }
        return false;
    }

    sellStock(symbol, amount) {
        const stock = this.stocks[symbol];
        const current = this.portfolio[symbol];
        if (!stock || !current || current.shares <= 0 || !window.bizEngine) return false;

        let qty = amount === 'all' ? current.shares : Math.min(current.shares, parseInt(amount, 10));
        if (qty <= 0) return false;

        const proceeds = qty * stock.price;
        window.bizEngine.state.cash += proceeds;
        current.shares -= qty;
        if (current.shares === 0) current.avgPrice = 0;

        window.bizEngine.state.stats.tradesExecuted += 1;
        const isProfit = stock.price >= current.avgPrice;
        if (window.bizAudio) window.bizAudio.playTrade(isProfit);
        this.savePortfolio();
        this.updateUI();
        return true;
    }

    initChart(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx || !window.Chart) return;

        const stock = this.stocks[this.selectedSymbol];
        const labels = stock.history.map((_, i) => `${i + 1}m`);

        this.chart = new window.Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: `${stock.symbol} Price ($)`,
                    data: [...stock.history],
                    borderColor: stock.color,
                    backgroundColor: 'rgba(0, 245, 160, 0.08)',
                    borderWidth: 2.5,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    tension: 0.35,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 400 },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: '#0c111e',
                        borderColor: '#1e293b',
                        borderWidth: 1,
                        titleColor: '#94a3b8',
                        bodyColor: '#ffffff'
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.04)' },
                        ticks: { color: '#64748b' }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.04)' },
                        ticks: {
                            color: '#64748b',
                            callback: (v) => `$${v.toFixed(1)}`
                        }
                    }
                }
            }
        });
    }

    renderChart() {
        if (!this.chart) return;
        const stock = this.stocks[this.selectedSymbol];
        this.chart.data.labels = stock.history.map((_, i) => `${i + 1}m`);
        this.chart.data.datasets[0].label = `${stock.symbol} Price ($)`;
        this.chart.data.datasets[0].data = [...stock.history];
        this.chart.data.datasets[0].borderColor = stock.color;
        this.chart.data.datasets[0].backgroundColor = stock.change24h >= 0 
            ? 'rgba(0, 245, 160, 0.08)' 
            : 'rgba(244, 63, 94, 0.08)';
        this.chart.update('none');
    }

    updateUI() {
        // Update stock list buttons
        const listEl = document.getElementById('market-stocks-list');
        if (listEl) {
            let html = '';
            for (const sym in this.stocks) {
                const s = this.stocks[sym];
                const isSelected = sym === this.selectedSymbol;
                const isPos = s.change24h >= 0;
                const sign = isPos ? '+' : '';
                html += `
                    <div class="market-stock-item ${isSelected ? 'active' : ''}" onclick="window.bizMarket.selectStock('${sym}')">
                        <div class="stock-item-info">
                            <span class="stock-sym">${s.symbol}</span>
                            <span class="stock-name">${s.name}</span>
                        </div>
                        <div class="stock-item-pricing">
                            <span class="stock-price">$${s.price.toFixed(2)}</span>
                            <span class="stock-change ${isPos ? 'green' : 'red'}">${sign}${s.change24h}%</span>
                        </div>
                    </div>
                `;
            }
            listEl.innerHTML = html;
        }

        // Update selected stock header
        const s = this.stocks[this.selectedSymbol];
        if (s) {
            const symEl = document.getElementById('selected-stock-symbol');
            const nameEl = document.getElementById('selected-stock-name');
            const priceEl = document.getElementById('selected-stock-price');
            const changeEl = document.getElementById('selected-stock-change');
            if (symEl) symEl.textContent = s.symbol;
            if (nameEl) nameEl.textContent = s.name;
            if (priceEl) priceEl.textContent = `$${s.price.toFixed(2)}`;
            if (changeEl) {
                const isPos = s.change24h >= 0;
                changeEl.textContent = `${isPos ? '+' : ''}${s.change24h}%`;
                changeEl.className = `stat-badge ${isPos ? 'green' : 'red'}`;
            }
        }

        // Update portfolio details
        const port = this.portfolio[this.selectedSymbol];
        const ownedEl = document.getElementById('portfolio-shares-owned');
        const avgEl = document.getElementById('portfolio-avg-price');
        const pnlEl = document.getElementById('portfolio-pnl');
        const totalPortEl = document.getElementById('portfolio-total-equity');

        if (port && s) {
            const currentVal = port.shares * s.price;
            const costBasis = port.shares * port.avgPrice;
            const diff = currentVal - costBasis;
            const pnlPct = costBasis > 0 ? ((diff / costBasis) * 100).toFixed(1) : '0.0';

            if (ownedEl) ownedEl.textContent = `${port.shares.toLocaleString()} shares`;
            if (avgEl) avgEl.textContent = `$${port.avgPrice.toFixed(2)}`;
            if (pnlEl) {
                const isProfit = diff >= 0;
                pnlEl.textContent = `${isProfit ? '+' : ''}$${Math.abs(diff).toFixed(2)} (${isProfit ? '+' : ''}${pnlPct}%)`;
                pnlEl.className = isProfit ? 'pnl-green' : 'pnl-red';
            }
        }

        if (totalPortEl) {
            totalPortEl.textContent = `$${this.getPortfolioValue().toLocaleString()}`;
        }

        // Live update active chart
        this.renderChart();
    }
}

window.bizMarket = new BizMarket();
