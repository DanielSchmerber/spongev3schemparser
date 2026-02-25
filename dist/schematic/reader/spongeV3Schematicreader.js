"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readSchematic = void 0;
const Schematic_1 = require("../Schematic");
const SpongeV3Schematic_1 = require("../SpongeV3Schematic");
const prismarine_nbt_1 = __importDefault(require("prismarine-nbt"));
const zlib_1 = require("zlib");
function readSchematic(buffer) {
    const decompressed = (0, zlib_1.gunzipSync)(buffer);
    const parsed = prismarine_nbt_1.default.parseUncompressed(decompressed, "big");
    return new Schematic_1.SchematicWrapper(new SpongeV3Schematic_1.SchematicV3(parsed));
}
exports.readSchematic = readSchematic;
