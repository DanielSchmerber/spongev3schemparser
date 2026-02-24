import {iterateBlocks, Schem} from "../Schematic";
import nbt from "prismarine-nbt";
import * as fs from "node:fs";
import { promisify } from 'node:util';
// Node built-in gzip
import { gzip as nodeGzip } from "node:zlib";

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

    async writeSchematic(){
        let pallet = this.createPallet();
        let palletObj = [...pallet.entries()].reduce(
            (acc, [key, value]) => {
                // @ts-ignore
                acc[key] = nbt.int(value)
                return acc
            },
            Object.create(null) // ← safe accumulator
        )

        let blockEntities = []
        let intArray = []
        //Write blockdata
        for(let block of iterateBlocks(this.schem)){
            let index = block.x + (block.z + block.y * this.schem.getLength()) * this.schem.getWidth()
            let blockPallet = pallet.get(block.block.getMaterial())!

            if (block.block.getData()) {
                const data = block.block.getData()!

                blockEntities.push(

                    {
                        Pos: nbt.intArray([block.x, block.y, block.z]),
                        //@ts-ignore
                        Id: block.block.getData()!["id"],
                        Data: nbt.comp(block.block.getData()!)
                    }


                )
            }

            intArray[index] = (blockPallet)
        }
        intArray = intArrayToVarintByteArray(intArray)
        let schemnbt = nbt.comp(
            {
                Schematic:nbt.comp({
                    Height: nbt.short(this.schem.getHeight()),
                    Width: nbt.short(this.schem.getWidth()),
                    Length: nbt.short(this.schem.getLength()),
                    Version: nbt.int(3),
                    Offset : nbt.intArray(this.schem.getOffset()),
                    DataVersion : nbt.int(this.schem.getDataVersion()),
                    Blocks: nbt.comp(
                        {
                            Palette: nbt.comp(palletObj),
                            BlockEntities:nbt.list(nbt.comp(blockEntities)),
                            Data:nbt.byteArray(intArray),
                        }
                    ),
                    Entities:nbt.list(nbt.comp([])),
                })
            }
        )






        // @ts-ignore
        const raw = nbt.writeUncompressed(schemnbt)
        let buf: Buffer

        if (this.compression.type === "zopfli") {


            buf = await zopfliGzip(raw, {
                verbose: false,
                numiterations: this.compression.numiterations ?? 2,
            }) as Buffer

        } else {

            const gzipAsync = promisify(nodeGzip)

            buf = await gzipAsync(raw)
        }




        //@ts-ignore
        fs.writeFileSync("schem.schem", buf)



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