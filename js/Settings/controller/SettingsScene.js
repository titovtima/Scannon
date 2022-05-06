class SettingsScene extends Phaser.Scene {
    constructor() {
        super(GC.SCENES.SETTINGS);
    }

    init(params) {
        this.gameScene = params.gameScene;
        this.settings = params.settings;
        this.sceneFrom = params.sceneFrom;
        this.levelNumber = params.levelNumber;

        Scaler.setResolution(this, GC.RESOLUTIONS.MEDIUM.INTERFACE.width, GC.RESOLUTIONS.MEDIUM.INTERFACE.height);
    }

    create() {
        this.sizer = new SettingsSizer(this);

        this.placeBackButton();
        this.placeSpeedSetting();
        this.placeMistakeTimeoutSetting();
        this.placeShowCorrectRuleSetting();
    }

    placeBackButton() {
        let backButtonLabel = '<- back';
        if (this.sceneFrom === GC.SCENES.LEVEL_MENU)
            backButtonLabel = '<- menu'
        else if (this.sceneFrom === GC.SCENES.GAME_PAUSE)
            backButtonLabel = '<- game'
        let backButtonFontSize = this.sizer.backButtonFontSize();
        let backButtonPosition = this.sizer.backButtonPosition();
        let fontColor = this.sizer.fontColor();

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
                    this.scene.start(GC.SCENES.GAME_PAUSE, {
                        settings: this.settings,
                        gameScene: this.gameScene,
                        levelNumber: this.levelNumber
                    });
                    break;
                default:
                    this.scene.start(this.sceneFrom, {settings: this.settings});
                    break;
            }
        });
    }

    placeSpeedSetting() {
        let fontSize = this.sizer.fontSize();
        let fontColor = this.sizer.fontColor();

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

    placeMistakeTimeoutSetting() {
        let positionY = this.sizer.mistakeTimeoutLineY();
        let labelLeftX = this.sizer.mistakeTimeoutLabelLeftX();

        let fontSize = this.sizer.fontSize();
        let fontColor = this.sizer.fontColor();

        let label = this.add.text(labelLeftX, positionY, 'Mistake Timeout',
            {fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor});
        label.setOrigin(0, 0.5);

        let minusButtonX = this.sizer.mistakeTimeoutMinusButtonX();
        let minusButton = this.add.text(minusButtonX, positionY, '-',
            {fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor});
        minusButton.setOrigin(0.5, 0.5);
        minusButton.setInteractive();

        minusButton.on('pointerover', () => {
            minusButton.setFontFamily('Ribeye');
        });
        minusButton.on('pointerout', () => {
            minusButton.setFontFamily('RibeyeMarrow');
        });
        minusButton.on('pointerup', () => {
            if (this.settings.mistakeTimeout > 0) {
                this.settings.mistakeTimeout = (this.settings.mistakeTimeout * 2 - 1) / 2;
                timeoutValue.text = this.settings.mistakeTimeout + 's';
            }
        });

        let timeoutValueX = this.sizer.mistakeTimeoutValueX();
        let timeoutValue = this.add.text(timeoutValueX, positionY,
            this.settings.mistakeTimeout + 's',
            {fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor});
        timeoutValue.setOrigin(0.5, 0.5);

        let plusButtonX = this.sizer.mistakeTimeoutPlusButtonX();
        let plusButton = this.add.text(plusButtonX, positionY, '+',
            {fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor});
        plusButton.setOrigin(0.5, 0.5);
        plusButton.setInteractive();

        plusButton.on('pointerover', () => {
            plusButton.setFontFamily('Ribeye');
        });
        plusButton.on('pointerout', () => {
            plusButton.setFontFamily('RibeyeMarrow');
        });
        plusButton.on('pointerup', () => {
            if (this.settings.mistakeTimeout < 10) {
                this.settings.mistakeTimeout = (this.settings.mistakeTimeout * 2 + 1) / 2;
                timeoutValue.text = this.settings.mistakeTimeout + 's';
            }
        });
    }

    placeShowCorrectRuleSetting() {
        let positionY = this.sizer.showCorrectRuleLineY();
        let fontSize = this.sizer.fontSize();
        let fontColor = this.sizer.fontColor();

        let labelLeftX = this.sizer.showCorrectRuleLabelLeftX();
        let label = this.add.text(labelLeftX, positionY, 'Show Correct Rule',
            {fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor});
        label.setOrigin(0, 0.5);

        let minusButtonX = this.sizer.showCorrectRuleMinusButtonX();
        let minusButton = this.add.text(minusButtonX, positionY, '-',
            {fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor});
        minusButton.setOrigin(0.5, 0.5);
        minusButton.setInteractive();

        minusButton.on('pointerover', () => {
            minusButton.setFontFamily('Ribeye');
        });
        minusButton.on('pointerout', () => {
            minusButton.setFontFamily('RibeyeMarrow');
        });
        minusButton.on('pointerup', () => {
            if (this.settings.showCorrectRule > 0) {
                this.settings.showCorrectRule = (this.settings.showCorrectRule * 2 - 1) / 2;
                showCorrectRuleValue.text = this.settings.showCorrectRule + 's';
            }
        });

        let showCorrectRuleValueX = this.sizer.showCorrectRuleValueX();
        let showCorrectRuleValue = this.add.text(showCorrectRuleValueX, positionY,
            this.settings.showCorrectRule + 's',
            {fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor});
        showCorrectRuleValue.setOrigin(0.5, 0.5);

        let plusButtonX = this.sizer.showCorrectRulePlusButtonX();
        let plusButton = this.add.text(plusButtonX, positionY, '+',
            {fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor});
        plusButton.setOrigin(0.5, 0.5);
        plusButton.setInteractive();

        plusButton.on('pointerover', () => {
            plusButton.setFontFamily('Ribeye');
        });
        plusButton.on('pointerout', () => {
            plusButton.setFontFamily('RibeyeMarrow');
        });
        plusButton.on('pointerup', () => {
            if (this.settings.showCorrectRule < 10) {
                this.settings.showCorrectRule = (this.settings.showCorrectRule * 2 + 1) / 2;
                showCorrectRuleValue.text = this.settings.showCorrectRule + 's';
            }
        });
    }

}