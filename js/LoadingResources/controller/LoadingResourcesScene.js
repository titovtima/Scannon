class LoadingResourcesScene extends Phaser.Scene {
    constructor() {
        super(GC.SCENES.LOADING_RESOURCES);
    }

    init(params) {
        this.levelNumber = params.levelNumber;
        this.formulas = params.formulas;
        this.totalScore = params.totalScore;
        this.startLevel = params.startLevel;
        this.isRestarted = params.isRestarted;

        this.scene.settings = params.settings;

        Scaler.setResolution(this, GC.RESOLUTIONS.MEDIUM.INTERFACE.width, GC.RESOLUTIONS.MEDIUM.INTERFACE.height);
    }

    preload() {
        this.load.image('cannon', GC.RESOURCES_PATH + '/assets/cannon.png');
        this.load.image('cannonBall', GC.RESOURCES_PATH + '/assets/cannonBall.png');
        this.load.image('cardBackground_Regular', GC.RESOURCES_PATH + '/assets/cardBackground_NoShadow.png');
        this.load.image('cardBackground_Hit', GC.RESOURCES_PATH + '/assets/cardBackground_Hit.png');
        this.load.image('cardBackground_Red', GC.RESOURCES_PATH + '/assets/cardBackground_Red.png');
        this.load.image('cardBackground_Wall', GC.RESOURCES_PATH + '/assets/cardBackground_Wall.png');
        this.load.image('cardBackground_Green', GC.RESOURCES_PATH + '/assets/cardBackground_Green.png');

        this.load.image('hintBackground', GC.RESOURCES_PATH + '/assets/hintBackground.png');

        this.load.image('arrow_question', GC.RESOURCES_PATH + '/assets/arrow_question.png');
        this.load.image('equals', GC.RESOURCES_PATH + '/assets/equals.png');
        this.load.image('not_equals', GC.RESOURCES_PATH + '/assets/not_equals.png');
        this.load.image('not_equals_red', GC.RESOURCES_PATH + '/assets/not_equals_red.png');

        this.load.image('pauseButton', GC.RESOURCES_PATH + '/assets/pauseButton.png');
        this.load.image('pauseMenuBackground', GC.RESOURCES_PATH + '/assets/pauseMenuBackground.png');

        this.load.image('wall_right', GC.RESOURCES_PATH + '/assets/wall_right.png');
        this.load.image('wall_left', GC.RESOURCES_PATH + '/assets/wall_left.png');

        this.sizer = new LoadingResourcesSizer(this);
        this.levelsInfo = this.cache.json.get('levelsInfo');

        this.formulasList = this.levelsInfo.levels[this.levelNumber].formulas_list;
        if (this.formulasList !== undefined) {
            this.sizer.rowsNumber = this.formulasList.rows.length;
        } else {
            this.sizer.rowsNumber = 0;
        }

        // this.placeTextHint();
        this.placeLevelName();
        this.placeLevelInstructions();
        this.placeFormulasList();
        this.sizer.centerVertically();

        // this.placeDescription();
        // this.placeLoadingBarBackground();
        //
        // let loadingBar = this.add.graphics({
        //     fillStyle: {
        //         color: 0x6B4800
        //     }
        // });
        //
        // this.load.on('progress', (progress) => {
        //     let leftX = this.sizer.loadingBar_LeftX();
        //     let topY = this.sizer.loadingBar_TopY();
        //     let width = progress * this.sizer.loadingBar_Width();
        //     let height = this.sizer.loadingBar_Height();
        //     let radius = this.sizer.loadingBar_Radius();
        //
        //     if (30 <= width) {
        //         loadingBar.fillRoundedRect(leftX, topY, width, height, radius);
        //     }
        // });
    }

    create() {
        this.placeStartButton();
    }

    placeDescription() {
        let centerX = this.sizer.description_CenterX();
        let centerY = this.sizer.description_CenterY();

        let fontSize = this.sizer.description_FontSize();
        let fontColor = this.sizer.description_FontColor();
        let text = this.scene.settings.strings.loading_resources;

        let description = this.add.text(centerX, centerY,
            text, {fontFamily: GC.FONTS.TEXT, fontSize: fontSize, color: fontColor});
        description.setOrigin(0.5);
    }

    placeLoadingBarBackground() {
        let leftX = this.sizer.loadingBarBackground_LeftX();
        let topY = this.sizer.loadingBarBackground_TopY();
        let width = this.sizer.loadingBarBackground_Width();
        let height = this.sizer.loadingBarBackground_Height();
        let radius = this.sizer.loadingBarBackground_Radius();

        let loadingBarBackground = this.add.graphics({
            fillStyle: {
                color: 0xD3A447
            }
        });

        loadingBarBackground.fillRoundedRect(leftX, topY, width, height, radius);
    }

    placeLevelName() {
        let centerX = this.sizer.levelName_CenterX();
        let topY = this.sizer.levelName_TopY();
        let fontSize = this.sizer.levelName_FontSize();
        let fontColor = this.sizer.levelName_FontColor();

        let text = this.levelsInfo.levels[this.levelNumber].index + " - "
            + this.levelsInfo.levels[this.levelNumber]["description_" + this.scene.settings.language];
        let levelName = this.add.text(centerX, topY, text,
            {fontFamily: GC.FONTS.BUTTON_OVER, fontSize: fontSize, color: fontColor});
        levelName.setOrigin(0.5, 0);
    }

    placeLevelInstructions() {
        let centerX = this.sizer.levelInstructionsCenterX();
        let topY = this.sizer.levelInstructionsTopY();
        let fontSize = this.sizer.levelInstructionsFontSize();
        let fontColor = this.sizer.levelInstructionsFontColor();

        let text = this.levelsInfo.levels[this.levelNumber]['instructions_' + this.scene.settings.language];
        if (!text) return;

        let levelInstructions = this.add.text(centerX, topY, text,
            { fontFamily: GC.FONTS.TEXT, fontSize: fontSize, color: fontColor});
        levelInstructions.setOrigin(0.5, 0);
        levelInstructions.setAlign('center');
        this.levelInstructions = levelInstructions;
    }

    // placeTextHint() {
    //     let centerX = this.sizer.textHintCenterX();
    //     let topY = this.sizer.textHintTopY();
    //     let fontSize = this.sizer.textHintFontSize();
    //     let fontColor = this.sizer.textHintFontColor();
    //
    //     let textHint = this.add.text(centerX, topY, this.scene.settings.strings.loading_resources_scene.hint,
    //         { fontFamily: GC.FONTS.TEXT, fontSize: fontSize, color: fontColor});
    //     textHint.setOrigin(0.5, 0);
    //     textHint.setAlign('center');
    // }

    placeStartButton() {
        let centerX = this.sizer.startButton_X();
        let bottomY = this.sizer.startButton_Y();
        let fontSize = this.sizer.startButton_FontSize();
        let fontColor = this.sizer.startButton_FontColor();

        let startButton = this.add.text(centerX, bottomY, this.scene.settings.strings.loading_resources_scene.start,
            { fontFamily: GC.FONTS.BUTTON_OUT, fontSize: fontSize, color: fontColor });
        startButton.setOrigin(0.5, 1);

        startButton.setInteractive();
        startButton.on('pointerover', () => {
            startButton.setFontFamily(GC.FONTS.BUTTON_OVER);
        });
        startButton.on('pointerout', () => {
            startButton.setFontFamily(GC.FONTS.BUTTON_OUT);
        });
        startButton.on('pointerup', () => {
            this.scene.start(GC.SCENES.GAME, {
                'formulas': this.formulas,
                'levelNumber': this.levelNumber,
                'settings': this.scene.settings,
                'totalScore': this.totalScore,
                'startLevel': this.startLevel,
                'isRestarted': this.isRestarted
            });
        });

        this.startButton = startButton;
    }

    placeFormulasList() {
        if (!this.sizer.rowsNumber) return;
        // this.placeFormulasHeader();

        let fontSize = this.sizer.formulasList_FontSize();
        let fontColor = this.sizer.formulasList_FontColor();
        let indexRow = 0;
        this.instuctionFormulas = [];

        for (let row of this.formulasList.rows) {
            let indexColumn = 0;
            let columnsNumber = row.length;
            let topY = this.sizer.formulasList_Y(indexRow);

            for (let formula of row) {
                let text = formula.left + " = " + formula.right;
                let centerX = this.sizer.formulasList_X(indexColumn, columnsNumber);
                let formulaText = this.add.text(centerX, topY, text,
                    {fontFamily: GC.FONTS.FORMULAS, fontSize: fontSize, color: fontColor})
                    .setOrigin(0.5, 0);
                indexColumn++;
                this.instuctionFormulas.push(formulaText);
            }
            indexRow++;
        }
    }

    // placeFormulasHeader() {
    //     let centerX = this.sizer.formulasHeader_X();
    //     let topY = this.sizer.formulasHeader_Y();
    //     let fontSize = this.sizer.formulasHeader_FontSize();
    //     let fontColor = this.sizer.formulasHeader_FontColor();
    //
    //     let header = this.add.text(centerX, topY, this.scene.settings.strings.loading_resources_scene.formulas_header,
    //         { fontFamily: GC.FONTS.SCORE_LABELS, fontSize: fontSize, color: fontColor });
    //     header.setOrigin(0.5, 0);
    // }
}