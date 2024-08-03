import { check } from 'express-validator';
import moment from 'moment';
import db from "../models/index.js";
import {
	default_status, check_length_TEXT, validate_future_date, validate_future_end_date, default_delete_status
} from '../config/config.js';

const COURSES = db.courses;
const Op = db.Sequelize.Op;

export const courses_rules = {
	forFindingCourseInternal: [
		check('unique_id', "Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom((unique_id, { req }) => {
				return COURSES.findOne({
					where: {
						unique_id
					}
				}).then(data => {
					if (!data) return Promise.reject('Course not found!');
				});
			})
	],
	forFindingCourse: [
		check('unique_id', "Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom((unique_id, { req }) => {
				return COURSES.findOne({
					where: {
						unique_id,
						status: default_status
					}
				}).then(data => {
					if (!data) return Promise.reject('Course not found!');
				});
			})
	],
	forFindingCourseFalsy: [
		check('unique_id', "Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom((unique_id, { req }) => {
				return COURSES.findOne({
					where: {
						unique_id,
						status: default_delete_status
					}
				}).then(data => {
					if (!data) return Promise.reject('Course not found!');
				});
			})
	],
	forFindingCourseAlt: [
		check('course_unique_id', "Course Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom(course_unique_id => {
				return COURSES.findOne({ where: { unique_id: course_unique_id, status: default_status } }).then(data => {
					if (!data) return Promise.reject('Course not found!');
				});
			})
	],
	forFindingViaReference: [
		check('reference', "Reference is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom(reference => {
				return COURSES.findOne({ where: { reference, status: default_status } }).then(data => {
					if (!data) return Promise.reject('Course not found!');
				});
			})
	],
	forAdding: [
		check('title', "Title is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.isString().isLength({ min: 3, max: 300 })
			.withMessage("Invalid length (3 - 300) characters"),
		check('file')
			.optional({ checkFalsy: false }),
		check('file_type')
			.optional({ checkFalsy: false }),
		check('file_public_id')
			.optional({ checkFalsy: false }),
		check('content', "Content is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.isLength({ min: 3, max: check_length_TEXT })
			.withMessage(`Invalid length (3 - ${check_length_TEXT}) characters`),
		check('certificate')
			.optional({ checkFalsy: false })
			.bail()
			.isString().isLength({ min: 3, max: 50 })
			.withMessage("Invalid length (3 - 50) characters"),
		check('amount', "Amount is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.isFloat()
			.custom(amount => {
				if (amount < 0) return false;
				else return true;
			})
			.withMessage("Amount invalid")
	],
	forUpdating: [
		check('title', "Title is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.isString().isLength({ min: 3, max: 300 })
			.withMessage("Invalid length (3 - 300) characters"),
		check('content', "Content is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.isLength({ min: 3, max: check_length_TEXT })
			.withMessage(`Invalid length (3 - ${check_length_TEXT}) characters`),
		check('certificate')
			.optional({ checkFalsy: false })
			.bail()
			.isString().isLength({ min: 3, max: 50 })
			.withMessage("Invalid length (3 - 50) characters"),
		check('amount', "Amount is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.isFloat()
			.custom(amount => {
				if (amount < 0) return false;
				else return true;
			})
			.withMessage("Amount invalid")
	],
	forUpdatingImage: [
		check('file', "File is required (url)")
			.exists({ checkNull: true, checkFalsy: true }),
		check('file_type', "File Type is required")
			.exists({ checkNull: true, checkFalsy: true }),
		check('file_public_id', "File Public Id is required")
			.exists({ checkNull: true, checkFalsy: true })
	],
};  