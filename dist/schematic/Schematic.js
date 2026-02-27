"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOTHING = exports.BlockWrapper = exports.SchematicWrapper = void 0;
exports.iterateBlocks = iterateBlocks;
exports.readSchematicFromBuf = readSchematicFromBuf;
exports.blocksEqual = blocksEqual;
const prismarine_nbt_1 = __importDefault(require("prismarine-nbt"));
const spongeV3Schematicreader_1 = require("./reader/spongeV3Schematicreader");
const node_util_1 = require("node:util");
class SchematicWrapper {
    constructor(schem) {
        this.schem = schem;
        this.overrides = new Map();
    }
    // ---------- Size setters ----------
    setWidth(width) {
        this.width = width;
    }
    setHeight(height) {
        this.height = height;
    }
    setLength(length) {
        this.length = length;
    }
    // ---------- Size getters ----------
    getWidth() {
        var _a;
        return (_a = this.width) !== null && _a !== void 0 ? _a : this.schem.getWidth();
    }
    getHeight() {
        var _a;
        return (_a = this.height) !== null && _a !== void 0 ? _a : this.schem.getHeight();
    }
    getLength() {
        var _a;
        return (_a = this.length) !== null && _a !== void 0 ? _a : this.schem.getLength();
    }
    // ---------- Block handling ----------
    getBlockAt(x, y, z) {
        var _a;
        if (!this.isInsideBounds(x, y, z)) {
            return exports.NOTHING;
        }
        return (_a = this.overrides.get(`${x},${y},${z}`)) !== null && _a !== void 0 ? _a : this.schem.getBlockAt(x, y, z);
    }
    setBlock(x, y, z, block) {
        if (!this.isInsideBounds(x, y, z))
            return;
        this.overrides.set(`${x},${y},${z}`, block);
    }
    isInsideBounds(x, y, z) {
        return (x >= 0 && y >= 0 && z >= 0 &&
            x < this.getWidth() &&
            y < this.getHeight() &&
            z < this.getLength());
    }
    // ---------- Delegate ----------
    getDataVersion() {
        return this.schem.getDataVersion();
    }
    getOffset() {
        return this.schem.getOffset();
    }
    getBlocks() {
        return iterateBlocks(this);
    }
}
exports.SchematicWrapper = SchematicWrapper;
class BlockWrapper {
    constructor(block) {
        this.block = block;
    }
    getMaterial() {
        return this.block.getMaterial();
    }
    getData() {
        return this.block.getData();
    }
    equals(other) {
        return blocksEqual(this, other);
    }
    getSimpleData() {
        try {
            // @ts-ignore
            return prismarine_nbt_1.default.simplify(prismarine_nbt_1.default.comp(this.getData()));
        }
        catch (e) {
            return null;
        }
    }
}
exports.BlockWrapper = BlockWrapper;
function* iterateBlocks(schem) {
    for (let x = 0; x < schem.getWidth(); x++) {
        for (let y = 0; y < schem.getHeight(); y++) {
            for (let z = 0; z < schem.getLength(); z++) {
                yield {
                    x,
                    y,
                    z,
                    block: schem.getBlockAt(x, y, z),
                };
            }
        }
    }
}
exports.NOTHING = {
    getMaterial() { return "nothing"; },
    getData() { return null; }
};
function readSchematicFromBuf(buf) {
    let readers = [spongeV3Schematicreader_1.readSchematic];
    for (let reader of readers) {
        try {
            return reader(buf);
        }
        catch (e) {
        }
    }
}
function blocksEqual(a, b) {
    if (a.getMaterial() !== b.getMaterial())
        return false;
    const dataA = a.getData();
    const dataB = b.getData();
    if (dataA == null && dataB == null)
        return true;
    if (dataA == null || dataB == null)
        return false;
    return (0, node_util_1.isDeepStrictEqual)(dataA, dataB);
}
