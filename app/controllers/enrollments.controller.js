import { validationResult, matchedData } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { ServerError, SuccessResponse, ValidationError, OtherSuccessResponse, NotFoundError, CreationSuccessResponse, BadRequestError, logger } from '../common/index.js';
import {
	default_delete_status, default_status, true_status, false_status, paginate, tag_root, email_templates, return_all_letters_uppercase, random_uuid
} from '../config/config.js';
import db from "../models/index.js";

const ENROLLMENTS = db.enrollments;
const COURSES = db.courses;
const USERS = db.users;
const Op = db.Sequelize.Op;

export async function rootGetEnrollments(req, res) {
	const total_records = await ENROLLMENTS.count();
	const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
	const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
	const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

	ENROLLMENTS.findAndCountAll({
		attributes: { exclude: ['id'] },
		order: [
			[orderBy, sortBy]
		],
		include: [
			{
				model: USERS,
				attributes: ['unique_id', 'firstname', 'middlename', 'lastname', 'email', 'profile_image']
			},
			{
				model: COURSES,
				attributes: ['unique_id', 'title', 'reference', 'certificate', 'amount']
			},
		],
		distinct: true,
		offset: pagination.start,
		limit: pagination.limit
	}).then(enrollments => {
		if (!enrollments || enrollments.length === 0) {
			SuccessResponse(res, { unique_id: tag_root, text: "Enrollments Not found" }, []);
		} else {
			SuccessResponse(res, { unique_id: tag_root, text: "Enrollments loaded" }, { ...enrollments, pages: pagination.pages });
		}
	}).catch(err => {
		ServerError(res, { unique_id: tag_root, text: err.message }, null);
	});
};

export function rootGetEnrollment(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		ENROLLMENTS.findOne({
			attributes: { exclude: ['id'] },
			where: {
				...payload
			},
			include: [
				{
					model: USERS,
					attributes: ['unique_id', 'firstname', 'middlename', 'lastname', 'email', 'profile_image']
				},
				{
					model: COURSES,
					attributes: ['unique_id', 'title', 'reference', 'certificate', 'amount', 'content']
				},
			],
		}).then(chat => {
			if (!chat) {
				NotFoundError(res, { unique_id: tag_root, text: "Enrollment not found" }, null);
			} else {
				SuccessResponse(res, { unique_id: tag_root, text: "Enrollment loaded" }, chat);
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function rootGetEnrollmentsSpecifically(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await ENROLLMENTS.count({ where: { ...payload } });
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
		const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		ENROLLMENTS.findAndCountAll({
			attributes: { exclude: ['id'] },
			where: {
				...payload
			},
			order: [
				[orderBy, sortBy]
			],
			include: [
				{
					model: USERS,
					attributes: ['unique_id', 'firstname', 'middlename', 'lastname', 'email', 'profile_image']
				},
				{
					model: COURSES,
					attributes: ['unique_id', 'title', 'reference', 'certificate', 'amount']
				},
			],
			distinct: true,
			offset: pagination.start,
			limit: pagination.limit
		}).then(enrollments => {
			if (!enrollments || enrollments.length === 0) {
				SuccessResponse(res, { unique_id: tag_root, text: "Enrollments Not found" }, []);
			} else {
				SuccessResponse(res, { unique_id: tag_root, text: "Enrollments loaded" }, { ...enrollments, pages: pagination.pages });
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function userGetEnrollments(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const total_records = await ENROLLMENTS.count({ where: { user_unique_id: user_unique_id } });
	const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
	const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
	const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

	ENROLLMENTS.findAndCountAll({
		attributes: { exclude: ['id'] },
		where: {
			user_unique_id: user_unique_id
		},
		order: [
			[orderBy, sortBy]
		],
		include: [
			{
				model: COURSES,
				attributes: ['unique_id', 'title', 'reference', 'certificate', 'amount']
			},
		],
		offset: pagination.start,
		limit: pagination.limit
	}).then(enrollments => {
		if (!enrollments || enrollments.length === 0) {
			SuccessResponse(res, { unique_id: user_unique_id, text: "Enrollments Not found" }, []);
		} else {
			SuccessResponse(res, { unique_id: user_unique_id, text: "Enrollments loaded" }, { ...enrollments, pages: pagination.pages });
		}
	}).catch(err => {
		ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
	});
};

export function userGetEnrollment(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		ENROLLMENTS.findOne({
			attributes: { exclude: ['id'] },
			where: {
				...payload,
				user_unique_id: user_unique_id
			},
			include: [
				{
					model: COURSES,
					attributes: ['unique_id', 'title', 'reference', 'certificate', 'amount', 'content']
				},
			],
		}).then(async chat => {
			if (!chat) {
				NotFoundError(res, { unique_id: user_unique_id, text: "Enrollment not found" }, null);
			} else {
				SuccessResponse(res, { unique_id: user_unique_id, text: "Enrollment loaded" }, chat);
			}
		}).catch(err => {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		});
	}
};

export async function userGetEnrollmentsSpecifically(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await ENROLLMENTS.count({ where: { ...payload, user_unique_id: user_unique_id } });
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
		const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		ENROLLMENTS.findAndCountAll({
			attributes: { exclude: ['id'] },
			where: {
				...payload,
				user_unique_id: user_unique_id
			},
			order: [
				[orderBy, sortBy]
			],
			offset: pagination.start,
			limit: pagination.limit
		}).then(enrollments => {
			if (!enrollments || enrollments.length === 0) {
				SuccessResponse(res, { unique_id: user_unique_id, text: "Enrollments Not found" }, []);
			} else {
				SuccessResponse(res, { unique_id: user_unique_id, text: "Enrollments loaded" }, { ...enrollments, pages: pagination.pages });
			}
		}).catch(err => {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		});
	}
};

export async function updateEnrollmentStatus(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			await db.sequelize.transaction(async (transaction) => {
				const enrollment = await ENROLLMENTS.update(
					{
						...payload,
					}, {
						where: {
							unique_id: payload.unique_id,
							status: default_status
						},
						transaction
					}
				);

				if (enrollment > 0) {
					SuccessResponse(res, { unique_id: tag_root, text: "Details updated successfully!" }, null);
				} else {
					throw new Error("Course not found");
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		}
	}
};