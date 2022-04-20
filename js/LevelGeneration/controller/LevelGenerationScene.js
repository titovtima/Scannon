class LevelGenerationScene extends Phaser.Scene {

    constructor() {
        super(GC.SCENES.LEVEL_GENERATION);
    }

    init(params) {
        this.levelGenerationInfo = params;
        this.numberOfFormulas = params.numberOfFormulas;
        this.initialExpressionsPath = params.initialExpressionPath;
        this.substitutionsPath = params.substitutionsPath;
        this.rulePacksPath = params.rulePacksPath;
        this.maxLength = params.maxLength;
        this.minLength = params.minLength;
        this.autogenerate = params.autogenerate;
        this.sequences = params.sequences;
        this.allRulePacksPath = '/js/GameConfiguration/allRulePacks.json';
        this.badRulePacksPath = '/js/GameConfiguration/badRulePacks.json';

        this.generator = undefined;
        this.formulas = [];

        this.scene.settings = params.settings;

        Scaler.setResolution(this, GC.RESOLUTIONS.MEDIUM.INTERFACE.width, GC.RESOLUTIONS.MEDIUM.INTERFACE.height);
    }

    preload() {
        if (this.autogenerate) {
            this.load.json(this.initialExpressionsPath, this.initialExpressionsPath);
            this.load.json(this.rulePacksPath, this.rulePacksPath);
            this.load.json(this.allRulePacksPath, this.allRulePacksPath);
            this.load.json(this.badRulePacksPath, this.badRulePacksPath);
        } else {
            this.sequence = this.pickRandomElement(this.sequences);
            this.load.json(this.sequence, this.sequence);
        }
    }

    create() {
        this.needRestart = false;
        if (this.autogenerate) {
            this.initialExpressions = this.copy_object(this.cache.json.get(this.initialExpressionsPath));
            this.substitutions = this.copy_object(this.cache.json.get(this.substitutionsPath));
            this.rulePacks = this.copy_object(this.cache.json.get(this.rulePacksPath));
            this.rulePacks = this.rulePacks.rulePacks;
            this.allRulePacks = this.cache.json.get(this.allRulePacksPath);
            this.badRulePacks = this.cache.json.get(this.badRulePacksPath);
            this.rulesFromPacks = [];
            for (let rulePack of this.allRulePacks.rulePacks) {
                if (this.rulePacks.includes(rulePack.code))
                    this.rulesFromPacks = this.rulesFromPacks.concat(rulePack.rules);
            }
            for (let rulePack of this.badRulePacks.rulePacks) {
                if (this.rulePacks.includes(rulePack.code))
                    this.rulesFromPacks = this.rulesFromPacks.concat(rulePack.rules);
            }

            this.generator = new LevelFormulaGenerator(this, {
                'numberOfFormulas': this.numberOfFormulas,
                'initialExpressions': this.initialExpressions.expressions,
                'rulesFromPacks': this.rulesFromPacks,
                'maxLength': this.maxLength,
                'minLength': this.minLength
            });
        } else {
            this.formulas = this.copy_object(this.cache.json.get(this.sequence)).sequence;
            this.scene.start(GC.SCENES.LOADING_RESOURCES, {
                'formulas': this.formulas,
                'levelGenerationInfo': this.levelGenerationInfo,
                'settings': this.scene.settings
            });
        }

        this.sizer = new LevelGenerationSizer(this);

        this.placeDescription();
        this.placeLoadingBarBackground();

        this.loadingBar = this.add.graphics({
            fillStyle: {
                color: 0x6B4800
            }
        })
    }

    update() {
        if (this.needRestart) return;
        if (!this.autogenerate || this.generator === undefined) {
            this.needRestart = true
            this.scene.restart(this.levelGenerationInfo);
        } else {
            if (this.generator.levelComplete()) {
                this.scene.start(GC.SCENES.LOADING_RESOURCES, {
                    'formulas': this.formulas,
                    'levelGenerationInfo': this.levelGenerationInfo,
                    'settings': this.scene.settings
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

    pickRandomElement(items) {
        return items[Math.floor(Math.random() * items.length)];
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
            // console.log(key, obj[key])
            new_obj[key] = this.copy_object(obj[key])
        }
        return new_obj
    }
}