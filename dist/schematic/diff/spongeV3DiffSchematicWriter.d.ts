import { SchematicDiff } from "./SchematicDiff";
export type CompressionOptions = {
    type?: "gzip";
} | {
    type: "zopfli";
    numiterations?: number;
};
export declare class SpongeV3DiffSchematicWriter {
    schematicDiff: SchematicDiff;
    compression: CompressionOptions;
    constructor(schem: SchematicDiff, compression?: CompressionOptions);
    writeSchematic(): Buffer;
    createPallet(): Map<string, number>;
}
//# sourceMappingURL=spongeV3DiffSchematicWriter.d.ts.map