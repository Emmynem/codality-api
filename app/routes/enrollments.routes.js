import { checks } from "../middleware/index.js";
import { enrollments_rules } from "../rules/enrollments.rules.js";
import { user_rules } from "../rules/users.rules.js";
import { courses_rules } from "../rules/courses.rules.js";
import { default_rules } from "../rules/default.rules.js";
import {
	rootGetEnrollment, rootGetEnrollments, rootGetEnrollmentsSpecifically, userGetEnrollment, userGetEnrollments, userGetEnrollmentsSpecifically, 
	updateEnrollmentStatus
} from "../controllers/enrollments.controller.js";

export default function (app) {
	app.get("/root/enrollments", [checks.verifyKey], rootGetEnrollments);
	app.get("/root/enrollments/via/user", [checks.verifyKey, user_rules.forFindingUserAlt], rootGetEnrollmentsSpecifically);
	app.get("/root/enrollments/via/course", [checks.verifyKey, courses_rules.forFindingCourseAlt], rootGetEnrollmentsSpecifically);
	app.get("/root/enrollment", [checks.verifyKey, enrollments_rules.forFindingEnrollmentInternal], rootGetEnrollment);

	app.get("/enrollments", [checks.verifyToken, checks.isUser], userGetEnrollments);
	app.get("/enrollment", [checks.verifyToken, checks.isUser, enrollments_rules.forFindingEnrollment], userGetEnrollment);

	app.put("/enrollment/status", [checks.verifyToken, checks.isUser, enrollments_rules.forUpdatingEnrollmentStatus], updateEnrollmentStatus);

};
