class LevelMenuScene extends Phaser.Scene {

    constructor() {
        super(GC.SCENES.LEVEL_MENU);
    }

    preload() {
        this.load.json('levelsInfo', '/js/GameConfiguration/levelsInfo.json');
        this.load.image('cardBackground', '/js/LevelMenu/src/cardBackground.png');
        this.load.image('cardBackground_Bordered', '/js/LevelMenu/src/cardBackground_Bordered.png');
    }

    create() {
        this.levelsInfo = this.cache.json.get('levelsInfo');

        this.sizer = new LevelMenuSizer(this);

        this.placeLevelCards();
    }

    placeLevelCards() {
        this.placeMainMenuButton();

        for (let level of this.levelsInfo.levels) {
            let cardBackground = this.placeCardBackground(level.index);
            this.placeCardIndex(level.index, cardBackground);
        }
    }

    placeMainMenuButton() {
        let sizer = this.sizer;
        let scene = this;

        WebFont.load({
            'custom': {
                families: ['Ribeye', 'RibeyeMarrow']
            },
            active: function () {
                let leftX = sizer.mainMenuButton_LeftX();
                let topY = sizer.mainMenuButton_TopY();

                let fontSize = sizer.mainMenuButton_fontSize();
                let fontColor = sizer.mainMenuButton_fontColor();

                let mainMenuButton = scene.add.text(leftX, topY,
                    '<- main menu', { fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor });
                mainMenuButton.setInteractive();
                mainMenuButton.on('pointerover', () => {
                  mainMenuButton.setFontFamily('Ribeye');
                });
                mainMenuButton.on('pointerout', () => {
                    mainMenuButton.setFontFamily('RibeyeMarrow');
                });
                mainMenuButton.on('pointerup', () => {
                    scene.scene.start(GC.SCENES.MAIN_MENU);
                });
            }
        })
    }

    placeCardBackground(index) {
        const leftX = this.sizer.backgroundRectangle_LeftX(index);
        const topY = this.sizer.backgroundRectangle_TopY(index);

        let cardBackground = this.add.image(leftX, topY, 'cardBackground');
        cardBackground.setOrigin(0);

        cardBackground.setInteractive();
        cardBackground.on('pointerover', () => {
            cardBackground.setTexture('cardBackground_Bordered');
        });
        cardBackground.on('pointerout', () => {
            cardBackground.setTexture('cardBackground');
        });
        cardBackground.on('pointerup', () => {
            this.scene.start(GC.SCENES.LEVEL_GENERATION, {
                'num_formulas': 100
            });
        });

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

    enableInteraction_Card(cardBackground, cardIndex) {



    }

}