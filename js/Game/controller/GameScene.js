class GameScene extends Phaser.Scene {

    constructor() {
        super(GC.SCENES.GAME);
    }

    init(params) {
        this.formulas = params.formulas;

        this.displayingFormulas = [];
        this.indexOfLastDisplayingFormula = -1;

        this.displayingCannonBalls = [];

        Scaler.setResolution(this, GC.RESOLUTIONS.MEDIUM.GAME.width, GC.RESOLUTIONS.MEDIUM.GAME.height);

    }

    create() {
        this.sizer = new GameSizer(this);

        this.placeCannon();
        // this.keyboard = this.input.keyboard.addKeys('M');

        this.input.on('pointerdown', this.shoot(this));
        this.keyM = this.input.keyboard.addKey('M');
    }

    update() {
        this.focusCannonOnPointer();
        this.handleKeyboardInput();

        this.moveCannonBalls();

        this.spanNewFormulaIfNeeded();
        this.moveFormulas();
        this.removeFormulasIfNeeded();
    }

    spanNewFormulaIfNeeded() {
        if (this.needToSpanNewFormula()) {
            this.spanNewFormula();
        }
    }

    needToSpanNewFormula() {
        return this.hasNoDisplayingFormulas()
            || !this.allFormulasHasBeenPlaced() && this.hasEnoughSpaceToPlaceNewFormula();
    }

    hasNoDisplayingFormulas() {
        return this.displayingFormulas.length === 0;
    }

    hasEnoughSpaceToPlaceNewFormula() {
        let cardSpeedY = this.sizer.card_SpeedY();
        let spaceBetweenY = this.sizer.cardBackground_DistanceBetween();

        return 0 <= this.lastCard_TopY() - spaceBetweenY + cardSpeedY;
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

        this.addExistingCollisionsToNewFormula(background);

        let formulaCenterX = this.sizer.formula_CenterX();
        let formulaCenterY = this.spanFormula_CenterY();
        let formulaLabel = this.formulas[index].label;
        let formula = this.add.image(formulaCenterX, formulaCenterY, formulaLabel);
        formula.setOrigin(0.5);

        let scoreForHit = this.formulas[index].scoreForHit;
        let scoreForSkip = this.formulas[index].scoreForSkip;

        return {
            'formula': formula,
            'background': background,
            'scoreForHit': scoreForHit,
            'scoreForSkip': scoreForSkip
        }
    }

    moveFormulas() {
        for (let formula of this.displayingFormulas) {
            formula.background.x += this.sizer.card_SpeedX();
            formula.background.y += this.sizer.card_SpeedY();

            formula.formula.x += this.sizer.card_SpeedX();
            formula.formula.y += this.sizer.card_SpeedY();
        }
    }

    removeFormulasIfNeeded() {

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

        // if (this.keyboard.M.isUp === true) {
        //     this.showMenu();
        // }
        // this.input.keyboard.on('keyup-M', this.showMenu);
        if (Phaser.Input.Keyboard.JustDown(this.keyM)) {
            this.showMenu();
        }
    }

    showMenu() {
        this.scene.pause(GC.SCENES.GAME);
        this.showPauseMenu();
    }

    showPauseMenu() {
        let x = this.sizer.menu_CenterX();
        let y = this.sizer.menu_CenterY();

        let width = this.sizer.menu_Width();
        let height = this.sizer.menu_Height();

        let window = this.add.zone(x, y, width, height);
        window.setInteractive();
        window.setOrigin(0.5);

        // let menuScene = new GamePauseScene(window);

        // this.scene.add(GC.SCENES.GAME_PAUSE, menuScene, true);
        this.scene.run(GC.SCENES.GAME_PAUSE);
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

            let scene = this;

            this.physics.add.collider(
                formula.background,
                cannonBallObject,
                function (_formula, _cannonBall) {
                    scene.removeCannonBall(cannonBallObject);
                    scene.formulaHasBeenHit(_formula);
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
                    // _cannonBall.destroy();


                }
            )
        }
    }

    removeCannonBall(cannonBallObject) {
        this.displayingCannonBalls
            = this.displayingCannonBalls.filter(item => item.cannonBall !== cannonBallObject);

        cannonBallObject.destroy();
    }

    formulaHasBeenHit(backgroundObject) {

    }



}