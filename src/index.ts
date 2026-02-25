import {readSchematic} from "./schematic/reader/spongeV3Schematicreader";

export { readSchematic } from "./schematic/reader/spongeV3Schematicreader";
export { SpongeV3SchematicWriter } from "./schematic/writer/spongeV3SchematicWriter";
import {Schem} from "./schematic/Schematic";
import {Block} from "./schematic/Schematic";
export {Schem,Block};
import {SchematicWrapper} from "./schematic/Schematic";
import {BlockWrapper} from "./schematic/Schematic";
export {SchematicWrapper,BlockWrapper};

import * as fs from "node:fs";

async function test(){

    let schem = await readSchematic(fs.readFileSync("../Cringelig.schem"));
    let testBlock = [...schem.getBlocks()].find((x)=>x.block.getData())

    console.log(JSON.stringify(testBlock?.block.getSimpleData()))


}
test()