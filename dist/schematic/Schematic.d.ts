import nbt, { NBT } from "prismarine-nbt";
export declare class SchematicWrapper implements Schem {
    private schem;
    private overrides;
    protected width?: number;
    protected height?: number;
    protected length?: number;
    constructor(schem: Schem);
    setWidth(width: number): void;
    setHeight(height: number): void;
    setLength(length: number): void;
    getWidth(): number;
    getHeight(): number;
    getLength(): number;
    getBlockAt(x: number, y: number, z: number): Block;
    setBlock(x: number, y: number, z: number, block: Block): void;
    private isInsideBounds;
    getDataVersion(): number;
    getOffset(): number[];
    getBlocks(): Generator<{
        x: number;
        y: number;
        z: number;
        block: Block;
    }, void, unknown>;
}
export declare class BlockWrapper {
    private block;
    constructor(block: Block);
    getMaterial(): string;
    getData(): nbt.NBT | null;
    equals(other: Block): boolean;
    getSimpleData(): any;
}
export interface Schem {
    getBlockAt(x: number, y: number, z: number): Block;
    getWidth(): number;
    getHeight(): number;
    getLength(): number;
    getDataVersion(): number;
    getOffset(): number[];
}
export declare function iterateBlocks(schem: Schem): Generator<{
    x: number;
    y: number;
    z: number;
    block: Block;
}, void, unknown>;
export interface Block {
    getMaterial(): string;
    getData(): NBT | null;
}
export declare let NOTHING: Block;
export declare function readSchematicFromBuf(buf: Buffer): SchematicWrapper | undefined;
export declare function blocksEqual(a: Block, b: Block): boolean;
//# sourceMappingURL=Schematic.d.ts.map