import { readSchematic } from "./src/schematic/reader/spongeV3Schematicreader";
import * as fs from "fs";
import { SpongeV3SchematicWriter } from "./src/schematic/writer/spongeV3SchematicWriter";

const schem = readSchematic(fs.readFileSync("block.schem"));

const writer = new SpongeV3SchematicWriter(schem);




fs.writeFileSync("out.schem", Buffer.from(writer.writeSchematic()));

console.log("Done.");