class LevelMenuScene extends Phaser.Scene {

    constructor() {
        super(GC.SCENES.LEVEL_MENU);
    }

    init(params) {
        //  Inject our CSS
        let element = document.createElement('style');
        document.head.appendChild(element);

        let sheet = element.sheet;

        let ribeyeMarrowStyles = '@font-face { font-family: "RibeyeMarrow"; src: url("/fonts/RibeyeMarrow-Regular.ttf") format("truetype"); }\n';
        sheet.insertRule(ribeyeMarrowStyles, 0);

        let ribeyeStyles = '@font-face { font-family: "Ribeye"; src: url("/fonts/Ribeye-Regular.ttf") format("truetype"); }\n';
        sheet.insertRule(ribeyeStyles, 0);

        let rhodiumLibreStyles = '@font-face { font-family: "RhodiumLibre"; src: url("/fonts/RhodiumLibre-Regular.ttf") format("truetype"); }\n';
        sheet.insertRule(rhodiumLibreStyles, 0);

        let ptMonoStyles = '@font-face { font-family: "PTMono"; src: url("/fonts/PTMono-Regular.ttf") format("truetype"); }\n';
        sheet.insertRule(ptMonoStyles, 0);

        let poetsenOneStyles = '@font-face { font-family: "PoetsenOne"; src: url("/fonts/PoetsenOne-Regular.ttf") format("truetype"); }\n';
        sheet.insertRule(poetsenOneStyles, 0);

        this.scene.settings = params.settings;
        this.setDefaultSettings();

        Scaler.setResolution(this, GC.RESOLUTIONS.MEDIUM.INTERFACE.width, GC.RESOLUTIONS.MEDIUM.INTERFACE.height);
    }

    preload() {
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

        this.load.json('levelsInfo', '/js/GameConfiguration/levelsInfo.json');
        this.load.image('cardBackground', '/js/LevelMenu/src/cardBackground.png');
        this.load.image('cardBackground_Bordered', '/js/LevelMenu/src/cardBackground_Bordered.png');
    }

    create() {
        console.log('base path', GC.BASE_PATH);
        this.levelsInfo = this.cache.json.get('levelsInfo');

        this.sizer = new LevelMenuSizer(this);

        // this.placeMainMenuButton();
        this.placeSettingsButton();
        this.placeLevelCards();
        this.placeLabel();
    }

    placeLevelCards() {
        for (let level of this.levelsInfo.levels) {
            let cardBackground = this.placeCardBackground(level.index);
            this.placeCardIndex(level.index, cardBackground);
            this.placeCardDescription(level.index);
        }
        this.placeLastCard(this.levelsInfo.levelsNumber + 1);
    }

    placeMainMenuButton() {
        let sizer = this.sizer;
        let scene = this.scene;
        let add = this.add;

        WebFont.load({
            'custom': {
                families: ['Ribeye', 'RibeyeMarrow']
            },
            active: function () {
                let leftX = sizer.mainMenuButton_LeftX();
                let topY = sizer.mainMenuButton_TopY();

                let fontSize = sizer.mainMenuButton_fontSize();
                let fontColor = sizer.mainMenuButton_fontColor();

                let mainMenuButton = add.text(leftX, topY,
                    '<- main menu', { fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor });
                mainMenuButton.setInteractive();
                mainMenuButton.on('pointerover', () => {
                    mainMenuButton.setFontFamily('Ribeye');
                });
                mainMenuButton.on('pointerout', () => {
                    mainMenuButton.setFontFamily('RibeyeMarrow');
                });
                mainMenuButton.on('pointerup', () => {
                    scene.start(GC.SCENES.MAIN_MENU, { settings: scene.settings });
                });
            }
        })
    }

    placeSettingsButton() {
        let sizer = this.sizer;
        let add = this.add;
        let scene = this.scene;

        WebFont.load({
            'custom': {
                families: ['Ribeye', 'RibeyeMarrow']
            },
            active: function () {
                let settingsButtonPosition = sizer.settingsButtonPosition();
                let fontSize = sizer.settingsButton_fontSize();
                let fontColor = sizer.settingsButton_fontColor();
                let settingsButton = add.text(
                    settingsButtonPosition.x, settingsButtonPosition.y,
                    'Settings', {fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor});
                settingsButton.setOrigin(1, 0);
                settingsButton.setInteractive();
                settingsButton.on('pointerover', () => {
                    settingsButton.setFontFamily('Ribeye');
                });
                settingsButton.on('pointerout', () => {
                    settingsButton.setFontFamily('RibeyeMarrow');
                });
                settingsButton.on('pointerup', () => {
                    scene.start(GC.SCENES.SETTINGS, {
                        settings: scene.settings,
                        sceneFrom: GC.SCENES.LEVEL_MENU
                    });
                });
            }
        });
    }

