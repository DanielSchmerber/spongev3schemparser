import { Schem } from "../Schematic";
export type CompressionOptions = {
    type?: "gzip";
} | {
    type: "zopfli";
    numiterations?: number;
};
export declare class SpongeV3SchematicWriter {
    schem: Schem;
    compression: CompressionOptions;
    constructor(schem: Schem, compression?: CompressionOptions);
    writeSchematic(): Buffer;
    createPallet(): Map<string, number>;
}
//# sourceMappingURL=spongeV3SchematicWriter.d.ts.map