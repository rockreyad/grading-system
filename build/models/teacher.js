"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const teacherSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
const TeacherModel = (0, mongoose_1.model)('Teacher', teacherSchema);
exports.default = TeacherModel;
//# sourceMappingURL=teacher.js.map