class GameCompleteSizer {

    constructor(scene) {
        this.scene = scene;
    }

    screen_CenterX() {
        return this.scene.game.renderer.width / 2;
    }

    scoreLabel_CenterX() {
        return this.screen_CenterX();
    }

    scoreLabel_CenterY() {
        return 187;
    }

    scoreLabel_FontSize() {
        return 44;
    }

    scoreLabel_Color() {
        return '#000';
    }

    scoreValue_CenterX() {
        return this.screen_CenterX();
    }

    scoreValue_CenterY() {
        return 362;
    }

    scoreValue_FontSize() {
        return 200;
    }

    scoreValue_Color() {
        return '#000';
    }

    menuItem_CenterX(label) {
        return this.screen_CenterX();
    }

    menuItem_CenterY(index) {
        let firstItemCenterY = 570;
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

    menuItem_FontSize() {
        return 65;
    }

    menuItem_Color() {
        return '#000';
    }

}