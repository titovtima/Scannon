class GamePauseScene extends Phaser.Scene {

    constructor() {
        super(GC.SCENES.GAME_PAUSE);
    }

    init(params) {
        this.scene.settings = params.settings;
        this.levelNumber = params.levelNumber;
        this.gameScene = params.gameScene;
        this.totalScore = this.gameScene.totalScore;
        this.startLevel = this.gameScene.startLevel;

        this.strings = this.scene.settings.strings.pause_menu;

        console.log('Init Pause. Settings:', this.scene.settings);
        this.scene.wake(GC.SCENES.GAME);
        this.scene.pause(GC.SCENES.GAME);
    }

    create() {
        this.sizer = new GamePauseSizer(this);

        this.gameScene.setScoreLabelText();
        this.gameScene.setTextHintText();

        this.prepareBackground();
        this.drawMenuItems();

        this.keyM = this.input.keyboard.addKey('M');
    }

    update() {
        this.handleKeyboardInput()
    }

    refresh() {
        this.scene.bringToTop();
    }

    handleKeyboardInput() {

        if (Phaser.Input.Keyboard.JustDown(this.keyM)) {
            this.closeMenu();
        }
    }

    prepareBackground() {
        this.darkenGameBackground();
        this.drawMenuBackground();
    }

    darkenGameBackground() {
        // TODO darken html page background
        let alpha = this.sizer.darkenedBackground_alpha();

        this.blackBox = this.add.graphics({
            fillStyle: {
                color: 0x000000,
                alpha: alpha
            }
        });

        let fieldWidth = this.sizer.field_Width();
        let fieldHeight = this.sizer.field_Height();
        this.blackBox.fillRect(0, 0, fieldWidth, fieldHeight);
    }

    drawMenuBackground() {
        let centerX = this.sizer.dialogBackground_CenterX();
        let centerY = this.sizer.dialogBackground_CenterY();

        this.add.image(centerX, centerY, 'pauseMenuBackground')
            .setOrigin(0.5);
    }

    drawMenuItems() {
        let labels = [this.strings.resume, this.strings.settings, this.strings.restart, this.strings.menu];

        for (let label of labels) {
            let centerX = this.sizer.menuItem_CenterX();
            let centerY = this.sizer.menuItem_CenterY(label);

            let menuItem = this.add.text(centerX, centerY, label, {
                fontFamily: GC.FONTS.BUTTON_OUT,
                fontSize: 75,
                color: '#000'
            }).setOrigin(0.5);

            menuItem.setInteractive();
            menuItem.on('pointerover', () => {
                menuItem.setFontFamily(GC.FONTS.BUTTON_OVER);
            });
            menuItem.on('pointerout', () => {
                menuItem.setFontFamily(GC.FONTS.BUTTON_OUT);
            });
            menuItem.on('pointerup', () => {
                switch (label) {
                    case this.strings.resume:
                        this.closeMenu();
                        break;
                    case this.strings.settings:
                        this.openSettings();
                        break;
                    case this.strings.restart:
                        this.restartLevel();
                        break;
                    case this.strings.menu:
                        this.openMainMenu();
                        break;
                }
            })
        }
    }

    closeMenu() {
        this.gameScene.scene.settings = this.scene.settings;
        this.gameScene.sizer.updateSettings();

        this.scene.run(GC.SCENES.GAME);
        this.scene.stop(GC.SCENES.GAME_PAUSE);
    }

    restartLevel() {
        // Scaler.setResolution(this, 1200, 900);

        this.gameScene.stopBlinking();
        this.scene.stop(GC.SCENES.GAME);
        this.scene.start(GC.SCENES.LEVEL_GENERATION, {
            "levelNumber": this.levelNumber,
            "settings": this.scene.settings,
            "totalScore": this.totalScore,
            "startLevel": this.startLevel,
            "isRestarted": true
        });
    }

    openMainMenu() {
        // Scaler.setResolution(this, 1200, 900);

        this.gameScene.stopBlinking();
        this.scene.stop(GC.SCENES.GAME);
        this.scene.start(GC.SCENES.LEVEL_MENU);
    }

    openSettings() {
        this.scene.sleep(GC.SCENES.GAME_PAUSE);
        this.scene.sleep(GC.SCENES.GAME);
        this.scene.start(GC.SCENES.SETTINGS, {
            settings: this.scene.settings,
            sceneFrom: GC.SCENES.GAME_PAUSE,
            gameScene: this.gameScene,
            levelNumber: this.levelNumber
        });
    }

}