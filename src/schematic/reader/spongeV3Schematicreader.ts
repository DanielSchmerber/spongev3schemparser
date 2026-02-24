import {Schem, SchematicWrapper} from '../Schematic';
import { SchematicV3 } from '../SpongeV3Schematic';
import nbt from "prismarine-nbt"

export async function readSchematic(schem: Buffer) : Promise<SchematicWrapper>{
    let parsed = (await nbt.parse(schem)).parsed;
    return new SchematicWrapper(new SchematicV3(parsed));
}

