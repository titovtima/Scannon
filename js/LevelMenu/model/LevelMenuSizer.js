class LevelMenuSizer {
    constructor(scene) {
        this.scene = scene;
    }

    backgroundRectangle_CornerRadius() {
        return 20;
    }

    backgroundRectangle_Width() {
        return 332;
    }

    backgroundRectangle_Height() {
        return 232;
    }

    backgroundRectangle_HorizontalDistanceBetween() {
        return 51;
    }

    backgroundRectangle_VerticalDistanceBetween() {
        return 31;
    }

    backgroundRectangle_TopOffset() {
        return 130;
    }

    backgroundRectangle_LeftX(index) {
        let width = this.backgroundRectangle_Width();
        let space = this.backgroundRectangle_HorizontalDistanceBetween();

        if (index % 4 === 0) { return 1 * space + 0 * width; }
        if (index % 4 === 1) { return 2 * space + 1 * width; }
        if (index % 4 === 2) { return 3 * space + 2 * width; }
        if (index % 4 === 3) { return 4 * space + 3 * width; }
    }

    backgroundRectangle_RightX(index) {
        return this.backgroundRectangle_LeftX(index)
            + this.backgroundRectangle_Width();
    }

    backgroundRectangle_TopY(index) {
        let row = Math.floor(index / 4);

        return this.backgroundRectangle_TopOffset()

            + row * this.backgroundRectangle_Height()
            + row * this.backgroundRectangle_VerticalDistanceBetween();
    }

    backgroundRectangle_BottomY(index) {
        return this.backgroundRectangle_TopY(index)
            + this.backgroundRectangle_Height();
    }

    cardIndex_TopY(index) {
        let offset = this.backgroundRectangle_TopY(index);
        return offset + 5;
    }

    cardIndex_CenterX(index) {
        let offset = this.backgroundRectangle_LeftX(index);
        let cardWidth = this.backgroundRectangle_Width();

        return offset + cardWidth / 2;
    }

    cardIndex_fontSize() {
        return 110;
    }

    cardIndex_fontColor() {
        return '#000';
    }

    cardDescription_CenterX(index) {
        let leftX = this.backgroundRectangle_LeftX(index);
        let cardWidth = this.backgroundRectangle_Width();

        return leftX + cardWidth / 2;
    }

    cardDescription_CenterY(index) {
        let topY = this.backgroundRectangle_TopY(index);

        // with the stars
        // return topY + 147;

        // without the stars
        return topY + 167;
    }

    cardDescription_FontSize(index) {
        return 24;
    }

    cardDescription_Color(index) {
        return '#000';
    }

    mainMenuButton_LeftX() {
        return 51;
    }

    mainMenuButton_TopY() {
        return 10;
    }

    mainMenuButton_fontSize() {
        return 60;
    }

    mainMenuButton_fontColor() {
        return '#000';
    }

    settingsButton_fontSize() {
        return 50;
    }

    settingsButton_fontColor() {
        return '#000';
    }

    settingsButtonPosition() {
        return { x: 1580, y: 10 };
    }

    labelPosition() {
        return { x: this.backgroundRectangle_HorizontalDistanceBetween(), y: 60 };
    }

    labelFontSize() {
        return 80;
    }

    labelFontColor() {
        return '#000';
    }

    lastCardTextCenterX() {
        return this.backgroundRectangle_Width() / 2;
    }

    lastCardTextCenterY() {
        return this.backgroundRectangle_Height() / 2;
    }

    lastCardFontColor() {
        return '#000';
    }

    lastCardFontSize() {
        return 40;
    }

    languageLineY() {
        return 90;
    }

    languageTile_FontSize() {
        return 40;
    }

    languageTile_FontColor() {
        return '#000';
    }

    languageTileX(index) {
        return 1540 - index * 100;
    }
}