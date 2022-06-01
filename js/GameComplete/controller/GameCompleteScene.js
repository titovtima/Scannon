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

        this.strings = this.scene.settings.strings.game_complete;

        Scaler.setResolution(this, GC.RESOLUTIONS.MEDIUM.INTERFACE.width, GC.RESOLUTIONS.MEDIUM.INTERFACE.height);
    }

    create() {
        ym(88802966,'reachGoal','finishLevel');
        if (this.score > 0) {
            ym(88802966,'reachGoal','getPositiveScore');
        }
        if (this.totalScore >= 200)
            ym(88802966,'reachGoal','totalScore200');

        let jsonString = `{"${GC.GAME_CODE}_${this.levelNumber}_score": ${this.score}}`;
        ym(88802966, 'params', JSON.parse(jsonString));
        if (this.score > 0) {
            jsonString = `{"${GC.GAME_CODE}_${this.levelNumber}_success": ${this.score}}`;
            ym(88802966, 'params', JSON.parse(jsonString));
        }

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
            + this.levelsInfo.levels[this.levelNumber]["description_" + this.scene.settings.language];
        let levelDescription = this.add.text(centerX, topY, text,
            {fontFamily: 'Ribeye', fontSize: fontSize, color: fontColor});
        levelDescription.setOrigin(0.5, 0);
    }

    placeTotalLevels() {
        let centerX = this.sizer.totalLevels_CenterX();
        let centerY = this.sizer.totalLevels_CenterY();
        let fontSize = this.sizer.totalLevels_FontSize();
        let fontColor = this.sizer.totalLevels_FontColor();

        let text = this.startLevel + " - " + this.levelNumber + " " + this.strings.levels;
        let totalLevels = this.add.text(centerX, centerY, text,
            {fontFamily: 'RhodiumLibre', fontSize: fontSize, color: fontColor});
        totalLevels.setOrigin(0.5);
    }

    placeLevelScore() {
        let scoreLabelCenterX = this.sizer.levelScoreLabel_CenterX();
        let scoreLabelCenterY = this.sizer.levelScoreLabel_CenterY();
        let scoreLabelFontSize = this.sizer.levelScoreLabel_FontSize();
        let scoreLabelColor = this.sizer.levelScoreLabel_Color();
        let text = this.strings.level_score;
        this.add.text(
            scoreLabelCenterX,
            scoreLabelCenterY,
            text,
            {fontFamily: 'PTMono', fontSize: scoreLabelFontSize, color: scoreLabelColor}
        ).setOrigin(0.5);

        let scoreValueCenterX = this.sizer.levelScoreValue_CenterX();
        let scoreValueCenterY = this.sizer.levelScoreValue_CenterY();
        let scoreValueFontSize = this.sizer.levelScoreValue_FontSize(this.score);
        let scoreValueColor = this.sizer.levelScoreValue_Color();
        this.add.text(
            scoreValueCenterX,
            scoreValueCenterY,
            this.score,
            {fontFamily: 'PoetsenOne', fontSize: scoreValueFontSize, color: scoreValueColor}
        ).setOrigin(0.5);
    }

    placeTotalScore() {
        let scoreLabelCenterX = this.sizer.totalScoreLabel_CenterX();
        let scoreLabelCenterY = this.sizer.totalScoreLabel_CenterY();
        let scoreLabelFontSize = this.sizer.totalScoreLabel_FontSize();
        let scoreLabelColor = this.sizer.totalScoreLabel_Color();
        let text = this.strings.total_score;
        this.add.text(
            scoreLabelCenterX,
            scoreLabelCenterY,
            text,
            {fontFamily: 'PTMono', fontSize: scoreLabelFontSize, color: scoreLabelColor}
        ).setOrigin(0.5);

        let scoreValueCenterX = this.sizer.totalScoreValue_CenterX();
        let scoreValueCenterY = this.sizer.totalScoreValue_CenterY();
        let scoreValueFontSize = this.sizer.totalScoreValue_FontSize(this.totalScore);
        let scoreValueColor = this.sizer.totalScoreValue_Color();
        this.add.text(
            scoreValueCenterX,
            scoreValueCenterY,
            this.totalScore,
            {fontFamily: 'PoetsenOne', fontSize: scoreValueFontSize, color: scoreValueColor}
        ).setOrigin(0.5);
    }

    placeMenu() {
        let menuItemFontSize = this.sizer.menuItem_FontSize();
        let menuItemColor = this.sizer.menuItem_Color();

        let labels = [this.strings.restart_level, this.strings.menu];

        let congratsLabel = this.strings.congrats;

        if (this.score > 0) {
            if (this.levelNumber === this.levelsInfo.levelsNumber) {
                labels.unshift(congratsLabel);
            } else {
                labels.unshift(this.strings.next_level);
            }
        }

        if (this.scene.settings.debug !== 0)
            labels.push(this.strings.save_sequence)

        let labelIndex = 0;
        for (let label of labels) {
            let menuItemCenterX = this.sizer.menuItem_CenterX();
            let menuItemCenterY = this.sizer.menuItem_CenterY(labelIndex);
            let fontFamily = 'RibeyeMarrow';
            if (label === congratsLabel)
                fontFamily = 'Ribeye';

            let menuItem = this.add.text(
                menuItemCenterX, menuItemCenterY,
                label,
                {fontFamily: fontFamily, fontSize: menuItemFontSize, color: menuItemColor}
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
                        case this.strings.menu:
                            this.openLevelMenu();
                            break;
                        case this.strings.restart_level:
                            this.restartLevel();
                            break;
                        case this.strings.next_level:
                            this.startNextLevel();
                            break;
                        case this.strings.save_sequence:
                            this.saveSequence();
                    }
                })
            }
            labelIndex++;
        }
    }

    showScientist() {
        this.load.json('showScientists', GC.RESOURCES_PATH + '/scientists/showScientists.json');

        this.load.once('complete', () => {
            let showScientists = this.cache.json.get('showScientists');
            console.log('showScientists', showScientists);

            for (let rule of showScientists.scoreToScientist) {
                if (this.totalScore >= rule.score) {
                    this.showScientistPortrait(rule.scientist.portrait);
                    this.placeScientistDescription(rule.scientist["description_" + this.scene.settings.language]);
                    if (!rule.scientist.name_en.startsWith("Start")) {
                        this.placeScientistName(rule.scientist["name_" + this.scene.settings.language]);
                    }
                    break;
                }
            }
        }, this);
        this.load.start();
    }

    showScientistPortrait(path) {
        this.load.image(path, GC.RESOURCES_PATH + path);

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

        let text = this.strings.before_scientist_name + "\n" + name;
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
        ym(88802966,'reachGoal','pushNextLevelButton');
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