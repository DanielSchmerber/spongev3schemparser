import {iterateBlocks, Schem} from "../Schematic";
import nbt from "prismarine-nbt";
import * as fs from "node:fs";
import { promisify } from 'node:util';
// Node built-in gzip
import { gzip as nodeGzip } from "node:zlib";
import { gzipSync } from "node:zlib";
// Zopfli gzip
import { gzip as zopfliGzip } from "node-zopfli";
export type CompressionOptions =
    | { type?: "gzip" } // default
    | { type: "zopfli"; numiterations?: number }

export class SpongeV3SchematicWriter {

    schem: Schem
    compression: CompressionOptions

    constructor(
        schem: Schem,
        compression: CompressionOptions = { type: "gzip" } // default
    ) {
        this.schem = schem
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

        const blockEntities: any[] = []
        let intArray: number[] = []

        for (let block of iterateBlocks(this.schem)) {
            const index =
                block.x +
                (block.z + block.y * this.schem.getLength()) *
                this.schem.getWidth()

            const blockPallet = pallet.get(block.block.getMaterial())!

            if (block.block.getData()) {
                // @ts-ignore
                blockEntities.push({
                    Pos: nbt.intArray([block.x, block.y, block.z]),
                    // @ts-ignore
                    Id: block.block.getData()!["id"],
                    Data: nbt.comp(block.block.getData()!)
                })
            }

            intArray[index] = blockPallet
        }

        intArray = intArrayToVarintByteArray(intArray)

        const schemnbt = nbt.comp({
            Schematic: nbt.comp({
                Height: nbt.short(this.schem.getHeight()),
                Width: nbt.short(this.schem.getWidth()),
                Length: nbt.short(this.schem.getLength()),
                Version: nbt.int(3),
                Offset: nbt.intArray(this.schem.getOffset()),
                DataVersion: nbt.int(this.schem.getDataVersion()),
                Blocks: nbt.comp({
                    Palette: nbt.comp(palletObj),
                    BlockEntities: nbt.list(nbt.comp(blockEntities)),
                    Data: nbt.byteArray(intArray),
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

        let blocks = [...iterateBlocks(this.schem)].map(x => x.block.getMaterial())
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