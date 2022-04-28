class GameCompleteScene extends Phaser.Scene {

    constructor() {
        super(GC.SCENES.GAME_COMPETE);
    }

    init(params) {
        this.score = params.score;
        this.sequence = params.sequence;

        this.scene.settings = params.settings;

        Scaler.setResolution(this, GC.RESOLUTIONS.MEDIUM.INTERFACE.width, GC.RESOLUTIONS.MEDIUM.INTERFACE.height);
    }

    create() {
        this.sizer = new GameCompleteSizer(this);

        this.placeScore();
        this.placeMenu();
    }

    placeScore() {
        let sizer = this.sizer;
        let add = this.add;
        let score = this.score;

        WebFont.load({
            'custom': {
                families: ['PTMono', 'PoetsenOne']
            },
            active: function () {
                let scoreLabelCenterX = sizer.scoreLabel_CenterX();
                let scoreLabelCenterY = sizer.scoreLabel_CenterY();
                let scoreLabelFontSize = sizer.scoreLabel_FontSize();
                let scoreLabelColor = sizer.scoreLabel_Color();
                add.text(
                    scoreLabelCenterX,
                    scoreLabelCenterY,
                    'Your Score',
                    { fontFamily: 'PTMono', fontSize: scoreLabelFontSize, color: scoreLabelColor }
                ).setOrigin(0.5);

                let scoreValueCenterX = sizer.scoreValue_CenterX();
                let scoreValueCenterY = sizer.scoreValue_CenterY();
                let scoreValueFontSize = sizer.scoreValue_FontSize();
                let scoreValueColor = sizer.scoreValue_Color();
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

        WebFont.load({
            'custom': {
                families: ['RibeyeMarrow', 'Ribeye']
            },
            active: function () {
                let menuItemFontSize = sizer.menuItem_FontSize();
                let menuItemColor = sizer.menuItem_Color();

                let menuItems = {};
                for (let label of ['Restart', 'Main Menu', 'Save sequence']) {
                    let menuItemCenterX = sizer.menuItem_CenterX();
                    let menuItemCenterY = sizer.menuItem_CenterY(label);
                    let menuItem = add.text(
                        menuItemCenterX, menuItemCenterY,
                        label,
                        { fontFamily: 'RibeyeMarrow', fontSize: menuItemFontSize, color: menuItemColor }
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
                            case 'Main Menu':
                                scene.openLevelMenu();
                                break;
                            case 'Save sequence':
                                scene.saveSequence();
                        }
                    })
                }



            }
        })

    }

    restartLevel() {
        this.scene.start(GC.SCENES.LEVEL_GENERATION, this.levelGenerationInfo);
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