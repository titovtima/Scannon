class GameScene extends Phaser.Scene {

    constructor() {
        super(GC.SCENES.GAME);
    }

    init(params) {
        this.levelGenerationInfo = params.levelGenerationInfo;

        this.formulas = params.formulas;

        this.displayingFormulas = [];
        this.indexOfLastDisplayingFormula = -1;

        this.displayingCannonBalls = [];
        this.score = 0;

        Scaler.setResolution(this, GC.RESOLUTIONS.MEDIUM.GAME.width, GC.RESOLUTIONS.MEDIUM.GAME.height);
    }

    create() {
        this.sizer = new GameSizer(this);

        console.log('Level started, formulas:', this.formulas.map(function (formula) {
            return formula.unicode;
        }))

        this.placeCannon();
        this.placeScoreLabels();

        this.input.on('pointerdown', this.shoot(this));

        this.placePauseButton();

        this.keyM = this.input.keyboard.addKey('M');
    }

    update() {
        this.focusCannonOnPointer();
        this.handleKeyboardInput();

        this.moveCannonBalls();

        this.spanNewFormulaIfNeeded();
        this.moveFormulas();
        this.removeFormulasIfNeeded();

        this.finishGameIfNeeded();
    }

    finishGameIfNeeded() {
        if (this.isGameFinished()) {
            Scaler.setResolution(this, 1200, 900);

            this.scene.start(GC.SCENES.GAME_COMPETE, {
                'score': this.score,
                'sequence': this.formulas,
                'levelGenerationInfo': this.levelGenerationInfo
            });
        }
    }

    isGameFinished() {
        return this.hasNoDisplayingFormulas() && this.allFormulasHasBeenPlaced()
    }

    spanNewFormulaIfNeeded() {
        if (this.needToSpanNewFormula()) {
            this.spanNewFormula();
        }
    }

    needToSpanNewFormula() {
        return !this.allFormulasHasBeenPlaced()
            && (this.hasNoDisplayingFormulas() || this.hasEnoughSpaceToPlaceNewFormula());
    }

    hasNoDisplayingFormulas() {
        return this.displayingFormulas.length === 0;
    }

    hasEnoughSpaceToPlaceNewFormula() {
        let cardSpeedY = this.sizer.card_SpeedY();

        return 0 <= this.lastCard_TopY() + cardSpeedY;
    }

    allFormulasHasBeenPlaced() {
        return this.indexOfLastDisplayingFormula === this.formulas.length - 1;
    }

    spanNewFormula() {
        let formula = this.placeNewFormula();

        this.displayingFormulas.push(formula);
        this.indexOfLastDisplayingFormula += 1;
    }

    placeNewFormula() {
        let index = this.indexOfLastDisplayingFormula + 1;

        let background_LeftX = this.sizer.cardBackground_LeftX();
        let background_TopY = this.spanCardBackground_TopY();
        let background = this.physics.add.image(background_LeftX, background_TopY, 'cardBackground_Regular');
        background.setOrigin(0, 0);
        background.wanted_y = background.y;

        this.addExistingCollisionsToNewFormula(background);

        let formulaCenterX = this.sizer.formula_CenterX();
        let formulaCenterY = this.spanFormula_CenterY();
        let formula = this.add.text(formulaCenterX, formulaCenterY, this.formulas[index].unicode,
            {
                fontFamily: 'serif',
                color: '#000',
                fontSize: '60px'
            });
        formula.setOrigin(0.5);
        formula.wanted_y = formula.y;

        let scoreForHit = this.formulas[index].scoreForHit;
        let scoreForSkip = this.formulas[index].scoreForSkip;

        let arrow = undefined;
        if (0 < index) {
            let arrowCenterX = this.sizer.arrow_CenterX();
            let arrowCenterY = this.spanArrow_CenterY();

            arrow = this.add.image(arrowCenterX, arrowCenterY, 'arrow_question');
            arrow.setOrigin(0.5);
        }

        let newFormula = {
            'formula': formula,
            'background': background,
            'arrow': arrow,
            'scoreForHit': scoreForHit,
            'scoreForSkip': scoreForSkip,
            'isHit': false
        };

        if (0 === index) {
            this.formulaHasBeenHit(newFormula);
        }

        return newFormula;
    }

    moveFormulas() {
        for (let formula of this.displayingFormulas) {
            formula.background.x += this.sizer.card_SpeedX();
            formula.background.wanted_y += this.sizer.card_SpeedY();
            formula.background.y = Math.floor(formula.background.wanted_y);

            formula.formula.x += this.sizer.card_SpeedX();
            formula.formula.wanted_y += this.sizer.card_SpeedY();
            formula.formula.y = Math.floor(formula.formula.wanted_y);

            if (formula.arrow) {
                formula.arrow.x += this.sizer.card_SpeedX();
                formula.arrow.y += this.sizer.card_SpeedY();
            }

            if (formula.score && formula.score !== 0) {
                formula.score.x += this.sizer.card_SpeedX();
                formula.score.y += this.sizer.card_SpeedY();
            }

        }
    }

    removeFormulasIfNeeded() {
        if (this.needToRemoveFirstFormula()) {
            this.removeFirstFormula();
        }
    }

    needToRemoveFirstFormula() {
        return 0 < this.displayingFormulas.length
            && this.sizer.field_Height() < this.displayingFormulas[0].background.y;
    }

    removeFirstFormula() {
        this.formulaHasBeenPassed(this.displayingFormulas[0]);
        this.destroyFormulaObjects(this.displayingFormulas[0]);
        this.displayingFormulas.shift();
    }

    formulaHasBeenPassed(formula) {
        if (!formula.isHit) {
            this.score += formula.scoreForSkip;

            let formattedScore = this.formatScore(this.score);
            this.scoreValueText.setText(formattedScore);
        }
    }

    destroyFormulaObjects(formula) {
        formula.formula.destroy();
        formula.background.destroy();
        if (formula.arrow) formula.arrow.destroy();
        if (formula.leftScore) formula.leftScore.destroy();
        if (formula.rightScore) formula.rightScore.destroy();
    }

    // MARK: - Sizes based on the current game state
    lastCard_TopY() {
        let indexOfLastFormula = this.displayingFormulas.length - 1;
        let lastFormula = this.displayingFormulas[indexOfLastFormula];

        return lastFormula.background.y;
    }

    spanCardBackground_TopY() {
        let height = this.sizer.cardBackground_Height();
        let shadowY = this.sizer.cardBackground_ShadowY();

        if (this.hasNoDisplayingFormulas()) {
            return 0 - shadowY - height;
        }

        let distanceBetween = this.sizer.cardBackground_DistanceBetween();

        return this.lastCard_TopY() - distanceBetween - shadowY - height;
    }

    spanFormula_CenterY() {
        let cardTopY = this.spanCardBackground_TopY();
        let cardHeight = this.sizer.cardBackground_Height();

        return cardTopY + cardHeight / 2;
    }

    spanArrow_CenterY() {
        let cardTopY = this.spanCardBackground_TopY();
        let cardHeight = this.sizer.cardBackground_Height();
        let spaceBetween = this.sizer.cardBackground_DistanceBetween();
        let cardShadowY = this.sizer.cardBackground_ShadowY();
        let arrowShadowY = this.sizer.arrow_ShadowY();

        return cardTopY + cardHeight + (spaceBetween + cardShadowY) / 2 + arrowShadowY / 2;
    }

    placeCannon() {
        let x = this.sizer.cannon_MovingCenterX();
        let y = this.sizer.cannon_MovingCenterY();
        this.cannon = this.physics.add.image(x, y, 'cannon');

        let scale = this.sizer.cannon_Scale();
        this.cannon.setScale(scale);

        let originX = this.sizer.cannon_OriginX();
        let originY = this.sizer.cannon_OriginY();
        this.cannon.setOrigin(originX, originY);

        this.cannon.setDepth(1000);
    }

    focusCannonOnPointer() {
        let cannonOrigin = {
            x: this.cannon.x,
            y: this.cannon.y
        };
        let pointer = this.input.activePointer;

        let angleToPointer
            = Phaser.Math.Angle.BetweenPoints(cannonOrigin, pointer);
        let wrappedAngleToPointer
            = Phaser.Math.Angle.Wrap(angleToPointer + Phaser.Math.TAU);

        this.cannon.rotation = wrappedAngleToPointer;

        return this;
    }

    handleKeyboardInput() {

        if (Phaser.Input.Keyboard.JustDown(this.keyM)) {
            this.showMenu();
        }
    }

    placePauseButton() {
        let right = this.sizer.pauseButton_RightX();
        let top = this.sizer.pauseButton_TopY();
        let pauseButton = this.physics.add.image(right, top, 'pauseButton');
        pauseButton.setOrigin(1,0);

        pauseButton.setInteractive();

        pauseButton.on('pointerup', () => {
            console.log('Pause button clicked');
            this.showMenu();
        })
        pauseButton.on('pointerdown', () => {
            this.removeCannonBall(this.displayingCannonBalls.last);
        })
        return pauseButton;
    }

    showMenu() {
        this.scene.pause(GC.SCENES.GAME);
        this.showPauseMenu();
    }

    showPauseMenu() {
        this.scene.run(GC.SCENES.GAME_PAUSE, {
            'levelGenerationInfo': this.levelGenerationInfo
        });
    }

    shoot(scene) {
        return () => {
            let shootDirection = scene.calculateShootDirection();
            let speed = scene.sizer.cannonBall_Speed();

            let startPositionX = scene.sizer.cannonBall_StartPositionX();
            let startPositionY = scene.sizer.cannonBall_StartPositionY();

            let cannonBallObj = scene.physics.add.image(startPositionX, startPositionY, 'cannonBall');
            cannonBallObj.setScale(this.sizer.cannonBall_Scale());
            cannonBallObj.setOrigin(0.5);

            scene.addNewCollisionToDisplayingFormulas(cannonBallObj);

            scene.displayingCannonBalls.push({
                cannonBall: cannonBallObj,
                speedX: speed * shootDirection.x,
                speedY: speed * shootDirection.y
            })
        }
    }

    calculateShootDirection() {
        return {
            x: Math.cos(this.cannon.rotation - Phaser.Math.TAU),
            y: Math.sin(this.cannon.rotation - Phaser.Math.TAU)
        };
    }

    moveCannonBalls() {
        for (let cannonBall of this.displayingCannonBalls) {
            cannonBall.cannonBall.x += cannonBall.speedX;
            cannonBall.cannonBall.y += cannonBall.speedY;
        }
    }

    addNewCollisionToDisplayingFormulas(cannonBallObject) {
        for (let formula of this.displayingFormulas) {

            if (formula.isHit) {
                continue;
            }

            let scene = this;

            this.physics.add.collider(
                formula.background,
                cannonBallObject,
                function (_background, _cannonBall) {
                    scene.removeCannonBall(cannonBallObject);

                    let hitFormula = scene.displayingFormulas.find(item => item.background === _background);
                    scene.formulaHasBeenHit(hitFormula);
                }
            )
        }
    }

    addExistingCollisionsToNewFormula(cardBackgroundObj) {

        // TODO: пересмотреть код, может стоит его удалить?
        for (let cannonBall of this.displayingCannonBalls) {

            this.physics.add.collider(
                cardBackgroundObj,
                cannonBall.cannon,
                function (_formula, _cannonBall) {
                    console.log("I was trying to destroy a ball (2)");

                }
            )
        }
    }

    removeCannonBall(cannonBallObject) {
        this.displayingCannonBalls
            = this.displayingCannonBalls.filter(item => item.cannonBall !== cannonBallObject);

        cannonBallObject.destroy();
    }

    formulaHasBeenHit(formula) {
        formula.isHit = true;

        formula.background.setTexture('cardBackground_Hit');

        let shadowX = this.sizer.cardBackground_ShadowX();
        formula.formula.x += shadowX;

        let shadowY = this.sizer.cardBackground_ShadowY();
        formula.formula.y += shadowY;

        let scoreColor = null;
        let scoreText = null;

        if (formula.arrow && formula.scoreForHit < 0) {
            formula.arrow.setTexture('equals');

            scoreColor = this.sizer.hitNegativeScoreColor();
            scoreText = formula.scoreForHit;
        }

        if (formula.arrow && 0 < formula.scoreForHit) {
            formula.arrow.setTexture('not_equals');

            scoreColor = this.sizer.hitPositiveScoreColor();
            scoreText = '+' + formula.scoreForHit;
        }

        let scoreRightX = this.sizer.hitScore_RightX();
        let scoreTopY = this.sizer.hitScoreTopY(formula.formula);
        let scoreFontSize = this.sizer.hitScoreFontSize();

        formula.score = this.add.text(
            scoreRightX, scoreTopY, scoreText,
            { fontSize: scoreFontSize, color: scoreColor }
        ).setOrigin(0, 0.5);

        this.score += formula.scoreForHit;

        let formattedScore = this.formatScore(this.score);
        this.scoreValueText.setText(formattedScore);
    }

    placeScoreLabels() {
        let labelRightX = this.sizer.scoreLabel_RightX();
        let labelBottomY = this.sizer.scoreLabel_BottomY();
        let labelFontSize = this.sizer.scoreLabel_FontSize();
        let labelColor = this.sizer.scoreLabel_Color();
        this.add.text(labelRightX, labelBottomY, 'score:',
            { fontSize: labelFontSize, color: labelColor })
            .setOrigin(1);

        let valueRightX = this.sizer.scoreValue_RightX();
        let valueBottomY = this.sizer.scoreValue_BottomY();
        let valueFontSize = this.sizer.scoreValue_FontSize();
        let valueColor = this.sizer.scoreValue_Color();
        this.scoreValueText = this.add.text(valueRightX, valueBottomY, '000000',
            { fontSize: valueFontSize, color: valueColor })
            .setOrigin(1);
    }

    formatScore(score) {
        let signString = score < 0 ? "-" : "";
        let valueString = String(Math.abs(this.score)).padStart(6, '0');

        return signString + valueString;
    }

}