import {blocksEqual, Schem, SchematicWrapper} from "../Schematic";
import {SchematicDiff} from "./SchematicDiff";

function applySchematicDiff(
    base: Schem,
    diff: SchematicDiff,
    direction: "forward" | "backward"
): Schem {
    const wrapped = new SchematicWrapper(base)

    for (const change of diff.diffs()) {
        const [x, y, z] = change.pos

        const expected = direction === "forward"
            ? change.before
            : change.after

        const replacement = direction === "forward"
            ? change.after
            : change.before

        const current = wrapped.getBlockAt(x, y, z)

        if (!blocksEqual(current, expected)) {

            throw new Error(
                `Block at ${x},${y},${z} does not match expected state! expected: ${expected.getMaterial()}, got: ${current.getMaterial()}`
            )
        }

        wrapped.setBlock(x, y, z, replacement)
    }

    return wrapped
}

export function applyChanges(base: Schem, diff: SchematicDiff): Schem {
    return applySchematicDiff(base, diff, "forward")
}

export function revertChanges(base: Schem, diff: SchematicDiff): Schem {
    return applySchematicDiff(base, diff, "backward")
}