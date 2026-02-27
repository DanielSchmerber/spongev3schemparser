"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//dumb squash function
const SchematicDiff_1 = require("./SchematicDiff");
function squashDiffs(older, newer) {
    return new SchematicDiff_1.SchematicDiff(older.before, newer.after);
}
