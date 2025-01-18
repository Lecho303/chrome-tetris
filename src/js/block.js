class Block {
    constructor(type) {
        this.type = type;
        this.shapes = {
            'I': [
                [[0,0,0,0],
                 [1,1,1,1],
                 [0,0,0,0],
                 [0,0,0,0]],
                [[0,0,1,0],
                 [0,0,1,0],
                 [0,0,1,0],
                 [0,0,1,0]]
            ],
            'J': [
                [[1,0,0],
                 [1,1,1],
                 [0,0,0]],
                [[0,1,1],
                 [0,1,0],
                 [0,1,0]],
                [[0,0,0],
                 [1,1,1],
                 [0,0,1]],
                [[0,1,0],
                 [0,1,0],
                 [1,1,0]]
            ],
            'L': [
                [[0,0,1],
                 [1,1,1],
                 [0,0,0]],
                [[0,1,0],
                 [0,1,0],
                 [0,1,1]],
                [[0,0,0],
                 [1,1,1],
                 [1,0,0]],
                [[1,1,0],
                 [0,1,0],
                 [0,1,0]]
            ],
            'O': [
                [[1,1],
                 [1,1]]
            ],
            'S': [
                [[0,1,1],
                 [1,1,0],
                 [0,0,0]],
                [[0,1,0],
                 [0,1,1],
                 [0,0,1]]
            ],
            'T': [
                [[0,1,0],
                 [1,1,1],
                 [0,0,0]],
                [[0,1,0],
                 [0,1,1],
                 [0,1,0]],
                [[0,0,0],
                 [1,1,1],
                 [0,1,0]],
                [[0,1,0],
                 [1,1,0],
                 [0,1,0]]
            ],
            'Z': [
                [[1,1,0],
                 [0,1,1],
                 [0,0,0]],
                [[0,0,1],
                 [0,1,1],
                 [0,1,0]]
            ]
        };
        this.colors = {
            'I': '#00f0f0',
            'J': '#0000f0',
            'L': '#f0a000',
            'O': '#f0f000',
            'S': '#00f000',
            'T': '#a000f0',
            'Z': '#f00000'
        };
        
        this.rotation = 0;
        this.shape = this.shapes[type][this.rotation];
        this.color = this.colors[type];
        
        // 设置初始位置（居中，并根据方块类型调整初始Y位置）
        this.x = Math.floor((10 - this.shape[0].length) / 2);
        this.y = type === 'I' ? -1 : 0; // I型方块从-1开始，其他从0开始
    }

    rotate() {
        // 获取当前形状的所有可能旋转状态
        const rotations = this.shapes[this.type];
        // 计算下一个旋转状态
        const nextRotation = (this.rotation + 1) % rotations.length;
        // 更新旋转状态和形状
        this.rotation = nextRotation;
        this.shape = rotations[this.rotation];
        return this.shape;
    }

    moveLeft() {
        this.x--;
    }

    moveRight() {
        this.x++;
    }

    moveDown() {
        this.y++;
    }

    getShape() {
        return this.shape;
    }

    getColor() {
        return this.color;
    }

    getPosition() {
        return {x: this.x, y: this.y};
    }

    static getRandomType() {
        const types = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
        return types[Math.floor(Math.random() * types.length)];
    }

    // 添加克隆方法
    clone() {
        const newBlock = new Block(this.type);
        newBlock.x = this.x;
        newBlock.y = this.y;
        newBlock.rotation = this.rotation;
        newBlock.shape = this.shapes[this.type][this.rotation];
        return newBlock;
    }
} 