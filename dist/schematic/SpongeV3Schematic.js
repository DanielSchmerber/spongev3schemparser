"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchematicV3 = void 0;
const Schematic_1 = require("./Schematic");
function byteArrayToVarintArray(byteArray) {
    const varintArray = [];
    let i = 0;
    while (i < byteArray.length) {
        let value = 0;
        let varintLength = 0;
        while (true) {
            value |= (byteArray[i] & 127) << (varintLength++ * 7);
            if (varintLength > 5)
                throw new Error('VarInt too big (probably corrupted data)');
            if ((byteArray[i++] & 128) !== 128)
                break;
        }
        varintArray.push(value);
    }
    return varintArray;
}
class SchematicV3 {
    constructor(nbt) {
        this.nbt = nbt;
        this.pallet = new Map();
        this.dataMap = new Map();
        for (const blockEntity of nbt.value.Schematic.value.Blocks.value.BlockEntities.value.value) {
            this.dataMap.set(`${blockEntity.Pos.value}`, blockEntity.Data.value);
        }
        let tempPallet = nbt.value.Schematic.value.Blocks.value.Palette.value;
        for (const temp in tempPallet) {
            this.pallet.set(tempPallet[temp].value, temp);
        }
        //unpack varint array
        this.nbt.value.Schematic.value.Blocks.value.Data.value = byteArrayToVarintArray(this.nbt.value.Schematic.value.Blocks.value.Data.value);
    }
    getBlockAt(x, y, z) {
        let index = x + (z + y * this.getLength()) * this.getWidth();
        let pallet = this.pallet;
        let nbt = this.nbt;
        let dataMap = this.dataMap;
        let tempBlock = {
            getMaterial() {
                var _a;
                return (_a = pallet.get(nbt.value.Schematic.value.Blocks.value.Data.value[index])) !== null && _a !== void 0 ? _a : "nothing";
            },
            getData() {
                var _a;
                return (_a = dataMap.get(`${[x, y, z]}`)) !== null && _a !== void 0 ? _a : null;
            },
        };
        tempBlock.toString = () => tempBlock.getMaterial() + (tempBlock.getData() ? `[${JSON.stringify(tempBlock.getData())}]` : "");
        return new Schematic_1.BlockWrapper(tempBlock);
    }
    getHeight() {
        return this.nbt.value.Schematic.value.Height.value;
    }
    getWidth() {
        return this.nbt.value.Schematic.value.Width.value;
    }
    getLength() {
        return this.nbt.value.Schematic.value.Length.value;
    }
    getDataVersion() {
        return this.nbt.value.Schematic.value.DataVersion.value;
    }
    getOffset() {
        return this.nbt.value.Schematic.value.Offset.value;
    }
}
exports.SchematicV3 = SchematicV3;
