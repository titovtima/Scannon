class LoadingResourcesSizer {

    constructor(scene) {
        this.scene = scene;
    }

    description_CenterX() {
        return this.scene.game.renderer.width / 2;
    }

    description_CenterY() {
        return this.scene.game.renderer.height / 2;
    }

    description_FontSize() {
        return 50;
    }

    description_FontColor() {
        return '#000';
    }

    loadingBarBackground_LeftX() {
        return 25;
    }

    loadingBarBackground_TopY() {
        let height = this.scene.game.renderer.height;

        return height / 2 + 130;
    }

    loadingBarBackground_Width() {
        return this.scene.game.renderer.width - 50;
    }

    loadingBarBackground_Height() {
        return 50;
    }

    loadingBarBackground_Radius() {
        return 15;
    }

    loadingBar_LeftX() {
        return 25;
    }

    loadingBar_TopY() {
        let height = this.scene.game.renderer.height;

        return height / 2 + 130;
    }

    loadingBar_Width() {
        return this.scene.game.renderer.width - 50;
    }

    loadingBar_Height() {
        return 50;
    }

    loadingBar_Radius() {
        return 15;
    }

    textHintCenterX() {
        return 800;
    }

    textHintTopY() {
        return 240 - this.formulaListRow()/2 * this.rowsNumber;
    }

    textHintFontSize() {
        return 42;
    }

    textHintFontColor() {
        return '#000';
    }

    levelInstructionsCenterX() {
        return 800;
    }

    levelInstructionsTopY() {
        return 150;
    }

    levelInstructionsFontSize() {
        return 42;
    }

    levelInstructionsFontColor() {
        return '#000';
    }

    startButton_X() {
        return 800;
    }

    startButton_Y() {
        if (this.startButtonY)
            return this.startButtonY;
        return 850;
    }

    startButton_FontSize() {
        return 100;
    }

    startButton_FontColor() {
        return '#000';
    }

    formulasHeader_X() {
        return 800;
    }

    formulasHeader_Y() {
        return 390 - this.formulaListRow()/2 * this.rowsNumber;
    }

    formulasHeader_FontSize() {
        return 45;
    }

    formulasHeader_FontColor() {
        return '#000';
    }

    formulasList_X(indexColumn, columnsNumber) {
        let margin = Math.max(20, 220 - columnsNumber * 20);
        return margin + (1600 - 2 *margin) * (indexColumn * 2 + 1) / (columnsNumber * 2);
    }

    formulasList_Y(indexRow) {
        return 650 - indexRow * this.formulaListRow();
    }

    formulaListRow() {
        return 50;
    }

    formulasList_FontSize() {
        return 40;
    }

    formulasList_FontColor() {
        return '#000';
    }


    levelName_CenterX() {
        return 800;
    }

    levelName_TopY() {
        return 50;
    }

    levelName_FontSize() {
        return 80;
    }

    levelName_FontColor() {
        return '#000';
    }

    centerVertically() {
        let totalHeight = this.scene.levelInstructions.height + this.rowsNumber * this.formulaListRow();
        let move = (500 - totalHeight) / 3;
        console.log('total height: ', totalHeight);
        this.scene.levelInstructions.y += move;
        this.startButtonY = 850 - move * 2;
        if (this.scene.startButton)
            this.scene.startButton.y -= move * 2;
        for (let formula of this.scene.instuctionFormulas) {
            formula.y -= move * 2;
        }
    }
}