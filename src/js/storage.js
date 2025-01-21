class GameStorage {
    static getHighScore() {
        return parseInt(localStorage.getItem('tetris_highScore')) || 0;
    }

    static setHighScore(score) {
        const currentHighScore = this.getHighScore();
        if (score > currentHighScore) {
            localStorage.setItem('tetris_highScore', score.toString());
            return true;
        }
        return false;
    }

    static getSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('tetris_settings'));
            return settings || { soundEnabled: true, musicEnabled: true };
        } catch (e) {
            return { soundEnabled: true, musicEnabled: true };
        }
    }

    static setSettings(settings) {
        localStorage.setItem('tetris_settings', JSON.stringify(settings));
    }

    static clearAll() {
        localStorage.removeItem('tetris_highScore');
        localStorage.removeItem('tetris_settings');
    }
}