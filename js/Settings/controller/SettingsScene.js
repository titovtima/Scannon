class SettingsScene extends Phaser.Scene {
    constructor() {
        super(GC.SCENES.SETTINGS);
    }

    init(params) {
        this.settings = params.settings;

        Scaler.setResolution(this, GC.RESOLUTIONS.MEDIUM.INTERFACE.width, GC.RESOLUTIONS.MEDIUM.INTERFACE.height);
    }

    create() {
        let sizer = new SettingsSizer(this);
        let add = this.add;
        let scene = this.scene;

        if (this.settings !== undefined && this.settings.speed !== undefined) {
            this.scene.speed = this.settings.speed
        } else {
            this.scene.speed = 1
        }

        WebFont.load({
            'custom': {
                families: [ 'Ribeye', 'RibeyeMarrow' ]
            },
            active: function() {
                let fontSize = sizer.fontSize();
                let fontColor = sizer.fontColor();

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
                    scene.start(GC.SCENES.MAIN_MENU, { settings: { speed: scene.speed }});
                });

                // let speedLinePosition = sizer.speedLinePosition();

                let speedLabelPosition = sizer.speedLabelPosition();
                let speedLabel = add.text(
                    speedLabelPosition.x, speedLabelPosition.y,
                    'Speed', { fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor});
                speedLabel.setOrigin(0, 0.5);

                let speedMinusButtonPosition = sizer.speedMinusButtonPosition();
                let speedMinusButton = add.text(
                    speedMinusButtonPosition.x, speedMinusButtonPosition.y,
                    '-', { fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor});
                speedMinusButton.setOrigin(0.5, 0.5);

                let speedValuePosition = sizer.speedValuePosition();
                let speedValue = add.text(
                    speedValuePosition.x, speedValuePosition.y,
                    scene.speed, { fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor});
                speedValue.setOrigin(0.5, 0.5);

                let speedPlusButtonPosition = sizer.speedPlusButtonPosition();
                let speedPlusButton = add.text(
                    speedPlusButtonPosition.x, speedPlusButtonPosition.y,
                    '+', { fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor});
                speedPlusButton.setOrigin(0.5, 0.5);

                speedMinusButton.setInteractive();
                speedPlusButton.setInteractive();

                speedMinusButton.on('pointerover', () => {
                    speedMinusButton.setFontFamily('Ribeye');
                });
                speedMinusButton.on('pointerout', () => {
                    speedMinusButton.setFontFamily('RibeyeMarrow');
                });
                speedMinusButton.on('pointerup', () => {
                    if (scene.speed > 0.2) {
                        scene.speed = (scene.speed * 10 - 1) / 10;
                        speedValue.text = scene.speed;
                    }
                });

                speedPlusButton.on('pointerover', () => {
                    speedPlusButton.setFontFamily('Ribeye');
                });
                speedPlusButton.on('pointerout', () => {
                    speedPlusButton.setFontFamily('RibeyeMarrow');
                });
                speedPlusButton.on('pointerup', () => {
                    if (scene.speed < 5) {
                        scene.speed = (scene.speed * 10 + 1) / 10;
                        speedValue.text = scene.speed;
                    }
                });
            }
        })
    }
}