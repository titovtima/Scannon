const config = {
    width: 1200,
    height: 800,
    backgroundColor: 0xffcc66,
    scene: [MainMenuScene],
    // pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.RESIZE
    }
};

let game = new Phaser.Game(config);