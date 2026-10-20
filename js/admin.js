/**
 * BizVerse Admin & Moderation Console (God Mode & Server Oversight)
 * Moderation tools, player disciplinary actions, economy liquidity injections,
 * and global server broadcasts.
 */

class BizAdmin {
    constructor() {
        this.isAdminMode = false;
        this.bannedPlayers = [];
        this.mutedPlayers = [];
    }

    toggleAdminModal() {
        const modal = document.getElementById('admin-modal');
        if (!modal) return;
        this.isAdminMode = !this.isAdminMode;
        modal.classList.toggle('active', this.isAdminMode);
        if (this.isAdminMode) {
            this.updateUI();
            if (window.bizAudio) window.bizAudio.playAlert();
        }
    }

    injectCash(amount) {
        if (!window.bizEngine) return;
        window.bizEngine.state.cash += amount;
        window.bizEngine.state.totalEarned += amount;
        if (window.bizAudio) window.bizAudio.playCash();
        if (window.confetti) window.confetti({ particleCount: 80, spread: 70 });
        if (window.bizApp) window.bizApp.showToast(`[ADMIN] Berhasil menyuntikkan dana kas sebesar +$${amount.toLocaleString()}!`, 'success');
    }

    setMultiplier(mult) {
        if (!window.bizEngine) return;
        window.bizEngine.state.boostMultiplier = mult;
        window.bizEngine.state.isBoosted = true;
        window.bizEngine.state.boostTimeRemaining = 300; // 5 minutes
        if (window.bizAudio) window.bizAudio.playUpgrade();
        if (window.bizApp) window.bizApp.showToast(`[ADMIN] Pengali pendapatan global diatur ke ${mult}x selama 5 menit!`, 'success');
    }

    triggerMarketRally() {
        if (!window.bizMarket) return;
        for (const sym in window.bizMarket.stocks) {
            const s = window.bizMarket.stocks[sym];
            s.price = +(s.price * 1.25).toFixed(2);
            s.history.push(s.price);
            s.change24h = +((s.change24h + 25.0).toFixed(2));
        }
        window.bizMarket.updateUI();
        this.broadcastMessage('PENGUMUMAN ADMIN: Bank Sentral Metaverse menyuntikkan stimulus, pasar saham mengalami MEGA BULL RUN! 📈');
    }

    triggerMarketCrash() {
        if (!window.bizMarket) return;
        for (const sym in window.bizMarket.stocks) {
            const s = window.bizMarket.stocks[sym];
            s.price = +(Math.max(5, s.price * 0.8)).toFixed(2);
            s.history.push(s.price);
            s.change24h = +((s.change24h - 20.0).toFixed(2));
        }
        window.bizMarket.updateUI();
        this.broadcastMessage('PERINGATAN ADMIN: Terjadi koreksi likuiditas global di pasar bursa! 📉');
    }

    broadcastMessage(text) {
        if (!text || text.trim().length === 0) return;
        const banner = document.getElementById('global-admin-broadcast-banner');
        if (banner) {
            banner.textContent = text;
            banner.style.display = 'block';
            if (window.bizAudio) window.bizAudio.playAlert();

            setTimeout(() => {
                banner.style.display = 'none';
            }, 8000);
        }
        if (window.bizApp) window.bizApp.showToast('Siaran global berhasil dipublikasikan!', 'success');
    }

    moderatePlayer(playerName, action) {
        if (action === 'ban') {
            this.bannedPlayers.push(playerName);
            if (window.bizSocial) {
                window.bizSocial.onlinePlayers = window.bizSocial.onlinePlayers.filter(p => p.name !== playerName);
                window.bizSocial.updateUI();
            }
            if (window.bizApp) window.bizApp.showToast(`[ADMIN] Pemain '${playerName}' telah diblokir permanen (Banned).`, 'error');
        } else if (action === 'mute') {
            this.mutedPlayers.push(playerName);
            if (window.bizApp) window.bizApp.showToast(`[ADMIN] Pemain '${playerName}' telah dibisukan (Muted).`, 'info');
        } else if (action === 'warn') {
            if (window.bizApp) window.bizApp.showToast(`[ADMIN] Peringatan resmi terkirim ke pemain '${playerName}'.`, 'info');
        }
        this.updateUI();
    }

    updateUI() {
        const table = document.getElementById('admin-players-table');
        if (!table || !window.bizSocial) return;

        let html = '';
        window.bizSocial.onlinePlayers.forEach(p => {
            const isMuted = this.mutedPlayers.includes(p.name);
            html += `
                <tr style="border-bottom: 1px solid var(--border-subtle); font-size: 12px;">
                    <td style="padding: 8px;"><strong>${p.name}</strong></td>
                    <td style="padding: 8px; color: var(--primary-cyan);">${p.title}</td>
                    <td style="padding: 8px; font-family: var(--font-mono);">$${p.netWorth.toLocaleString()}</td>
                    <td style="padding: 8px;">
                        <span class="badge ${isMuted ? 'red' : 'green'}">${isMuted ? 'Muted' : 'Normal'}</span>
                    </td>
                    <td style="padding: 8px; display: flex; gap: 4px;">
                        <button class="btn btn-sm btn-secondary" onclick="window.bizAdmin.moderatePlayer('${p.name}', 'warn')">Peringatkan</button>
                        <button class="btn btn-sm btn-secondary" onclick="window.bizAdmin.moderatePlayer('${p.name}', 'mute')">${isMuted ? 'Unmute' : 'Bisukan'}</button>
                        <button class="btn btn-sm btn-boost" onclick="window.bizAdmin.moderatePlayer('${p.name}', 'ban')">Blokir</button>
                    </td>
                </tr>
            `;
        });
        table.innerHTML = html;
    }
}

window.bizAdmin = new BizAdmin();
