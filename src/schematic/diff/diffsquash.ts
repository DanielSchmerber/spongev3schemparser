//dumb squash function
import {SchematicDiff} from "./SchematicDiff";

function squashDiffs(older : SchematicDiff, newer : SchematicDiff){
    return new SchematicDiff(older.before,newer.after)
}