class Board {
    constructor(width = 10, height = 20) {
        this.width = width;
        this.height = height;
        this.grid = Array(height).fill().map(() => Array(width).fill(null));
        this.score = 0;
        this.level = 1;
        this.lines = 0;
    }

    isValidMove(block, x, y) {
        const shape = block.getShape();
        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
                if (shape[i][j]) {
                    const newX = x + j;
                    const newY = y + i;
                    
                    if (newY < 0) continue;
                    
                    if (newX < 0 || newX >= this.width || 
                        newY >= this.height || 
                        (newY >= 0 && this.grid[newY][newX] !== null)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    placeBlock(block) {
        const shape = block.getShape();
        const pos = block.getPosition();
        const color = block.getColor();
        let hasPlacedBlocks = false;

        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
                if (shape[i][j]) {
                    const y = pos.y + i;
                    const x = pos.x + j;
                    if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
                        this.grid[y][x] = color;
                        hasPlacedBlocks = true;
                    }
                }
            }
        }

        if (hasPlacedBlocks) {
            this.checkLines();
        }

        return hasPlacedBlocks;
    }

    checkLines() {
        let linesCleared = 0;
        let y = this.height - 1;
        
        while (y >= 0) {
            if (this.isLineFull(y)) {
                this.clearLine(y);
                linesCleared++;
            } else {
                y--;
            }
        }
        
        if (linesCleared > 0) {
            this.updateScore(linesCleared);
            this.updateLevel();
            this.dropLines();
            return true;
        }
        
        return false;
    }

    dropLines() {
        for (let y = this.height - 1; y >= 0; y--) {
            if (this.isLineEmpty(y)) {
                let sourceY = y - 1;
                while (sourceY >= 0 && this.isLineEmpty(sourceY)) {
                    sourceY--;
                }
                
                if (sourceY >= 0) {
                    for (let x = 0; x < this.width; x++) {
                        this.grid[y][x] = this.grid[sourceY][x];
                        this.grid[sourceY][x] = null;
                    }
                }
            }
        }
    }

    updateScore(linesCleared) {
        const points = [0, 40, 100, 300, 1200]; // 0,1,2,3,4行的得分
        this.score += points[linesCleared] * this.level;
        this.lines += linesCleared;
        this.level = Math.floor(this.lines / 10) + 1;
    }

    isGameOver() {
        return this.grid[0].some(cell => cell !== null) && 
               this.grid[1].some(cell => cell !== null);
    }

    clear() {
        this.grid = Array(this.height).fill().map(() => Array(this.width).fill(null));
        this.score = 0;
        this.level = 1;
        this.lines = 0;
    }

    getGrid() {
        return this.grid;
    }

    getScore() {
        return this.score;
    }

    getLevel() {
        return this.level;
    }

    getLines() {
        return this.lines;
    }

    isLineFull(y) {
        return this.grid[y].every(cell => cell !== null);
    }

    isLineEmpty(y) {
        return this.grid[y].every(cell => cell === null);
    }

    clearLine(y) {
        // 清除该行
        for (let x = 0; x < this.width; x++) {
            this.grid[y][x] = null;
        }
    }

    updateLevel() {
        // 每消除10行升一级
        this.level = Math.floor(this.lines / 10) + 1;
    }
} 