import {NBT} from "prismarine-nbt";
import {Block, BlockWrapper} from "./Schematic";

function byteArrayToVarintArray (byteArray : number[]) {
    const varintArray = []
    let i = 0
    while (i < byteArray.length) {
        let value = 0
        let varintLength = 0
        while (true) {
            value |= (byteArray[i] & 127) << (varintLength++ * 7)
            if (varintLength > 5) throw new Error('VarInt too big (probably corrupted data)')
            if ((byteArray[i++] & 128) !== 128) break
        }
        varintArray.push(value)
    }
    return varintArray
}


export class SchematicV3 {
    public pallet: Map<number, string>;
    public dataMap: Map<string, NBT>;

    constructor(private nbt: any) {
        this.pallet = new Map();

        this.dataMap = new Map<string, NBT>();
        try {
            for (const blockEntity of nbt.value.Schematic.value.Blocks.value.BlockEntities.value.value) {
                this.dataMap.set(`${blockEntity.Pos.value}`, blockEntity.Data.value)
            }
        }catch (e){

        }


        let tempPallet = nbt.value.Schematic.value.Blocks.value.Palette.value;

        for (const temp in tempPallet) {
            this.pallet.set(tempPallet[temp].value, temp)
        }
        //unpack varint array
        this.nbt.value.Schematic.value.Blocks.value.Data.value = byteArrayToVarintArray(this.nbt.value.Schematic.value.Blocks.value.Data.value)
    }

    getBlockAt(x: number, y: number, z: number): BlockWrapper {
        let index = x + (z + y * this.getLength()) * this.getWidth()
        let pallet = this.pallet;
        let nbt = this.nbt;
        let dataMap = this.dataMap;
        let tempBlock = {

            getMaterial() {
                return pallet.get(nbt.value.Schematic.value.Blocks.value.Data.value[index]) ?? "nothing"
            },
            getData() {
                return dataMap.get(`${[x, y, z]}`) ?? null
            },

        }

        tempBlock.toString = () => tempBlock.getMaterial() + (tempBlock.getData() ? `[${JSON.stringify(tempBlock.getData())}]` : "")

        return new BlockWrapper(tempBlock)

    }

    getHeight() {
        return this.nbt.value.Schematic.value.Height.value
    }

    getWidth() {
        return this.nbt.value.Schematic.value.Width.value
    }

    getLength() {
        return this.nbt.value.Schematic.value.Length.value
    }

    getDataVersion(){
        return this.nbt.value.Schematic.value.DataVersion.value
    }
    getOffset(){
        return this.nbt.value.Schematic.value.Offset.value
    }
}

