import varint from 'varint';
import nbt, {NBT} from "prismarine-nbt";
import {readSchematic} from "./reader/spongeV3Schematicreader";
import assert from "node:assert";
import {isDeepStrictEqual} from "node:util";


export class SchematicWrapper implements Schem {
    private overrides: Map<string, Block>;
    protected width?: number;
    protected height?: number;
    protected length?: number;

    constructor(private schem: Schem) {
        this.overrides = new Map();
    }

    // ---------- Size setters ----------

    setWidth(width: number) {
        this.width = width;
    }

    setHeight(height: number) {
        this.height = height;
    }

    setLength(length: number) {
        this.length = length;
    }

    // ---------- Size getters ----------

    getWidth() {
        return this.width ?? this.schem.getWidth();
    }

    getHeight() {
        return this.height ?? this.schem.getHeight();
    }

    getLength() {
        return this.length ?? this.schem.getLength();
    }

    // ---------- Block handling ----------

    getBlockAt(x: number, y: number, z: number) {
        if (!this.isInsideBounds(x, y, z)) {
            return NOTHING;
        }

        return this.overrides.get(`${x},${y},${z}`)
            ?? this.schem.getBlockAt(x, y, z);
    }

    setBlock(x: number, y: number, z: number, block: Block) {
        if (!this.isInsideBounds(x, y, z)) return;
        this.overrides.set(`${x},${y},${z}`, block);
    }

    private isInsideBounds(x: number, y: number, z: number) {
        return (
            x >= 0 && y >= 0 && z >= 0 &&
            x < this.getWidth() &&
            y < this.getHeight() &&
            z < this.getLength()
        );
    }

    // ---------- Delegate ----------

    getDataVersion() {
        return this.schem.getDataVersion();
    }

    getOffset() {
        return this.schem.getOffset();
    }

    getBlocks() {
        return iterateBlocks(this);
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

    equals(other:Block){
        return blocksEqual(this,other)
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

export function blocksEqual(a: Block, b: Block): boolean {
    if (a.getMaterial() !== b.getMaterial()) return false

    const dataA = a.getData()
    const dataB = b.getData()

    if (dataA == null && dataB == null) return true
    if (dataA == null || dataB == null) return false

    return isDeepStrictEqual(dataA, dataB)
}