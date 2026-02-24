"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpongeV3SchematicWriter = void 0;
const Schematic_1 = require("../Schematic");
const prismarine_nbt_1 = __importDefault(require("prismarine-nbt"));
const fs = __importStar(require("node:fs"));
const node_util_1 = require("node:util");
// Node built-in gzip
const node_zlib_1 = require("node:zlib");
// Zopfli gzip
const node_zopfli_1 = require("node-zopfli");
class SpongeV3SchematicWriter {
    constructor(schem, compression = { type: "gzip" } // default
    ) {
        this.schem = schem;
        this.compression = compression;
    }
    async writeSchematic() {
        var _a;
        let pallet = this.createPallet();
        let palletObj = [...pallet.entries()].reduce((acc, [key, value]) => {
            // @ts-ignore
            acc[key] = prismarine_nbt_1.default.int(value);
            return acc;
        }, Object.create(null) // ← safe accumulator
        );
        let blockEntities = [];
        let intArray = [];
        //Write blockdata
        for (let block of (0, Schematic_1.iterateBlocks)(this.schem)) {
            let index = block.x + (block.z + block.y * this.schem.getLength()) * this.schem.getWidth();
            let blockPallet = pallet.get(block.block.getMaterial());
            if (block.block.getData()) {
                const data = block.block.getData();
                blockEntities.push({
                    Pos: prismarine_nbt_1.default.intArray([block.x, block.y, block.z]),
                    //@ts-ignore
                    Id: block.block.getData()["id"],
                    Data: prismarine_nbt_1.default.comp(block.block.getData())
                });
            }
            intArray[index] = (blockPallet);
        }
        intArray = intArrayToVarintByteArray(intArray);
        let schemnbt = prismarine_nbt_1.default.comp({
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
            })
        });
        // @ts-ignore
        const raw = prismarine_nbt_1.default.writeUncompressed(schemnbt);
        let buf;
        if (this.compression.type === "zopfli") {
            buf = await (0, node_zopfli_1.gzip)(raw, {
                verbose: false,
                numiterations: (_a = this.compression.numiterations) !== null && _a !== void 0 ? _a : 2,
            });
        }
        else {
            const gzipAsync = (0, node_util_1.promisify)(node_zlib_1.gzip);
            buf = await gzipAsync(raw);
        }
        //@ts-ignore
        fs.writeFileSync("schem.schem", buf);
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
