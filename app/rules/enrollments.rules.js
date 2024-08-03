import { check } from 'express-validator';
import moment from 'moment';
import db from "../models/index.js";
import {
	default_status, check_length_TEXT, validate_future_date, validate_future_end_date, default_delete_status
} from '../config/config.js';

const ENROLLMENTS = db.enrollments;
const Op = db.Sequelize.Op;

export const enrollments_rules = {
	forFindingEnrollmentInternal: [
		check('unique_id', "Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom((unique_id, { req }) => {
				return ENROLLMENTS.findOne({
					where: {
						unique_id
					}
				}).then(data => {
					if (!data) return Promise.reject('Enrollment not found!');
				});
			})
	],
	forFindingEnrollment: [
		check('unique_id', "Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom((unique_id, { req }) => {
				return ENROLLMENTS.findOne({
					where: {
						unique_id,
						status: default_status
					}
				}).then(data => {
					if (!data) return Promise.reject('Enrollment not found!');
				});
			})
	],
	forFindingEnrollmentFalsy: [
		check('unique_id', "Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom((unique_id, { req }) => {
				return ENROLLMENTS.findOne({
					where: {
						unique_id,
						status: default_delete_status
					}
				}).then(data => {
					if (!data) return Promise.reject('Enrollment not found!');
				});
			})
	],
	forFindingEnrollmentAlt: [
		check('enrollment_unique_id', "Enrollment Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom(enrollment_unique_id => {
				return ENROLLMENTS.findOne({ where: { unique_id: enrollment_unique_id, status: default_status } }).then(data => {
					if (!data) return Promise.reject('Enrollment not found!');
				});
			})
	],
	forUpdatingEnrollmentStatus: [
		check('enrollment_status', "Enrollment Status is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.isLength({ min: 3, max: 50 })
			.withMessage(`Invalid length (3 - ${50}) characters`)
	]
};  