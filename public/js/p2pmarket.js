/**
 * BizVerse Player-to-Player (P2P) Marketplace
 * Lets players trade rare business deeds, patents, tech hardware, and metaverse assets.
 */

class BizP2PMarket {
    constructor() {
        this.listings = [
            { id: 'item_1', name: 'Akta Kavling Pantai Eksklusif', seller: 'CyberTycoon_ID', price: 45000, category: 'Real Estat', icon: '🏝️', desc: 'Hak guna bangunan kavling pulau pribadi dengan akses pantai utama.' },
            { id: 'item_2', name: 'Lisensi Algoritma HFT Kuantum', seller: 'CryptoWhale_99', price: 85000, category: 'Algoritma', icon: '📈', desc: 'Algoritma arbitrase otomatis meningkatkan profit trading sebesar +20%.' },
            { id: 'item_3', name: 'Server Rack Superkomputer Liquid-Cooled', seller: 'Luna_Quantum', price: 120000, category: 'Hardware', icon: '🖥️', desc: 'Unit komputasi daya tinggi memberikan pendapatan pasif +$350/s.' },
            { id: 'item_4', name: 'Armada 10 Drone Kargo Otonom', seller: 'AlphaTrader', price: 65000, category: 'Logistik', icon: '🛸', desc: 'Mempercepat pengiriman barang dagang dan memangkas biaya logistik.' },
            { id: 'item_5', name: 'Setelan Jas Emas Cyberpunk (Avatar)', seller: 'MetaVenture', price: 25000, category: 'Kosmetik', icon: '👑', desc: 'Pakaian mewah edisi terbatas yang memancarkan kilau emas prestisius.' }
        ];

        this.myListings = [];
    }

    buyListing(itemId) {
        const item = this.listings.find(x => x.id === itemId);
        if (!item || !window.bizEngine) return false;

        if (window.bizEngine.state.cash < item.price) {
            if (window.bizApp) window.bizApp.showToast('Kas perusahaan tidak cukup untuk membeli aset ini!', 'error');
            return false;
        }

        window.bizEngine.state.cash -= item.price;
        window.bizEngine.state.reputation += 25;
        this.listings = this.listings.filter(x => x.id !== itemId);

        if (window.bizAudio) window.bizAudio.playCash();
        if (window.confetti) window.confetti({ particleCount: 60, spread: 60 });
        if (window.bizApp) window.bizApp.showToast(`Berhasil Membeli ${item.name} dari ${item.seller}!`, 'success');

        this.updateUI();
        return true;
    }

    createListing(name, price, category, desc) {
        if (!name || !price || isNaN(price) || price <= 0) return false;
        const username = window.bizAuth ? window.bizAuth.profile.username : 'Alex Mercer';

        const newItem = {
            id: `item_${Date.now()}`,
            name,
            seller: username,
            price: parseInt(price, 10),
            category: category || 'Aset Bisnis',
            icon: '📦',
            desc: desc || 'Aset bisnis korporat terverifikasi.'
        };

        this.listings.unshift(newItem);
        if (window.bizAudio) window.bizAudio.playUpgrade();
        if (window.bizApp) window.bizApp.showToast('Aset Anda berhasil dipasang di Pasar Pemain!', 'success');

        this.updateUI();
        return true;
    }

    updateUI() {
        const grid = document.getElementById('marketplace-items-grid');
        if (!grid) return;

        let html = '';
        this.listings.forEach(item => {
            const canAfford = window.bizEngine && window.bizEngine.state.cash >= item.price;
            html += `
                <div class="market-item-card">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                        <span style="font-size: 32px;">${item.icon}</span>
                        <span class="badge cyan">${item.category}</span>
                    </div>
                    <h4 style="font-family: var(--font-heading); font-size: 15px; margin-bottom: 4px;">${item.name}</h4>
                    <p style="font-size: 11px; color: var(--text-muted); line-height: 1.5; margin-bottom: 12px; flex: 1;">
                        ${item.desc}
                    </p>
                    <div style="font-size: 11px; color: var(--primary-cyan); margin-bottom: 8px;">
                        Penjual: <strong>${item.seller}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 10px;">
                        <span style="font-family: var(--font-mono); font-size: 16px; font-weight: 700; color: var(--primary-emerald);">$${item.price.toLocaleString()}</span>
                        <button class="btn btn-sm ${canAfford ? 'btn-primary' : 'btn-disabled'}" 
                                onclick="window.bizP2PMarket.buyListing('${item.id}')">
                            Beli Aset
                        </button>
                    </div>
                </div>
            `;
        });
        grid.innerHTML = html;
    }
}

window.bizP2PMarket = new BizP2PMarket();
