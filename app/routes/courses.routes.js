import { checks } from "../middleware/index.js";
import { courses_rules } from "../rules/courses.rules.js";
import { default_rules } from "../rules/default.rules.js";
import {
	addCourse, deleteCourse, publicGetCourse, publicGetCourses, publicSearchCourses, rootGetCourse, rootGetCourses, rootGetCoursesSpecifically, 
	rootSearchCourses, updateCourseDetails, updateCourseImage
} from "../controllers/courses.controller.js";

export default function (app) {
	app.get("/root/courses", [checks.verifyKey], rootGetCourses);
	app.get("/root/courses/via/reference", [checks.verifyKey, courses_rules.forFindingViaReference], rootGetCoursesSpecifically);
	app.get("/root/search/courses", [checks.verifyKey, default_rules.forSearching], rootSearchCourses);
	app.get("/root/course", [checks.verifyKey, courses_rules.forFindingCourseInternal], rootGetCourse);
	
	app.get("/public/courses", publicGetCourses);
	app.get("/public/course", [courses_rules.forFindingCourse], publicGetCourse);
	app.get("/public/search/courses", [default_rules.forSearching], publicSearchCourses);
	app.get("/public/course/via/reference", [courses_rules.forFindingViaReference], publicGetCourse);
	
	app.post("/add/course", [checks.verifyKey, courses_rules.forAdding], addCourse);

	app.put("/update/course/details", [checks.verifyKey, courses_rules.forFindingCourse, courses_rules.forUpdating], updateCourseDetails);
	app.put("/update/course/image", [checks.verifyKey, courses_rules.forFindingCourse, courses_rules.forUpdatingImage], updateCourseImage);

	app.delete("/course", [checks.verifyKey, courses_rules.forFindingCourse], deleteCourse);
};
