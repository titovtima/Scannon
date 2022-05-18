class GameCompleteScene extends Phaser.Scene {

    constructor() {
        super(GC.SCENES.GAME_COMPETE);
    }

    init(params) {
        this.score = params.score;
        this.sequence = params.sequence;
        this.totalScore = params.totalScore;
        if (this.totalScore === undefined)
            this.totalScore = 0;
        this.totalScore += this.score;

        this.scene.settings = params.settings;
        this.levelNumber = params.levelNumber;
        this.startLevel = params.startLevel;
        if (this.startLevel === undefined)
            this.startLevel = this.levelNumber;

        Scaler.setResolution(this, GC.RESOLUTIONS.MEDIUM.INTERFACE.width, GC.RESOLUTIONS.MEDIUM.INTERFACE.height);
    }

    create() {
        this.levelsInfo = this.cache.json.get('levelsInfo');
        this.sizer = new GameCompleteSizer(this);

        this.placeLevelDescription();
        if (this.startLevel !== this.levelNumber)
            this.placeTotalLevels();
        this.placeTotalScore();
        this.placeLevelScore();
        this.placeMenu();
        // this.placeLevelMenu();

        this.showScientist();
    }

    placeLevelDescription() {
        let centerX = this.sizer.levelDescription_CenterX();
        let topY = this.sizer.levelDescription_TopY();
        let fontSize = this.sizer.levelDescription_FontSize();
        let fontColor = this.sizer.levelDescription_FontColor();

        let text = this.levelsInfo.levels[this.levelNumber].index + " - "
            + this.levelsInfo.levels[this.levelNumber].description;
        let levelDescription = this.add.text(centerX, topY, text,
            {fontFamily: 'Ribeye', fontSize: fontSize, color: fontColor});
        levelDescription.setOrigin(0.5, 0);
    }

    placeTotalLevels() {
        let centerX = this.sizer.totalLevels_CenterX();
        let centerY = this.sizer.totalLevels_CenterY();
        let fontSize = this.sizer.totalLevels_FontSize();
        let fontColor = this.sizer.totalLevels_FontColor();

        let text = this.startLevel + " - " + this.levelNumber + " levels";
        let totalLevels = this.add.text(centerX, centerY, text,
            {fontFamily: 'RhodiumLibre', fontSize: fontSize, color: fontColor});
        totalLevels.setOrigin(0.5);
    }

    placeLevelScore() {
        let sizer = this.sizer;
        let add = this.add;
        let score = this.score;

        WebFont.load({
            'custom': {
                families: ['PTMono', 'PoetsenOne']
            },
            active: function () {
                let scoreLabelCenterX = sizer.levelScoreLabel_CenterX();
                let scoreLabelCenterY = sizer.levelScoreLabel_CenterY();
                let scoreLabelFontSize = sizer.levelScoreLabel_FontSize();
                let scoreLabelColor = sizer.levelScoreLabel_Color();
                add.text(
                    scoreLabelCenterX,
                    scoreLabelCenterY,
                    'Level Score',
                    { fontFamily: 'PTMono', fontSize: scoreLabelFontSize, color: scoreLabelColor }
                ).setOrigin(0.5);

                let scoreValueCenterX = sizer.levelScoreValue_CenterX();
                let scoreValueCenterY = sizer.levelScoreValue_CenterY();
                let scoreValueFontSize = sizer.levelScoreValue_FontSize();
                let scoreValueColor = sizer.levelScoreValue_Color();
                add.text(
                    scoreValueCenterX,
                    scoreValueCenterY,
                    score,
                    { fontFamily: 'PoetsenOne', fontSize: scoreValueFontSize, color: scoreValueColor }
                ).setOrigin(0.5);
            }
        })
    }

    placeTotalScore() {
        let sizer = this.sizer;
        let add = this.add;
        let score = this.totalScore;

        WebFont.load({
            'custom': {
                families: ['PTMono', 'PoetsenOne']
            },
            active: function () {
                let scoreLabelCenterX = sizer.totalScoreLabel_CenterX();
                let scoreLabelCenterY = sizer.totalScoreLabel_CenterY();
                let scoreLabelFontSize = sizer.totalScoreLabel_FontSize();
                let scoreLabelColor = sizer.totalScoreLabel_Color();
                add.text(
                    scoreLabelCenterX,
                    scoreLabelCenterY,
                    'Total Score',
                    { fontFamily: 'PTMono', fontSize: scoreLabelFontSize, color: scoreLabelColor }
                ).setOrigin(0.5);

                let scoreValueCenterX = sizer.totalScoreValue_CenterX();
                let scoreValueCenterY = sizer.totalScoreValue_CenterY();
                let scoreValueFontSize = sizer.totalScoreValue_FontSize();
                let scoreValueColor = sizer.totalScoreValue_Color();
                add.text(
                    scoreValueCenterX,
                    scoreValueCenterY,
                    score,
                    { fontFamily: 'PoetsenOne', fontSize: scoreValueFontSize, color: scoreValueColor }
                ).setOrigin(0.5);
            }
        })
    }

    placeMenu() {
        let sizer = this.sizer;
        let scene = this;
        let add = this.add;
        let score = this.score;
        let levelsInfo = this.levelsInfo;

        WebFont.load({
            'custom': {
                families: ['RibeyeMarrow', 'Ribeye']
            },
            active: function () {
                let menuItemFontSize = sizer.menuItem_FontSize();
                let menuItemColor = sizer.menuItem_Color();

                let menuItems = {};
                let labels = ['Restart level', 'Main Menu'];

                let congratsLabel = "You won!";

                if (score > 0) {
                    if (scene.levelNumber === levelsInfo.levelsNumber) {
                        labels.unshift(congratsLabel);
                    } else {
                        labels.unshift("Next level");
                    }
                }

                if (scene.scene.settings.debug !== 0)
                    labels.push('Save sequence')

                let labelIndex = 0;
                for (let label of labels) {
                    let menuItemCenterX = sizer.menuItem_CenterX();
                    let menuItemCenterY = sizer.menuItem_CenterY(labelIndex);
                    let fontFamily = 'RibeyeMarrow'
                    if (label === congratsLabel)
                        fontFamily = 'Ribeye'

                    let menuItem = add.text(
                        menuItemCenterX, menuItemCenterY,
                        label,
                        { fontFamily: fontFamily, fontSize: menuItemFontSize, color: menuItemColor }
                    ).setOrigin(0.5);

                    if (label !== congratsLabel) {
                        menuItem.setInteractive();

                        menuItem.on('pointerover', () => {
                            menuItem.setFontFamily('Ribeye');
                        });

                        menuItem.on('pointerout', () => {
                            menuItem.setFontFamily('RibeyeMarrow');
                        });

                        menuItem.on('pointerup', () => {
                            switch (label) {
                                case 'Main Menu':
                                    scene.openLevelMenu();
                                    break;
                                case 'Restart level':
                                    scene.restartLevel();
                                    break;
                                case 'Next level':
                                    scene.startNextLevel();
                                    break;
                                case 'Save sequence':
                                    scene.saveSequence();
                            }
                        })
                    }
                    labelIndex++;
                }



            }
        })

    }

    placeLevelMenu() {
        let sizer = this.sizer;
        let scene = this;
        let add = this.add;
        let score = this.score;
        let levelsInfo = this.levelsInfo;

        WebFont.load({
            'custom': {
                families: ['RibeyeMarrow', 'Ribeye']
            },
            active: function () {
                let menuItemFontSize = sizer.levelMenuItem_FontSize();
                let menuItemColor = sizer.levelMenuItem_Color();

                let menuItems = {};
                let labels = [];

                if (score > 0) {
                    if (scene.levelNumber !== levelsInfo.levelsNumber) {
                        labels.unshift("Next level");
                    }
                }

                if (scene.scene.settings.debug !== 0)
                    labels.push('Save sequence')

                let labelIndex = 0;
                for (let label of labels) {
                    let menuItemCenterX = sizer.levelMenuItem_CenterX();
                    let menuItemCenterY = sizer.levelMenuItem_CenterY(labelIndex);
                    let fontFamily = 'RibeyeMarrow'

                    let menuItem = add.text(
                        menuItemCenterX, menuItemCenterY,
                        label,
                        {fontFamily: fontFamily, fontSize: menuItemFontSize, color: menuItemColor}
                    ).setOrigin(0.5);

                    menuItem.setInteractive();

                    menuItem.on('pointerover', () => {
                        menuItem.setFontFamily('Ribeye');
                    });

                    menuItem.on('pointerout', () => {
                        menuItem.setFontFamily('RibeyeMarrow');
                    });

                    menuItem.on('pointerup', () => {
                        switch (label) {
                            case 'Restart':
                                scene.restartLevel();
                                break;
                            case 'Next level':
                                scene.startNextLevel();
                                break;
                            case 'Save sequence':
                                scene.saveSequence();
                        }
                    })

                    labelIndex++;
                }



            }
        })

    }

    showScientist() {
        this.load.json('showScientists', '/resources/scientists/showScientists.json');

        this.load.once('complete', () => {
            let showScientists = this.cache.json.get('showScientists');
            console.log('showScientists', showScientists);

            for (let rule of showScientists.scoreToScientist) {
                console.log('total score:', this.totalScore);
                console.log('rule', rule);
                if (this.totalScore >= rule.score) {
                    this.showScientistPortrait(rule.scientist.portrait);
                    this.placeScientistDescription(rule.scientist.description);
                    this.placeScientistName(rule.scientist.name);
                }
            }
        }, this);
        this.load.start();
    }

    showScientistPortrait(path) {
        this.load.image(path, path);

        let centerX = this.sizer.scientistPortrait_CenterX();
        let centerY = this.sizer.scientistPortrait_CenterY();
        let scale = this.sizer.scientistPortrait_Scale();

        this.load.once('complete', () => {
            let portrait = this.add.image(centerX, centerY, path).setOrigin(0.5).setScale(scale);
        }, this);
        this.load.start();
    }

    placeScientistDescription(text) {
        let centerX = this.sizer.scientistDescription_CenterX();
        let topY = this.sizer.scientistDescription_TopY();
        let fontColor = this.sizer.scientistDescription_FontColor();
        let fontSize = this.sizer.scientistDescription_FontSize();
        let fixedWidth = this.sizer.scientistDescription_FixedWidth();

        let description = this.add.text(centerX, topY, text,
            {fontFamily: 'RhodiumLibre', fontSize: fontSize, color: fontColor});
        description.setOrigin(0.5, 0);
        description.setWordWrapWidth(fixedWidth, 0);
        description.setAlign('center');
    }

    placeScientistName(name) {
        let centerX = this.sizer.scientistName_CenterX();
        let topY = this.sizer.scientistName_TopY();
        let fontSize = this.sizer.scientistName_FontSize();
        let fontColor = this.sizer.scientistName_FontColor();

        let text = "You're like\n" + name;
        let scientistName = this.add.text(centerX, topY, text,
            {fontFamily: 'RhodiumLibre', fontSize: fontSize, color: fontColor});
        scientistName.setOrigin(0.5, 0);
        scientistName.setAlign('center');
    }

    restartLevel() {
        this.scene.start(GC.SCENES.LEVEL_GENERATION, {
            levelNumber: this.levelNumber,
            settings: this.scene.settings,
            totalScore: this.totalScore - this.score,
            startLevel: this.startLevel
        });
    }

    startNextLevel() {
        this.scene.start(GC.SCENES.LEVEL_GENERATION, {
            levelNumber: this.levelNumber + 1,
            settings: this.scene.settings,
            totalScore: this.totalScore,
            startLevel: this.startLevel
        });
    }

    openLevelMenu() {
        this.scene.start(GC.SCENES.LEVEL_MENU, { settings: this.scene.settings });
    }

    openMainMenu() {
        this.scene.start(GC.SCENES.MAIN_MENU, { settings: this.scene.settings });
    }

    saveSequence() {
        let dataToSave = {
            'sequence': this.sequence.map(function (formula) {
                return {
                    unicode: formula.unicode,
                    scoreForHit: formula.scoreForHit,
                    scoreForSkip: formula.scoreForSkip
                }
            })
        };
        let file = new Blob(
            [JSON.stringify(dataToSave)], {
                type: 'application/json'
            }
        );
        let link = document.createElement('a');
        link.setAttribute('href', URL.createObjectURL(file));
        link.setAttribute('download', 'sequence.json');
        link.click();
        URL.revokeObjectURL(file);
    }

}