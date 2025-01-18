class IconGenerator {
    static generateIcons() {
        const sizes = [16, 48, 128];
        const icons = {};

        sizes.forEach(size => {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');

            // 绘制背景
            ctx.fillStyle = '#1e90ff';
            ctx.fillRect(0, 0, size, size);

            // 绘制俄罗斯方块图案
            ctx.fillStyle = '#4169e1';
            const blockSize = Math.floor(size / 4);
            
            // T形方块图案
            const blocks = [
                [1, 1, 1],
                [0, 1, 0]
            ];

            const offsetX = Math.floor((size - blocks[0].length * blockSize) / 2);
            const offsetY = Math.floor((size - blocks.length * blockSize) / 2);

            blocks.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (cell) {
                        ctx.fillRect(
                            offsetX + x * blockSize,
                            offsetY + y * blockSize,
                            blockSize,
                            blockSize
                        );
                        // 添加高光效果
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                        ctx.fillRect(
                            offsetX + x * blockSize,
                            offsetY + y * blockSize,
                            blockSize / 2,
                            blockSize / 2
                        );
                        ctx.fillStyle = '#4169e1';
                    }
                });
            });

            // 添加边框
            ctx.strokeStyle = '#000';
            ctx.lineWidth = Math.max(1, size / 32);
            ctx.strokeRect(0, 0, size, size);

            // 转换为Base64
            icons[size] = canvas.toDataURL();
        });

        return icons;
    }

    static async updateExtensionIcons() {
        const icons = this.generateIcons();
        
        // 更新图标
        if (chrome && chrome.action) {
            await chrome.action.setIcon({
                path: {
                    "16": icons[16],
                    "48": icons[48],
                    "128": icons[128]
                }
            });
        }
    }
} 