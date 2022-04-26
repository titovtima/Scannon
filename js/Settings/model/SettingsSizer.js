class SettingsSizer {
    constructor(scene) {
        this.scene = scene
    }

    fontSize() {
        return 75;
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
        return { x: 500, y: 220 };
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
}