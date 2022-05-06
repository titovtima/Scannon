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
        return this.loadingBar_TopY() + this.loadingBar_Height() + 20;
    }

    textHintFontSize() {
        return 42;
    }

    textHintFontColor() {
        return '#000';
    }
}