class Game {
    constructor() {
        this.board = new Board();
        this.currentBlock = null;
        this.nextBlock = null;
        this.holdBlock = null;
        this.canHold = true;
        this.gameLoop = null;
        this.isPaused = false;

        // Canvas设置
        this.gameCanvas = document.getElementById('game-canvas');
        this.nextCanvas = document.getElementById('next-canvas');
        this.holdCanvas = document.getElementById('hold-canvas');
        
        if (!this.gameCanvas || !this.nextCanvas || !this.holdCanvas) {
            console.error('无法找到必要的Canvas元素');
            return;
        }

        this.gameCtx = this.gameCanvas.getContext('2d');
        this.nextCtx = this.nextCanvas.getContext('2d');
        this.holdCtx = this.holdCanvas.getContext('2d');

        // 设置Canvas尺寸
        this.blockSize = 30;
        this.gameCanvas.width = this.board.width * this.blockSize;
        this.gameCanvas.height = this.board.height * this.blockSize;
        this.nextCanvas.width = this.nextCanvas.height = 4 * this.blockSize;
        this.holdCanvas.width = this.holdCanvas.height = 4 * this.blockSize;

        // 初始化UI元素
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.linesElement = document.getElementById('lines');
        this.highScoreElement = document.getElementById('high-score');

        if (!this.scoreElement || !this.levelElement || !this.linesElement || !this.highScoreElement) {
            console.error('无法找到必要的UI元素');
            return;
        }

        // 初始化高分显示
        this.updateHighScore();

        // 初始绘制空游戏板
        this.draw();
        
        console.log('Game initialized successfully');
    }