    placeCardBackground(index) {
        const leftX = this.sizer.backgroundRectangle_LeftX(index);
        const topY = this.sizer.backgroundRectangle_TopY(index);

        let cardBackground = this.add.image(leftX, topY, 'cardBackground');
        cardBackground.setOrigin(0);

        // if (index !== this.levelsInfo.levels.length - 1) {
        cardBackground.setInteractive();
        cardBackground.on('pointerover', () => {
            cardBackground.setTexture('cardBackground_Bordered');
        });
        cardBackground.on('pointerout', () => {
            cardBackground.setTexture('cardBackground');
        });
        cardBackground.on('pointerup', () => {
            ym(88802966,'reachGoal','openLevel');
            this.scene.start(GC.SCENES.LEVEL_GENERATION, {
                "levelNumber": index,
                "settings": this.scene.settings
            });
            // let autogenerate = this.levelsInfo.levels[index - 1].autogenerate;
            // let basePath = "/js/GameConfiguration";
            // let initialExpressionPath = basePath + this.levelsInfo.levels[index - 1].initialExpressions;
            // let substitutionsPath = basePath + this.levelsInfo.levels[index - 1].substitutions;
            // let numberOfFormulas = this.levelsInfo.levels[index - 1].numberOfFormulas;
            // let rulePacksPath = basePath + this.levelsInfo.levels[index - 1].rulePacks;
            // let maxLength = this.levelsInfo.levels[index - 1].maxLength;
            // let minLength = this.levelsInfo.levels[index - 1].minLength;
            // let sequences = this.levelsInfo.levels[index - 1].sequences;
            // if (sequences !== undefined)
            //     sequences = sequences.map(function (seq) {
            //         return basePath + seq;
            //     });
            //
            //
            // this.scene.start(GC.SCENES.LEVEL_GENERATION, {
            //     'autogenerate': autogenerate,
            //     'numberOfFormulas': numberOfFormulas,
            //     'initialExpressionPath': initialExpressionPath,
            //     'substitutionsPath': substitutionsPath,
            //     'rulePacksPath': rulePacksPath,
            //     'maxLength': maxLength,
            //     'minLength': minLength,
            //     'sequences': sequences,
            //     'settings': this.scene.settings
            // });
        });
        // }

        return cardBackground;
    }

    placeCardIndex(index, cardBackground) {
        let sizer = this.sizer;
        let add = this.add;

        WebFont.load({
            'custom': {
                families: ['Ribeye', 'RibeyeMarrow']
            },
            active: function () {
                let centerX = sizer.cardIndex_CenterX(index);
                let topY = sizer.cardIndex_TopY(index);

                let fontSize = sizer.cardIndex_fontSize();
                let fontColor = sizer.cardIndex_fontColor();

                let cardIndex = add.text(centerX, topY,
                    index, { fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor });
                cardIndex.setOrigin(0.5, 0);

                cardBackground.on('pointerover', () => {
                    cardIndex.setFontFamily('Ribeye');
                });
                cardBackground.on('pointerout', () => {
                    cardIndex.setFontFamily('RibeyeMarrow');
                })
            }
        });
    }

    placeCardDescription(index) {
        let sizer = this.sizer;
        let add = this.add;
        let description = this.levelsInfo.levels[index].description;

        WebFont.load({
            'custom': {
                families: ['RhodiumLibre']
            },
            active: function () {
                let centerX = sizer.cardDescription_CenterX(index);
                let centerY = sizer.cardDescription_CenterY(index);
                let fontSize = sizer.cardDescription_FontSize(index);
                let color = sizer.cardDescription_Color(index);

                add.text(
                    centerX, centerY,
                    description,
                    { fontFamily: 'RhodiumLibre', fontSize: fontSize, color: color }
                ).setOrigin(0.5);
            }
        })
    }

    placeLastCard(index) {
        let leftX = this.sizer.backgroundRectangle_LeftX(index);
        let topY = this.sizer.backgroundRectangle_TopY(index);

        let cardBackground = this.add.image(leftX, topY, 'cardBackground');
        cardBackground.setOrigin(0);

        let sizer = this.sizer;
        let add = this.add;

        WebFont.load({
            'custom': {
                families: ['RhodiumLibre']
            },
            active: function () {
                let centerX = leftX + sizer.lastCardTextCenterX();
                let centerY = topY + sizer.lastCardTextCenterY();
                let fontSize = sizer.lastCardFontSize();
                let color = sizer.lastCardFontColor();

                let lastCardDescription = add.text(centerX, centerY, 'Coming soon...',
                    { fontFamily: 'RhodiumLibre', fontSize: fontSize, color: color });
                lastCardDescription.setOrigin(0.5);
            }
        });
    }

    setDefaultSettings() {
        if (this.scene.settings === undefined)
            this.scene.settings = {};

        let getUrlParams = new URLSearchParams(window.location.search);

        if (this.scene.settings.speed === undefined) {
            this.scene.settings.speed = parseFloat(getUrlParams.get("speed"));
            if (isNaN(this.scene.settings.speed))
                this.scene.settings.speed = 0.7;
        }

        if (this.scene.settings.mistakeTimeout === undefined) {
            this.scene.settings.mistakeTimeout = parseFloat(getUrlParams.get("mistakeTimeout"));
            if (isNaN(this.scene.settings.mistakeTimeout))
                this.scene.settings.mistakeTimeout = 5;
        }

        if (this.scene.settings.showCorrectRule === undefined) {
            this.scene.settings.showCorrectRule = parseFloat(getUrlParams.get("showCorrectRule"));
            if (isNaN(this.scene.settings.showCorrectRule))
                this.scene.settings.showCorrectRule = 3;
        }

        if (this.scene.settings.debug === undefined) {
            this.scene.settings.debug = parseInt(getUrlParams.get("debug"));
            if (isNaN(this.scene.settings.debug))
                this.scene.settings.debug = 0;
        }
    }

    placeLabel() {
        let sizer = this.sizer;
        let add = this.add;

        WebFont.load({
            'custom': {
                families: ['RibeyeMarrow']
            },
            active: function () {
                let labelPosition = sizer.labelPosition();
                let labelFontSize = sizer.labelFontSize();
                let labelFontColor = sizer.labelFontColor();

                let label = add.text(labelPosition.x, labelPosition.y, 'SCANNON - LOGIC',
                    { fontFamily: 'RibeyeMarrow', fontSize: labelFontSize, color: labelFontColor });
                label.setOrigin(0, 0);
            }
        });
    }
}