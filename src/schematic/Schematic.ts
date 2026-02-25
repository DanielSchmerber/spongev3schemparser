import varint from 'varint';
import nbt, {NBT} from "prismarine-nbt";
import {readSchematic} from "./reader/spongeV3Schematicreader";

export class SchematicWrapper{
    private overrides: Map<string, Block>;
    constructor(private schem : Schem){
        this.overrides = new Map()
    }

    getBlockAt(x:number,y:number,z:number){
        return new BlockWrapper(this.overrides.get(`${x},${y},${z}`) ?? this.schem.getBlockAt(x,y,z))
    }

    setBlock(x: number,y:number,z:number,block:Block){
        this.overrides.set(`${x},${y},${z}`,block)
    }

    getWidth(){
        return this.schem.getWidth()
    }
    getHeight(){
        return this.schem.getHeight()
    }
    getLength(){
        return this.schem.getLength()
    }
    getDataVersion(){
        return this.schem.getDataVersion()
    }
    getOffset(){
        return this.schem.getOffset()
    }
    getBlocks(){
        return iterateBlocks(this.schem)
    }
}

export class BlockWrapper{
    constructor(private block : Block){

    }

    getMaterial(){
        return this.block.getMaterial()
    }
    getData(){
        return this.block.getData()
    }

    getSimpleData() {
        try{
            // @ts-ignore
            return nbt.simplify(nbt.comp(this.getData())!)
        }catch (e){
            return null
        }
    }
}

export interface Schem{
  getBlockAt(x:number,y:number,z:number): Block
  getWidth():number
  getHeight():number
  getLength():number
    getDataVersion():number
    getOffset():number[]
}

export function* iterateBlocks(schem: Schem) {
    for (let x = 0; x < schem.getWidth(); x++) {
        for (let y = 0; y < schem.getHeight(); y++) {
            for (let z = 0; z < schem.getLength(); z++) {
                yield {
                    x,
                    y,
                    z,
                    block: schem.getBlockAt(x, y, z),
                }
            }
        }
    }
}

export interface Block{
    getMaterial():string
    getData():NBT | null
}

export let NOTHING: Block = {
    getMaterial():string{return "nothing"},
    getData():NBT | null{return null}
}
type ReadSchematicFn = (schem: Buffer) => SchematicWrapper;
type WriteSchematicFn = (schem: Schem) => Buffer;


export function readSchematicFromBuf(buf : Buffer){
    let readers : ReadSchematicFn[] = [readSchematic]

    for(let reader of readers){
        try{
            return reader(buf)
        }catch(e){

        }
    }

}

export function blocksEqual(a:Block,b:Block){
    return a.getMaterial() == b.getMaterial() && JSON.stringify(a.getData()) == JSON.stringify(b.getData())
}
