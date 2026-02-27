"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptySchematic = exports.BlockWrapper = exports.SchematicWrapper = exports.revertChanges = exports.applyChanges = exports.readDiff = exports.SchematicDiff = exports.SpongeV3DiffSchematicWriter = exports.SpongeV3SchematicWriter = exports.readSchematic = void 0;
// Readers
var spongeV3Schematicreader_1 = require("./schematic/reader/spongeV3Schematicreader");
Object.defineProperty(exports, "readSchematic", { enumerable: true, get: function () { return spongeV3Schematicreader_1.readSchematic; } });
// Writers
var spongeV3SchematicWriter_1 = require("./schematic/writer/spongeV3SchematicWriter");
Object.defineProperty(exports, "SpongeV3SchematicWriter", { enumerable: true, get: function () { return spongeV3SchematicWriter_1.SpongeV3SchematicWriter; } });
// Diff Writers
var spongeV3DiffSchematicWriter_1 = require("./schematic/diff/spongeV3DiffSchematicWriter");
Object.defineProperty(exports, "SpongeV3DiffSchematicWriter", { enumerable: true, get: function () { return spongeV3DiffSchematicWriter_1.SpongeV3DiffSchematicWriter; } });
// Diff Core
var SchematicDiff_1 = require("./schematic/diff/SchematicDiff");
Object.defineProperty(exports, "SchematicDiff", { enumerable: true, get: function () { return SchematicDiff_1.SchematicDiff; } });
var diffReader_1 = require("./schematic/diff/diffReader");
Object.defineProperty(exports, "readDiff", { enumerable: true, get: function () { return diffReader_1.readDiff; } });
var applyDiff_1 = require("./schematic/diff/applyDiff");
Object.defineProperty(exports, "applyChanges", { enumerable: true, get: function () { return applyDiff_1.applyChanges; } });
Object.defineProperty(exports, "revertChanges", { enumerable: true, get: function () { return applyDiff_1.revertChanges; } });
// Base Schematic Types
var Schematic_1 = require("./schematic/Schematic");
Object.defineProperty(exports, "SchematicWrapper", { enumerable: true, get: function () { return Schematic_1.SchematicWrapper; } });
Object.defineProperty(exports, "BlockWrapper", { enumerable: true, get: function () { return Schematic_1.BlockWrapper; } });
// Optional (if used externally)
var EmptySchematic_1 = require("./schematic/EmptySchematic");
Object.defineProperty(exports, "EmptySchematic", { enumerable: true, get: function () { return EmptySchematic_1.EmptySchematic; } });
