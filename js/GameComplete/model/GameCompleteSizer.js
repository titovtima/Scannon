class GameCompleteSizer {

    constructor(scene) {
        this.scene = scene;
    }

    screen_CenterX() {
        return this.scene.game.renderer.width / 2;
    }

    levelScoreLabel_CenterX() {
        return 300;
    }

    levelScoreLabel_CenterY() {
        return 187;
    }

    levelScoreLabel_FontSize() {
        return 44;
    }

    levelScoreLabel_Color() {
        return '#000';
    }

    levelScoreValue_CenterX() {
        return this.levelScoreLabel_CenterX();
    }

    levelScoreValue_CenterY() {
        return 362;
    }

    levelScoreValue_FontSize() {
        return 200;
    }

    levelScoreValue_Color() {
        return '#000';
    }

    totalScoreLabel_CenterX() {
        return this.screen_CenterX();
    }

    totalScoreLabel_CenterY() {
        return 150;
    }

    totalScoreLabel_FontSize() {
        return 60;
    }

    totalScoreLabel_Color() {
        return '#000';
    }

    totalScoreValue_CenterX() {
        return this.totalScoreLabel_CenterX();
    }

    totalScoreValue_CenterY() {
        return 400;
    }

    totalScoreValue_FontSize() {
        return 250;
    }

    totalScoreValue_Color() {
        return '#000';
    }

    menuItem_CenterX(label) {
        return this.screen_CenterX();
    }

    menuItem_CenterY(index) {
        let firstItemCenterY = 700;
        let distanceBetween = 80;
        return firstItemCenterY + index * distanceBetween;

        // switch (label) {
        //     case 'Restart':
        //         return firstItemCenterY;
        //     case 'Main Menu':
        //         return firstItemCenterY + distanceBetween;
        //     case 'Save sequence':
        //         return firstItemCenterY + 2 * distanceBetween;
        // }
    }

    levelMenuItem_CenterX(label) {
        return this.levelScoreLabel_CenterX();
    }

    levelMenuItem_CenterY(index) {
        let firstItemCenterY = 570;
        let distanceBetween = 60;
        return firstItemCenterY + index * distanceBetween;
    }

    menuItem_FontSize() {
        return 65;
    }

    menuItem_Color() {
        return '#000';
    }

    levelMenuItem_FontSize() {
        return 50;
    }

    levelMenuItem_Color() {
        return this.menuItem_Color();
    }

}