"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpongeV3SchematicWriter = void 0;
const Schematic_1 = require("../Schematic");
const prismarine_nbt_1 = __importDefault(require("prismarine-nbt"));
const node_zlib_1 = require("node:zlib");
class SpongeV3SchematicWriter {
    constructor(schem, compression = { type: "gzip" } // default
    ) {
        this.schem = schem;
        this.compression = compression;
    }
    writeSchematic() {
        const pallet = this.createPallet();
        const palletObj = [...pallet.entries()].reduce((acc, [key, value]) => {
            // @ts-ignore
            acc[key] = prismarine_nbt_1.default.int(value);
            return acc;
        }, Object.create(null));
        const blockEntities = [];
        let intArray = [];
        for (let block of (0, Schematic_1.iterateBlocks)(this.schem)) {
            const index = block.x +
                (block.z + block.y * this.schem.getLength()) *
                    this.schem.getWidth();
            const blockPallet = pallet.get(block.block.getMaterial());
            if (block.block.getData()) {
                // @ts-ignore
                blockEntities.push({
                    Pos: prismarine_nbt_1.default.intArray([block.x, block.y, block.z]),
                    // @ts-ignore
                    Id: block.block.getData()["id"],
                    Data: prismarine_nbt_1.default.comp(block.block.getData())
                });
            }
            intArray[index] = blockPallet;
        }
        intArray = intArrayToVarintByteArray(intArray);
        const schemnbt = prismarine_nbt_1.default.comp({
            Schematic: prismarine_nbt_1.default.comp({
                Height: prismarine_nbt_1.default.short(this.schem.getHeight()),
                Width: prismarine_nbt_1.default.short(this.schem.getWidth()),
                Length: prismarine_nbt_1.default.short(this.schem.getLength()),
                Version: prismarine_nbt_1.default.int(3),
                Offset: prismarine_nbt_1.default.intArray(this.schem.getOffset()),
                DataVersion: prismarine_nbt_1.default.int(this.schem.getDataVersion()),
                Blocks: prismarine_nbt_1.default.comp({
                    Palette: prismarine_nbt_1.default.comp(palletObj),
                    BlockEntities: prismarine_nbt_1.default.list(prismarine_nbt_1.default.comp(blockEntities)),
                    Data: prismarine_nbt_1.default.byteArray(intArray),
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
        let blocks = [...(0, Schematic_1.iterateBlocks)(this.schem)].map(x => x.block.getMaterial());
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
exports.SpongeV3SchematicWriter = SpongeV3SchematicWriter;
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
