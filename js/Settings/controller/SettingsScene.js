class SettingsScene extends Phaser.Scene {
    constructor() {
        super(GC.SCENES.SETTINGS);
    }

    init() {
        Scaler.setResolution(this, GC.RESOLUTIONS.MEDIUM.INTERFACE.width, GC.RESOLUTIONS.MEDIUM.INTERFACE.height);
    }

    create() {
        let sizer = new SettingsSizer(this);
        let add = this.add;
        let scene = this.scene;

        WebFont.load({
            'custom': {
                families: [ 'Ribeye', 'RibeyeMarrow' ]
            },
            active: function() {
                let fontSize = sizer.fontSize();
                let fontColor = sizer.fontColor();

                let speedLabelPosition = sizer.speedLabelPosition();
                let speedLabel = add.text(
                    speedLabelPosition.x, speedLabelPosition.y,
                    'Speed', { fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor});
                speedLabel.setOrigin(0);

                let backButtonPosition = sizer.backButtonPosition();
                let backButton = add.text(
                    backButtonPosition.x, backButtonPosition.y,
                    'Back to Main menu', { fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor});
                backButton.setOrigin(1, 0);
                backButton.setInteractive();

                backButton.on('pointerover', () => {
                    backButton.setFontFamily('Ribeye');
                });
                backButton.on('pointerout', () => {
                    backButton.setFontFamily('RibeyeMarrow');
                });
                backButton.on('pointerup', () => {
                    scene.start(GC.SCENES.MAIN_MENU);
                });

            }
        })
    }
}