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
        return 220;
    }

    scoreValue_Color() {
        return '#000';
    }

    menuItem_CenterX(label) {
        return this.screen_CenterX();
    }

    menuItem_CenterY(label) {
        let firstItemCenterY = 602;
        let distanceBetween = 100;

        switch (label) {
            case 'Restart':
                return firstItemCenterY;
            case 'Choose Level':
                return firstItemCenterY + distanceBetween;
            case 'Main Menu':
                return firstItemCenterY + 2 * distanceBetween;
        }
    }

    menuItem_FontSize() {
        return 70;
    }

    menuItem_Color() {
        return '#000';
    }

}