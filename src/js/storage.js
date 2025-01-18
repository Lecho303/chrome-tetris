class Storage {
    static KEY_HIGH_SCORE = 'tetris_high_score';
    static KEY_SETTINGS = 'tetris_settings';

    static saveHighScore(score) {
        const currentHighScore = this.getHighScore();
        if (score > currentHighScore) {
            localStorage.setItem(this.KEY_HIGH_SCORE, score.toString());
            return true;
        }
        return false;
    }

    static getHighScore() {
        return parseInt(localStorage.getItem(this.KEY_HIGH_SCORE) || '0');
    }

    static saveSettings(settings) {
        localStorage.setItem(this.KEY_SETTINGS, JSON.stringify(settings));
    }

    static getSettings() {
        const defaultSettings = {
            soundEnabled: true,
            musicEnabled: true
        };

        const savedSettings = localStorage.getItem(this.KEY_SETTINGS);
        if (!savedSettings) {
            return defaultSettings;
        }

        try {
            return {...defaultSettings, ...JSON.parse(savedSettings)};
        } catch (e) {
            return defaultSettings;
        }
    }

    static clearAll() {
        localStorage.removeItem(this.KEY_HIGH_SCORE);
        localStorage.removeItem(this.KEY_SETTINGS);
    }
} 