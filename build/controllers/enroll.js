"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.course_drop = exports.enroll_student = void 0;
const course_service_1 = require("../service/course.service");
const courseInstructor_service_1 = require("../service/courseInstructor.service");
const enroll_service_1 = require("../service/enroll.service");
const student_service_1 = require("../service/student.service");
const enroll_student = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { course, studentId } = req.body;
    if (!course || !studentId) {
        return res.status(400).json({
            message: 'course code and student id Required field'
        });
    }
    try {
        const find_course = yield (0, course_service_1.findOneCourse)({ code: course });
        if (!find_course) {
            throw {
                message: 'No course exists with this code!'
            };
        }
        const find_student = yield (0, student_service_1.findOneStudent)({ studentId: studentId }, { lean: false });
        if (!find_student) {
            throw {
                message: 'No student with this id!'
            };
        }
        const find_instructor = yield (0, courseInstructor_service_1.findOneInstructor)({ course: find_course._id });
        if (!find_instructor) {
            throw {
                message: 'No instructor with this name taking courses!'
            };
        }
        const find_enroll = yield (0, enroll_service_1.findOneEnroll)({ instructor: find_instructor._id }, { lean: false }).populate('student');
        let already_enrolled = find_enroll === null || find_enroll === void 0 ? void 0 : find_enroll.student.find((value) => {
            return value.id == find_student.id;
        });
        if (already_enrolled) {
            throw {
                message: 'You already enrolled in this course'
            };
        }
        if (countCredit(find_student.creditTaken, find_course.credit, 'add') > find_student.creditAssign) {
            throw {
                message: 'You can not take this code, credit limits'
            };
        }
        let enroll;
        if (!find_enroll) {
            enroll = yield (0, enroll_service_1.enrollStudent)({ instructor: find_instructor._id, student: [find_student._id] });
        }
        else {
            yield (0, enroll_service_1.findAndUpdate)({ _id: find_enroll._id }, { student: [...find_enroll.student, find_student._id] });
        }
        yield find_student.updateOne({ creditTaken: countCredit(find_student.creditTaken, find_course.credit, 'add') });
        return res.status(201).send({
            status: 'SUCESS',
            message: `${find_student.name} enrolled in ${find_course.name} successfully!`
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'FAILED',
            message: error
        });
    }
});
exports.enroll_student = enroll_student;
const course_drop = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { course, studentId } = req.body;
    if (!course || !studentId) {
        return res.status(400).json({
            message: 'course code and student id Required field'
        });
    }
    try {
        const find_course = yield (0, course_service_1.findOneCourse)({ code: course });
        if (!find_course) {
            throw {
                message: 'No course exists with this code!'
            };
        }
        const find_student = yield (0, student_service_1.findOneStudent)({ studentId: studentId }, { lean: false });
        if (!find_student) {
            throw {
                message: 'No student with this id!'
            };
        }
        const find_instructor = yield (0, courseInstructor_service_1.findOneInstructor)({ course: find_course._id });
        if (!find_instructor) {
            throw {
                message: 'No instructor with this name taking courses!'
            };
        }
        const find_enroll = yield (0, enroll_service_1.findOneEnroll)({ instructor: find_instructor._id, student: find_student._id }, { lean: false }).populate('student');
        if (!find_enroll) {
            throw {
                message: 'You did not enroll in this course!'
            };
        }
        //Drop the student from course
        let drop_student = find_enroll.student.filter((value) => value.id != find_student.id);
        yield (0, enroll_service_1.findAndUpdate)({ instructor: find_instructor._id, student: find_student._id }, { student: drop_student }, { lean: false });
        yield find_student.updateOne({ creditTaken: countCredit(find_student.creditTaken, find_course.credit, 'sub') });
        return res.status(200).send({
            status: 'SUCESS',
            message: `${find_student.name} drop from ${find_course.name} successfully!`
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'FAILED',
            message: error
        });
    }
});
exports.course_drop = course_drop;
/** Custom Function */
function countCredit(fetchCredit, addCredit, operaton) {
    let credit = 0;
    switch (operaton) {
        case 'add':
            credit = fetchCredit + addCredit;
            break;
        case 'sub':
            credit = fetchCredit - addCredit;
            break;
        default:
            break;
    }
    return credit;
}
//# sourceMappingURL=enroll.js.map