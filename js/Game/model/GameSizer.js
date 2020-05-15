class GameSizer {

    constructor(scene) {
        this.scene = scene;
    }

    cardBackground_Width() {
        return 800;
    }

    cardBackground_Height() {
        return 110;
    }

    cardBackground_LeftX() {
        return 25;
    }

    cardBackground_ShadowY() {
        return 10;
    }

    cardBackground_ShadowX() {
        return 8;
    }

    // distance between <<Card With Shadow>>
    cardBackground_DistanceBetween() {
        return 50;
    }

    card_SpeedX() {
        return 0;
    }

    card_SpeedY() {
        return 2;
    }

    formula_CenterX() {
        let cardLeftX = this.cardBackground_LeftX();
        let cardWidth = this.cardBackground_Width();

        return cardLeftX + cardWidth / 2;
    }

    cannon_MovingCenterX() {
        let width = this.scene.game.renderer.width;

        return width - 25 - 60;
    }

    cannon_MovingCenterY() {
        return this.scene.game.renderer.height / 2;
    }

    cannon_Scale() {
        return 0.4;
    }

    cannon_OriginX() {
        return 0.5;
    }

    cannon_OriginY() {
        return 0.7;
    }

    cannonBall_StartPositionX() {
        return this.cannon_MovingCenterX();
    }

    cannonBall_StartPositionY() {
        return this.cannon_MovingCenterY();
    }

    cannonBall_Speed() {
        return 100;
    }

    cannonBall_Scale() {
        return this.cannon_Scale();
    }

    menu_Width() {
        return 700;
    }

    menu_Height() {
        return 700;
    }

    menu_CenterX() {
        let width = this.scene.game.renderer.width;

        return width / 2;
    }

    menu_CenterY() {
        let height = this.scene.game.renderer.height;

        return height / 2;
    }

}