const gameCode = "boolean";
const basePath = "/scannon/" + gameCode;

const GC = {
    SCENES: {
        LEVEL_MENU: 'LEVEL_MENU_SCENE',
        LEVEL_GENERATION: 'LEVEL_GENERATION_SCENE',
        LOADING_RESOURCES: 'LOADING_RESOURCES_SCENE',
        GAME: 'GAME_SCENE',
        GAME_PAUSE: 'GAME_PAUSE_SCENE',
        GAME_COMPETE: 'GAME_COMPLETE_SCENE',
        SETTINGS: 'SETTINGS_SCENE'
    },
    RESOLUTIONS: {
        MEDIUM: {
            INTERFACE: {
                width: 1600,
                height: 900
            },
            GAME: {
                width: 1600,
                height: 900
            }
        }
    },
    COLORS: {
        BACKGROUND: 0xffcc66
    },
    GAME_CODE: gameCode,
    BASE_PATH: basePath,
    RESOURCES_PATH: basePath + "/resources/" + gameCode
};