class LevelGenerationScene extends Phaser.Scene {

    constructor(params) {
        super(GC.SCENES.LEVEL_GENERATION);
    }

    init(params) {
        this.levelGenerationParams = params;

        this.formulas = [];
    }

    create() {
        this.sizer = new LevelGenerationSizer(this);
        this.generator = new LevelFormulaGenerator(this, this.levelGenerationParams);

        this.placeDescription();
        this.placeLoadingBarBackground();

        this.loadingBar = this.add.graphics({
            fillStyle: {
                color: 0x6B4800
            }
        })
    }

    update() {
        if (this.generator.levelComplete()) {
            this.scene.start(GC.SCENES.LOADING_RESOURCES, {
                'formulas': this.formulas
            });
        }

        let formula = this.generator.nextFormula();
        this.formulas.push(formula);

        let progress = this.generator.progress();

        let leftX = this.sizer.loadingBar_LeftX();
        let topY = this.sizer.loadingBar_TopY();
        let width = progress * this.sizer.loadingBar_Width();
        let height = this.sizer.loadingBar_Height();
        let radius = this.sizer.loadingBar_Radius();

        this.loadingBar.fillRoundedRect(leftX, topY, width, height, radius);
    }

    placeDescription() {
        let sizer = this.sizer;
        let add = this.add;

        WebFont.load({
            'custom': {
                families: ['RhodiumLibre']
            },
            active: function () {
                let centerX = sizer.description_CenterX();
                let centerY = sizer.description_CenterY();

                let fontSize = sizer.description_FontSize();
                let fontColor = sizer.description_FontColor();

                let description = add.text(centerX, centerY,
                    'Generating the level', { fontFamily: 'RhodiumLibre', fontSize: fontSize, color: fontColor });
                description.setOrigin(0.5);
            }
        });
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

}