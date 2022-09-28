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
        this.cardVariant = GC.GAME_INFO.levels[this.levelNumber].card_variant;
        if (!this.cardVariant)
            this.cardVariant = defaultCardVariant;

        Scaler.setResolution(this, GC.RESOLUTIONS.MEDIUM.INTERFACE.width, GC.RESOLUTIONS.MEDIUM.INTERFACE.height);
    }

    preload() {
        this.load.image('cannon', GC.RESOURCES_PATH + '/assets/cannon.png');
        this.load.image('cannonBall', GC.RESOURCES_PATH + '/assets/cannonBall.png');

        let card_variant = GC.GAME_INFO.levels[this.levelNumber].card_variant;
        if (!card_variant)
            card_variant = defaultCardVariant;

        this.load.image('cardBackground_Regular_' + card_variant,
            GC.RESOURCES_PATH + '/assets/cardBackground_' + card_variant +'.png');
        this.load.image('cardBackground_Hit_' + card_variant,
            GC.RESOURCES_PATH + '/assets/cardBackground_' + card_variant +'_hit.png');
        this.load.image('cardBackground_Wall_' + card_variant,
            GC.RESOURCES_PATH + '/assets/cardBackground_' + card_variant +'_bottom.png');
        this.load.image('cardBackground_Green_' + card_variant,
            GC.RESOURCES_PATH + '/assets/cardBackground_' + card_variant +'_green.png');

        this.load.image('hintBackground', GC.RESOURCES_PATH + '/assets/hintBackground.png');

        this.load.image('arrow_question', GC.RESOURCES_PATH + '/assets/arrow_question.png');
        this.load.image('equals', GC.RESOURCES_PATH + '/assets/equals.png');
        this.load.image('not_equals', GC.RESOURCES_PATH + '/assets/not_equals.png');
        this.load.image('not_equals_red', GC.RESOURCES_PATH + '/assets/not_equals_red.png');

        this.load.image('pauseButton', GC.RESOURCES_PATH + '/assets/pauseButton.png');
        this.load.image('pauseMenuBackground', GC.RESOURCES_PATH + '/assets/pauseMenuBackground.png');

        this.load.image('wall_right', GC.RESOURCES_PATH + '/assets/wall_right.png');
        this.load.image('wall_left', GC.RESOURCES_PATH + '/assets/wall_left.png');
        this.load.image('finishButton', GC.RESOURCES_PATH + '/assets/finishButton.png');
        this.load.image('finishButton_Over', GC.RESOURCES_PATH + '/assets/finishButton_Over.png');

        this.sizer = new LoadingResourcesSizer(this);
        // this.levelsInfo = this.cache.json.get('levelsInfo');

        this.formulasList = GC.GAME_INFO.levels[this.levelNumber].formulas_list;
        if (this.formulasList !== undefined) {
            this.sizer.rowsNumber = this.formulasList.rows.length;
        } else {
            this.sizer.rowsNumber = 0;
        }

        this.placeLevelName();
        this.placeLevelInstructions();
        this.placeFormulasList();
        this.sizer.centerVertically();
        // this.placeLoadingProcessText();

        if (this.formulas.find(value => !!value.tex && !this.textures.exists(value.tex))) {
            this.placeDescription();
            this.placeLoadingBarBackground();

            let loadingBar = this.add.graphics({
                fillStyle: {
                    color: 0x6B4800
                }
            });

            this.loadingBar = loadingBar;
            this.progress = 0;
            this.loadingPicturesPart = 0.2;

            this.load.on('progress', (progress) => {
                this.progress = progress * this.loadingPicturesPart;
                let leftX = this.sizer.loadingBar_LeftX();
                let topY = this.sizer.loadingBar_TopY();
                let width = this.progress * this.sizer.loadingBar_Width();
                let height = this.sizer.loadingBar_Height();
                let radius = this.sizer.loadingBar_Radius();

                if (30 <= width) {
                    loadingBar.fillRoundedRect(leftX, topY, width, height, radius);
                }
            });
        }
    }

    create() {
        this.imagesLoaded = [];
        this.loadTexImages()
            .then(() => {
                Promise.all(this.imagesLoaded).then(() => {
                    this.placeStartButton();
                });
            });
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
        this.loadingBarDescription = description;
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
        this.loadingBarBackground = loadingBarBackground;
    }

    placeLevelName() {
        let centerX = this.sizer.levelName_CenterX();
        let topY = this.sizer.levelName_TopY();
        let fontSize = this.sizer.levelName_FontSize();
        let fontColor = this.sizer.levelName_FontColor();

        let text = this.levelNumber + " - "
            + GC.GAME_INFO.levels[this.levelNumber]["name_" + this.scene.settings.language];
        let levelName = this.add.text(centerX, topY, text,
            {fontFamily: GC.FONTS.BUTTON_OVER, fontSize: fontSize, color: fontColor});
        levelName.setOrigin(0.5, 0.5).setAlign('center');
    }

    placeLevelInstructions() {
        let centerX = this.sizer.levelInstructionsCenterX();
        let topY = this.sizer.levelInstructionsTopY();
        let fontSize = this.sizer.levelInstructionsFontSize();
        let fontColor = this.sizer.levelInstructionsFontColor();

        let text = GC.GAME_INFO.levels[this.levelNumber]['instructions_' + this.scene.settings.language];
        if (!text) return;

        let levelInstructions = this.add.text(centerX, topY, text,
            { fontFamily: GC.FONTS.TEXT, fontSize: fontSize, color: fontColor});
        levelInstructions.setOrigin(0.5, 0);
        levelInstructions.setAlign('center');
        this.levelInstructions = levelInstructions;
    }

    placeStartButton() {
        // clearInterval(this.loadingProcessTextInterval);
        // this.loadingProcessText.destroy();
        if (this.loadingBar) this.loadingBar.destroy();
        if (this.loadingBarBackground) this.loadingBarBackground.destroy();
        if (this.loadingBarDescription) this.loadingBarDescription.destroy();

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

    placeLoadingProcessText() {
        let centerX = this.sizer.loadingProcessText_X();
        let bottomY = this.sizer.loadingProcessText_Y();
        let fontSize = this.sizer.loadingProcessText_FontSize();
        let fontColor = this.sizer.loadingProcessText_FontColor();

        let loadingProcessText = this.add.text(centerX, bottomY,
            this.scene.settings.strings.loading_resources_scene.loading_process_text,
            { fontFamily: GC.FONTS.TEXT, fontSize: fontSize, color: fontColor });
        loadingProcessText.setOrigin(0.5, 1);

        let counter = 0;
        this.loadingProcessTextInterval = setInterval(() => {
            let text = this.scene.settings.strings.loading_resources_scene.loading_process_text;
            for (let i = 0; i < counter % 4; i++)
                text += '.';
            loadingProcessText.setText(text);
            counter++;
        }, 200);

        this.loadingProcessText = loadingProcessText;
    }

    async loadTexImages() {
        this.sizer.setCardHeight();
        let texToConvert = [];
        this.formulas.filter(expression => !!expression.tex).forEach(expression => {
            if (!texToConvert.includes(expression.tex) && !this.textures.exists(expression.tex))
                texToConvert.push(expression.tex);
        });
        let numberToConvert = texToConvert.length;

        let scene = this;
        function countExpression(texExpression) {
            texToConvert.filter(value => value !== texExpression);
            scene.progress = Math.max(scene.progress,
                texToConvert.length / numberToConvert * (1 - scene.loadingPicturesPart));

            let leftX = scene.sizer.loadingBar_LeftX();
            let topY = scene.sizer.loadingBar_TopY();
            let width = scene.progress * scene.sizer.loadingBar_Width();
            let height = scene.sizer.loadingBar_Height();
            let radius = scene.sizer.loadingBar_Radius();
            scene.loadingBar.fillRoundedRect(leftX, topY, width, height, radius);
        }

        for (let expression of texToConvert) {
            if (this.imagesLoaded.length >= GC.THREADS) {
                await Promise.any(this.imagesLoaded);
            }
            let div = document.createElement('div');
            div.style.padding = '2px';
            div.style.display = 'inline-block';
            document.body.append(div);
            let fontSize = 50;
            let backgroundWidth = this.sizer.cardBackground_Width();
            let backgroundHeight = this.sizer.cardBackground_Height();
            div.style.fontFamily = GC.FONTS.FORMULAS;
            div.style.fontSize = fontSize + 'px';
            katex.render(expression, div);

            let padding = GC.EXPRESSION_CARD_PADDING * 2;
            if (div.scrollHeight > backgroundHeight - padding)
                fontSize = fontSize * (backgroundHeight - padding) / div.scrollHeight;
            if (div.scrollWidth > backgroundWidth - padding)
                fontSize = fontSize * (backgroundWidth - padding) / div.scrollWidth;
            div.style.fontSize = fontSize + 'px';

            let promise = new Promise((resolve) => {
                domtoimage.toPng(div)
                    .then(url => {
                        div.remove();
                        this.textures.once('addtexture', () => {
                            countExpression(expression);
                            resolve();
                        }, this);
                        this.textures.addBase64(expression, url);
                    });
            });
            this.imagesLoaded.push(promise);
        }
    }

}