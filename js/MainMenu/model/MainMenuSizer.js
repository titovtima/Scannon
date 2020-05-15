class MainMenuSizer {

    constructor(scene) {
        this.scene = scene;
    }


    fontSize() {
        return 115;
    }

    fontColor() {
        return '#000';
    }

    position(label) {
        let centerX = game.renderer.width / 2;
        let centerY = game.renderer.height / 2;

        let textHeight = 145;

        switch (label) {
            case 'Play':
                return { x: centerX, y: centerY - textHeight };
            case 'How to play':
                return { x: centerX, y: centerY };
            case 'Settings':
                return { x: centerX, y: centerY + textHeight };
            default:
                return undefined
        }
    }

}