import {iterateBlocks, Schem} from "../Schematic";
import nbt from "prismarine-nbt";
import * as fs from "node:fs";
import { promisify } from 'node:util';
// Node built-in gzip
import { gzip as nodeGzip } from "node:zlib";
import { gzipSync } from "node:zlib";
// Zopfli gzip
import { gzip as zopfliGzip } from "node-zopfli";
import {SchematicDiff} from "./SchematicDiff";
export type CompressionOptions =
    | { type?: "gzip" } // default
    | { type: "zopfli"; numiterations?: number }


export class SpongeV3DiffSchematicWriter {

    schematicDiff : SchematicDiff
    compression: CompressionOptions

    constructor(
        schem: SchematicDiff,
        compression: CompressionOptions = { type: "gzip" } // default
    ) {
        this.schematicDiff = schem
        this.compression = compression
    }

    writeSchematic(): Buffer {
        const pallet = this.createPallet();

        const palletObj = [...pallet.entries()].reduce(
            (acc, [key, value]) => {
                // @ts-ignore
                acc[key] = nbt.int(value)
                return acc
            },
            Object.create(null)
        )

        let oldIntArray: number[] = []
        let newIntArray: number[] = []

        const oldBlockEntities: any[] = []
        const newBlockEntities: any[] = []

        for (let block of iterateBlocks(this.schematicDiff.afterBlocks)) {

            const index =
                block.x +
                (block.z + block.y * this.schematicDiff.afterBlocks.getLength()) *
                this.schematicDiff.afterBlocks.getWidth()

            const oldBlock = this.schematicDiff.beforeBlocks.getBlockAt(block.x, block.y, block.z)
            const newBlock = this.schematicDiff.afterBlocks.getBlockAt(block.x, block.y, block.z)

            const oldPalette = pallet.get(oldBlock.getMaterial())!
            const newPalette = pallet.get(newBlock.getMaterial())!

            oldIntArray[index] = oldPalette
            newIntArray[index] = newPalette

            // ---- Old BlockEntities ----
            if (oldBlock.getData()) {
                // @ts-ignore
                oldBlockEntities.push({
                    Pos: nbt.intArray([block.x, block.y, block.z]),
                    // @ts-ignore
                    Id: oldBlock.getData()!["id"],
                    Data: nbt.comp(oldBlock.getData()!)
                })
            }

            // ---- New BlockEntities ----
            if (newBlock.getData()) {
                newBlockEntities.push({
                    Pos: nbt.intArray([block.x, block.y, block.z]),
                    // @ts-ignore
                    Id: newBlock.getData()!["id"],
                    Data: nbt.comp(newBlock.getData()!)
                })
            }
        }

        oldIntArray = intArrayToVarintByteArray(oldIntArray)
        newIntArray = intArrayToVarintByteArray(newIntArray)

        const schemnbt = nbt.comp({
            Schematic: nbt.comp({
                Height: nbt.short(this.schematicDiff.beforeBlocks.getHeight()),
                Width: nbt.short(this.schematicDiff.beforeBlocks.getWidth()),
                Length: nbt.short(this.schematicDiff.beforeBlocks.getLength()),
                Version: nbt.int(3),
                Offset: nbt.intArray(this.schematicDiff.beforeBlocks.getOffset()),
                DataVersion: nbt.int(this.schematicDiff.beforeBlocks.getDataVersion()),
                Blocks: nbt.comp({
                    Palette: nbt.comp(palletObj),

                    OldData: nbt.byteArray(oldIntArray),
                    NewData: nbt.byteArray(newIntArray),

                    OldBlockEntities: nbt.list(nbt.comp(oldBlockEntities)),
                    NewBlockEntities: nbt.list(nbt.comp(newBlockEntities)),
                }),
                Entities: nbt.list(nbt.comp([])),
            }),
        })

        // @ts-ignore
        const raw = nbt.writeUncompressed(schemnbt)

        // 🔥 FULLY SYNC COMPRESSION
        return gzipSync(raw)
    }

    createPallet(){

        let blocks = [...this.schematicDiff.afterBlocks.getBlocks(),...this.schematicDiff.beforeBlocks.getBlocks()].map(x => x.block.getMaterial())
        let blocks_unduplicated = [...new Set(blocks)]
        let counts = blocks_unduplicated.map(x=>{return {count:blocks.filter(y=>y==x).length,x}})
        counts.sort((a,b)=>b.count-a.count)


        let map = new Map<string,number>()
        for(let i = 0;i<counts.length;i++){
            map.set(counts[i].x,i)
        }

        return map


    }



}
function toSignedByte(n: number) {
    return n > 127 ? n - 256 : n
}
function intArrayToVarintByteArray(values: number[]): number[] {
    const bytes: number[] = []

    for (let value of values) {
        value |= 0

        while (true) {
            if ((value & ~0x7F) === 0) {
                bytes.push(toSignedByte(value))
                break
            }

            bytes.push(toSignedByte((value & 0x7F) | 0x80))
            value >>>= 7
        }
    }

    return bytes
}