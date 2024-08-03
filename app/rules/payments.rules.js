import { check } from 'express-validator';
import moment from 'moment';
import db from "../models/index.js";
import {
	default_status, check_length_TEXT, strip_text, validate_future_date, validate_future_end_date,
	default_delete_status, validate_payment_method, payment_methods, validate_past_date, validate_gateway, gateways
} from '../config/config.js';

const USERS = db.users;
const COURSES = db.courses;
const PAYMENTS = db.payments;

export const payment_rules = {
	forFindingPayment: [
		check('unique_id', "Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom((unique_id, { req }) => {
				return PAYMENTS.findOne({
					where: {
						unique_id,
						status: default_status
					}
				}).then(data => {
					if (!data) return Promise.reject('Payment not found!');
				});
			})
	],
	forFindingPaymentFalsy: [
		check('user_unique_id', "User Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom(user_unique_id => {
				return USERS.findOne({ where: { unique_id: user_unique_id, status: default_status } }).then(data => {
					if (!data) return Promise.reject('User not found!');
				});
			}),
		check('unique_id', "Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom((unique_id, { req }) => {
				return PAYMENTS.findOne({
					where: {
						unique_id,
						user_unique_id: req.query.user_unique_id || req.body.user_unique_id || '',
						status: default_delete_status
					}
				}).then(data => {
					if (!data) return Promise.reject('Payment not found!');
				});
			})
	],
	forFindingPaymentAlt: [
		check('payment_unique_id', "Payment Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom(payment_unique_id => {
				return PAYMENTS.findOne({ where: { unique_id: payment_unique_id, status: default_status } }).then(data => {
					if (!data) return Promise.reject('Payment not found!');
				});
			})
	],
	forAdding: [
		check('course_unique_id', "Course Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom(course_unique_id => {
				return COURSES.findOne({ where: { unique_id: course_unique_id, status: default_status } }).then(data => {
					if (!data) return Promise.reject('Course not found!');
				});
			}),
		check('gateway', "Gateway is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom(gateway => !!validate_gateway(gateway))
			.withMessage(`Invalid gateway, accepts - ${gateways.paystack + ", " + gateways.squad + ", " + gateways.internal}`),
		check('reference')
			.optional({ checkFalsy: false }),
		check('payment_status', "Payment Status is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.isString().isLength({ min: 3, max: 50 })
			.withMessage("Invalid length (3 - 50) characters")
	],
	forAddingMultiple: [
		check('gateway', "Gateway is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom(gateway => !!validate_gateway(gateway))
			.withMessage(`Invalid gateway, accepts - ${gateways.paystack + ", " + gateways.squad + ", " + gateways.internal}`),
		check('reference')
			.optional({ checkFalsy: false }),
		check('courses', "Courses are required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.isArray({ min: 1 })
			.withMessage("Must be an array of course unique id strings (not empty)"),
	],
	forUpdatingStatus: [
		check('payment_status', "Payment Status is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.isString().isLength({ min: 3, max: 50 })
			.withMessage("Invalid length (3 - 50) characters")
	],
	forFindingViaType: [
		check('type', "Type is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.isString().isLength({ min: 3, max: 50 })
			.withMessage("Invalid length (3 - 50) characters")
	],
	forFindingViaGateway: [
		check('gateway', "Gateway is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom(gateway => !!validate_gateway(gateway))
			.withMessage(`Invalid gateway, accepts - ${gateways.paystack + ", " + gateways.squad + ", " + gateways.internal}`),
	],
	forFindingViaPaymentStatus: [
		check('payment_status', "Payment Status is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.isString().isLength({ min: 3, max: 50 })
			.withMessage("Invalid length (3 - 50) characters")
	],
	forFindingViaReference: [
		check('reference', "Reference is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
	],
	forFiltering: [
		check('start_date', "Start Date is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom(start_date => {
				const later = moment(start_date, "YYYY-MM-DD", true);
				return later.isValid();
			})
			.withMessage("Invalid start datetime format (YYYY-MM-DD)")
			.bail()
			.custom(start_date => !!validate_past_date(start_date))
			.withMessage("Invalid start datetime"),
		check('end_date', "End Date is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom(end_date => {
				const later = moment(end_date, "YYYY-MM-DD", true);
				return later.isValid();
			})
			.withMessage("Invalid end datetime format (YYYY-MM-DD)")
			.bail()
			.custom((end_date, { req }) => !!validate_future_end_date(req.query.start_date || req.body.start_date || '', end_date))
			.withMessage("Invalid end datetime"),
	],
};  