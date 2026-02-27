"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpongeV3DiffSchematicWriter = void 0;
const Schematic_1 = require("../Schematic");
const prismarine_nbt_1 = __importDefault(require("prismarine-nbt"));
const node_zlib_1 = require("node:zlib");
class SpongeV3DiffSchematicWriter {
    constructor(schem, compression = { type: "gzip" } // default
    ) {
        this.schematicDiff = schem;
        this.compression = compression;
    }
    writeSchematic() {
        const pallet = this.createPallet();
        const palletObj = [...pallet.entries()].reduce((acc, [key, value]) => {
            // @ts-ignore
            acc[key] = prismarine_nbt_1.default.int(value);
            return acc;
        }, Object.create(null));
        let oldIntArray = [];
        let newIntArray = [];
        const oldBlockEntities = [];
        const newBlockEntities = [];
        for (let block of (0, Schematic_1.iterateBlocks)(this.schematicDiff.afterBlocks)) {
            const index = block.x +
                (block.z + block.y * this.schematicDiff.afterBlocks.getLength()) *
                    this.schematicDiff.afterBlocks.getWidth();
            const oldBlock = this.schematicDiff.beforeBlocks.getBlockAt(block.x, block.y, block.z);
            const newBlock = this.schematicDiff.afterBlocks.getBlockAt(block.x, block.y, block.z);
            const oldPalette = pallet.get(oldBlock.getMaterial());
            const newPalette = pallet.get(newBlock.getMaterial());
            oldIntArray[index] = oldPalette;
            newIntArray[index] = newPalette;
            // ---- Old BlockEntities ----
            if (oldBlock.getData()) {
                // @ts-ignore
                oldBlockEntities.push({
                    Pos: prismarine_nbt_1.default.intArray([block.x, block.y, block.z]),
                    // @ts-ignore
                    Id: oldBlock.getData()["id"],
                    Data: prismarine_nbt_1.default.comp(oldBlock.getData())
                });
            }
            // ---- New BlockEntities ----
            if (newBlock.getData()) {
                newBlockEntities.push({
                    Pos: prismarine_nbt_1.default.intArray([block.x, block.y, block.z]),
                    // @ts-ignore
                    Id: newBlock.getData()["id"],
                    Data: prismarine_nbt_1.default.comp(newBlock.getData())
                });
            }
        }
        oldIntArray = intArrayToVarintByteArray(oldIntArray);
        newIntArray = intArrayToVarintByteArray(newIntArray);
        const schemnbt = prismarine_nbt_1.default.comp({
            Schematic: prismarine_nbt_1.default.comp({
                Height: prismarine_nbt_1.default.short(this.schematicDiff.beforeBlocks.getHeight()),
                Width: prismarine_nbt_1.default.short(this.schematicDiff.beforeBlocks.getWidth()),
                Length: prismarine_nbt_1.default.short(this.schematicDiff.beforeBlocks.getLength()),
                Version: prismarine_nbt_1.default.int(3),
                Offset: prismarine_nbt_1.default.intArray(this.schematicDiff.beforeBlocks.getOffset()),
                DataVersion: prismarine_nbt_1.default.int(this.schematicDiff.beforeBlocks.getDataVersion()),
                Blocks: prismarine_nbt_1.default.comp({
                    Palette: prismarine_nbt_1.default.comp(palletObj),
                    OldData: prismarine_nbt_1.default.byteArray(oldIntArray),
                    NewData: prismarine_nbt_1.default.byteArray(newIntArray),
                    OldBlockEntities: prismarine_nbt_1.default.list(prismarine_nbt_1.default.comp(oldBlockEntities)),
                    NewBlockEntities: prismarine_nbt_1.default.list(prismarine_nbt_1.default.comp(newBlockEntities)),
                }),
                Entities: prismarine_nbt_1.default.list(prismarine_nbt_1.default.comp([])),
            }),
        });
        // @ts-ignore
        const raw = prismarine_nbt_1.default.writeUncompressed(schemnbt);
        // 🔥 FULLY SYNC COMPRESSION
        return (0, node_zlib_1.gzipSync)(raw);
    }
    createPallet() {
        let blocks = [...this.schematicDiff.afterBlocks.getBlocks(), ...this.schematicDiff.beforeBlocks.getBlocks()].map(x => x.block.getMaterial());
        let blocks_unduplicated = [...new Set(blocks)];
        let counts = blocks_unduplicated.map(x => { return { count: blocks.filter(y => y == x).length, x }; });
        counts.sort((a, b) => b.count - a.count);
        let map = new Map();
        for (let i = 0; i < counts.length; i++) {
            map.set(counts[i].x, i);
        }
        return map;
    }
}
exports.SpongeV3DiffSchematicWriter = SpongeV3DiffSchematicWriter;
function toSignedByte(n) {
    return n > 127 ? n - 256 : n;
}
function intArrayToVarintByteArray(values) {
    const bytes = [];
    for (let value of values) {
        value |= 0;
        while (true) {
            if ((value & ~0x7F) === 0) {
                bytes.push(toSignedByte(value));
                break;
            }
            bytes.push(toSignedByte((value & 0x7F) | 0x80));
            value >>>= 7;
        }
    }
    return bytes;
}
