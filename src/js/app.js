// 初始化游戏
function initGame() {
    try {
        console.log('Initializing game...');
        
        // 检查DOM元素
        const gameCanvas = document.getElementById('game-canvas');
        const nextCanvas = document.getElementById('next-canvas');
        const holdCanvas = document.getElementById('hold-canvas');
        
        if (!gameCanvas || !nextCanvas || !holdCanvas) {
            throw new Error('Required canvas elements not found');
        }
        
        console.log('Canvas elements found');
        
        // 创建游戏实例
        const game = new Game();
        console.log('Game instance created');
        
        // 创建控制器实例
        const controller = new Controller(game);
        console.log('Controller instance created');
        
        // 初始化游戏界面
        game.draw();
        console.log('Initial game state drawn');
        
        return { game, controller };
    } catch (error) {
        console.error('Error during game initialization:', error);
        throw error;
    }
}

// 等待DOM加载完成
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM Content Loaded');
        initGame();
    });
} else {
    console.log('DOM already loaded');
    initGame();
} 