import { readSchematic } from "./src/schematic/reader/spongeV3Schematicreader";
import * as fs from "fs";
import { SpongeV3SchematicWriter } from "./src/schematic/writer/spongeV3SchematicWriter";
import {EmptySchematic} from "./src/schematic/EmptySchematic";
import {SpongeV3DiffSchematicWriter} from "./src/schematic/diff/spongeV3DiffSchematicWriter";
import {SchematicDiff} from "./src/schematic/diff/SchematicDiff";
import {readDiff} from "./src/schematic/diff/diffReader";
import {applyChanges, revertChanges} from "./src/schematic/diff/applyDiff";

var cringelig = readSchematic(fs.readFileSync("Cringelig2.schem"));
var cringelig2 = readSchematic(fs.readFileSync("Cringelig3.schem"));
var diff = new SpongeV3DiffSchematicWriter(new SchematicDiff(cringelig, cringelig2))

fs.writeFileSync("diff.schem", diff.writeSchematic())


let diffRead = readDiff(diff.writeSchematic())

console.log(diffRead)

let changes = [...diffRead.diffs()]



let appliedChanges = applyChanges(cringelig,diffRead)
fs.writeFileSync("applied.schem", new SpongeV3SchematicWriter(appliedChanges).writeSchematic())

let reverSchems = revertChanges(cringelig2,diffRead)
fs.writeFileSync("reverted.schem", new SpongeV3SchematicWriter(reverSchems).writeSchematic())