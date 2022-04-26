class SettingsScene extends Phaser.Scene {
    constructor() {
        super(GC.SCENES.SETTINGS);
    }

    init(params) {
        this.settings = params.settings;

        Scaler.setResolution(this, GC.RESOLUTIONS.MEDIUM.INTERFACE.width, GC.RESOLUTIONS.MEDIUM.INTERFACE.height);
    }

    create() {
        this.sizer = new SettingsSizer(this);

        if (this.settings !== undefined && this.settings.speed !== undefined) {
            this.scene.speed = this.settings.speed
        } else {
            this.scene.speed = 1
        }

        let fontSize = this.sizer.fontSize();
        let fontColor = this.sizer.fontColor();

        let backButtonFontSize = this.sizer.backButtonFontSize();
        let backButtonPosition = this.sizer.backButtonPosition();
        let backButton = this.add.text(
            backButtonPosition.x, backButtonPosition.y,
            '<- menu', {
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
            this.scene.start(GC.SCENES.LEVEL_MENU, {settings: {speed: this.scene.speed}});
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
            this.scene.speed, {fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor});
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
            if (this.scene.speed > 0.2) {
                this.scene.speed = (this.scene.speed * 10 - 1) / 10;
                speedValue.text = this.scene.speed;
            }
        });

        speedPlusButton.on('pointerover', () => {
            speedPlusButton.setFontFamily('Ribeye');
        });
        speedPlusButton.on('pointerout', () => {
            speedPlusButton.setFontFamily('RibeyeMarrow');
        });
        speedPlusButton.on('pointerup', () => {
            if (this.scene.speed < 5) {
                this.scene.speed = (this.scene.speed * 10 + 1) / 10;
                speedValue.text = this.scene.speed;
            }
        });
    }
}