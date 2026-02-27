import { Block, Schem, SchematicWrapper } from "../Schematic";
export declare class SchematicDiff {
    after: Schem;
    before: Schem;
    beforeBlocks: SchematicWrapper;
    afterBlocks: SchematicWrapper;
    constructor(before: Schem, after: Schem);
    calculateSchems(): void;
    diffs(): Generator<{
        pos: number[];
        before: Block;
        after: Block;
    }, void, unknown>;
}
//# sourceMappingURL=SchematicDiff.d.ts.map