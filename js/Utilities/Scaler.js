class Scaler {

    static setResolution(scene, width, height) {
        scene.sys.game.scale.setGameSize(width, height);
        scene.scale.parentSize.setSize(width, height);
        scene.scale.displaySize.setAspectRatio(width / height);
        scene.physics.world.setBounds(0, 0, width, height);
    }

}