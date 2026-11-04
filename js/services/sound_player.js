const SoundPlayer = {
    audio: document.getElementById('bg-music'),
    btnMusic: document.getElementById('btnMusic'),
    btnLoop: document.getElementById('btnLoop'),
    btnPlaylist: document.getElementById('btnPlaylist'),
    btnShuffle: document.getElementById('btnShuffle'),
    playlistContainer: document.getElementById('playerPlaylist'),
    tracksContainer: document.getElementById('playlistTracksContainer'),
    progressBg: document.querySelector('.timeline-bg'),
    progressFill: document.querySelector('.timeline-fill'),
    timeCurrent: document.getElementById('timeCurrent'),
    timeTotal: document.getElementById('timeTotal'),
    volumeSlider: document.getElementById('volumeSlider'),

    playlist: [],
    currentTrackIdx: 0,
    isLooping: false,
    isShuffling: false,

    async init() {
        if (!this.audio) return;
        this.audio.volume = 0.25;
        this.attachEvents();
        await this.loadPlaylist();
    },

    async loadPlaylist() {
        try {
            const response = await fetch('audio/playlist.json');
            this.playlist = await response.json();
            this.renderPlaylistUI();
            this.loadTrack(this.currentTrackIdx, false);
        } catch (error) {
            console.error("Ошибка загрузки плейлиста:", error);
        }
    },

    renderPlaylistUI() {
        if (!this.tracksContainer) return;
        this.tracksContainer.innerHTML = "";
        this.playlist.forEach((track, idx) => {
            const item = document.createElement("div");
            item.className = "playlist-item";
            item.textContent = `${idx + 1}. ${this.formatTrackName(track)}`;
            item.addEventListener("click", () => this.loadTrack(idx, true));
            this.tracksContainer.appendChild(item);
        });
    },

    formatTrackName(filename) {
        let name = filename.replace('.mp3', '')
            .replace(/_/g, ' ')
            .replace(/audio\//gi, '')
            .replace(/\s+/g, ' ')
            .trim();
        return name.charAt(0).toUpperCase() + name.slice(1);
    },

    loadTrack(idx, startPlaying = false) {
        if (idx < 0 || idx >= this.playlist.length) return;
        this.currentTrackIdx = idx;
        this.audio.src = this.playlist[this.currentTrackIdx];

        if (this.tracksContainer) {
            const items = this.tracksContainer.querySelectorAll(".playlist-item");
            items.forEach((item, index) => item.classList.toggle("current", index === idx));
        }

        const marqueeContainer = document.querySelector('.winamp-track-info-marquee');
        if (marqueeContainer) {
            const cleanName = this.formatTrackName(this.playlist[this.currentTrackIdx]);
            marqueeContainer.innerHTML = `<span class="marquee-text">⚜️ ${cleanName} ⚜️</span>`;
        }

        if (startPlaying) {
            this.audio.play()
                .then(() => this.updateButtonUI(true))
                .catch(e => console.log("Ожидание клика пользователя"));
        } else {
            this.updateButtonUI(false);
        }
    },

    toggleMusic() {
        if (!this.audio.src) {
            this.loadTrack(this.currentTrackIdx, true);
            return;
        }
        if (this.audio.paused) {
            this.audio.play()
                .then(() => this.updateButtonUI(true))
                .catch(e => alert('Нужен клик на странице'));
        } else {
            this.audio.pause();
            this.updateButtonUI(false);
        }
    },

    toggleLoop() {
        this.isLooping = !this.isLooping;
        this.audio.loop = this.isLooping;
        if (this.isLooping) {
            this.btnLoop.classList.add('active');
            this.btnLoop.title = "Цикл ВКЛ";
        } else {
            this.btnLoop.classList.remove('active');
            this.btnLoop.title = "Зациклить трек";
        }
    },

    togglePlaylistUI() {
        if (!this.playlistContainer) return;
        const isOpen = this.playlistContainer.classList.toggle("open");
        if (this.btnPlaylist) this.btnPlaylist.classList.toggle("active", isOpen);

        const playerWrapper = document.querySelector('.music-player-monolith-wrapper');
        const legend = document.querySelector('.legend-container');
        if (playerWrapper) playerWrapper.classList.toggle('playlist-open', isOpen);
        if (legend) legend.classList.toggle('playlist-open', isOpen);
    },

    playNextRandomTrack() {
        if (this.playlist.length <= 1) return;
        let nextIdx;
        do {
            nextIdx = Math.floor(Math.random() * this.playlist.length);
        } while (nextIdx === this.currentTrackIdx);
        this.loadTrack(nextIdx, true);
    },

    updateButtonUI(isPlayingNow) {
        if (!this.btnMusic) return;
        if (isPlayingNow) {
            this.btnMusic.innerHTML = `⏸ PAUSE`;
            this.btnMusic.style.background = '#19140b';
            this.btnMusic.style.boxShadow = 'inset 1px 1px 3px rgba(0, 0, 0, 0.9)';
            this.btnMusic.style.color = '#ff7675';
            this.btnMusic.style.textShadow = '0 0 4px rgba(255, 118, 117, 0.6)';
        } else {
            this.btnMusic.innerHTML = `▶ PLAY`;
            this.btnMusic.style.background = '';
            this.btnMusic.style.boxShadow = '';
            this.btnMusic.style.color = '';
            this.btnMusic.style.textShadow = '';
        }
    },

    formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    },

    attachEvents() {
        if (this.btnMusic) this.btnMusic.addEventListener('click', () => this.toggleMusic());
        if (this.btnLoop) this.btnLoop.addEventListener('click', () => this.toggleLoop());
        if (this.btnPlaylist) this.btnPlaylist.addEventListener('click', () => this.togglePlaylistUI());

        if (this.btnShuffle) {
            this.btnShuffle.textContent = "➔";
            this.btnShuffle.title = "Перемешать треки";
            this.btnShuffle.addEventListener('click', () => {
                this.isShuffling = !this.isShuffling;
                this.btnShuffle.classList.toggle('active', this.isShuffling);
                if (this.isShuffling) {
                    this.btnShuffle.textContent = "🔀";
                    this.btnShuffle.title = "Перемешивание ВКЛ";
                    this.playNextRandomTrack();
                } else {
                    this.btnShuffle.textContent = "➔";
                    this.btnShuffle.title = "Перемешать треки";
                }
            });
        }

        this.audio.addEventListener("timeupdate", () => {
            if (!this.audio.duration) return;
            const pct = (this.audio.currentTime / this.audio.duration) * 100;
            if (this.progressFill) this.progressFill.style.width = `${pct}%`;
            if (this.timeCurrent) this.timeCurrent.textContent = this.formatTime(this.audio.currentTime);
        });

        this.audio.addEventListener("loadedmetadata", () => {
            if (this.timeTotal) this.timeTotal.textContent = this.formatTime(this.audio.duration);
        });

        if (this.progressBg) {
            this.progressBg.addEventListener("click", (e) => {
                if (!this.audio.duration) return;
                const rect = this.progressBg.getBoundingClientRect();
                const pct = (e.clientX - rect.left) / rect.width;
                this.audio.currentTime = pct * this.audio.duration;
            });
        }

        if (this.volumeSlider) {
            this.volumeSlider.value = this.audio.volume;
            this.volumeSlider.addEventListener("input", (e) => { this.audio.volume = e.target.value; });
        }

        this.audio.addEventListener("ended", () => {
            if (this.isLooping) return;
            if (this.isShuffling) {
                this.playNextRandomTrack();
            } else {
                let nextIdx = this.currentTrackIdx + 1;
                if (nextIdx >= this.playlist.length) nextIdx = 0;
                this.loadTrack(nextIdx, true);
            }
        });

        document.addEventListener('click', (e) => {
            if (this.playlistContainer &&
                this.playlistContainer.classList.contains('open') &&
                !this.playlistContainer.contains(e.target) &&
                e.target !== this.btnPlaylist) {
                this.playlistContainer.classList.remove('open');
                if (this.btnPlaylist) this.btnPlaylist.classList.remove('active');
            }
        });
    }
};

export default SoundPlayer;
