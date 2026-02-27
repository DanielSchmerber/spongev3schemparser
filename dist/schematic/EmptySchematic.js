"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptySchematic = void 0;
const Schematic_1 = require("./Schematic");
class EmptySchematic {
    constructor(width, height, length) {
        this.width = width;
        this.height = height;
        this.length = length;
    }
    getBlockAt(x, y, z) {
        return new Schematic_1.BlockWrapper({
            getData() {
                return null;
            },
            getMaterial() {
                return "wargit:nothing";
            }
        });
    }
    getWidth() {
        return this.width;
    }
    getHeight() {
        return this.height;
    }
    getLength() {
        return this.length;
    }
    getDataVersion() {
        return 0;
    }
    getOffset() {
        return [0, 0, 0];
    }
}
exports.EmptySchematic = EmptySchematic;
