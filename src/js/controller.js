class Controller {
    constructor(game) {
        this.game = game;
        this.bindKeys();
        this.bindButtons();
        this.preventScroll();
    }

    preventScroll() {
        // 阻止所有可能导致滚动的键盘事件
        window.addEventListener('keydown', (e) => {
            if(['ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) {
                e.preventDefault();
                return false;
            }
        }, true);

        // 阻止触摸滚动
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });

        // 为游戏区域添加特殊处理
        const gameArea = document.querySelector('.game-container');
        if (gameArea) {
            gameArea.addEventListener('wheel', (e) => {
                e.preventDefault();
            }, { passive: false });
        }
    }

    bindKeys() {
        document.addEventListener('keydown', (event) => {
            if (event.repeat) return; // 防止按住键时重复触发

            // 阻止事件冒泡和默认行为
            event.preventDefault();
            event.stopPropagation();

            switch (event.code) {
                case 'ArrowLeft':
                    this.game.moveCurrentBlockLeft();
                    break;
                case 'ArrowRight':
                    this.game.moveCurrentBlockRight();
                    break;
                case 'ArrowDown':
                    this.game.moveCurrentBlockDown();
                    break;
                case 'ArrowUp':
                    this.game.rotateCurrentBlock();
                    break;
                case 'Space':
                    this.game.dropCurrentBlock();
                    break;
                case 'KeyC':
                    this.game.holdCurrentBlock();
                    break;
                case 'KeyP':
                    this.game.togglePause();
                    break;
            }
        }, true); // 使用捕获阶段
    }

    bindButtons() {
        const startBtn = document.getElementById('start-btn');
        const pauseBtn = document.getElementById('pause-btn');
        const restartBtn = document.getElementById('restart-btn');

        if (startBtn) {
            startBtn.addEventListener('click', () => this.game.start());
        }
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.game.togglePause());
        }
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.game.restart());
        }
    }
} 