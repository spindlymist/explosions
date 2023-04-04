export default class Engine {

    static update() {
        let dt = Engine.updateTime();
        Engine.updateInput();

        Engine.ctx.clearRect(0, 0, Engine.canvas.width, Engine.canvas.height);

        let currentEntities = Engine.entities.slice();
        currentEntities.forEach(function(val, i) {
            val.update(dt);
        });
        currentEntities.forEach(function(val, i) {
            val.draw(Engine.ctx);
        });

        Engine.entities = Engine.entities.filter(e => e.__delete_on_frame_end !== true);

        window.requestAnimationFrame(Engine.update);
    }

    static updateTime() {
        let newTime = Date.now();
        let dt = newTime - Engine.time;
        Engine.time = newTime;

        return dt;
    }

    static updateInput() {
        if (Engine.input.mouse.left) {
            Engine.input.mouse.leftDown = !Engine.lastInput.mouse.left;
        } else {
            Engine.input.mouse.leftUp = Engine.lastInput.mouse.left;
        }

        if (Engine.input.mouse.right) {
            Engine.input.mouse.rightDown = !Engine.lastInput.mouse.right;
        } else {
            Engine.input.mouse.rightUp = Engine.lastInput.mouse.right;
        }

        Engine.lastInput = JSON.parse(JSON.stringify(Engine.input));
    }

    static startGame() {
        Engine.initCanvas();

        Engine.lastInput = JSON.parse(JSON.stringify(Engine.input));

        Engine.entities.forEach(function(val, i) {
            val.init();
        });

        Engine.registerEventListeners();

        Engine.time = Date.now();
        window.requestAnimationFrame(Engine.update);
    }

    static addEntity() {
        for (let arg of arguments) {
            Engine.entities.push(arg);
        }
    }

    static deleteEntity(entity) {
        entity.__delete_on_frame_end = true;
    }

    static initCanvas() {
        Engine.canvas = document.querySelector('#main-canvas');
        Engine.ctx = Engine.canvas.getContext('2d');

        Engine.adjustCanvasDimensions();
        window.addEventListener('resize', Engine.adjustCanvasDimensions);
    }

    static adjustCanvasDimensions() {
        Engine.canvas.width = Engine.canvas.offsetWidth;
        Engine.canvas.height = Engine.canvas.offsetHeight;
    }

    static registerEventListeners() {
        Engine.canvas.addEventListener('mousedown', Engine.onMouseDown);
        Engine.canvas.addEventListener('mouseup', Engine.onMouseUp);
        Engine.canvas.addEventListener('mousemove', Engine.onMouseMove);
        Engine.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
    }

    static onMouseDown(e) {
        e.preventDefault();

        if (e.button === 0) {
            Engine.input.mouse.left = true;
        } else if (e.button === 2) {
            Engine.input.mouse.right = true;
        }
    }

    static onMouseUp(e) {
        if (e.button === 0) {
            Engine.input.mouse.left = false;
        } else if (e.button === 2) {
            Engine.input.mouse.right = false;
        }
    }

    static onMouseMove(e) {
        Engine.input.mouse.x = e.offsetX;
        Engine.input.mouse.y = e.offsetY;
    }

}

Engine.entities = [];
Engine.time = 0;
Engine.input = {
    mouse: {
        leftDown: false,
        left: false,
        leftUp: false,
        rightDown: false,
        right: false,
        rightUp: false,
        x: 0,
        y: 0,
    },
    keys: {},
};
