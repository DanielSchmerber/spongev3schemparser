"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchematicDiff = void 0;
const Schematic_1 = require("../Schematic");
const EmptySchematic_1 = require("../EmptySchematic");
class SchematicDiff {
    constructor(before, after) {
        this.before = before;
        this.after = after;
        this.beforeBlocks = new Schematic_1.SchematicWrapper(new EmptySchematic_1.EmptySchematic(this.before.getWidth(), this.before.getHeight(), this.before.getLength()));
        this.afterBlocks = new Schematic_1.SchematicWrapper(new EmptySchematic_1.EmptySchematic(this.after.getWidth(), this.after.getHeight(), this.after.getLength()));
        this.calculateSchems();
    }
    calculateSchems() {
        let diffs = 0;
        for (let x = 0; x < this.before.getWidth(); x++) {
            for (let y = 0; y < this.before.getHeight(); y++) {
                for (let z = 0; z < this.before.getLength(); z++) {
                    let beforeBlock = this.before.getBlockAt(x, y, z);
                    let afterBlock = this.after.getBlockAt(x, y, z);
                    if (!(0, Schematic_1.blocksEqual)(beforeBlock, afterBlock)) {
                        this.beforeBlocks.setBlock(x, y, z, this.before.getBlockAt(x, y, z));
                        this.afterBlocks.setBlock(x, y, z, this.after.getBlockAt(x, y, z));
                    }
                }
            }
        }
    }
    *diffs() {
        for (let x = 0; x < this.before.getWidth(); x++) {
            for (let y = 0; y < this.before.getHeight(); y++) {
                for (let z = 0; z < this.before.getLength(); z++) {
                    let beforeBlock = this.before.getBlockAt(x, y, z);
                    let afterBlock = this.after.getBlockAt(x, y, z);
                    if (!(0, Schematic_1.blocksEqual)(beforeBlock, afterBlock)) {
                        yield {
                            pos: [x, y, z],
                            before: beforeBlock,
                            after: afterBlock,
                        };
                    }
                }
            }
        }
    }
}
exports.SchematicDiff = SchematicDiff;
