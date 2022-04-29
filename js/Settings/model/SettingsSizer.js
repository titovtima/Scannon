class SettingsSizer {
    constructor(scene) {
        this.scene = scene
    }

    fontSize() {
        return 70;
    }

    fontColor() {
        return '#000';
    }

    speedLabelPosition() {
        return { x: 100, y: this.speedLinePosition().y };
    }

    backButtonPosition() {
        return { x: 50, y: 10 };
    }

    backButtonFontSize() {
        return 60;
    }

    speedLinePosition() {
        return { x: 500, y: 200 };
    }

    speedMinusButtonPosition() {
        return { x: 500, y: this.speedLinePosition().y };
    }

    speedValuePosition() {
        return { x: 600, y: this.speedLinePosition().y };
    }

    speedPlusButtonPosition() {
        return { x: 700, y: this.speedLinePosition().y };
    }

    mistakeTimeoutLineY() {
        return 300;
    }

    mistakeTimeoutLabelLeftX() {
        return 100;
    }

    mistakeTimeoutMinusButtonX() {
        return 900;
    }

    mistakeTimeoutValueX() {
        return 1000;
    }

    mistakeTimeoutPlusButtonX() {
        return 1100;
    }

    showCorrectRuleLineY() {
        return 400;
    }

    showCorrectRuleLabelLeftX() {
        return 100;
    }

    showCorrectRuleMinusButtonX() {
        return 900;
    }

    showCorrectRuleValueX() {
        return 1000;
    }

    showCorrectRulePlusButtonX() {
        return 1100;
    }
}