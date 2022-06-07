class LevelMenuScene extends Phaser.Scene {

    constructor() {
        super(GC.SCENES.LEVEL_MENU);
    }

    init(params) {
        //  Inject our CSS
        let element = document.createElement('style');
        document.head.appendChild(element);

        let sheet = element.sheet;

        // let ribeyeMarrowStyles = '@font-face { font-family: "RibeyeMarrow"; src: url("' + GC.BASE_PATH + '/fonts/RibeyeMarrow-Regular.ttf") format("truetype"); }\n';
        // sheet.insertRule(ribeyeMarrowStyles, 0);
        //
        // let ribeyeStyles = '@font-face { font-family: "Ribeye"; src: url("' + GC.BASE_PATH + '/fonts/Ribeye-Regular.ttf") format("truetype"); }\n';
        // sheet.insertRule(ribeyeStyles, 0);
        //
        // let rhodiumLibreStyles = '@font-face { font-family: "RhodiumLibre"; src: url("' + GC.BASE_PATH + '/fonts/RhodiumLibre-Regular.ttf") format("truetype"); }\n';
        // sheet.insertRule(rhodiumLibreStyles, 0);

        let ptMonoStyles = '@font-face { font-family: "PTMono"; src: url("' + GC.BASE_PATH + '/fonts/PTMono-Regular.ttf") format("truetype"); }\n';
        sheet.insertRule(ptMonoStyles, 0);

        let poetsenOneStyles = '@font-face { font-family: "PoetsenOne"; src: url("' + GC.BASE_PATH + '/fonts/PoetsenOne-Regular.ttf") format("truetype"); }\n';
        sheet.insertRule(poetsenOneStyles, 0);

        let roboto = '@font-face { font-family: "Roboto"; src: url("' + GC.BASE_PATH + '/fonts/Roboto-Regular.ttf") format("truetype"); }\n';
        sheet.insertRule(roboto, 0);

        // let alice = '@font-face { font-family: "Alice"; src: url("' + GC.BASE_PATH + '/fonts/Alice-Regular.ttf") format("truetype"); }\n';
        // sheet.insertRule(alice, 0);

        let cheque = '@font-face { font-family: "Cheque"; src: url("' + GC.BASE_PATH + '/fonts/Cheque-Regular.otf") format("truetype"); }\n';
        sheet.insertRule(cheque, 0);

        let chequeBlack = '@font-face { font-family: "ChequeBlack"; src: url("' + GC.BASE_PATH + '/fonts/Cheque-Black.otf") format("truetype"); }\n';
        sheet.insertRule(chequeBlack, 0);

        this.scene.settings = params.settings;

        Scaler.setResolution(this, GC.RESOLUTIONS.MEDIUM.INTERFACE.width, GC.RESOLUTIONS.MEDIUM.INTERFACE.height);
    }

    preload() {
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

        this.load.json('levelsInfo', GC.RESOURCES_PATH + '/levelsInfo.json');
        this.load.json('languages', GC.BASE_PATH + '/resources/languages.json');
        this.load.image('cardBackground', GC.RESOURCES_PATH + '/assets/cardBackground.png');
        this.load.image('cardBackground_Bordered', GC.RESOURCES_PATH + '/assets/cardBackground_Bordered.png');
    }

    create() {
        this.setDefaultSettings();
        this.levelsInfo = this.cache.json.get('levelsInfo');
        this.strings = this.scene.settings.strings.menu;

        this.sizer = new LevelMenuSizer(this);

        let scene = this;
        WebFont.load({
            'custom': {
                families: ['Roboto', 'PoetsenOne', 'PTMono', 'Cheque', 'ChequeBlack']
            },
            active: function () {
                scene.placeSettingsButton();
                scene.placeLevelCards();
                scene.placeLabel();
            }
        });
    }

    placeLevelCards() {
        for (let level of this.levelsInfo.levels) {
            let cardBackground = this.placeCardBackground(level.index);
            this.placeCardIndex(level.index, cardBackground);
            this.placeCardDescription(level.index);
        }
        this.placeLastCard(this.levelsInfo.levelsNumber + 1);
    }

    placeSettingsButton() {
        let settingsButtonPosition = this.sizer.settingsButtonPosition();
        let fontSize = this.sizer.settingsButton_fontSize();
        let fontColor = this.sizer.settingsButton_fontColor();
        let text = this.strings.settings;
        let settingsButton = this.add.text(
            settingsButtonPosition.x, settingsButtonPosition.y,
            text, {fontFamily: GC.FONTS.BUTTON_OUT, fontSize: fontSize, color: fontColor});
        settingsButton.setOrigin(1, 0);
        settingsButton.setInteractive();
        settingsButton.on('pointerover', () => {
            settingsButton.setFontFamily(GC.FONTS.BUTTON_OVER);
        });
        settingsButton.on('pointerout', () => {
            settingsButton.setFontFamily(GC.FONTS.BUTTON_OUT);
        });
        settingsButton.on('pointerup', () => {
            this.scene.start(GC.SCENES.SETTINGS, {
                settings: this.scene.settings,
                sceneFrom: GC.SCENES.LEVEL_MENU
            });
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
        });

        return cardBackground;
    }

    placeCardIndex(index, cardBackground) {
        let centerX = this.sizer.cardIndex_CenterX(index);
        let topY = this.sizer.cardIndex_TopY(index);

        let fontSize = this.sizer.cardIndex_fontSize();
        let fontColor = this.sizer.cardIndex_fontColor();

        let cardIndex = this.add.text(centerX, topY,
            index, {fontFamily: GC.FONTS.BUTTON_OUT, fontSize: fontSize, color: fontColor});
        cardIndex.setOrigin(0.5, 0);

        cardBackground.on('pointerover', () => {
            cardIndex.setFontFamily(GC.FONTS.BUTTON_OVER);
        });
        cardBackground.on('pointerout', () => {
            cardIndex.setFontFamily(GC.FONTS.BUTTON_OUT);
        })
    }

    placeCardDescription(index) {
        let description = this.levelsInfo.levels[index]["description_" + this.scene.settings.language];

        let centerX = this.sizer.cardDescription_CenterX(index);
        let centerY = this.sizer.cardDescription_CenterY(index);
        let fontSize = this.sizer.cardDescription_FontSize(index);
        let color = this.sizer.cardDescription_Color(index);

        this.add.text(
            centerX, centerY,
            description,
            {fontFamily: GC.FONTS.TEXT, fontSize: fontSize, color: color}
        ).setOrigin(0.5).setAlign('center');
    }

    placeLastCard(index) {
        let leftX = this.sizer.backgroundRectangle_LeftX(index);
        let topY = this.sizer.backgroundRectangle_TopY(index);

        let cardBackground = this.add.image(leftX, topY, 'cardBackground');
        cardBackground.setOrigin(0);

        let centerX = leftX + this.sizer.lastCardTextCenterX();
        let centerY = topY + this.sizer.lastCardTextCenterY();
        let fontSize = this.sizer.lastCardFontSize();
        let color = this.sizer.lastCardFontColor();
        let text = this.strings.last_level;

        let lastCardDescription = this.add.text(centerX, centerY, text,
            {fontFamily: GC.FONTS.TEXT, fontSize: fontSize, color: color});
        lastCardDescription.setOrigin(0.5);
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

        if (this.scene.settings.language === undefined) {
            let possibleLanguages = GC.LANGUAGES;
            this.scene.settings.language = getUrlParams.get("lang")?.toLowerCase();
            if (!possibleLanguages.includes(this.scene.settings.language))
                this.scene.settings.language = 'en';

            let languages = this.cache.json.get('languages');
            this.scene.settings.strings = languages[this.scene.settings.language];
        }
    }

    placeLabel() {
        let labelPosition = this.sizer.labelPosition();
        let labelFontSize = this.sizer.labelFontSize();
        let labelFontColor = this.sizer.labelFontColor();

        let text = "SCANNON - " + this.strings.game_name[GC.GAME_CODE];

        if (text.length > GC.GAME_NAME_MAX_NON_SCALABLE_LENGTH) {
            labelFontSize = (labelFontSize * GC.GAME_NAME_MAX_NON_SCALABLE_LENGTH) / text.length;
        }

        let label = this.add.text(labelPosition.x, labelPosition.y, text,
            {fontFamily: GC.FONTS.BUTTON_OUT, fontSize: labelFontSize, color: labelFontColor});
        label.setOrigin(0, 0);
    }
}