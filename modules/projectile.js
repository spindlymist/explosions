import {
    getEdgeNormal
} from './collision.js'
import {
    clamp,
    reflect,
    Vector2,
    randColor
} from './mathutil.js'
import Engine from './engine.js';

export default class Projectile {
    constructor(pos, dir, options) {
        this.pos = pos;
        this.dir = dir.normalized();
        this.options = options;
    }

    init() {}

    update(dt) {
        let movement = new Vector2(this.dir);
        movement.mult(dt * this.options.speed / 100);
        let nextPos = this.pos.plus(movement);

        nextPos.i = clamp(nextPos.i, 0, Engine.canvas.width);
        nextPos.j = clamp(nextPos.j, 0, Engine.canvas.height);
        this.pos = nextPos;

        let edge = getEdgeNormal(this.pos);
        if (edge) {
            this.explode(edge);
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.options.color;
        ctx.beginPath();
        ctx.arc(this.pos.i, this.pos.j, this.options.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    explode(edge) {
        Engine.deleteEntity(this);

        let newSize = this.options.size / 2;
        if (newSize < 1) {
            return;
        }

        let range = 120;
        let dTheta = range / this.options.explosionParticles;

        let newDir = reflect(this.dir, edge);

        if (this.options.explosionParticles > 1) {
            newDir.rotate(range / -2);
        }

        for (let i = 0; i < this.options.explosionParticles; i++) {
            if (this.options.randomizeExplosionColor) {
                var color = randColor();
            } else {
                var color = this.options.color;
            }

            Engine.addEntity(
                new Projectile(new Vector2(this.pos), new Vector2(newDir), {
                    speed: this.options.speed,
                    size: newSize,
                    color: color,
                    randomizeExplosionColor: this.options.randomizeExplosionColor,
                    explosionParticles: this.options.explosionParticles,
                })
            );
            newDir.rotate(dTheta);
        }
    }
}
