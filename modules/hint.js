import Engine from './engine.js';

export default class Hint {

    constructor(src, dimensions, condition) {
        this.loaded = false;
        this.img = new Image;
        this.img.onload = () => {
            this.aspectRatio = this.img.height / this.img.width;
            this.loaded = true;
        };
        this.img.src = src;
        this.dimensions = dimensions;
        this.condition = condition;
        this.fading = false;
        this.alpha = 1;
    }

    init() {}

    update(dt) {
        this.calculateDimensions();

        if (Engine.input.mouse[this.condition]) {
            this.fading = true;
        }

        if (this.fading) {
            this.handleFading(dt);
        }
    }

    draw(ctx) {
        if (this.loaded) {
            let globalAlpha = ctx.globalAlpha;
            ctx.globalAlpha = this.alpha;
            ctx.drawImage(this.img, this.actualDimensions.x, this.actualDimensions.y, this.actualDimensions.width, this.actualDimensions.height);
            ctx.globalAlpha = globalAlpha;
        }
    }

    calculateDimensions() {
        this.actualDimensions = {
            x: this.dimensions.x * Engine.canvas.width,
            y: this.dimensions.y * Engine.canvas.height,
            width: this.dimensions.width * Engine.canvas.width,
        }
        this.actualDimensions.height = this.aspectRatio * this.actualDimensions.width;
        this.actualDimensions.x -= this.actualDimensions.width / 2;
        this.actualDimensions.y -= this.actualDimensions.height / 2;
    }

    handleFading(dt) {
        this.alpha -= 0.005 * dt;
        if (this.alpha <= 0) {
            this.alpha = 0;
            Engine.deleteEntity(this);
        }
    }

}
