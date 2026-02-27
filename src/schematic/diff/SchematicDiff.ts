import {Block, blocksEqual, Schem, SchematicWrapper} from "../Schematic";
import {EmptySchematic} from "../EmptySchematic";
import {isDeepStrictEqual} from "node:util";



export class SchematicDiff {
    public after: Schem;
    public before: Schem;
    
    public beforeBlocks : SchematicWrapper
    public afterBlocks : SchematicWrapper

    constructor( before : Schem,  after : Schem) {
        this.before = before
        this.after = after

        this.beforeBlocks = new SchematicWrapper(new EmptySchematic(this.before.getWidth(),this.before.getHeight(),this.before.getLength()))
        this.afterBlocks = new SchematicWrapper(new EmptySchematic(this.after.getWidth(),this.after.getHeight(),this.after.getLength()))

        this.calculateSchems();
    }

    calculateSchems(){

        let diffs = 0;

        for(let x = 0; x < this.before.getWidth(); x++ ) {
            for(let y = 0; y < this.before.getHeight(); y++ ) {
                for(let z = 0; z < this.before.getLength(); z++ ) {

                    let beforeBlock = this.before.getBlockAt(x,y,z)
                    let afterBlock = this.after.getBlockAt(x,y,z)

                    if(!blocksEqual(beforeBlock,afterBlock)){

                        this.beforeBlocks.setBlock(x,y,z,this.before.getBlockAt(x,y,z))
                        this.afterBlocks.setBlock(x,y,z,this.after.getBlockAt(x,y,z))


                    }

                }
            }
        }

    }

    *diffs(){
        for(let x = 0; x < this.before.getWidth(); x++ ) {
            for(let y = 0; y < this.before.getHeight(); y++ ) {
                for(let z = 0; z < this.before.getLength(); z++ ) {

                    let beforeBlock = this.before.getBlockAt(x,y,z)
                    let afterBlock = this.after.getBlockAt(x,y,z)

                    if(!blocksEqual(beforeBlock,afterBlock)){

                        yield {
                            pos: [x,y,z],
                            before: beforeBlock,
                            after: afterBlock,
                        }


                    }

                }
            }
        }
    }
    
    



}