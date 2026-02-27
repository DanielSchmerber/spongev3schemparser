import { NBT } from "prismarine-nbt";
import { BlockWrapper } from "./Schematic";
export declare class SchematicV3 {
    private nbt;
    pallet: Map<number, string>;
    dataMap: Map<string, NBT>;
    constructor(nbt: any);
    getBlockAt(x: number, y: number, z: number): BlockWrapper;
    getHeight(): any;
    getWidth(): any;
    getLength(): any;
    getDataVersion(): any;
    getOffset(): any;
}
//# sourceMappingURL=SpongeV3Schematic.d.ts.map