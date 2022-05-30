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

        this.load.image('arrow_question', GC.RESOURCES_PATH + '/assets/arrow_question.png');
        this.load.image('equals', GC.RESOURCES_PATH + '/assets/equals.png');
        this.load.image('not_equals', GC.RESOURCES_PATH + '/assets/not_equals.png');
        this.load.image('not_equals_red', GC.RESOURCES_PATH + '/assets/not_equals_red.png');

        this.load.image('pauseButton', GC.RESOURCES_PATH + '/assets/pauseButton.png');
        this.load.image('pauseMenuBackground', GC.RESOURCES_PATH + '/assets/pauseMenuBackground.png');

        this.load.image('wall_right', GC.RESOURCES_PATH + '/assets/wall_right.png');
        this.load.image('wall_left', GC.RESOURCES_PATH + '/assets/wall_left.png');

        this.sizer = new LoadingResourcesSizer(this);

        this.placeDescription();
        this.placeLoadingBarBackground();

        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0x6B4800
            }
        });

        this.load.on('progress', (progress) => {
            let leftX = this.sizer.loadingBar_LeftX();
            let topY = this.sizer.loadingBar_TopY();
            let width = progress * this.sizer.loadingBar_Width();
            let height = this.sizer.loadingBar_Height();
            let radius = this.sizer.loadingBar_Radius();

            if (30 <= width) {
                loadingBar.fillRoundedRect(leftX, topY, width, height, radius);
            }
        });
    }

    create() {
        this.scene.start(GC.SCENES.GAME, {
            'formulas': this.formulas,
            'levelNumber': this.levelNumber,
            'settings': this.scene.settings,
            'totalScore': this.totalScore,
            'startLevel': this.startLevel,
            'isRestarted': this.isRestarted
        });
    }

    placeDescription() {
        let centerX = this.sizer.description_CenterX();
        let centerY = this.sizer.description_CenterY();

        let fontSize = this.sizer.description_FontSize();
        let fontColor = this.sizer.description_FontColor();

        let description = this.add.text(centerX, centerY,
            'Loading resources', {fontFamily: 'RhodiumLibre', fontSize: fontSize, color: fontColor});
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

    placeTextHint() {
        let centerX = this.sizer.textHintCenterX();
        let topY = this.sizer.textHintTopY();
        let fontSize = this.sizer.textHintFontSize();
        let fontColor = this.sizer.textHintFontColor();

        let textHint = this.add.text(centerX, topY,
            "shoot the wrong steps by click",
            { fontFamily: "RhodiumLibre", fontSize: fontSize, color: fontColor});
        textHint.setOrigin(0.5, 0);
    }
}