    start() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }

        // 重置游戏状态
        this.board.clear();
        this.currentBlock = null;
        this.nextBlock = null;
        this.holdBlock = null;
        this.canHold = true;
        this.isPaused = false;

        // 更新UI
        this.updateUI();
        
        // 生成初始方块
        this.generateNewBlock();
        
        // 开始游戏循环
        this.startGameLoop();
        
        console.log('Game started');
    }

    pause() {
        this.isPaused = true;
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }

    resume() {
        if (this.isPaused) {
            this.isPaused = false;
            this.startGameLoop();
        }
    }

    togglePause() {
        if (this.isPaused) {
            this.resume();
        } else {
            this.pause();
        }
    }

    restart() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
        this.start();
    }

    startGameLoop() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }

        // 根据等级调整速度
        const baseSpeed = 800;    // 1级的基础速度（毫秒）
        const speedFactor = 100;  // 每升一级减少的毫秒数
        const minSpeed = 100;     // 最低速度限制（8级及以上）
        const level = this.board.getLevel();
        
        // 计算当前等级的速度
        const speed = Math.max(minSpeed, baseSpeed - (level - 1) * speedFactor);
        
        this.gameLoop = setInterval(() => {
            this.update();
        }, speed);
    }

    update() {
        if (this.isPaused) return;
        
        if (!this.currentBlock) {
            this.generateNewBlock();
        }
        
        this.moveCurrentBlockDown();
        this.updateUI();
    }

    moveCurrentBlockLeft() {
        if (this.isPaused || !this.currentBlock) return;
        
        this.currentBlock.moveLeft();
        if (!this.board.isValidMove(this.currentBlock, this.currentBlock.x, this.currentBlock.y)) {
            this.currentBlock.moveRight();
            return false;
        }
        this.draw();
        return true;
    }

    moveCurrentBlockRight() {
        if (this.isPaused || !this.currentBlock) return;
        
        this.currentBlock.moveRight();
        if (!this.board.isValidMove(this.currentBlock, this.currentBlock.x, this.currentBlock.y)) {
            this.currentBlock.moveLeft();
            return false;
        }
        this.draw();
        return true;
    }

    moveCurrentBlockDown() {
        if (this.isPaused || !this.currentBlock) return false;
        
        this.currentBlock.moveDown();
        if (!this.board.isValidMove(this.currentBlock, this.currentBlock.x, this.currentBlock.y)) {
            this.currentBlock.y--;
            
            // 检查方块是否完全在游戏区域外
            if (this.currentBlock.y < 0) {
                this.gameOver();
                return false;
            }
            
            // 直接放置方块并生成新方块
            this.placeCurrentBlock();
            if (!this.board.isGameOver()) {
                this.generateNewBlock();
                this.draw();
            }
            return false;
        }
        this.draw();
        return true;
    }

    rotateCurrentBlock() {
        if (this.isPaused || !this.currentBlock) return;
        
        // 创建方块的副本进行旋转尝试
        const testBlock = this.currentBlock.clone();
        testBlock.rotate();
        
        // 如果旋转后的位置无效，尝试左右移动来适应（踢墙）
        let offset = 0;
        const maxOffset = Math.ceil(testBlock.shape.length / 2);
        
        // 先尝试原位置
        if (this.board.isValidMove(testBlock, testBlock.x, testBlock.y)) {
            this.currentBlock.rotation = testBlock.rotation;
            this.currentBlock.shape = testBlock.shape;
            this.draw();
            return true;
        }
        
        // 再尝试左右移动
        while (offset <= maxOffset) {
            // 尝试向右移动
            if (this.board.isValidMove(testBlock, testBlock.x + offset, testBlock.y)) {
                this.currentBlock.rotation = testBlock.rotation;
                this.currentBlock.shape = testBlock.shape;
                this.currentBlock.x += offset;
                this.draw();
                return true;
            }
            // 尝试向左移动
            if (this.board.isValidMove(testBlock, testBlock.x - offset, testBlock.y)) {
                this.currentBlock.rotation = testBlock.rotation;
                this.currentBlock.shape = testBlock.shape;
                this.currentBlock.x -= offset;
                this.draw();
                return true;
            }
            offset++;
        }
        
        return false;
    }

    dropCurrentBlock() {
        if (this.isPaused || !this.currentBlock) return;
        
        while (this.moveCurrentBlockDown()) {}
    }

    holdCurrentBlock() {
        if (this.isPaused || !this.currentBlock || !this.canHold) return;
        
        if (this.holdBlock === null) {
            this.holdBlock = this.currentBlock;
            this.generateNewBlock();
        } else {
            const type = this.holdBlock.type;
            this.holdBlock = this.currentBlock;
            this.currentBlock = new Block(type);
        }
        
        this.canHold = false;
        this.draw();
    }

    placeCurrentBlock() {
        if (!this.currentBlock) return false;
        
        // 尝试放置方块，如果返回false说明方块完全在游戏区域外
        if (!this.board.placeBlock(this.currentBlock)) {
            this.gameOver();
            return false;
        }
        
        this.canHold = true;
        
        // 检查是否需要更新最高分
        if (GameStorage.setHighScore(this.board.getScore())) {
            this.updateHighScore();
        }
        
        // 检查游戏是否结束
        if (this.board.isGameOver()) {
            this.gameOver();
            return false;
        }

        // 如果等级发生变化，更新游戏速度
        const newLevel = this.board.getLevel();
        if (newLevel > this.board.level) {
            this.startGameLoop();
        }
        
        return true;
    }

    generateNewBlock() {
        if (this.nextBlock === null) {
            this.nextBlock = new Block(Block.getRandomType());
        }
        
        this.currentBlock = this.nextBlock;
        this.nextBlock = new Block(Block.getRandomType());
        
        // 检查新方块是否可以放置
        if (!this.board.isValidMove(this.currentBlock, this.currentBlock.x, this.currentBlock.y)) {
            this.gameOver();
            return false;
        }
        return true;
    }

    gameOver() {
        clearInterval(this.gameLoop);
        this.gameLoop = null;
        this.isPaused = true;
        
        // 立即显示游戏结束消息
        const score = this.board.getScore();
        alert('游戏结束！\n得分：' + score);
        
        // 绘制最终状态
        this.draw();
    }

    draw() {
        // 清空所有画布
        this.gameCtx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
        this.nextCtx.clearRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        this.holdCtx.clearRect(0, 0, this.holdCanvas.width, this.holdCanvas.height);

        // 绘制背景网格
        this.drawGrid();

        // 绘制游戏板上的方块
        const grid = this.board.getGrid();
        for (let y = 0; y < this.board.height; y++) {
            for (let x = 0; x < this.board.width; x++) {
                if (grid[y][x] !== null) {
                    this.drawBlock(this.gameCtx, x, y, grid[y][x]);
                }
            }
        }

        // 绘制当前方块
        if (this.currentBlock) {
            const shape = this.currentBlock.getShape();
            const pos = this.currentBlock.getPosition();
            for (let y = 0; y < shape.length; y++) {
                for (let x = 0; x < shape[y].length; x++) {
                    if (shape[y][x]) {
                        this.drawBlock(this.gameCtx, pos.x + x, pos.y + y, this.currentBlock.getColor());
                    }
                }
            }
        }

        // 绘制下一个方块
        if (this.nextBlock) {
            this.drawPreviewBlock(this.nextCtx, this.nextBlock);
        }

        // 绘制暂存方块
        if (this.holdBlock) {
            this.drawPreviewBlock(this.holdCtx, this.holdBlock);
        }
    }

    drawGrid() {
        // 绘制背景网格
        this.gameCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.gameCtx.lineWidth = 0.5;

        // 绘制垂直线
        for (let x = 0; x <= this.board.width; x++) {
            this.gameCtx.beginPath();
            this.gameCtx.moveTo(x * this.blockSize, 0);
            this.gameCtx.lineTo(x * this.blockSize, this.gameCanvas.height);
            this.gameCtx.stroke();
        }

        // 绘制水平线
        for (let y = 0; y <= this.board.height; y++) {
            this.gameCtx.beginPath();
            this.gameCtx.moveTo(0, y * this.blockSize);
            this.gameCtx.lineTo(this.gameCanvas.width, y * this.blockSize);
            this.gameCtx.stroke();
        }
    }

    drawBlock(ctx, x, y, color) {
        const size = this.blockSize;
        ctx.fillStyle = color;
        ctx.fillRect(x * size, y * size, size, size);
        
        // 添加边框
        ctx.strokeStyle = '#333';
        ctx.strokeRect(x * size, y * size, size, size);
    }

    drawPreviewBlock(ctx, block) {
        const shape = block.getShape();
        const color = block.getColor();
        const size = this.blockSize;
        
        // 计算居中位置
        const offsetX = (4 - shape[0].length) * size / 2;
        const offsetY = (4 - shape.length) * size / 2;
        
        // 清除画布
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // 绘制方块
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    ctx.fillStyle = color;
                    ctx.fillRect(offsetX + x * size, offsetY + y * size, size, size);
                    ctx.strokeStyle = '#333';
                    ctx.strokeRect(offsetX + x * size, offsetY + y * size, size, size);
                }
            }
        }
    }

    updateUI() {
        if (this.scoreElement) this.scoreElement.textContent = this.board.getScore();
        if (this.levelElement) this.levelElement.textContent = this.board.getLevel();
        if (this.linesElement) this.linesElement.textContent = this.board.getLines();
    }

    updateHighScore() {
        const highScore = GameStorage.getHighScore() || 0;
        if (this.highScoreElement) {
            this.highScoreElement.textContent = highScore;
        }
    }

    loadSettings() {
        const settings = GameStorage.getSettings();
        document.getElementById('sound-toggle').checked = settings.soundEnabled;
        document.getElementById('music-toggle').checked = settings.musicEnabled;

        // 绑定设置变更事件
        document.getElementById('sound-toggle').addEventListener('change', (e) => {
            const settings = GameStorage.getSettings();
            settings.soundEnabled = e.target.checked;
            GameStorage.setSettings(settings);
        });

        document.getElementById('music-toggle').addEventListener('change', (e) => {
            const settings = GameStorage.getSettings();
            settings.musicEnabled = e.target.checked;
            GameStorage.setSettings(settings);
        });
    }
} 