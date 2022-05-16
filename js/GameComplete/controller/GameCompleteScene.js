class GameCompleteScene extends Phaser.Scene {

    constructor() {
        super(GC.SCENES.GAME_COMPETE);
    }

    init(params) {
        this.score = params.score;
        this.sequence = params.sequence;

        this.scene.settings = params.settings;
        this.levelNumber = params.levelNumber;

        Scaler.setResolution(this, GC.RESOLUTIONS.MEDIUM.INTERFACE.width, GC.RESOLUTIONS.MEDIUM.INTERFACE.height);
    }

    create() {
        this.levelsInfo = this.cache.json.get('levelsInfo');
        this.sizer = new GameCompleteSizer(this);

        this.placeTotalScore();
        this.placeLevelScore();
        this.placeMenu();
        this.placeLevelMenu();
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
        let score = this.score;

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
                let labels = ['Main Menu'];

                let congratsLabel = "Congratulations! You won the game!";

                if (score > 0) {
                    if (scene.levelNumber === levelsInfo.levelsNumber) {
                        labels.unshift(congratsLabel);
                    }
                }

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
                let labels = ['Restart'];

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

    restartLevel() {
        this.scene.start(GC.SCENES.LEVEL_GENERATION, {
            levelNumber: this.levelNumber,
            settings: this.scene.settings
        });
    }

    startNextLevel() {
        this.scene.start(GC.SCENES.LEVEL_GENERATION, {
            levelNumber: this.levelNumber + 1,
            settings: this.scene.settings
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