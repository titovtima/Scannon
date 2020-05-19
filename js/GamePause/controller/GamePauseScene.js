class GamePauseScene extends Phaser.Scene {

    constructor() {
        super(GC.SCENES.GAME_PAUSE);
    }

    init(params) {
        this.levelGenerationInfo = params.levelGenerationInfo;
    }

    create() {
        this.sizer = new GamePauseSizer(this);

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
        let sizer = this.sizer;
        let scene = this;
        let add = this.add;

        WebFont.load({
            'custom': {
                families: ['Ribeye', 'RibeyeMarrow']
            },
            active: function () {
                let labels = [ 'Resume', 'Restart', 'Main Menu' ];

                for (let label of labels) {
                    let centerX = sizer.menuItem_CenterX();
                    let centerY = sizer.menuItem_CenterY(label);

                    let menuItem = add.text(centerX, centerY, label, {
                        fontFamily: 'RibeyeMarrow',
                        fontSize: 84,
                        color: '#000'
                    }).setOrigin(0.5);

                    menuItem.setInteractive();
                    menuItem.on('pointerover', () => {
                        menuItem.setFontFamily('Ribeye');
                    });
                    menuItem.on('pointerout', () => {
                        menuItem.setFontFamily('RibeyeMarrow');
                    });
                    menuItem.on('pointerup', () => {
                        switch (label) {
                            case "Resume":
                                scene.closeMenu();
                                break;
                            case "Restart":
                                scene.restartLevel();
                                break;
                            case "Main Menu":
                                scene.openMainMenu();
                                break;
                        }
                    })
                }
            }
        })


    }

    closeMenu() {
        this.scene.run(GC.SCENES.GAME);
        this.scene.stop(GC.SCENES.GAME_PAUSE);
    }

    restartLevel() {
        Scaler.setResolution(this, 1200, 900);

        this.scene.stop(GC.SCENES.GAME);
        this.scene.start(GC.SCENES.LEVEL_GENERATION, this.levelGenerationInfo);
    }

    openMainMenu() {
        Scaler.setResolution(this, 1200, 900);

        this.scene.stop(GC.SCENES.GAME);
        this.scene.start(GC.SCENES.MAIN_MENU);
    }

}