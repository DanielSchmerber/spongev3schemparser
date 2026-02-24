import * as fs from "node:fs";
import {readSchematicFromBuf} from "./schematic/Schematic";
import {SpongeV3SchematicWriter} from "./schematic/writer/spongeV3SchematicWriter";


async function main() {
    let schematic = await readSchematicFromBuf(fs.readFileSync("../Cringelig.schem"))!




    await new SpongeV3SchematicWriter(schematic!).writeSchematic()

}
main()