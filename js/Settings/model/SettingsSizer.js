class SettingsSizer {
    constructor(scene) {
        this.scene = scene
    }

    fontSize() {
        return 60;
    }

    labelsFontSize() {
        if (this.scene.settings.language === 'ru')
            return 53;
        return 70;
    }

    fontColor() {
        return '#000';
    }

    speedLabelX() {
        return 100;
    }

    backButtonPosition() {
        return { x: 50, y: 10 };
    }

    backButtonFontSize() {
        return 60;
    }

    speedLineY() {
        return 200;
    }

    speedMinusButtonX() {
        return this.speedValueX() - this.fontSize()*1.3;
    }

    speedValueX() {
        return 600;
    }

    speedPlusButtonX() {
        return this.speedValueX() + this.fontSize()*1.3;
    }

    mistakeTimeoutLineY() {
        return 300;
    }

    mistakeTimeoutLabelLeftX() {
        return 100;
    }

    mistakeTimeoutMinusButtonX() {
        return this.mistakeTimeoutValueX() - this.fontSize()*1.3;
    }

    mistakeTimeoutValueX() {
        return 1000;
    }

    mistakeTimeoutPlusButtonX() {
        return this.mistakeTimeoutValueX() + this.fontSize()*1.3;
    }

    showCorrectRuleLineY() {
        return 400;
    }

    showCorrectRuleLabelLeftX() {
        return 100;
    }

    showCorrectRuleMinusButtonX() {
        return this.showCorrectRuleValueX() - this.fontSize()*1.3;
    }

    showCorrectRuleValueX() {
        return 1000;
    }

    showCorrectRulePlusButtonX() {
        return this.showCorrectRuleValueX() + this.fontSize()*1.3;
    }

    languageLineY() {
        return 500;
    }

    languageLabelX() {
        return 100;
    }

    languageTileX(index) {
        return 600 + index * 100;
    }

    languageTile_FontSize() {
        return 40;
    }
}