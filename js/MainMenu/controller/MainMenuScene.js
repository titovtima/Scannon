class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenuScene')
    }

    init()
    {
        //  Inject our CSS
        let element = document.createElement('style');
        document.head.appendChild(element);

        let sheet = element.sheet;

        let ribeyeMarrowStyles = '@font-face { font-family: "RibeyeMarrow"; src: url("/fonts/RibeyeMarrow-Regular.ttf") format("truetype"); }\n';
        sheet.insertRule(ribeyeMarrowStyles, 0);

        let ribeyeStyles = '@font-face { font-family: "Ribeye"; src: url("/fonts/Ribeye-Regular.ttf") format("truetype"); }\n';
        sheet.insertRule(ribeyeStyles, 0);
    }

    preload() {
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }

    create() {
        let add = this.add;
        let game = this.game;

        WebFont.load({
            'custom': {
                families: [ 'Ribeye', 'RibeyeMarrow' ]
            },
            active: function() {
                let centerX = game.renderer.width / 2;
                let centerY = game.renderer.height / 2;

                let playButton = add.text(centerX, centerY - 145, 'Play', { fontFamily: 'RibeyeMarrow', fontSize: 115, color: '#000' });

                playButton.setInteractive();
                playButton.setOrigin(0.5);
                playButton.on('pointerover', () => {
                    playButton.setFontFamily('Ribeye');
                });
                playButton.on('pointerout', () => {
                    playButton.setFontFamily('RibeyeMarrow');
                });

                let howToPlayButton = add.text(centerX, centerY, 'How to play', { fontFamily: 'RibeyeMarrow', fontSize: 115, color: '#000' });

                howToPlayButton.setInteractive();
                howToPlayButton.setOrigin(0.5);
                howToPlayButton.on('pointerover', () => {
                    howToPlayButton.setFontFamily('Ribeye');
                });
                howToPlayButton.on('pointerout', () => {
                    howToPlayButton.setFontFamily('RibeyeMarrow');
                });

                let settingsButton = add.text(centerX, centerY + 145, 'Settings', { fontFamily: 'RibeyeMarrow', fontSize: 115, color: '#000' });

                settingsButton.setInteractive();
                settingsButton.setOrigin(0.5);
                settingsButton.on('pointerover', () => {
                    settingsButton.setFontFamily('Ribeye');
                });
                settingsButton.on('pointerout', () => {
                    settingsButton.setFontFamily('RibeyeMarrow');
                });
            }
        })
    };
}