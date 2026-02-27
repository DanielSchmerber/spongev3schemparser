import nbt from "prismarine-nbt"
import {SchematicDiff} from "./SchematicDiff";
import {gunzipSync} from "zlib";
import {SchematicWrapper} from "../Schematic";
import {SchematicV3} from "../SpongeV3Schematic";

export function readDiff(diff: Buffer): SchematicDiff {

    const decompressed = gunzipSync(diff);
    let newSchem = nbt.parseUncompressed(decompressed, "big");
    //@ts-ignore
    newSchem.value.Schematic.value.Blocks.value.Data = newSchem.value.Schematic.value.Blocks.value.NewData
    //@ts-ignore
    newSchem.value.Schematic.value.Blocks.value.BlockEntities = newSchem.value.Schematic.value.Blocks.value.NewBlockEntities

    let newSchemP = new SchematicWrapper(new SchematicV3(newSchem))


    let oldSchem = nbt.parseUncompressed(decompressed, "big");
    //@ts-ignore
    oldSchem.value.Schematic.value.Blocks.value.Data = oldSchem.value.Schematic.value.Blocks.value.OldData
    //@ts-ignore
    oldSchem.value.Schematic.value.Blocks.value.BlockEntities = oldSchem.value.Schematic.value.Blocks.value.OldBlockEntities

    let oldSchemP = new SchematicWrapper(new SchematicV3(oldSchem))

    return new SchematicDiff(oldSchemP,newSchemP)

}