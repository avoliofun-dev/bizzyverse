/**
 * BizVerse Account & Profile Management System
 * Handles player identity, bio, corporate title, 3D avatar color customization,
 * and profile data export/import.
 */

class BizAuth {
    constructor() {
        this.saveKey = 'bizverse_user_profile';
        
        this.profile = {
            username: 'Alex Mercer',
            title: 'Direktur Utama & Pendiri',
            bio: 'Membangun konglomerat otonom terdepan di dunia virtual BizVerse.',
            joinedDate: new Date().toLocaleDateString('id-ID'),
            skinColor: '#ffdbac',
            torsoColor: '#00d2ff',
            legsColor: '#1e293b',
            hatType: 'cap',
            badges: ['Pendiri', 'Investor Benih', 'Taipan Metaverse']
        };

        this.loadProfile();
    }

    loadProfile() {
        try {
            const data = localStorage.getItem(this.saveKey);
            if (data) {
                this.profile = { ...this.profile, ...JSON.parse(data) };
            }
        } catch (e) {}
    }

    saveProfile() {
        try {
            localStorage.setItem(this.saveKey, JSON.stringify(this.profile));
        } catch (e) {}
    }

    updateProfile(data) {
        if (data.username) this.profile.username = data.username;
        if (data.title) this.profile.title = data.title;
        if (data.bio) this.profile.bio = data.bio;
        if (data.skinColor) this.profile.skinColor = data.skinColor;
        if (data.torsoColor) this.profile.torsoColor = data.torsoColor;
        if (data.legsColor) this.profile.legsColor = data.legsColor;
        if (data.hatType) this.profile.hatType = data.hatType;

        this.saveProfile();

        // Update 3D avatar appearance if present
        if (window.bizIsland && window.bizIsland.avatar) {
            window.bizIsland.avatar.setColors(
                this.profile.skinColor,
                this.profile.torsoColor,
                this.profile.legsColor,
                this.profile.hatType
            );
            window.bizIsland.avatar.updateNametagText(this.profile.username, this.profile.title);
        }

        if (window.bizApp) {
            window.bizApp.showToast('Profil & Penampilan Avatar Berhasil Diperbarui!', 'success');
        }
        this.updateUI();
    }

    updateUI() {
        // Update top profile triggers & modals
        const nameEl = document.getElementById('profile-display-name');
        const titleEl = document.getElementById('profile-display-title');
        const bioEl = document.getElementById('profile-display-bio');

        if (nameEl) nameEl.textContent = this.profile.username;
        if (titleEl) titleEl.textContent = this.profile.title;
        if (bioEl) bioEl.textContent = this.profile.bio;

        // Populate form inputs
        const inName = document.getElementById('input-profile-name');
        const inTitle = document.getElementById('input-profile-title');
        const inBio = document.getElementById('input-profile-bio');
        const inSkin = document.getElementById('input-avatar-skin');
        const inTorso = document.getElementById('input-avatar-torso');
        const inLegs = document.getElementById('input-avatar-legs');
        const inHat = document.getElementById('input-avatar-hat');

        if (inName) inName.value = this.profile.username;
        if (inTitle) inTitle.value = this.profile.title;
        if (inBio) inBio.value = this.profile.bio;
        if (inSkin) inSkin.value = this.profile.skinColor;
        if (inTorso) inTorso.value = this.profile.torsoColor;
        if (inLegs) inLegs.value = this.profile.legsColor;
        if (inHat) inHat.value = this.profile.hatType;
    }
}

window.bizAuth = new BizAuth();
