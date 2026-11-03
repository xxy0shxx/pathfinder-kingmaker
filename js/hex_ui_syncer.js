import { MAP_CONFIG } from './config/app_config.js';
import { ColorConverter } from './utils/helpers.js';
import AnimationManager from './animation_manager.js';

/**
 * Модуль синхронизации UI: создание внутренних слоев гекса и обновление его DOM-состояния
 */
const HexUiSyncer = {
    visualLayer: null,

    init() {
        this.visualLayer = document.getElementById('visualLayer');
    },
};

export default HexUiSyncer;
