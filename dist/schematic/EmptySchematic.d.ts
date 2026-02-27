import { BlockWrapper } from "./Schematic";
export declare class EmptySchematic {
    private width;
    private length;
    private height;
    constructor(width: number, height: number, length: number);
    getBlockAt(x: number, y: number, z: number): BlockWrapper;
    getWidth(): number;
    getHeight(): number;
    getLength(): number;
    getDataVersion(): number;
    getOffset(): [number, number, number];
}
//# sourceMappingURL=EmptySchematic.d.ts.map