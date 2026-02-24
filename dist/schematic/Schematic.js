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
class SchematicWrapper {
    constructor(schem) {
        this.schem = schem;
        this.overrides = new Map();
    }
    getBlockAt(x, y, z) {
        var _a;
        return (_a = this.overrides.get(`${x},${y},${z}`)) !== null && _a !== void 0 ? _a : this.schem.getBlockAt(x, y, z);
    }
    setBlock(x, y, z, block) {
        this.overrides.set(`${x},${y},${z}`, block);
    }
    getWidth() {
        return this.schem.getWidth();
    }
    getHeight() {
        return this.schem.getHeight();
    }
    getLength() {
        return this.schem.getLength();
    }
    getDataVersion() {
        return this.schem.getDataVersion();
    }
    getOffset() {
        return this.schem.getOffset();
    }
    getBlocks() {
        return iterateBlocks(this.schem);
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
    return a.getMaterial() == b.getMaterial() && JSON.stringify(a.getData()) == JSON.stringify(b.getData());
}
