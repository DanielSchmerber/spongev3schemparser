"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyChanges = applyChanges;
exports.revertChanges = revertChanges;
const Schematic_1 = require("../Schematic");
function applySchematicDiff(base, diff, direction) {
    const wrapped = new Schematic_1.SchematicWrapper(base);
    for (const change of diff.diffs()) {
        const [x, y, z] = change.pos;
        const expected = direction === "forward"
            ? change.before
            : change.after;
        const replacement = direction === "forward"
            ? change.after
            : change.before;
        const current = wrapped.getBlockAt(x, y, z);
        if (!(0, Schematic_1.blocksEqual)(current, expected)) {
            throw new Error(`Block at ${x},${y},${z} does not match expected state! expected: ${expected.getMaterial()}, got: ${current.getMaterial()}`);
        }
        wrapped.setBlock(x, y, z, replacement);
    }
    return wrapped;
}
function applyChanges(base, diff) {
    return applySchematicDiff(base, diff, "forward");
}
function revertChanges(base, diff) {
    return applySchematicDiff(base, diff, "backward");
}
