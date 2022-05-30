class GameSizer {

    constructor(scene) {
        this.scene = scene;

        this.formulasSpeed = scene.scene.settings.speed;
    }

    field_Width() {
        return this.scene.game.renderer.width;
    }

    field_Height() {
        return this.scene.game.renderer.height;
    }

    cardBackground_Width() {
        return 800 * this.cardBackground_Scale();
    }

    cardBackground_Height() {
        return 110 * this.cardBackground_Scale();
    }

    cardBackground_Scale() {
        return 0.85;
    }

    cardBackground_LeftX() {
        return 100;
    }

    hitFormulaMoveLeft() {
        return 80;
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

    formula_FontSize() {
        return 50;
    }

    formula_FontFamily() {
        return 'Roboto';
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
        return 0.35;
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

    cannonBall_Size() {
        return 190 * this.cannon_Scale();
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

    hitScore_RightX() {
        return this.cardBackground_LeftX() + this.cardBackground_Width() + 10;
    }

    hitScoreTopY(formula) {
        return formula.y;
    }

    hitPositiveScoreColor() {
        return '#460';
    }

    hitNegativeScoreColor() {
        return '#F40'
    }

    hitScoreFontSize() {
        return 35;
    }

    lastFormula_RightX() {
        return 1580;
    }

    lastFormula_TopY() {
        return this.bottomLine()+1;
    }

    bottomLine() {
        return 750;
    }

    slowSpeed() {
        return 0;
    }

    isFormulaHitFromRight(background, cannonBall) {
        return cannonBall.cannonBall.x - cannonBall.speedX > background.x + this.cardBackground_Width() + 5;
    }

    bottomLineSign_CenterY() {
        return this.formulasCheckLineY() + this.cardBackground_Height() / 2;
    }

    bottomLineSign_CenterX() {
        return 830;
    }

    addScore_RightX() {
        return this.scoreValue_RightX();
    }

    addPositiveScore_TopY() {
        return this.scoreValue_BottomY() + 40;
    }

    addNegativeScore_TopY() {
        return this.scoreValue_BottomY() + 10;
    }

    addScore_FontSize() {
        return this.scoreValue_FontSize();
    }

    addPositiveScore_Color() {
        return this.hitPositiveScoreColor();
    }

    addNegativeScore_Color() {
        return this.hitNegativeScoreColor();
    }

    addScore_Speed() {
        return 0.5;
    }

    addScore_SpeedAlpha() {
        return -0.01;
    }

    blinkingInterval() {
        return 300 / Math.max(1, this.formulasSpeed);
    }

    equals_Scale() {
        return 0.025;
    }

    equalsLastLine_Scale() {
        return 0.038;
    }

    lastLineFormula_SpeedX() {
        return 5 * this.formulasSpeed;
    }

    formulasCheckLineY() {
        return 780;
    }

    wallPosition() {
        return { left: 0, right: 1600, y: this.bottomLine() }
    }

    correctRuleBackgroundPosition() {
        return { x: this.pauseButton_RightX(), y: 150 };
    }

    correctRuleTextPosition() {
        return { x: this.correctRuleBackgroundPosition().x - this.cardBackground_Width() / 2,
                 y: this.correctRuleBackgroundPosition().y + this.cardBackground_Height() / 2 };
    }

    updateSettings() {
        this.formulasSpeed = this.scene.scene.settings.speed;
    }

    textHintRightX() {
        return this.pauseButton_RightX() - 10;
    }

    textHintTopY() {
        return 150;
    }

    textHintFontSize() {
        return 42;
    }

    textHintFontColor() {
        return '#000';
    }
}