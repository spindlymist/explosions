export function degToRad(deg) {
    return deg * (Math.PI / 180);
}

export function reflect(dir, normal) {
    let intermediate = normal.times(2 * dir.dot(normal));
    return dir.minus(intermediate);
}

export class Vector2 {
    constructor(i, j) {
        if (i === undefined) {
            this.i = 0;
            this.j = 0;
        } else if (i instanceof Vector2) {
            this.i = i.i;
            this.j = i.j;
        } else if (j === undefined) {
            this.i = i;
            this.j = 0;
        } else {
            this.i = i;
            this.j = j;
        }
    }

    magnitude() {
        return Math.sqrt(this.i * this.i + this.j * this.j)
    }

    normalize() {
        let mag = this.magnitude();
        this.i /= mag;
        this.j /= mag;
    }

    normalized() {
        let mag = this.magnitude();
        let norm = new Vector2(this.i / mag, this.j / mag);
        return norm;
    }

    add(other) {
        this.i += other.i;
        this.j += other.j;
    }

    plus(other) {
        return new Vector2(this.i + other.i, this.j + other.j);
    }

    sub(other) {
        this.i -= other.i;
        this.j -= other.j;
    }

    minus(other) {
        return new Vector2(this.i - other.i, this.j - other.j);
    }

    mult(x) {
        this.i *= x;
        this.j *= x;
    }

    times(x) {
        return new Vector2(this.i * x, this.j * x);
    }

    dot(other) {
        return this.i * other.i + this.j * other.j;
    }

    rotate(deg) {
        let theta = degToRad(deg);

        let cosTheta = Math.cos(theta);
        let sinTheta = Math.sin(theta);

        let newI = this.i * cosTheta - this.j * sinTheta;
        let newJ = this.i * sinTheta + this.j * cosTheta;

        this.i = newI;
        this.j = newJ;
    }

    rotated(deg) {
        let theta = degToRad(deg);

        let cosTheta = Math.cos(theta);
        let sinTheta = Math.sin(theta);

        let newI = this.i * cosTheta - this.j * sinTheta;
        let newJ = this.i * sinTheta + this.j * cosTheta;

        return new Vector2(newI, newJ);
    }

    toString() {
        return `[${this.i}, ${this.j}]`;
    }
}

export function clamp(val, min, max) {
    if (val < min) {
        return min;
    } else if (val > max) {
        return max;
    } else {
        return val;
    }
}

export function randReal(min, max) {
    return Math.random() * (max - min) + min;
}

export function randInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export function randColor() {
    let color = Math.floor(Math.random() * 16777216).toString(16);
    return '#000000'.slice(0, -color.length) + color;
}
