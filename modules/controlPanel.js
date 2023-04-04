import Engine from './engine.js';

export default class ControlPanel {

    constructor(emitter, className, options) {
        this.emitter = emitter;
        this.className = className;
        this.options = {};
        Object.assign(this.options, options);
    }

    init() {
        this.panel = document.createElement('div');
        this.panel.className = this.className;
        this.panel.innerHTML = ControlPanel.template;

        document.body.appendChild(this.panel);

        this.initForm();
        this.registerEventListeners();

    }

    initForm() {
        this.autoSpawnCheckbox = this.panel.querySelector('#autoSpawn');
        this.autoSpawnCheckbox.checked = this.emitter.options.autoSpawn;

        this.sliders = this.panel.querySelectorAll('input[type="range"]');
        this.sliders.forEach((slider, idx) => {
            let sliderValue = this.emitter.options[slider.id];
            let sliderOptions = this.options[slider.id];

            if (sliderOptions) {
                slider.min = sliderOptions.min;
                slider.max = sliderOptions.max;
            } else {
                slider.min = 1;
                slider.max = sliderValue;
            }

            slider.value = sliderValue;
        });

        this.backgroundSelector = this.panel.querySelector('#background');
        if (this.options.background) {
            this.backgroundSelector.value = this.options.background;
        }

        this.colorSelector = this.panel.querySelector('#color');
        this.colorSelector.value = this.emitter.options.color;

        this.colorCheckbox = this.panel.querySelector('#randomizeColor');
        this.colorCheckbox.checked = this.emitter.options.randomizeColor;

        this.explosionCheckbox = this.panel.querySelector('#randomizeExplosionColor');
        this.explosionCheckbox.checked = this.emitter.options.randomizeExplosionColor;
    }

    registerEventListeners() {
        this.panel.addEventListener('mousedown', (e) => this.startDrag(e));
        this.panel.addEventListener('mousemove', (e) => this.processDrag(e));
        Engine.canvas.addEventListener('mousemove', (e) => this.processDrag(e));
        window.addEventListener('mouseup', (e) => this.endDrag(e));

        this.panel.querySelector('button').addEventListener('click', () => this.panel.classList.remove('show'));

        this.autoSpawnCheckbox.addEventListener('input', (e) => this.updateOption(e.srcElement.id, e.srcElement.checked));
        this.sliders.forEach((slider, idx) => {
            slider.addEventListener('input', (e) => this.onSliderUpdate(e));
        });
        this.backgroundSelector.addEventListener('input', (e) => Engine.canvas.style.backgroundColor = e.srcElement.value);
        this.colorSelector.addEventListener('input', (e) => this.updateOption(e.srcElement.id, e.srcElement.value));
        this.colorCheckbox.addEventListener('input', (e) => this.updateOption(e.srcElement.id, e.srcElement.checked));
        this.explosionCheckbox.addEventListener('input', (e) => this.updateOption(e.srcElement.id, e.srcElement.checked));
    }

    onSliderUpdate(e) {
        let value = parseInt(e.srcElement.value);

        if (e.srcElement.dataset.minFor) {
            let max = this.panel.querySelector('#' + e.srcElement.dataset.minFor);
            let maxValue = parseInt(max.value);

            if (maxValue < value) {
                max.value = value;
                this.updateOption(max.id, value);
            }
        } else if (e.srcElement.dataset.maxFor) {
            let min = this.panel.querySelector('#' + e.srcElement.dataset.maxFor);
            let minValue = parseInt(min.value);

            if (minValue > value) {
                min.value = value;
                this.updateOption(min.id, value);
            }
        }

        this.updateOption(e.srcElement.id, value);
    }

    updateOption(option, value) {
        this.emitter.options[option] = value;
    }

    update(dt) {
        if (Engine.input.mouse.rightUp) {
            if(!this.panel.classList.contains('show')) {
                this.panel.style.top = "150vh";
                this.panel.classList.add('show');
            }

            let width = this.panel.offsetWidth;
            let height = this.panel.offsetHeight;

            let x = Engine.input.mouse.x - (width / 2);
            let y = Engine.input.mouse.y;

            let maxX = Engine.canvas.width - width;
            let maxY = Engine.canvas.height - height;

            this.panel.style.left = Math.min(Math.max(x, 0), maxX) + 'px';
            this.panel.style.top = Math.min(y, maxY) + 'px';
        }
    }

    draw(ctx) {

    }

    startDrag(e) {
        if('dragGrip' in e.target.dataset) {
            this.dragging = true;
            this.dragOffset = {
                x: e.clientX - this.panel.offsetLeft,
                y: e.clientY - this.panel.offsetTop
            };
        }
    }

    processDrag(e) {
        if(this.dragging) {
            this.panel.style.left = e.clientX - this.dragOffset.x + 'px';
            this.panel.style.top = e.clientY - this.dragOffset.y + 'px';
        }
    }

    endDrag(e) {
        this.dragging = false;
    }

}

ControlPanel.template = `
    <h2 data-drag-grip>Options</h2>
    <form>
        <label for='autoSpawn'>Auto-Spawn</label>
        <input name='autoSpawn' id='autoSpawn' type='checkbox'>
        <label for='spawnRate'>Spawn Rate</label>
        <input name='spawnRate' id='spawnRate' type='range'>
        <label for='minSize'>Min Size</label>
        <input name='minSize' id='minSize' type='range' data-min-for="maxSize">
        <label for='maxSize'>Max Size</label>
        <input name='maxSize' id='maxSize' type='range' data-max-for="minSize">
        <label for='minSpeed'>Min Speed</label>
        <input name='minSpeed' id='minSpeed' type='range' data-min-for="maxSpeed">
        <label for='maxSpeed'>Max Speed</label>
        <input name='maxSpeed' id='maxSpeed' type='range' data-max-for="minSpeed">
        <label for='explosionParticles'>Explosion Particles</label>
        <input name='explosionParticles' id='explosionParticles' type='range'>
        <label for='color'>Background</label>
        <input name='background' id='background' type='color' value="#FFFFFF">
        <label for='color'>Color</label>
        <input name='color' id='color' type='color' value="#0000FF">
        <h3>Color Randomization</h3>
        <label for='randomizeColor'>On Spawn</label>
        <input name='randomizeColor' id='randomizeColor' type='checkbox'>
        <label for='randomizeExplosionColor'>On Explosion</label>
        <input name='randomizeExplosionColor' id='randomizeExplosionColor' type='checkbox'>
    </form>
    <button>Close</button>
`;
