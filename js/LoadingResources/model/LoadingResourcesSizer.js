class LoadingResourcesSizer {

    constructor(scene) {
        this.scene = scene;
    }

    setCardHeight() {
        let card = this.scene.add.image(-1000, -1000, 'cardBackground_Regular_' + this.scene.cardVariant);
        this.cardHeight = (card.height - this.cardBackground_ShadowY()) * this.cardBackground_Scale();
    }

    cardBackground_Width() {
        return 800 * this.cardBackground_Scale();
    }

    cardBackground_Height() {
        return this.cardHeight;
    }

    cardBackground_Scale() {
        return 0.85;
    }

    cardBackground_ShadowY() {
        return 10;
    }

    cardBackground_ShadowX() {
        return 8;
    }

    description_CenterX() {
        return this.scene.game.renderer.width / 2;
    }

    description_CenterY() {
        return this.loadingBar_TopY() - 70;
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
        return this.loadingBar_TopY();
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
        return 800;
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

    loadingProcessText_X() {
        return this.startButton_X();
    }

    loadingProcessText_Y() {
        // return this.startButtonY - (this.startButton_FontSize() - this.loadingProcessText_FontSize()) / 2;
        return this.startButtonY;
    }

    loadingProcessText_FontSize() {
        return 40;
    }

    loadingProcessText_FontColor() {
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
        return 700 - (this.rowsNumber - indexRow - 1) * this.formulaListRow();
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
        return 100;
    }

    levelName_FontSize() {
        return 80;
    }

    levelName_FontColor() {
        return '#000';
    }

    centerVertically() {
        let totalHeight = this.scene.levelInstructions.height + this.rowsNumber * this.formulaListRow();
        let move = (580 - totalHeight) / 3;
        console.log('total height: ', totalHeight);
        this.scene.levelInstructions.y += move;
        this.startButtonY = 850 - move * 2;
        if (this.scene.startButton)
            this.scene.startButton.y -= move * 2;
        if (this.scene.loadingProcessText)
            this.scene.loadingProcessText.y -= move * 2;
        if (this.rowsNumber)
            for (let formula of this.scene.instuctionFormulas) {
                formula.y -= move * 2;
            }
    }
}