import Engine from './engine.js';
import Projectile from './projectile.js';
import {
    Vector2,
    randReal,
    randColor
} from './mathutil.js';

export default class ProjectileEmitter {

    constructor(options) {
        this.options = {};
        Object.assign(this.options, options);

        this.lastSpawn = 0;
    }

    init() {}

    update(dt) {
        if (this.options.autoSpawn && Engine.time - this.lastSpawn > this.options.spawnRate) {
            this.lastSpawn = Engine.time;
            this.spawnProjectile(true);
        }

        if (Engine.input.mouse.leftDown) {
            this.spawnProjectile();
            this.spawnTimer = setInterval(() => this.spawnProjectile(), this.options.spawnRate);
        } else if (Engine.input.mouse.leftUp) {
            clearInterval(this.spawnTimer);
        }
    }

    draw(ctx) {

    }

    spawnProjectile(random) {
        if (random === true) {
            var x = randReal(0, Engine.canvas.width);
            var y = randReal(0, Engine.canvas.height);
        } else {
            var x = Engine.input.mouse.x;
            var y = Engine.input.mouse.y;
        }

        let pos = new Vector2(x, y);

        let dir = new Vector2(1, 0);
        dir.rotate(randReal(0, 360));

        let speed = randReal(this.options.minSpeed, this.options.maxSpeed);
        let size = randReal(this.options.minSize, this.options.maxSize);

        if (this.options.randomizeColor) {
            var color = randColor();
        } else {
            var color = this.options.color;
        }

        let proj = new Projectile(pos, dir, {
            speed: speed,
            size: size,
            color: color,
            randomizeExplosionColor: this.options.randomizeExplosionColor,
            explosionParticles: this.options.explosionParticles,
        });
        Engine.addEntity(proj);
    }

}
