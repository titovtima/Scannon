class SettingsScene extends Phaser.Scene {
    constructor() {
        super(GC.SCENES.SETTINGS);
    }

    init(params) {
        this.gameScene = params.gameScene;
        this.settings = params.settings;
        this.sceneFrom = params.sceneFrom;
        this.levelNumber = params.levelNumber;

        this.strings = this.settings.strings.settings_scene;

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
        let backButtonLabel = '<- ' + this.strings.back;
        if (this.sceneFrom === GC.SCENES.LEVEL_MENU)
            backButtonLabel = '<- ' + this.strings.back_to_menu;
        else if (this.sceneFrom === GC.SCENES.GAME_PAUSE)
            backButtonLabel = '<- ' + this.strings.back_to_game;
        let backButtonFontSize = this.sizer.backButtonFontSize();
        let backButtonPosition = this.sizer.backButtonPosition();
        let fontColor = this.sizer.fontColor();

        let backButton = this.add.text(
            backButtonPosition.x, backButtonPosition.y,
            backButtonLabel, {
                fontFamily: GC.FONTS.BUTTON_OUT,
                fontSize: backButtonFontSize,
                color: fontColor});
        backButton.setOrigin(0, 0);
        backButton.setInteractive();

        backButton.on('pointerover', () => {
            backButton.setFontFamily(GC.FONTS.BUTTON_OVER);
        });
        backButton.on('pointerout', () => {
            backButton.setFontFamily(GC.FONTS.BUTTON_OUT);
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
        let text = this.strings.settings_names.speed;

        let speedLineY = this.sizer.speedLineY();
        let speedLabelX = this.sizer.speedLabelX();
        let speedLabel = this.add.text(
            speedLabelX, speedLineY,
            text, {fontFamily: GC.FONTS.BUTTON_OUT, fontSize: fontSize, color: fontColor});
        speedLabel.setOrigin(0, 0.5);

        let speedMinusButtonX = this.sizer.speedMinusButtonX();
        let speedMinusButton = this.add.text(
            speedMinusButtonX, speedLineY,
            '-', {fontFamily: GC.FONTS.BUTTON_OUT, fontSize: fontSize, color: fontColor});
        speedMinusButton.setOrigin(0.5, 0.5);

        let speedValueX = this.sizer.speedValueX();
        let speedValue = this.add.text(
            speedValueX, speedLineY,
            this.settings.speed, {fontFamily: GC.FONTS.BUTTON_OUT, fontSize: fontSize, color: fontColor});
        speedValue.setOrigin(0.5, 0.5);

        let speedPlusButtonX = this.sizer.speedPlusButtonX();
        let speedPlusButton = this.add.text(
            speedPlusButtonX, speedLineY,
            '+', {fontFamily: GC.FONTS.BUTTON_OUT, fontSize: fontSize, color: fontColor});
        speedPlusButton.setOrigin(0.5, 0.5);

        speedMinusButton.setInteractive();
        speedPlusButton.setInteractive();

        speedMinusButton.on('pointerover', () => {
            speedMinusButton.setFontFamily(GC.FONTS.BUTTON_OVER);
        });
        speedMinusButton.on('pointerout', () => {
            speedMinusButton.setFontFamily(GC.FONTS.BUTTON_OUT);
        });
        speedMinusButton.on('pointerup', () => {
            if (this.settings.speed > 0.2) {
                this.settings.speed = (this.settings.speed * 10 - 1) / 10;
                speedValue.text = this.settings.speed;
            }
        });

        speedPlusButton.on('pointerover', () => {
            speedPlusButton.setFontFamily(GC.FONTS.BUTTON_OVER);
        });
        speedPlusButton.on('pointerout', () => {
            speedPlusButton.setFontFamily(GC.FONTS.BUTTON_OUT);
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
        let text = this.strings.settings_names.mistake_timeout;

        let label = this.add.text(labelLeftX, positionY, text,
            {fontFamily: GC.FONTS.BUTTON_OUT, fontSize: fontSize, color: fontColor});
        label.setOrigin(0, 0.5);

        let minusButtonX = this.sizer.mistakeTimeoutMinusButtonX();
        let minusButton = this.add.text(minusButtonX, positionY, '-',
            {fontFamily: GC.FONTS.BUTTON_OUT, fontSize: fontSize, color: fontColor});
        minusButton.setOrigin(0.5, 0.5);
        minusButton.setInteractive();

        minusButton.on('pointerover', () => {
            minusButton.setFontFamily(GC.FONTS.BUTTON_OVER);
        });
        minusButton.on('pointerout', () => {
            minusButton.setFontFamily(GC.FONTS.BUTTON_OUT);
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
            {fontFamily: GC.FONTS.BUTTON_OUT, fontSize: fontSize, color: fontColor});
        timeoutValue.setOrigin(0.5, 0.5);

        let plusButtonX = this.sizer.mistakeTimeoutPlusButtonX();
        let plusButton = this.add.text(plusButtonX, positionY, '+',
            {fontFamily: GC.FONTS.BUTTON_OUT, fontSize: fontSize, color: fontColor});
        plusButton.setOrigin(0.5, 0.5);
        plusButton.setInteractive();

        plusButton.on('pointerover', () => {
            plusButton.setFontFamily(GC.FONTS.BUTTON_OVER);
        });
        plusButton.on('pointerout', () => {
            plusButton.setFontFamily(GC.FONTS.BUTTON_OUT);
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
        let text = this.strings.settings_names.show_correct_rule;

        let labelLeftX = this.sizer.showCorrectRuleLabelLeftX();
        let label = this.add.text(labelLeftX, positionY, text,
            {fontFamily: GC.FONTS.BUTTON_OUT, fontSize: fontSize, color: fontColor});
        label.setOrigin(0, 0.5);

        let minusButtonX = this.sizer.showCorrectRuleMinusButtonX();
        let minusButton = this.add.text(minusButtonX, positionY, '-',
            {fontFamily: GC.FONTS.BUTTON_OUT, fontSize: fontSize, color: fontColor});
        minusButton.setOrigin(0.5, 0.5);
        minusButton.setInteractive();

        minusButton.on('pointerover', () => {
            minusButton.setFontFamily(GC.FONTS.BUTTON_OVER);
        });
        minusButton.on('pointerout', () => {
            minusButton.setFontFamily(GC.FONTS.BUTTON_OUT);
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
            {fontFamily: GC.FONTS.BUTTON_OUT, fontSize: fontSize, color: fontColor});
        showCorrectRuleValue.setOrigin(0.5, 0.5);

        let plusButtonX = this.sizer.showCorrectRulePlusButtonX();
        let plusButton = this.add.text(plusButtonX, positionY, '+',
            {fontFamily: GC.FONTS.BUTTON_OUT, fontSize: fontSize, color: fontColor});
        plusButton.setOrigin(0.5, 0.5);
        plusButton.setInteractive();

        plusButton.on('pointerover', () => {
            plusButton.setFontFamily(GC.FONTS.BUTTON_OVER);
        });
        plusButton.on('pointerout', () => {
            plusButton.setFontFamily(GC.FONTS.BUTTON_OUT);
        });
        plusButton.on('pointerup', () => {
            if (this.settings.showCorrectRule < 10) {
                this.settings.showCorrectRule = (this.settings.showCorrectRule * 2 + 1) / 2;
                showCorrectRuleValue.text = this.settings.showCorrectRule + 's';
            }
        });
    }

}