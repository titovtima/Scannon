class LevelGenerationScene extends Phaser.Scene {

    constructor() {
        super(GC.SCENES.LEVEL_GENERATION);
    }

    init(params) {
        this.levelGenerationInfo = params;
        this.numberOfFormulas = params.numberOfFormulas;
        this.initialExpressionsPath = params.initialExpressionPath;
        this.substitutionsPath = params.substitutionsPath;

        this.generator = undefined;
        this.formulas = [];
    }

    preload() {
        this.load.json(this.initialExpressionsPath, this.initialExpressionsPath);
        this.load.json(this.substitutionsPath, this.substitutionsPath);
    }

    create() {
        console.log('LevelGenerationScene create started');
        this.initialExpressions = this.cache.json.get(this.initialExpressionsPath);
        // this.substitutions = Object.assign({}, this.cache.json.get(this.substitutionsPath));
        this.substitutions = this.copy_object(this.cache.json.get(this.substitutionsPath));
        console.log('Path for substitutions', this.substitutionsPath);
        console.log('Substitutions get from path:', this.substitutions);
        for (let sub of this.substitutions.substitutions) {
            console.log('Substitution:', sub);
        }
        console.log('Path for initialExpressions', this.initialExpressionsPath);
        console.log('InitialExpressions get from path:', this.initialExpressions);


        this.sizer = new LevelGenerationSizer(this);
        console.log({
            'numberOfFormulas': this.numberOfFormulas,
            'initialExpressions': this.initialExpressions.expressions,
            'substitutions': this.substitutions.substitutions
        });
        this.generator = new LevelFormulaGenerator(this, {
            'numberOfFormulas': this.numberOfFormulas,
            'initialExpressions': this.initialExpressions.expressions,
            'substitutions': this.substitutions.substitutions
        });

        this.placeDescription();
        this.placeLoadingBarBackground();

        this.loadingBar = this.add.graphics({
            fillStyle: {
                color: 0x6B4800
            }
        })
        console.log('LevelGenerationScene create ended');
    }

    update() {
        // console.log('LevelGenerationScene update started');
        if (this.generator.levelComplete()) {
            this.scene.start(GC.SCENES.LOADING_RESOURCES, {
                'formulas': this.formulas,
                'levelGenerationInfo': this.levelGenerationInfo
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
        // console.log('LevelGenerationScene update ended');
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

    copy_object(obj) {
        if (typeof obj != "object")
            return obj
        if (Array.isArray(obj)) {
            let new_arr = []
            for (let item of obj)
                new_arr.push(this.copy_object(item))
            return new_arr
        }
        let new_obj = {}
        for (let key in obj) {
            console.log(key, obj[key])
            new_obj[key] = this.copy_object(obj[key])
        }
        return new_obj
    }
}