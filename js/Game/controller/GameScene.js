class GameScene extends Phaser.Scene {

    constructor() {
        super(GC.SCENES.GAME);
    }

    init(params) {
        this.levelNumber = params.levelNumber;
        this.totalScore = params.totalScore;
        this.startLevel = params.startLevel;

        this.formulas = params.formulas;

        this.displayingFormulas = [];
        this.indexOfLastDisplayingFormula = -1;

        this.displayingCannonBalls = [];
        this.score = 0;
        this.displayingAddScore = [];

        this.scene.settings = params.settings;

        this.hitFormulasNumber = 0;

        Scaler.setResolution(this, GC.RESOLUTIONS.MEDIUM.GAME.width, GC.RESOLUTIONS.MEDIUM.GAME.height);
    }

    create() {
        this.sizer = new GameSizer(this);

        // this.events.on('resume', (params) => {
        //     this.scene.settings = params.settings;
        //     console.log('Awake game. Settings:', this.scene.settings);
        // });

        console.log('Level started, formulas:', this.formulas.map(function (formula) {
            return formula.unicode;
        }))

        this.placeCannon();
        this.placeScoreLabels();
        // this.placeLastFormula();
        // this.placeBottomLine();
        this.placeWall();

        this.input.on('pointerdown', this.shoot(this));

        this.placePauseButton();
        this.placeTextHint();

        // this.keyM = this.input.keyboard.addKey('M');
    }

    wake(params) {
        console.log('Wake Game. Params:', params);
        this.scene.settings = params.settings;
    }

    update() {
        this.focusCannonOnPointer();
        // this.handleKeyboardInput();

        this.moveCannonBalls();

        this.spanNewFormulaIfNeeded();
        this.moveFormulas();
        this.removeFormulasIfNeeded();
        this.checkIfFormulaPassed();

        this.moveAddScores();

        this.finishGameIfNeeded();
    }

    placeWall() {
        let wallPosition = this.sizer.wallPosition();
        let wall_left = this.physics.add.image(wallPosition.left, wallPosition.y, 'wall_left');
        wall_left.setOrigin(0, 1);
        wall_left.setDepth(255);
        let wall_right = this.physics.add.image(wallPosition.right, wallPosition.y, 'wall_right');
        wall_right.setOrigin(1, 1);
        wall_right.setDepth(255);

        this.wallObjects = [wall_left, wall_right];
    }

    finishGameIfNeeded() {
        if (this.isGameFinished()) {
            this.scene.start(GC.SCENES.GAME_COMPETE, {
                'score': this.score,
                'sequence': this.formulas,
                'levelNumber': this.levelNumber,
                'settings': this.scene.settings,
                'totalScore': this.totalScore,
                'startLevel': this.startLevel
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

    addText(x, y, text, params) {
        return this.add.text(x, y, text, params);
    }

    placeNewFormula() {
        let index = this.indexOfLastDisplayingFormula + 1;

        let background_LeftX = this.sizer.cardBackground_LeftX();
        let background_TopY = this.spanCardBackground_TopY();
        let background = this.physics.add.image(background_LeftX, background_TopY, 'cardBackground_Regular');
        background.setDepth(index * 2);
        background.setOrigin(0, 0);
        let scale = this.sizer.cardBackground_Scale();
        background.setScale(scale);
        background.wanted_y = background.y;

        this.addExistingCollisionsToNewFormula(background);

        let formulaCenterX = this.sizer.formula_CenterX();
        let formulaCenterY = this.spanFormula_CenterY();
        let fontSize = this.sizer.formula_FontSize();
        let formula = this.addText(formulaCenterX, formulaCenterY, this.formulas[index].unicode,
        // let formula = this.addText(formulaCenterX, formulaCenterY, "",
            {
                fontFamily: 'serif',
                color: '#000',
                fontSize: fontSize
            });
        // let formula = this.add.text(formulaCenterX, formulaCenterY, this.formulas[index].unicode,
        //     {
        //         fontFamily: 'serif',
        //         color: '#000',
        //         fontSize: fontSize
        //     });
        formula.setOrigin(0.5);
        formula.setDepth(index * 2 + 1);
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

        let unicodeSubstitution = undefined;
        if (this.formulas[index].substitution !== undefined)
            unicodeSubstitution = this.formulas[index].substitution.left + " \u27F6 "
                + this.formulas[index].substitution.right;

        let newFormula = {
            'formula': formula,
            'background': background,
            'arrow': arrow,
            'scoreForHit': scoreForHit,
            'scoreForSkip': scoreForSkip,
            'substitution': unicodeSubstitution,
            'isHit': false
        };

        if (0 === index) {
            this.formulaHasBeenHit(newFormula);
        }

        return newFormula;
    }

    moveFormulas() {
        for (let formula of this.displayingFormulas) {
            if (!formula.passed) {
                formula.background.x += this.sizer.card_SpeedX();
                formula.background.y += this.sizer.card_SpeedY();

                formula.formula.x += this.sizer.card_SpeedX();
                formula.formula.y += this.sizer.card_SpeedY();

                if (formula.arrow) {
                    formula.arrow.x += this.sizer.card_SpeedX();
                    formula.arrow.y += this.sizer.card_SpeedY();
                }

                if (formula.score) {
                    formula.score.x += this.sizer.card_SpeedX();
                    formula.score.y += this.sizer.card_SpeedY();
                }
            } else {
                formula.background.x += this.sizer.lastLineFormula_SpeedX();
                formula.formula.x += this.sizer.lastLineFormula_SpeedX();

                if (formula.arrow) {
                    formula.arrow.x += this.sizer.lastLineFormula_SpeedX();
                }
            }
        }
    }

    removeFormulasIfNeeded() {
        // if (this.needToRemoveFirstFormula()) {
        if (0 < this.displayingFormulas.length
            && this.displayingFormulas[0].background.x > this.sizer.field_Width()) {
            this.destroyFormulaObjects(this.displayingFormulas[0]);
            this.displayingFormulas.shift();
            // this.removeFirstFormulaFromList();
        }
    }

    needToRemoveFirstFormula() {
        return 0 < this.displayingFormulas.length
            && this.displayingFormulas[0].background.x > this.sizer.field_Width();
            // && (this.sizer.lastFormula_TopY() < this.fallingFormulas[0].background.y
            //         && this.fallingFormulas[0].scoreForSkip < 0
            //     || this.sizer.field_Height() < this.fallingFormulas[0].background.y);
    }

    removeFirstFormulaFromList() {
        this.displayingFormulas.shift();
    }

    checkIfFormulaPassed() {
        for (let formula of this.displayingFormulas)
            if (!formula.passed && this.sizer.formulasCheckLineY() < formula.background.y)
                this.formulaHasBeenPassed(formula);
    }

    formulaHasBeenPassed(formula) {
        console.log('Formula passed', formula);
        formula.passed = true;
        if (formula.arrow) formula.arrow.destroy();
        formula.arrow = null;
        if (formula.score) formula.score.destroy();

        if (formula.scoreForSkip < 0)
            this.placeBottomLineFormulaSign(formula, 'not_equals');
        if (formula.scoreForSkip > 0)
            this.placeBottomLineFormulaSign(formula, 'equals');

        if (formula.isHit && formula.scoreForHit > 0) {
            formula.background.x += this.sizer.hitFormulaMoveLeft();
            formula.formula.x += this.sizer.hitFormulaMoveLeft();
        }

        formula.background.setTexture('cardBackground_Wall');

        if (!formula.isHit) {
            this.score += formula.scoreForSkip;

            if (formula.scoreForSkip < 0)
                this.wrongFormulaPassed(formula);
            if (formula.scoreForSkip > 0)
                this.correctFormulaPassed(formula);

            this.placeAddScore(formula.scoreForSkip);

            let formattedScore = this.formatScore(this.score);
            this.scoreValueText.setText(formattedScore);
        }
    }

    placeBottomLineFormulaSign(formula, imageName) {
        if (formula.arrow) {
            formula.arrow.destroy();
            formula.arrow = undefined;
        }
        let centerX = this.sizer.bottomLineSign_CenterX();
        let centerY = this.sizer.bottomLineSign_CenterY();
        formula.arrow = this.add.image(centerX, centerY, imageName);
        formula.arrow.setOrigin(0.5);
        formula.arrow.setScale(this.sizer.equalsLastLine_Scale());
    }

    wrongFormulaPassed(formula) {
        this.placeBottomLineFormulaSign(formula, 'not_equals_red');
        let realSpeed = this.sizer.formulasSpeed;
        this.sizer.formulasSpeed = this.sizer.slowSpeed();
        let mistakeTimeout = this.scene.settings.mistakeTimeout * 1000;
        setTimeout(() => { this.sizer.formulasSpeed = realSpeed; }, mistakeTimeout);
        let interval = this.sizer.blinkingInterval();
        this.blinkLastLineFormulaSign(formula, 'not_equals_red', mistakeTimeout, interval);
        // this.blinkFormula(formula, 'cardBackground_Regular', 'cardBackground_Red', 5000, interval);
    }

    correctFormulaPassed(formula) {
        // if (formula.substitution !== undefined)
            // this.addCorrectRule(formula.substitution);
    }

    addCorrectRule(rule) {
        clearTimeout(this.correctRuleTimer);
        this.destroyCorrectRule();
        if (this.scene.settings.showCorrectRule === 0) return;

        let scale = this.sizer.cardBackground_Scale();
        let correctRuleBackgroundPosition = this.sizer.correctRuleBackgroundPosition();
        this.correctRuleBackground = this.add.image(
            correctRuleBackgroundPosition.x, correctRuleBackgroundPosition.y,
            'cardBackground_Green');
        this.correctRuleBackground.setOrigin(1, 0);
        this.correctRuleBackground.setScale(scale);

        let fontSize = this.sizer.formula_FontSize();
        let correctRuleTextPosition = this.sizer.correctRuleTextPosition();
        this.correctRuleText = this.add.text(
            correctRuleTextPosition.x, correctRuleTextPosition.y,
            rule, { fontFamily: 'serif', color: '#000', fontSize: fontSize });
        this.correctRuleText.setOrigin(0.5, 0.5);

        let timeout = this.scene.settings.showCorrectRule * 1000;
        this.correctRuleTimer = setTimeout(() => { this.destroyCorrectRule(); }, timeout);
    }

    destroyCorrectRule() {
        if (this.correctRuleBackground !== undefined)
            this.correctRuleBackground.destroy();
        if (this.correctRuleText !== undefined)
            this.correctRuleText.destroy();
        this.correctRuleBackground = undefined;
        this.correctRuleText = undefined;
    }

    blinkLastLineFormulaSign(formula, imageName, duration, interval) {
        let times = 0;
        this.blinkingInterval = setInterval(() => {
            if (formula.arrow) {
                formula.arrow.destroy();
                formula.arrow = undefined;
            } else
                this.placeBottomLineFormulaSign(formula, imageName);
            times++;
        }, interval);
        this.blinkingTimeout = setTimeout(() => {
            clearInterval(this.blinkingInterval);
            if (!formula.arrow)
                this.placeBottomLineFormulaSign(formula, imageName);
            }, duration);
    }

    stopBlinking() {
        clearInterval(this.blinkingInterval);
        clearTimeout(this.blinkingTimeout);
    }

    // blinkFormula(formula, firstBackground, secondBackground, duration, interval) {
    //     let times = 0;
    //     let blinking = setInterval(() => {
    //         if (times % 2 === 0) {
    //             formula.background.setTexture(firstBackground);
    //         } else {
    //             formula.background.setTexture(secondBackground);
    //         }
    //         times++;
    //     }, interval);
    //     setTimeout(() => { clearInterval(blinking); }, duration);
    // }

    placeAddScore(score) {
        let rightX = this.sizer.addScore_RightX();
        let topY = 0;
        let fontSize = this.sizer.addScore_FontSize();

        let color = '#FFF';
        let speed = this.sizer.addScore_Speed();
        let speedAlpha = this.sizer.addScore_SpeedAlpha();
        if (score > 0) {
            color = this.sizer.addPositiveScore_Color();
            score = '+' + score;
            speed = -speed;
            topY = this.sizer.addPositiveScore_TopY();
        } else {
            color = this.sizer.addNegativeScore_Color();
            topY = this.sizer.addNegativeScore_TopY();
        }

        let drawScore = this.add.text(rightX, topY, score, {
            fontSize: fontSize,
            color: color
        });
        drawScore.setOrigin(1, 0);
        let pushScore = {
            'drawScore': drawScore,
            'speedY': speed,
            'speedAlpha': speedAlpha
        }
        this.displayingAddScore.push(pushScore);
    }

    moveAddScores() {
        for (let addScore of this.displayingAddScore) {
            addScore.drawScore.y += addScore.speedY;
            addScore.drawScore.alpha += addScore.speedAlpha;
            if (addScore.drawScore.alpha <= 0) {
                this.displayingAddScore.filter(item => item !== addScore);
                addScore.drawScore.destroy();
            }
        }
    }

    destroyFormulaObjects(formula) {
        formula.formula.destroy();
        formula.background.destroy();
        if (formula.arrow) formula.arrow.destroy();
        if (formula.score) formula.score.destroy();
    }

    placeBottomLine() {
        let line = new Phaser.Geom.Line(0, this.sizer.bottomLine(), this.sizer.field_Width(), this.sizer.bottomLine());
        let graphics = this.add.graphics({ lineStyle: { width: 4, color: '#000' }});
        graphics.strokeLineShape(line);
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
            // this.removeCannonBall(this.displayingCannonBalls.last);
        })
        return pauseButton;
    }

    showMenu() {
        this.scene.pause(GC.SCENES.GAME);
        this.showPauseMenu();
    }

    showPauseMenu() {
        this.scene.run(GC.SCENES.GAME_PAUSE, {
            'levelNumber': this.levelNumber,
            'settings': this.scene.settings,
            'gameScene': this
        });
    }

    shoot(scene) {
        return () => {
            let pointer = this.input.activePointer;
            let pauseButtonLeftX = scene.sizer.pauseButton_RightX() - 110;
            let pauseButtonBottomY = scene.sizer.pauseButton_TopY() + 110;
            if (pointer.x > pauseButtonLeftX && pointer.y < pauseButtonBottomY)
                return;

            ym(88802966,'reachGoal','firstShoot');
            let shootDirection = scene.calculateShootDirection();
            let speed = scene.sizer.cannonBall_Speed();

            let startPositionX = scene.sizer.cannonBall_StartPositionX();
            let startPositionY = scene.sizer.cannonBall_StartPositionY();

            let cannonBallObj = scene.physics.add.image(startPositionX, startPositionY, 'cannonBall');
            cannonBallObj.setScale(this.sizer.cannonBall_Scale());
            cannonBallObj.setOrigin(0.5);

            scene.addNewCollisionToDisplayingFormulas(cannonBallObj);
            scene.addNewCollisionToWall(cannonBallObj);

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

    addNewCollisionToWall(cannonBallObject) {
        for (let wallObject of this.wallObjects) {
            let scene = this;

            this.physics.add.collider(wallObject, cannonBallObject,
                function (_wall, _cannonBall) {
                    let cannonBall = scene.displayingCannonBalls.find(item => item.cannonBall === _cannonBall);
                    cannonBall.speedY = -cannonBall.speedY;
                })
        }
    }

    addNewCollisionToDisplayingFormulas(cannonBallObject) {
        for (let formula of this.displayingFormulas) {

            if (formula.isHit || formula.passed) {
                continue;
            }

            let scene = this;

            this.physics.add.collider(
                formula.background,
                cannonBallObject,
                function (_background, _cannonBall) {
                    let hitFormula = scene.displayingFormulas.find(item => item.background === _background);
                    let cannonBall = scene.displayingCannonBalls.find(item => item.cannonBall === _cannonBall);
                    if (cannonBall.isHit) return;

                    if (hitFormula.isHit || hitFormula.passed) return;
                    scene.formulaHasBeenHit(hitFormula);
                    cannonBall.isHit = true;
                    _cannonBall.alpha = 0.2;

                    console.log('Formula is hit', hitFormula);
                    console.log('ScoreForHit', hitFormula.scoreForHit);
                    console.log('cannonBall', cannonBall);
                    if (hitFormula.scoreForHit > 0)
                        scene.removeCannonBall(cannonBallObject);
                    else {
                        if (scene.sizer.isFormulaHitFromRight(_background, cannonBall))
                            cannonBall.speedX = -(cannonBall.speedX / 2);
                        else
                            cannonBall.speedY = -(cannonBall.speedY / 2);
                    }
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
        this.hitFormulasNumber++;
        if (this.hitFormulasNumber >= 3)
            ym(88802966,'reachGoal','threeFormulasHit');

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
            formula.arrow.setScale(this.sizer.equals_Scale());

            scoreColor = this.sizer.hitNegativeScoreColor();
            scoreText = formula.scoreForHit;

            if (formula.substitution !== undefined)
                this.addCorrectRule(formula.substitution);
        }

        if (formula.arrow && 0 < formula.scoreForHit) {
            formula.arrow.setTexture('not_equals');
            formula.arrow.setScale(this.sizer.equals_Scale());

            formula.background.x -= this.sizer.hitFormulaMoveLeft();
            formula.formula.x -= this.sizer.hitFormulaMoveLeft();

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

    placeTextHint() {
        let rightX = this.sizer.textHintRightX();
        let topY = this.sizer.textHintTopY();
        let fontSize = this.sizer.textHintFontSize();
        let fontColor = this.sizer.textHintFontColor();

        let textHint = this.add.text(rightX, topY,
            "shoot the wrong steps by click",
            { fontFamily: "RhodiumLibre", fontSize: fontSize, color: fontColor});
        textHint.setOrigin(1, 0);
    }

    formatScore(score) {
        let signString = score < 0 ? "-" : "";
        let valueString = String(Math.abs(this.score)).padStart(6, '0');

        return signString + valueString;
    }

}