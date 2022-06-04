class SettingsSizer {
    constructor(scene) {
        this.scene = scene
    }

    fontSize() {
        console.log('settings', this.scene.settings);
        if (this.scene.settings.language === 'ru')
            return 54;
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
        return this.speedValueX() - this.fontSize()*1.5;
    }

    speedValueX() {
        return 600;
    }

    speedPlusButtonX() {
        return this.speedValueX() + this.fontSize()*1.5;
    }

    mistakeTimeoutLineY() {
        return 300;
    }

    mistakeTimeoutLabelLeftX() {
        return 100;
    }

    mistakeTimeoutMinusButtonX() {
        return this.mistakeTimeoutValueX() - this.fontSize()*1.5;
    }

    mistakeTimeoutValueX() {
        return 1000;
    }

    mistakeTimeoutPlusButtonX() {
        return this.mistakeTimeoutValueX() + this.fontSize()*1.5;
    }

    showCorrectRuleLineY() {
        return 400;
    }

    showCorrectRuleLabelLeftX() {
        return 100;
    }

    showCorrectRuleMinusButtonX() {
        return this.showCorrectRuleValueX() - this.fontSize()*1.5;
    }

    showCorrectRuleValueX() {
        return 1000;
    }

    showCorrectRulePlusButtonX() {
        return this.showCorrectRuleValueX() + this.fontSize()*1.5;
    }
}