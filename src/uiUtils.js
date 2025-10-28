// Toast Notification System
export class ToastManager {
    constructor() {
        this.container = document.getElementById('toast-container');
        this.toasts = [];
    }

    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        this.container.appendChild(toast);
        this.toasts.push(toast);

        // Auto remove
        setTimeout(() => {
            this.remove(toast);
        }, duration);

        return toast;
    }

    remove(toast) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }

            const index = this.toasts.indexOf(toast);
            if (index > -1) {
                this.toasts.splice(index, 1);
            }
        }, 300);
    }

    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }
}

// Theme Manager
export class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.applyTheme();
    }

    applyTheme() {
        if (this.currentTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }

        localStorage.setItem('theme', this.currentTheme);
    }

    toggle() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        return this.currentTheme;
    }

    get() {
        return this.currentTheme;
    }
}

// Settings Manager
export class SettingsManager {
    constructor(app) {
        this.app = app;
        this.panel = document.getElementById('settings-panel');
        this.settings = {
            quality: localStorage.getItem('quality') || 'high',
            cameraSpeed: parseFloat(localStorage.getItem('cameraSpeed')) || 1,
            shadows: localStorage.getItem('shadows') !== 'false',
            postProcessing: localStorage.getItem('postProcessing') !== 'false',
            particles: localStorage.getItem('particles') !== 'false'
        };

        this.setupEventListeners();
        this.loadSettings();
    }

    setupEventListeners() {
        // Quality select
        const qualitySelect = document.getElementById('quality-select');
        if (qualitySelect) {
            qualitySelect.value = this.settings.quality;
            qualitySelect.addEventListener('change', (e) => {
                this.setSetting('quality', e.target.value);
            });
        }

        // Camera speed
        const cameraSpeed = document.getElementById('camera-speed');
        if (cameraSpeed) {
            cameraSpeed.value = this.settings.cameraSpeed;
            cameraSpeed.addEventListener('input', (e) => {
                this.setSetting('cameraSpeed', parseFloat(e.target.value));
            });
        }

        // Shadows toggle
        const shadowsToggle = document.getElementById('shadows-toggle');
        if (shadowsToggle) {
            shadowsToggle.checked = this.settings.shadows;
            shadowsToggle.addEventListener('change', (e) => {
                this.setSetting('shadows', e.target.checked);
            });
        }

        // Post-processing toggle
        const postProcessToggle = document.getElementById('postprocess-toggle');
        if (postProcessToggle) {
            postProcessToggle.checked = this.settings.postProcessing;
            postProcessToggle.addEventListener('change', (e) => {
                this.setSetting('postProcessing', e.target.checked);
            });
        }

        // Particles toggle
        const particlesToggle = document.getElementById('particles-toggle');
        if (particlesToggle) {
            particlesToggle.checked = this.settings.particles;
            particlesToggle.addEventListener('change', (e) => {
                this.setSetting('particles', e.target.checked);
            });
        }

        // Close button
        const closeBtn = document.getElementById('close-settings');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }
    }

    setSetting(key, value) {
        this.settings[key] = value;
        localStorage.setItem(key, value);

        // Apply setting
        if (this.app.applySettings) {
            this.app.applySettings(this.settings);
        }
    }

    loadSettings() {
        if (this.app.applySettings) {
            this.app.applySettings(this.settings);
        }
    }

    show() {
        this.panel.classList.remove('hidden');
    }

    hide() {
        this.panel.classList.add('hidden');
    }

    toggle() {
        if (this.panel.classList.contains('hidden')) {
            this.show();
        } else {
            this.hide();
        }
    }

    get(key) {
        return this.settings[key];
    }
}

// Loading Manager
export class LoadingManager {
    constructor() {
        this.element = document.getElementById('loading');
        this.statusElement = document.getElementById('loading-status');
        this.progressElement = document.getElementById('loading-progress');
        this.isVisible = false;
    }

    show(message = 'Loading...') {
        this.isVisible = true;
        this.element.classList.remove('hidden');
        this.setStatus(message);
        this.setProgress(0);
    }

    hide() {
        this.isVisible = false;
        this.element.classList.add('hidden');
    }

    setStatus(message) {
        if (this.statusElement) {
            this.statusElement.textContent = message;
        }
    }

    setProgress(percent) {
        if (this.progressElement) {
            this.progressElement.style.width = `${percent}%`;
        }
    }
}

// Breadcrumb Manager
export class BreadcrumbManager {
    constructor() {
        this.container = document.getElementById('breadcrumb');
        this.items = [];
    }

    set(items) {
        this.items = items;
        this.render();
    }

    render() {
        if (!this.container) return;

        this.container.innerHTML = this.items.map((item, index) => {
            const activeClass = index === this.items.length - 1 ? 'active' : '';
            return `<span class="breadcrumb-item ${activeClass}">${item}</span>`;
        }).join('');
    }
}

// Stats HUD Manager
export class StatsHUD {
    constructor() {
        this.container = document.getElementById('stats-hud');
        this.activeEquipmentEl = document.getElementById('active-equipment');
        this.operationalCountEl = document.getElementById('operational-count');
        this.warningCountEl = document.getElementById('warning-count');
    }

    show() {
        if (this.container) {
            this.container.classList.remove('hidden');
        }
    }

    hide() {
        if (this.container) {
            this.container.classList.add('hidden');
        }
    }

    update(stats) {
        if (this.activeEquipmentEl) {
            this.activeEquipmentEl.textContent = stats.active || 0;
        }

        if (this.operationalCountEl) {
            this.operationalCountEl.textContent = stats.operational || 0;
        }

        if (this.warningCountEl) {
            this.warningCountEl.textContent = stats.warnings || 0;
        }
    }
}

// Fullscreen Manager
export class FullscreenManager {
    constructor() {
        this.isFullscreen = false;
    }

    toggle() {
        if (!this.isFullscreen) {
            this.enter();
        } else {
            this.exit();
        }
    }

    enter() {
        const elem = document.documentElement;

        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }

        this.isFullscreen = true;
    }

    exit() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }

        this.isFullscreen = false;
    }
}
