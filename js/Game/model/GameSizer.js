class GameSizer {

    constructor(scene) {
        this.scene = scene;

        let getUrlParams = new URLSearchParams(window.location.search);
        this.formulasSpeed = parseFloat(getUrlParams.get("speed"));
        if (isNaN(this.formulasSpeed))
            this.formulasSpeed = 1;
    }

    field_Width() {
        return this.scene.game.renderer.width;
    }

    field_Height() {
        return this.scene.game.renderer.height;
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
        return this.formulasSpeed;
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

    arrow_Width() {
        return 32;
    }

    arrow_Height() {
        return 29;
    }

    arrow_ShadowX() {
        return 6;
    }

    arrow_ShadowY() {
        return 8;
    }

    arrow_CenterX() {
        let cardLeftX = this.cardBackground_LeftX();
        let cardWidth = this.cardBackground_Width();
        let shadowX = this.arrow_ShadowX();

        return cardLeftX + cardWidth / 2 + shadowX / 2;
    }

    scoreLabel_RightX() {
        return 1260;
    }

    scoreLabel_BottomY() {
        return 86;
    }

    scoreLabel_FontSize() {
        return 44;
    }

    scoreLabel_Color() {
        return '#000';
    }

    scoreValue_RightX() {
        // return 1580;
        return 1450;
    }

    scoreValue_BottomY() {
        return 86;
    }

    scoreValue_FontSize() {
        return 44;
    }

    scoreValue_Color() {
        return '#000';
    }

    arrowScore_FontSize() {
        return 28;
    }

    arrowScore_Color() {
        return '#000';
    }

    arrowScore_DistanceToCenter() {
        return 25;
    }

    arrowScoreLeft_RightX() {
        let centerX = this.arrow_CenterX();
        let distanceToCenter = this.arrowScore_DistanceToCenter();

        return centerX - distanceToCenter;
    }

    arrowScoreRight_LeftX() {
        let centerX = this.arrow_CenterX();
        let distanceToCenter = this.arrowScore_DistanceToCenter();

        return centerX + distanceToCenter;
    }

    pauseButton_RightX() {
        return 1580;
    }

    pauseButton_TopY() {
        return 20;
    }
}