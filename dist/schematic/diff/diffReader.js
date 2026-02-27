"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readDiff = readDiff;
const prismarine_nbt_1 = __importDefault(require("prismarine-nbt"));
const SchematicDiff_1 = require("./SchematicDiff");
const zlib_1 = require("zlib");
const Schematic_1 = require("../Schematic");
const SpongeV3Schematic_1 = require("../SpongeV3Schematic");
function readDiff(diff) {
    const decompressed = (0, zlib_1.gunzipSync)(diff);
    let newSchem = prismarine_nbt_1.default.parseUncompressed(decompressed, "big");
    //@ts-ignore
    newSchem.value.Schematic.value.Blocks.value.Data = newSchem.value.Schematic.value.Blocks.value.NewData;
    //@ts-ignore
    newSchem.value.Schematic.value.Blocks.value.BlockEntities = newSchem.value.Schematic.value.Blocks.value.NewBlockEntities;
    let newSchemP = new Schematic_1.SchematicWrapper(new SpongeV3Schematic_1.SchematicV3(newSchem));
    let oldSchem = prismarine_nbt_1.default.parseUncompressed(decompressed, "big");
    //@ts-ignore
    oldSchem.value.Schematic.value.Blocks.value.Data = oldSchem.value.Schematic.value.Blocks.value.OldData;
    //@ts-ignore
    oldSchem.value.Schematic.value.Blocks.value.BlockEntities = oldSchem.value.Schematic.value.Blocks.value.OldBlockEntities;
    let oldSchemP = new Schematic_1.SchematicWrapper(new SpongeV3Schematic_1.SchematicV3(oldSchem));
    return new SchematicDiff_1.SchematicDiff(oldSchemP, newSchemP);
}
