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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockWrapper = exports.SchematicWrapper = exports.SpongeV3SchematicWriter = exports.readSchematic = void 0;
const spongeV3Schematicreader_1 = require("./schematic/reader/spongeV3Schematicreader");
var spongeV3Schematicreader_2 = require("./schematic/reader/spongeV3Schematicreader");
Object.defineProperty(exports, "readSchematic", { enumerable: true, get: function () { return spongeV3Schematicreader_2.readSchematic; } });
var spongeV3SchematicWriter_1 = require("./schematic/writer/spongeV3SchematicWriter");
Object.defineProperty(exports, "SpongeV3SchematicWriter", { enumerable: true, get: function () { return spongeV3SchematicWriter_1.SpongeV3SchematicWriter; } });
const Schematic_1 = require("./schematic/Schematic");
Object.defineProperty(exports, "SchematicWrapper", { enumerable: true, get: function () { return Schematic_1.SchematicWrapper; } });
const Schematic_2 = require("./schematic/Schematic");
Object.defineProperty(exports, "BlockWrapper", { enumerable: true, get: function () { return Schematic_2.BlockWrapper; } });
const fs = __importStar(require("node:fs"));
async function test() {
    let schem = await (0, spongeV3Schematicreader_1.readSchematic)(fs.readFileSync("../Cringelig.schem"));
    let testBlock = [...schem.getBlocks()].find((x) => x.block.getData());
    console.log(JSON.stringify(testBlock === null || testBlock === void 0 ? void 0 : testBlock.block.getSimpleData()));
}
test();
