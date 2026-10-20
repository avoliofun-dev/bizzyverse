/**
 * BizVerse Multiplayer Social Engine
 * Simulated Live Multiplayer Network, Global Metaverse Chat,
 * 3D Avatar Emote Triggers, and Island Visiting System.
 */

class BizSocial {
    constructor() {
        this.messages = [
            { sender: 'CryptoWhale_99', title: 'Baron', text: 'Baru saja borong 500 saham NRTX di Bursa Apex! 🚀', time: '01:02' },
            { sender: 'CyberTycoon_ID', title: 'Director', text: 'Ada yang mau barter lisensi komputasi awan di pasar pemain?', time: '01:04' },
            { sender: 'Luna_Quantum', title: 'AI Architect', text: 'Pulau pribadi saya sekarang menghasilkan +$800/s dari penambang kuantum 😎', time: '01:06' },
            { sender: 'MetaVenture', title: 'Angel Investor', text: 'Selamat pagi para CEO! Siap ekspansi sektor hari ini?', time: '01:07' }
        ];

        this.onlinePlayers = [
            { name: 'CryptoWhale_99', title: 'Baron', netWorth: 18400000, status: 'Online' },
            { name: 'CyberTycoon_ID', title: 'Director', netWorth: 9200000, status: 'Trading' },
            { name: 'Luna_Quantum', title: 'AI Architect', netWorth: 5400000, status: 'Building Island' },
            { name: 'MetaVenture', title: 'Angel', netWorth: 4100000, status: 'In Boardroom' },
            { name: 'AlphaTrader', title: 'Analyst', netWorth: 1200000, status: 'Online' }
        ];

        this.randomChatPool = [
            'Pasar saham Hyperion lagi naik daun nih!',
            'Baru rekrut 3 AI Scientist, produktivitas melonjak gila-gilaan!',
            'Siapa yang sudah buka kavling di Pulau Pribadi?',
            'Ada tawaran akuisisi hostile masuk, mending tolak atau terima ya?',
            'Viral Blitz aktif, profit berlipat 2.5x lipat!',
            'Kontrak Smart City B2B sudah berhasil ditandatangani! 🎉'
        ];

        this.startChatSimulation();
    }

    startChatSimulation() {
        // Simulated network chat incoming every 12-20 seconds
        setInterval(() => {
            if (Math.random() < 0.6) {
                const randomPlayer = this.onlinePlayers[Math.floor(Math.random() * this.onlinePlayers.length)];
                const randomText = this.randomChatPool[Math.floor(Math.random() * this.randomChatPool.length)];
                const now = new Date();
                const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

                this.messages.push({
                    sender: randomPlayer.name,
                    title: randomPlayer.title,
                    text: randomText,
                    time: timeStr
                });

                if (this.messages.length > 30) this.messages.shift();
                this.updateUI();
            }
        }, 14000);
    }

    sendMessage(text) {
        if (!text || text.trim().length === 0) return;
        const trimmed = text.trim();

        // Handle Emotes commands
        if (trimmed.startsWith('/')) {
            this.handleEmoteCommand(trimmed);
            return;
        }

        const username = window.bizAuth ? window.bizAuth.profile.username : 'Alex Mercer';
        const title = window.bizAuth ? window.bizAuth.profile.title : 'CEO';
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        this.messages.push({
            sender: username,
            title,
            text: trimmed,
            time: timeStr,
            isMe: true
        });

        if (window.bizAudio) window.bizAudio.playClick();

        // Display floating chat bubble above 3D avatar head
        if (window.bizIsland && window.bizIsland.avatar) {
            window.bizIsland.avatar.showChatBubble(trimmed);
        }

        this.updateUI();
    }

    handleEmoteCommand(cmd) {
        const lower = cmd.toLowerCase();
        if (lower === '/wave') {
            if (window.bizIsland && window.bizIsland.avatar) {
                window.bizIsland.avatar.showChatBubble('👋 Melambaikan tangan ke semua CEO!');
            }
            if (window.bizApp) window.bizApp.showToast('Avatar melambaikan tangan! 👋', 'info');
        } else if (lower === '/dance') {
            if (window.bizIsland && window.bizIsland.avatar) {
                window.bizIsland.avatar.showChatBubble('🕺 Menari merayakan profit bisnis!');
            }
            if (window.confetti) window.confetti({ particleCount: 60, spread: 50 });
            if (window.bizApp) window.bizApp.showToast('Avatar menari merayakan kesuksesan! 🕺', 'success');
        } else if (lower === '/flex') {
            if (window.bizAudio) window.bizAudio.playCash();
            if (window.bizEngine) window.bizEngine.venturePitchClick();
            if (window.bizIsland && window.bizIsland.avatar) {
                window.bizIsland.avatar.showChatBubble('💸 Memamerkan kekayaan konglomerat!');
            }
        } else {
            if (window.bizApp) window.bizApp.showToast('Perintah Emote tersedia: /wave, /dance, /flex', 'info');
        }
    }

    visitIsland(playerName) {
        if (window.bizAudio) window.bizAudio.playUpgrade();
        if (window.bizApp) {
            window.bizApp.showToast(`Mengunjungi Pulau Pribadi milik ${playerName}...`, 'info');
        }
    }

    updateUI() {
        // Update chat list
        const chatBox = document.getElementById('global-chat-messages');
        if (chatBox) {
            let html = '';
            this.messages.forEach(m => {
                html += `
                    <div class="chat-msg-row ${m.isMe ? 'my-msg' : ''}">
                        <div class="chat-meta">
                            <span class="chat-sender">${m.sender}</span>
                            <span class="chat-title">[${m.title}]</span>
                            <span class="chat-time">${m.time}</span>
                        </div>
                        <div class="chat-body">${m.text}</div>
                    </div>
                `;
            });
            chatBox.innerHTML = html;
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        // Update online players list
        const playersList = document.getElementById('online-players-list');
        if (playersList) {
            let html = '';
            this.onlinePlayers.forEach(p => {
                html += `
                    <div class="online-player-card">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span class="live-dot"></span>
                            <div>
                                <div style="font-weight: 700; font-size: 13px;">${p.name}</div>
                                <div style="font-size: 11px; color: var(--primary-cyan);">${p.title} • $${p.netWorth.toLocaleString()}</div>
                            </div>
                        </div>
                        <button class="btn btn-sm btn-secondary" onclick="window.bizSocial.visitIsland('${p.name}')">
                            Kunjungi Pulau
                        </button>
                    </div>
                `;
            });
            playersList.innerHTML = html;
        }
    }
}

window.bizSocial = new BizSocial();
