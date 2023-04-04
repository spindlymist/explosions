import Engine from './modules/engine.js';
import ProjectileEmitter from './modules/projectileEmitter.js';
import ControlPanel from './modules/controlPanel.js';
import Hint from './modules/hint.js';

let emitter = new ProjectileEmitter({
    spawnRate: 250,
    minSpeed: 10,
    maxSpeed: 100,
    minSize: 5,
    maxSize: 15,
    color: '#40eaed',
    randomizeColor: false,
    randomizeExplosionColor: false,
    explosionParticles: 12,
    autoSpawn: false,
})
Engine.addEntity(emitter);

let controlPanel = new ControlPanel(emitter, 'control-panel', {
    spawnRate: {
        min: 50,
        max: 1000,
    },
    minSpeed: {
        min: 1,
        max: 250,
    },
    maxSpeed: {
        min: 1,
        max: 250,
    },
    minSize: {
        min: 1,
        max: 50,
    },
    maxSize: {
        min: 1,
        max: 50,
    },
    explosionParticles: {
        min: 1,
        max: 20,
    },
    background: '#48384c',
});
Engine.addEntity(controlPanel);

let leftHintDimensions = {
    x: .25,
    y: .5,
    width: .25,
};
let leftHint = new Hint('./img/left-click.svg', leftHintDimensions, 'leftDown');
Engine.addEntity(leftHint);

let rightHintDimensions = {
    x: .75,
    y: .5,
    width: .25,
};
let rightHint = new Hint('./img/right-click.svg', rightHintDimensions, 'rightDown');
Engine.addEntity(rightHint);

window.addEventListener('load', Engine.startGame, false);
