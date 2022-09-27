class GameScene extends Phaser.Scene {

    constructor() {
        super(GC.SCENES.GAME);
    }

    init(params) {
        this.levelNumber = params.levelNumber;
        this.totalScore = params.totalScore;
        this.startLevel = params.startLevel;
        if (this.startLevel === undefined)
            this.startLevel = this.levelNumber;

        this.isRestarted = params.isRestarted;
        console.log('isRestarted', this.isRestarted);

        this.formulas = params.formulas;

        this.displayingFormulas = [];
        this.indexOfLastDisplayingFormula = -1;

        this.displayingCannonBalls = [];
        this.score = 0;
        this.displayingAddScore = [];

        this.scene.settings = params.settings;

        this.hitFormulasNumber = 0;
        this.speedUp = false;

        // this.levelsInfo = this.cache.json.get('levelsInfo');
        this.tutorialStatus = GC.GAME_INFO.levels[this.levelNumber].tutorial;
        this.cardVariant = GC.GAME_INFO.levels[this.levelNumber].card_variant;
        if (!this.cardVariant)
            this.cardVariant = defaultCardVariant;
        if (params.isTutorial !== undefined)
            this.isTutorial = params.isTutorial
        else
            this.isTutorial = this.tutorialStatus === "always";

        Scaler.setResolution(this, GC.RESOLUTIONS.MEDIUM.GAME.width, GC.RESOLUTIONS.MEDIUM.GAME.height);
    }

    create() {
        this.sizer = new GameSizer(this);

        if (!this.isRestarted) {
            console.log('not restarted');
            let jsonString = `{"${GC.GAME_CODE}_${this.levelNumber}_start": "${this.startLevel}"}`;
            ym(88802966, 'params', JSON.parse(jsonString));
        }

        // this.events.on('resume', (params) => {
        //     this.scene.settings = params.settings;
        //     console.log('Awake game. Settings:', this.scene.settings);
        // });

        // console.log('Level started, formulas:', this.formulas.map(function (formula) {
        //     return formula.unicode;
        // }))

        this.placeCannon();
        this.placeScoreLabels();
        this.placeWall();
        this.placeFinishButton();

        this.input.on('pointerdown', this.shoot(this));

        this.placePauseButton();
        if (this.tutorialStatus === "by button")
            this.placeTutorialButton(); //TODO
        // this.placeTextHint();

        // this.keyM = this.input.keyboard.addKey('M');
        // this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
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
            this.stopSpeedingUp();
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
        // if (this.indexOfLastDisplayingFormula >= 0)
        //     this.changeDomToImage(this.displayingFormulas[this.indexOfLastDisplayingFormula]);
        let index = this.indexOfLastDisplayingFormula + 1;

        let background_LeftX = this.sizer.cardBackground_LeftX();
        let background_TopY = this.spanCardBackground_TopY();
        let background = this.physics.add.image(background_LeftX, background_TopY,
            'cardBackground_Regular_' + this.cardVariant);
        background.setDepth(index * 2);
        background.setOrigin(0, 0);
        let scale = this.sizer.cardBackground_Scale();
        background.setScale(scale);
        background.wanted_y = background.y;

        this.addExistingCollisionsToNewFormula(background);

        let formulaCenterX = this.sizer.formula_CenterX();
        let formulaCenterY = this.spanFormula_CenterY();
        let fontSize = this.sizer.formula_FontSize();
        let backgroundHeight = this.sizer.cardBackground_Height();
        let backgroundWidth = this.sizer.cardBackground_Width();
        let formula;
        if (this.formulas[index].unicode) {
            formula = this.add.text(formulaCenterX, formulaCenterY, this.formulas[index].unicode,
                {
                    fontFamily: GC.FONTS.FORMULAS,
                    color: '#000',
                    fontSize: fontSize
                });
            if (formula.height > backgroundHeight - 10)
                fontSize = fontSize * (backgroundHeight - 10) / formula.height;
            if (formula.width > backgroundWidth - 10)
                fontSize = fontSize * (backgroundWidth - 10) / formula.width;
            formula.setFontSize(fontSize);
            formula.setOrigin(0.5);
            formula.setDepth(index * 2 + 1);
        } else if (this.formulas[index].tex) {
            console.log('tex: ', this.formulas[index].tex);

            let dom = document.createElement('div');

            formula = this.add.dom(formulaCenterX, formulaCenterY, dom);
            // formula.setOrigin(0.5);
            formula.node.style.fontFamily = GC.FONTS.FORMULAS;
            formula.node.style.fontSize = fontSize + 'px';
            katex.render(this.formulas[index].tex, dom);

            if (formula.node.scrollHeight > backgroundHeight - 10)
                fontSize = fontSize * (backgroundHeight - 10) / formula.node.scrollHeight;
            if (formula.node.scrollWidth > backgroundWidth - 10)
                fontSize = fontSize * (backgroundWidth - 10) / formula.node.scrollWidth;
            formula.node.style.fontSize = fontSize + 'px';

            formula.x -= formula.node.scrollWidth / 2;
            formula.y -= formula.node.scrollHeight / 2;
        } else if (this.formulas[index].image) {
            formula = this.add.image(formulaCenterX, formulaCenterY, '');
            formula.setOrigin(0.5);
            formula.setDepth(index * 2 + 1);
            this.load.image(this.formulas[index].image, GC.RESOURCES_PATH + this.formulas[index].image);
            this.load.once('complete', () => {
                formula.setTexture(this.formulas[index].image);
                let scale = 1;
                if (formula.height > backgroundHeight - 10) {
                    scale *= (backgroundHeight - 10) / formula.height;
                    formula.setScale(scale);
                }
                if (formula.width > backgroundWidth - 10) {
                    scale *= (backgroundWidth - 10) / formula.width;
                    formula.setScale(scale);
                }
            });
            this.load.start();
        }

        if (!formula) {
            formula = this.add.image(formulaCenterX, formulaCenterY, '');
        }

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
            'isHit': false,
            'unicode': this.formulas[index].unicode
        };

        if (0 === index) {
            this.formulaHasBeenHit(newFormula);
        }

        return newFormula;
    }

    placeFormulaHint(formulaIndex) {
        if (formulaIndex < 1) return;
        let formula = this.displayingFormulas[formulaIndex];
        if (formula.hint || formula.score) return;
        let prevFormula = this.displayingFormulas[formulaIndex - 1];

        let leftX = this.sizer.hitScore_LeftX();
        let centerY = this.sizer.hitScoreCenterY(formula.formula);

        formula.hintBackground = this.add.image(leftX, centerY, 'hintBackground')
            .setOrigin(0, 0.5).setDepth(-10);

        let fontSize = this.sizer.formulaHintFontSize();
        let fontColor = '#000';

        let textParts = [];
        if (formula.scoreForHit < 0) {
            fontColor = this.sizer.correctFormulaHintColor();
            textParts = this.scene.settings.strings.game_scene.correct_formula_tutorial_hint;
        }
        if (formula.scoreForHit > 0) {
            fontColor = this.sizer.wrongFormulaHintColor();
            textParts = this.scene.settings.strings.game_scene.wrong_formula_tutorial_hint;
        }
        let text1 = this.add.text(leftX + 5, centerY, textParts[0],
            { fontFamily: GC.FONTS.TEXT, fontSize: fontSize, color: fontColor})
            .setOrigin(0, 1).setDepth(-1);
        let text2 = this.add.text(leftX + 5, centerY, formula.unicode,
            { fontFamily: GC.FONTS.FORMULAS_BOLD, fontSize: fontSize, color: fontColor })
            .setOrigin(0, 0).setDepth(-1);
        let text3 = this.add.text(text2.x + text2.width, centerY, textParts[1] + textParts[2],
            {fontFamily: GC.FONTS.TEXT, fontSize: fontSize, color: fontColor})
            .setOrigin(0, 0).setDepth(-1);
        let text4 = this.add.text(text3.x + text3.width, centerY, prevFormula.unicode,
            {fontFamily: GC.FONTS.FORMULAS_BOLD, fontSize: fontSize, color: fontColor})
            .setOrigin(0, 0).setDepth(-1);

        formula.hint = [text1, text2, text3, text4];
    }

    moveFormulaHint(formula, speedX, speedY) {
        for (let text of formula.hint) {
            text.x += speedX;
            text.y += speedY;
        }
        formula.hintBackground.x += speedX;
        formula.hintBackground.y += speedY;
    }

    destroyFormulaHint(formula) {
        for (let text of formula.hint)
            text.destroy();
        formula.hint = undefined;
        formula.hintBackground.destroy();
    }

    moveFormulas() {
        let index = 0;
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

                if (formula.hint) {
                    this.moveFormulaHint(formula, this.sizer.card_SpeedX(), this.sizer.card_SpeedY());
                }

                if (this.isTutorial && !formula.score &&
                    formula.background.y >= 100 && formula.formula.y < this.sizer.wallPosition().y - 200)
                    this.placeFormulaHint(index);

                if (formula.formula.y >= this.sizer.wallPosition().y - 200 && formula.hint)
                    this.destroyFormulaHint(formula);

                if (formula.formula.y >= this.sizer.wallPosition().y && formula.score)
                    formula.score.destroy();
            } else {
                formula.background.x += this.sizer.lastLineFormula_SpeedX();
                formula.formula.x += this.sizer.lastLineFormula_SpeedX();

                if (formula.arrow) {
                    formula.arrow.x += this.sizer.lastLineFormula_SpeedX();
                }
            }
            index++;
        }
    }

    removeFormulasIfNeeded() {
        if (0 < this.displayingFormulas.length
            && this.displayingFormulas[0].background.x > this.sizer.field_Width()) {
            this.destroyFormulaObjects(this.displayingFormulas[0]);
            this.displayingFormulas.shift();
        }
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

        formula.background.setTexture('cardBackground_Wall_' + this.cardVariant);

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

        let jsonString = `{"${GC.GAME_CODE}_${this.levelNumber}_wrongPass": "${formula.unicode}"}`;
        ym(88802966, 'params', JSON.parse(jsonString));

        if (this.speedUp) return;
        let realSpeed = this.sizer.formulasSpeed;
        this.sizer.formulasSpeed = this.sizer.slowSpeed();
        let mistakeTimeout = this.scene.settings.mistakeTimeout * 1000;
        setTimeout(() => { if (!this.speedUp) this.sizer.formulasSpeed = realSpeed; }, mistakeTimeout);
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
            'cardBackground_Green_' + this.cardVariant);
        this.correctRuleBackground.setOrigin(1, 0);
        this.correctRuleBackground.setScale(scale);

        let fontSize = this.sizer.formula_FontSize();
        let correctRuleTextPosition = this.sizer.correctRuleTextPosition();
        this.correctRuleText = this.add.text(
            correctRuleTextPosition.x, correctRuleTextPosition.y,
            rule, { fontFamily: GC.FONTS.FORMULAS, color: '#000', fontSize: fontSize });
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
            fontFamily: GC.FONTS.SCORE_COUNTER,
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

        // if (Phaser.Input.Keyboard.JustDown(this.keyM)) {
        //     this.showMenu();
        // }

        // if (this.keyEnter.isDown) {
        //     this.speedUpToTheEnd();
        // }
    }

    placePauseButton() {
        let right = this.sizer.pauseButton_RightX();
        let top = this.sizer.pauseButton_TopY();
        let pauseButton = this.physics.add.image(right, top, 'pauseButton');
        pauseButton.setOrigin(1,0);

        pauseButton.setInteractive();

        pauseButton.on('pointerup', () => {
            console.log('Pause button clicked');
            this.stopSpeedingUp();
            this.showMenu();
        });
        pauseButton.on('pointerdown', () => {
            // this.removeCannonBall(this.displayingCannonBalls.last);
        });
        return pauseButton;
    }

    placeTutorialButton() { //TODO
    }

    showMenu() {
        let tex = document.querySelectorAll('.texFormula');
        // console.log('tex formulas: ', tex);
        // tex.forEach(value => { value.style.visibility = 'hidden'; });
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
            scene.focusCannonOnPointer();
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
        if (formula.hint)
            this.destroyFormulaHint(formula);

        formula.background.setTexture('cardBackground_Hit_' + this.cardVariant);

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

            let jsonString = `{"${GC.GAME_CODE}_${this.levelNumber}_wrongHit": "${formula.unicode}"}`;
            ym(88802966, 'params', JSON.parse(jsonString));
        }

        if (formula.arrow && 0 < formula.scoreForHit) {
            formula.arrow.setTexture('not_equals');
            formula.arrow.setScale(this.sizer.equals_Scale());

            formula.background.x -= this.sizer.hitFormulaMoveLeft();
            formula.formula.x -= this.sizer.hitFormulaMoveLeft();

            scoreColor = this.sizer.hitPositiveScoreColor();
            scoreText = '+' + formula.scoreForHit;
        }

        let scoreLeftX = this.sizer.hitScore_LeftX();
        let scoreCenterY = this.sizer.hitScoreCenterY(formula.formula);
        let scoreFontSize = this.sizer.hitScoreFontSize();

        formula.score = this.add.text(
            scoreLeftX, scoreCenterY, scoreText,
            { fontSize: scoreFontSize, color: scoreColor }
        ).setOrigin(0, 0.5).setDepth(-1);

        this.score += formula.scoreForHit;

        let formattedScore = this.formatScore(this.score);
        this.scoreValueText.setText(formattedScore);
    }

    placeScoreLabels() {
        let labelRightX = this.sizer.scoreLabel_RightX();
        let labelBottomY = this.sizer.scoreLabel_BottomY();
        let labelFontSize = this.sizer.scoreLabel_FontSize();
        let labelColor = this.sizer.scoreLabel_Color();
        let text = this.scene.settings.strings.game_scene.score + ":";

        this.scoreLabel = this.add.text(labelRightX, labelBottomY, text,
            { fontFamily: GC.FONTS.SCORE_LABELS, fontSize: labelFontSize, color: labelColor })
            .setOrigin(1);

        let valueRightX = this.sizer.scoreValue_RightX();
        let valueBottomY = this.sizer.scoreValue_BottomY();
        let valueFontSize = this.sizer.scoreValue_FontSize();
        let valueColor = this.sizer.scoreValue_Color();
        this.scoreValueText = this.add.text(valueRightX, valueBottomY, '000000',
            { fontFamily: GC.FONTS.SCORE_COUNTER, fontSize: valueFontSize, color: valueColor })
            .setOrigin(1);
    }

    setScoreLabelText() {
        this.scoreLabel.setText(this.scene.settings.strings.game_scene.score + ":");
    }

    placeTextHint() {
        let rightX = this.sizer.textHintRightX();
        let topY = this.sizer.textHintTopY();
        let fontSize = this.sizer.textHintFontSize();
        let fontColor = this.sizer.textHintFontColor();
        let text = this.scene.settings.strings.game_scene.hint;

        this.textHint = this.add.text(rightX, topY, text,
            { fontFamily: GC.FONTS.TEXT, fontSize: fontSize, color: fontColor});
        this.textHint.setOrigin(1, 0);
    }

    setTextHintText() {
        if (!this.textHint) return;
        this.textHint.setText(this.scene.settings.strings.game_scene.hint);
    }

    formatScore(score) {
        let signString = score < 0 ? "-" : "";
        let valueString = String(Math.abs(this.score)).padStart(6, '0');

        return signString + valueString;
    }

    placeFinishButton() {
        let rightX = this.sizer.finishButton_RightX();
        let bottomY = this.sizer.finishButton_BottomY();
        let scale = this.sizer.finishButton_Scale();

        let button = this.add.image(rightX, bottomY, 'finishButton')
            .setOrigin(1, 1).setScale(scale).setDepth(256);

        button.setInteractive();

        button.on('pointerup', () => {
            console.log('Finish button clicked');
            this.speedUpToTheEnd();
        });

        button.on('pointerover', () => {
            button.setTexture('finishButton_Over');
        });
        button.on('pointerout', () => {
            if (!this.speedUp)
                button.setTexture('finishButton');
        });

        this.finishButton = button;
    }

    speedUpToTheEnd() {
        if (this.speedUp) return;
        this.speedUp = true;
        this.sizer.mistakeTimeout = 0;
        this.stopBlinking();
        let interval = setInterval(() => {
            if (this.sizer.formulasSpeed >= 10)
                clearInterval(interval);
            this.sizer.formulasSpeed += 0.1;
        }, 100);
        this.speedingUpInterval = interval;
    }

    stopSpeedingUp() {
        this.sizer.formulasSpeed = this.scene.settings.speed;
        clearInterval(this.speedingUpInterval);
        this.speedUp = false;
        this.finishButton.setTexture('finishButton');
    }

}