class SettingsScene extends Phaser.Scene {
    constructor() {
        super(GC.SCENES.SETTINGS);
    }

    init(params) {
        this.gameScene = params.gameScene;
        this.settings = params.settings;
        this.sceneFrom = params.sceneFrom;

        Scaler.setResolution(this, GC.RESOLUTIONS.MEDIUM.INTERFACE.width, GC.RESOLUTIONS.MEDIUM.INTERFACE.height);
    }

    create() {
        this.sizer = new SettingsSizer(this);

        // if (this.settings !== undefined && this.settings.speed !== undefined) {
        //     this.scene.speed = this.settings.speed
        // } else {
        //     this.scene.speed = 1
        // }

        let fontSize = this.sizer.fontSize();
        let fontColor = this.sizer.fontColor();

        let backButtonLabel = '<- back';
        if (this.sceneFrom === GC.SCENES.LEVEL_MENU)
            backButtonLabel = '<- menu'
        else if (this.sceneFrom === GC.SCENES.GAME_PAUSE)
            backButtonLabel = '<- game'
        let backButtonFontSize = this.sizer.backButtonFontSize();
        let backButtonPosition = this.sizer.backButtonPosition();
        let backButton = this.add.text(
            backButtonPosition.x, backButtonPosition.y,
            backButtonLabel, {
                fontFamily: 'RibeyeMarrow',
                fontSize: backButtonFontSize,
                color: fontColor});
        backButton.setOrigin(0, 0);
        backButton.setInteractive();

        backButton.on('pointerover', () => {
            backButton.setFontFamily('Ribeye');
        });
        backButton.on('pointerout', () => {
            backButton.setFontFamily('RibeyeMarrow');
        });
        backButton.on('pointerup', () => {
            switch (this.sceneFrom) {
                case GC.SCENES.LEVEL_MENU:
                    this.scene.start(GC.SCENES.LEVEL_MENU, {settings: this.settings});
                    break;
                case GC.SCENES.GAME_PAUSE:
                    this.scene.start(GC.SCENES.GAME_PAUSE, {settings: this.settings, gameScene: this.gameScene});
                    break;
                default:
                    this.scene.start(this.sceneFrom, {settings: this.settings});
                    break;
            }
        });

        // let speedLinePosition = sizer.speedLinePosition();

        let speedLabelPosition = this.sizer.speedLabelPosition();
        let speedLabel = this.add.text(
            speedLabelPosition.x, speedLabelPosition.y,
            'Speed', {fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor});
        speedLabel.setOrigin(0, 0.5);

        let speedMinusButtonPosition = this.sizer.speedMinusButtonPosition();
        let speedMinusButton = this.add.text(
            speedMinusButtonPosition.x, speedMinusButtonPosition.y,
            '-', {fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor});
        speedMinusButton.setOrigin(0.5, 0.5);

        let speedValuePosition = this.sizer.speedValuePosition();
        let speedValue = this.add.text(
            speedValuePosition.x, speedValuePosition.y,
            this.settings.speed, {fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor});
        speedValue.setOrigin(0.5, 0.5);

        let speedPlusButtonPosition = this.sizer.speedPlusButtonPosition();
        let speedPlusButton = this.add.text(
            speedPlusButtonPosition.x, speedPlusButtonPosition.y,
            '+', {fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor});
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
            if (this.settings.speed > 0.2) {
                this.settings.speed = (this.settings.speed * 10 - 1) / 10;
                speedValue.text = this.settings.speed;
            }
        });

        speedPlusButton.on('pointerover', () => {
            speedPlusButton.setFontFamily('Ribeye');
        });
        speedPlusButton.on('pointerout', () => {
            speedPlusButton.setFontFamily('RibeyeMarrow');
        });
        speedPlusButton.on('pointerup', () => {
            if (this.settings.speed < 5) {
                this.settings.speed = (this.settings.speed * 10 + 1) / 10;
                speedValue.text = this.settings.speed;
            }
        });
    }
}