class GamePauseSizer {

    constructor(scene) {
        this.scene = scene;
    }

    field_Width() {
        return this.scene.game.renderer.width;
    }

    field_Height() {
        return this.scene.game.renderer.height;
    }

    darkenedBackground_alpha() {
        return 0.7;
    }

    darkenBackground_Width() {
        return this.scene.game.renderer.width;
    }

    darkenBackground_Height() {
        return this.scene.game.renderer.height;
    }

    dialogBackground_LeftX() {
        let centerX = this.darkenBackground_Width() / 2;
        let width = this.dialogBackground_Width() / 2;

        return centerX - width / 2;
    }

    dialogBackground_TopY() {
        let centerY = this.darkenBackground_Height() / 2;
        let height = this.dialogBackground_Height();

        return centerY - height / 2;
    }

    dialogBackground_Width() {
        return 800;
    }

    dialogBackground_Height() {
        return 466;
    }

    dialogBackground_ShadowX() {
        return 10;
    }

    dialogBackground_ShadowY() {
        return 8;
    }

    dialogBackground_CenterX() {
        let rawCenterX = this.darkenBackground_Width() / 2;
        let shadowX = this.dialogBackground_ShadowX();

        return rawCenterX + shadowX / 2;
    }

    dialogBackground_CenterY() {
        let rawCenterY = this.darkenBackground_Height() / 2;
        let shadowY = this.dialogBackground_ShadowY();

        return rawCenterY + shadowY / 2;
    }

    dialogBackground_Color() {
        return GC.COLORS.BACKGROUND;
    }

    menuItem_CenterX() {
        return this.darkenBackground_Width() / 2;
    }

    menuItem_CenterY(label) {
        let centerY = this.darkenBackground_Height() / 2;
        let textHeight = 145;

        switch (label) {
            case 'Resume': return centerY - textHeight;
            case 'Restart': return centerY;
            case 'Main Menu': return centerY + textHeight;
        }
    }

}