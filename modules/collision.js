import Engine from './engine.js';
import {
    Vector2
} from './mathutil.js'

export function getEdgeNormal(pos) {
    if (pos.i <= 0) {
        return new Vector2(1, 0);
    } else if (pos.i >= Engine.canvas.width) {
        return new Vector2(-1, 0);
    } else if (pos.j <= 0) {
        return new Vector2(0, 1);
    } else if (pos.j >= Engine.canvas.height) {
        return new Vector2(0, -1);
    }

    return false;
}
