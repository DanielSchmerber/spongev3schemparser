import {Schem, SchematicWrapper} from '../Schematic';
import { SchematicV3 } from '../SpongeV3Schematic';
import nbt from "prismarine-nbt"
import { gunzipSync } from "zlib";


export function readSchematic(buffer: Buffer): SchematicWrapper {
    const decompressed = gunzipSync(buffer);
    const parsed = nbt.parseUncompressed(decompressed, "big");
    return new SchematicWrapper(new SchematicV3(parsed));
}