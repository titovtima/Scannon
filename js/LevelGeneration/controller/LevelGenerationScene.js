class LevelGenerationScene extends Phaser.Scene {

    constructor() {
        super(GC.SCENES.LEVEL_GENERATION);
    }

    init(params) {
        this.levelGenerationInfo = params;
        this.levelNumber = params.levelNumber;
        this.totalScore = params.totalScore;
        this.startLevel = params.startLevel;
        this.isRestarted = params.isRestarted;
        // this.numberOfFormulas = params.numberOfFormulas;
        // this.initialExpressionsPath = params.initialExpressionPath;
        // this.substitutionsPath = params.substitutionsPath;
        // this.rulePacksPath = params.rulePacksPath;
        // this.maxLength = params.maxLength;
        // this.minLength = params.minLength;
        // this.autogenerate = params.autogenerate;
        // this.sequences = params.sequences;

        this.generator = undefined;
        this.formulas = [];

        this.scene.settings = params.settings;

        Scaler.setResolution(this, GC.RESOLUTIONS.MEDIUM.INTERFACE.width, GC.RESOLUTIONS.MEDIUM.INTERFACE.height);
    }

    preload() {
        // this.levelsInfo = this.cache.json.get('levelsInfo');

        let basePath = GC.RESOURCES_PATH;
        console.log(GC.GAME_INFO);
        console.log(this.levelNumber);
        console.log(GC.GAME_INFO.levels[this.levelNumber]);
        this.sequences = GC.GAME_INFO.levels[this.levelNumber].sequences;
        this.sequences = this.sequences.map(function (seq) {
            return basePath + seq;
        });
        this.sequence = this.pickRandomElement(this.sequences);
        this.load.json(this.sequence, this.sequence);
    }

    create() {
        this.formulas = this.copy_object(this.cache.json.get(this.sequence)).sequence;
        // this.formulas = <autogeneration_function(this.levelRequirements) -> expression[]>

        this.scene.start(GC.SCENES.LOADING_RESOURCES, {
            'formulas': this.formulas,
            'levelNumber': this.levelNumber,
            'settings': this.scene.settings,
            'totalScore': this.totalScore,
            'startLevel': this.startLevel,
            'isRestarted': this.isRestarted
        });

        this.sizer = new LevelGenerationSizer(this);

        this.loadingBar = this.add.graphics({
            fillStyle: {
                color: 0x6B4800
            }
        });
    }

    pickRandomElement(items) {
        return items[Math.floor(Math.random() * items.length)];
    }

    copy_object(obj) {
        if (typeof obj != "object")
            return obj;
        if (Array.isArray(obj)) {
            let new_arr = [];
            for (let item of obj)
                new_arr.push(this.copy_object(item));
            return new_arr
        }
        let new_obj = {};
        for (let key in obj) {
            // console.log(key, obj[key])
            new_obj[key] = this.copy_object(obj[key])
        }
        return new_obj
    }
}