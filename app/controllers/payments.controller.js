import { validationResult, matchedData } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import dotenv from 'dotenv';
import { ServerError, SuccessResponse, ValidationError, OtherSuccessResponse, NotFoundError, CreationSuccessResponse, BadRequestError, logger } from '../common/index.js';
import {
	default_delete_status, default_status, true_status, false_status, paginate, tag_root, email_templates, return_all_letters_uppercase, random_uuid,
	anonymous, zero, completed, processing, cancelled, refunded, payment_methods, gateways, transaction_types, mailer_url, return_all_letters_lowercase, 
	paystack_verify_payment_url, squad_sandbox_verify_payment_url, squad_live_verify_payment_url, return_enrollment_courses_array, app_defaults, return_bulk_payments_array, return_courses_from_payments
} from '../config/config.js';
import { user_cancel_payment, user_cancel_payment_via_reference, user_complete_payment } from '../config/templates.js';
import db from "../models/index.js";

dotenv.config();

const { clouder_key, cloudy_name, cloudy_key, cloudy_secret, cloud_mailer_key, host_type, smtp_host, cloud_mailer_username, cloud_mailer_password, from_email } = process.env;

const PAYMENTS = db.payments;
const COURSES = db.courses;
const ENROLLMENTS = db.enrollments;
const USERS = db.users;
const APP_DEFAULTS = db.app_defaults;
const Op = db.Sequelize.Op;

export async function rootGetPayments(req, res) {
	const total_records = await PAYMENTS.count();
	const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
	const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
	const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

	PAYMENTS.findAndCountAll({
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
	}).then(payments => {
		if (!payments || payments.length === 0) {
			SuccessResponse(res, { unique_id: tag_root, text: "Payments Not found" }, []);
		} else {
			SuccessResponse(res, { unique_id: tag_root, text: "Payments loaded" }, { ...payments, pages: pagination.pages });
		}
	}).catch(err => {
		ServerError(res, { unique_id: tag_root, text: err.message }, null);
	});
};

export function rootGetPayment(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		PAYMENTS.findOne({
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
					attributes: ['unique_id', 'title', 'reference', 'certificate', 'amount']
				},
			],
		}).then(payment => {
			if (!payment) {
				NotFoundError(res, { unique_id: tag_root, text: "Payment not found" }, null);
			} else {
				SuccessResponse(res, { unique_id: tag_root, text: "Payment loaded" }, payment);
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function rootSearchPayments(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await PAYMENTS.count({
			where: {
				[Op.or]: [
					{
						reference: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						},
					},
					{
						type: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						}
					},
					{
						gateway: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						}
					},
					{
						payment_method: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						}
					}, 
					{
						payment_status: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						}
					}
				]
			}
		});
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);

		PAYMENTS.findAndCountAll({
			attributes: { exclude: ['id'] },
			where: {
				[Op.or]: [
					{
						reference: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						},
					},
					{
						type: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						}
					},
					{
						gateway: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						}
					},
					{
						payment_method: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						}
					},
					{
						payment_status: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						}
					}
				]
			},
			order: [
				['createdAt', 'DESC']
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
		}).then(payments => {
			if (!payments || payments.length === 0) {
				SuccessResponse(res, { unique_id: tag_root, text: "Payments Not found" }, []);
			} else {
				SuccessResponse(res, { unique_id: tag_root, text: "Payments loaded" }, { ...payments, pages: pagination.pages });
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function rootGetPaymentsSpecifically(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await PAYMENTS.count({ where: { ...payload } });
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
		const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		PAYMENTS.findAndCountAll({
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
		}).then(payments => {
			if (!payments || payments.length === 0) {
				SuccessResponse(res, { unique_id: tag_root, text: "Payments Not found" }, []);
			} else {
				SuccessResponse(res, { unique_id: tag_root, text: "Payments loaded" }, { ...payments, pages: pagination.pages });
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function publicGetPaymentsSpecifically(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await PAYMENTS.count({ where: { ...payload, status: default_status } });
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
		const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		PAYMENTS.findAndCountAll({
			attributes: { exclude: ['id', 'user_unique_id',] },
			where: {
				...payload,
				status: default_status
			},
			order: [
				[orderBy, sortBy]
			],
			include: [
				{
					model: USERS,
					attributes: ['firstname', 'middlename', 'lastname']
				},
				{
					model: COURSES,
					attributes: ['title', 'reference', 'certificate', 'amount']
				},
			],
			offset: pagination.start,
			limit: pagination.limit
		}).then(payments => {
			if (!payments || payments.length === 0) {
				SuccessResponse(res, { unique_id: anonymous, text: "Payments Not found" }, []);
			} else {
				SuccessResponse(res, { unique_id: anonymous, text: "Payments loaded" }, { ...payments, pages: pagination.pages });
			}
		}).catch(err => {
			ServerError(res, { unique_id: anonymous, text: err.message }, null);
		});
	}
};

export function publicGetPayment(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
	} else {
		PAYMENTS.findOne({
			attributes: { exclude: ['id', 'user_unique_id', 'status'] },
			where: {
				...payload,
				status: default_status
			},
			include: [
				{
					model: USERS,
					attributes: ['firstname', 'middlename', 'lastname']
				},
				{
					model: COURSES,
					attributes: ['title', 'reference', 'certificate', 'amount']
				},
			],
		}).then(async payment => {
			if (!payment) {
				NotFoundError(res, { unique_id: anonymous, text: "Payment not found" }, null);
			} else {
				SuccessResponse(res, { unique_id: anonymous, text: "Payment loaded" }, payment);
			}
		}).catch(err => {
			ServerError(res, { unique_id: anonymous, text: err.message }, null);
		});
	}
};

export async function userGetPayments(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const total_records = await PAYMENTS.count({ where: { user_unique_id: user_unique_id } });
	const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
	const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
	const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

	PAYMENTS.findAndCountAll({
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
	}).then(payments => {
		if (!payments || payments.length === 0) {
			SuccessResponse(res, { unique_id: user_unique_id, text: "Payments Not found" }, []);
		} else {
			SuccessResponse(res, { unique_id: user_unique_id, text: "Payments loaded" }, { ...payments, pages: pagination.pages });
		}
	}).catch(err => {
		ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
	});
};

export function userGetPayment(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		PAYMENTS.findOne({
			attributes: { exclude: ['id'] },
			where: {
				...payload,
				user_unique_id: user_unique_id
			},
			include: [
				{
					model: COURSES,
					attributes: ['unique_id', 'title', 'reference', 'certificate', 'amount']
				},
			],
		}).then(async payment => {
			if (!payment) {
				NotFoundError(res, { unique_id: user_unique_id, text: "Payment not found" }, null);
			} else {
				SuccessResponse(res, { unique_id: user_unique_id, text: "Payment loaded" }, payment);
			}
		}).catch(err => {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		});
	}
};

export async function userSearchPayments(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await PAYMENTS.count({
			where: {
				[Op.or]: [
					{
						reference: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						},
					},
					{
						type: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						}
					},
					{
						gateway: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						}
					},
					{
						payment_method: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						}
					},
					{
						payment_status: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						}
					}
				],
				user_unique_id: user_unique_id
			},
			include: [
				{
					model: COURSES,
					attributes: ['unique_id', 'title', 'reference', 'certificate', 'amount']
				},
			],
		});
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);

		PAYMENTS.findAndCountAll({
			attributes: { exclude: ['id'] },
			where: {
				[Op.or]: [
					{
						reference: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						},
					},
					{
						type: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						}
					},
					{
						gateway: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						}
					},
					{
						payment_method: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						}
					},
					{
						payment_status: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						}
					}
				],
				user_unique_id: user_unique_id
			},
			order: [
				['createdAt', 'DESC']
			],
			include: [
				{
					model: COURSES,
					attributes: ['unique_id', 'title', 'reference', 'certificate', 'amount']
				},
			],
			offset: pagination.start,
			limit: pagination.limit
		}).then(payments => {
			if (!payments || payments.length === 0) {
				SuccessResponse(res, { unique_id: user_unique_id, text: "Payments Not found" }, []);
			} else {
				SuccessResponse(res, { unique_id: user_unique_id, text: "Payments loaded" }, { ...payments, pages: pagination.pages });
			}
		}).catch(err => {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		});
	}
};

export async function userGetPaymentsSpecifically(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await PAYMENTS.count({ where: { ...payload, user_unique_id: user_unique_id } });
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
		const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		PAYMENTS.findAndCountAll({
			attributes: { exclude: ['id'] },
			where: {
				...payload,
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
		}).then(payments => {
			if (!payments || payments.length === 0) {
				SuccessResponse(res, { unique_id: user_unique_id, text: "Payments Not found" }, []);
			} else {
				SuccessResponse(res, { unique_id: user_unique_id, text: "Payments loaded" }, { ...payments, pages: pagination.pages });
			}
		}).catch(err => {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		});
	}
};

export async function addPayment(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const user_details = await USERS.findOne({
				attributes: ['unique_id', 'firstname', 'middlename', 'lastname', 'email'],
				where: {
					unique_id: user_unique_id
				}
			});

			const course_details = await COURSES.findOne({
				attributes: ['unique_id', 'title', 'reference', 'certificate', 'amount'],
				where: {
					unique_id: payload.course_unique_id
				}
			});

			if (!user_details) {
				BadRequestError(res, { unique_id: user_unique_id, text: "User not found" }, null);
			} else if (!course_details) {
				BadRequestError(res, { unique_id: user_unique_id, text: "Course not found" }, null);
			} else {
				const current_payment = await PAYMENTS.findOne({
					attributes: { exclude: ['id'] },
					where: {
						user_unique_id: user_unique_id,
						course_unique_id: payload.course_unique_id,
						type: transaction_types.payment,
						payment_status: processing,
						status: default_status
					},
				});

				if (current_payment) {
					BadRequestError(res, { unique_id: user_unique_id, text: "You have a pending payment!!" }, { reference: current_payment.reference });
				} else {
					const details = `NGN ${course_details.amount.toLocaleString()} ${transaction_types.payment.toLowerCase()}, via ${payment_methods.card} for ${course_details.title} course`;
					const payment_unique_id = uuidv4();
					const reference = random_uuid(4);
		
					await db.sequelize.transaction(async (transaction) => {
						const payment = await PAYMENTS.create(
							{
								unique_id: payment_unique_id,
								user_unique_id,
								course_unique_id: payload.course_unique_id,
								type: transaction_types.payment,
								gateway: return_all_letters_uppercase(payload.gateway),
								payment_method: payment_methods.card,
								amount: parseInt(course_details.amount),
								reference: payload.reference ? payload.reference : reference,
								payment_status: processing,
								details,
								status: default_status
							}, { transaction }
						);
		
						if (payment) {
							SuccessResponse(res, { unique_id: user_unique_id, text: "Payment created successfully!" }, { unique_id: payment_unique_id, reference: payment.reference, amount: course_details.amount });
						} else {
							throw new Error("Error adding payment");
						}
					});
				}
			}
		} catch (err) {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		}
	}
};

export async function addMultiplePayment(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const user_details = await USERS.findOne({
				attributes: ['unique_id', 'firstname', 'middlename', 'lastname', 'email'],
				where: {
					unique_id: user_unique_id
				}
			});

			const course_details = await COURSES.findOne({
				attributes: ['unique_id', 'title', 'reference', 'certificate', 'amount'],
				where: {
					unique_id: {
						[Op.in]: payload.courses
					}
				}
			});

			const courses = await COURSES.findAll({
				attributes: ['unique_id', 'title', 'reference', 'certificate', 'amount'],
				where: {
					unique_id: {
						[Op.in]: payload.courses
					}
				}
			});

			const sum_total = await COURSES.sum("amount", { where: { unique_id: { [Op.in]: payload.courses } } });

			if (!user_details) {
				BadRequestError(res, { unique_id: user_unique_id, text: "User not found" }, null);
			} else if (!course_details) {
				BadRequestError(res, { unique_id: user_unique_id, text: "One or more courses not found" }, null);
			} else {
				const current_payment = await PAYMENTS.findOne({
					attributes: { exclude: ['id'] },
					where: {
						user_unique_id: user_unique_id,
						course_unique_id: {
							[Op.in]: payload.courses
						},
						type: transaction_types.payment,
						payment_status: processing,
						status: default_status
					},
				});

				if (current_payment) {
					BadRequestError(res, { unique_id: user_unique_id, text: "You have one or more pending course payments!!" }, null);
				} else {
					const reference = random_uuid(7);
					const data = {
						user_unique_id,
						gateway: return_all_letters_uppercase(payload.gateway),
						reference: payload.reference ? payload.reference : reference
					};

					await db.sequelize.transaction(async (transaction) => {
						const payments = await PAYMENTS.bulkCreate(return_bulk_payments_array(courses, data), { transaction });

						if (payments.length > 0) {
							SuccessResponse(res, { unique_id: user_unique_id, text: "Payments created successfully!" }, { reference: data.reference, amount: sum_total });
						} else {
							throw new Error("Error adding payments");
						}
					});
				}
			}
		} catch (err) {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		}
	}
};

export async function cancelPayment(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const user_details = await USERS.findOne({
				attributes: ['unique_id', 'firstname', 'middlename', 'lastname', 'email', 'phone_number', 'balance'],
				where: {
					unique_id: user_unique_id
				}
			});

			if (user_details) {
				const current_payment = await PAYMENTS.findOne({
					attributes: { exclude: ['id'] },
					where: {
						user_unique_id: user_details.unique_id,
						unique_id: payload.unique_id,
						type: transaction_types.payment,
						payment_status: processing,
						status: default_status
					},
				});

				if (current_payment) {
					const course_details = await COURSES.findOne({
						attributes: ['unique_id', 'title', 'reference', 'certificate', 'amount'],
						where: {
							unique_id: current_payment.course_unique_id
						}
					});

					if (!course_details) {
						BadRequestError(res, { unique_id: user_unique_id, text: "Course not found!" }, null);
					} else {
						const { email_html, email_subject, email_text } = user_cancel_payment({ title: course_details.title });
	
						const mailer_response = await axios.post(
							`${mailer_url}/send`,
							{
								host_type: host_type,
								smtp_host: smtp_host,
								username: cloud_mailer_username,
								password: cloud_mailer_password,
								from_email: from_email,
								to_email: user_details.email,
								subject: email_subject,
								text: email_text,
								html: email_html
							},
							{
								headers: {
									'mailer-access-key': cloud_mailer_key
								}
							}
						);
	
						if (mailer_response.data.success) {
							if (mailer_response.data.data === null) {
								BadRequestError(response, { unique_id: tag_root, text: "Unable to send email to user" }, null);
							} else {
								await db.sequelize.transaction(async (transaction) => {
									const payments = await PAYMENTS.update(
										{
											payment_status: cancelled,
										}, {
											where: {
												unique_id: payload.unique_id,
												status: default_status
											},
											transaction
										}
									);
			
									if (payments > 0) {
										SuccessResponse(res, { unique_id: user_unique_id, text: "Payment was cancelled successfully!" }, null);
									} else {
										throw new Error("Payment not found");
									}
								});
							}
						} else {
							BadRequestError(res, { unique_id: user_unique_id, text: mailer_response.data.message }, null);
						}
					}
				} else {
					BadRequestError(res, { unique_id: user_unique_id, text: "Processing Payment not found!" }, null);
				}
			} else {
				BadRequestError(res, { unique_id: user_unique_id, text: "User not found!" }, null);
			}
		} catch (err) {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		}
	}
};

export async function cancelPaymentViaReference(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const user_details = await USERS.findOne({
				attributes: ['unique_id', 'firstname', 'middlename', 'lastname', 'email', 'phone_number', 'balance'],
				where: {
					unique_id: user_unique_id
				}
			});

			if (user_details) {
				const current_payment = await PAYMENTS.findOne({
					attributes: { exclude: ['id'] },
					where: {
						user_unique_id: user_details.unique_id,
						reference: payload.reference,
						type: transaction_types.payment,
						payment_status: processing,
						status: default_status
					},
				});

				if (current_payment) {
					const { email_html, email_subject, email_text } = user_cancel_payment_via_reference({ reference: payload.reference });

					const mailer_response = await axios.post(
						`${mailer_url}/send`,
						{
							host_type: host_type,
							smtp_host: smtp_host,
							username: cloud_mailer_username,
							password: cloud_mailer_password,
							from_email: from_email,
							to_email: user_details.email,
							subject: email_subject,
							text: email_text,
							html: email_html
						},
						{
							headers: {
								'mailer-access-key': cloud_mailer_key
							}
						}
					);

					if (mailer_response.data.success) {
						if (mailer_response.data.data === null) {
							BadRequestError(response, { unique_id: tag_root, text: "Unable to send email to user" }, null);
						} else {
							await db.sequelize.transaction(async (transaction) => {
								const payments = await PAYMENTS.update(
									{
										payment_status: cancelled,
									}, {
										where: {
											reference: payload.reference,
											type: transaction_types.payment,
											payment_status: processing,
											status: default_status
										},
										transaction
									}
								);

								if (payments > 0) {
									SuccessResponse(res, { unique_id: user_unique_id, text: "Payment was cancelled successfully!" }, null);
								} else {
									throw new Error("Payment not found");
								}
							});
						}
					} else {
						BadRequestError(res, { unique_id: user_unique_id, text: mailer_response.data.message }, null);
					}
				} else {
					BadRequestError(res, { unique_id: user_unique_id, text: "Processing Payment not found!" }, null);
				}
			} else {
				BadRequestError(res, { unique_id: user_unique_id, text: "User not found!" }, null);
			}
		} catch (err) {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		}
	}
};

export async function completePayment(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const user_details = await USERS.findOne({
				attributes: ['unique_id', 'firstname', 'middlename', 'lastname', 'email', 'phone_number', 'balance'],
				where: {
					unique_id: req.USER_UNIQUE_ID || payload.user_unique_id
				}
			});

			if (user_details) {
				const current_payments_details = await PAYMENTS.findOne({
					attributes: { exclude: ['id'] },
					where: {
						user_unique_id: user_details.unique_id,
						reference: payload.reference,
						type: transaction_types.payment,
						payment_status: processing,
						status: default_status
					},
				});

				const current_payments = await PAYMENTS.findAll({
					attributes: { exclude: ['id'] },
					where: {
						user_unique_id: user_details.unique_id,
						reference: payload.reference,
						type: transaction_types.payment,
						payment_status: processing,
						status: default_status
					},
				});

				if (current_payments && current_payments.length > 0) {

					const sum_total = await COURSES.sum("amount", { where: { unique_id: { [Op.in]: return_courses_from_payments(current_payments) } } });
					
					if (current_payments_details.payment_method === payment_methods.card) {
						if (current_payments_details.gateway === gateways.paystack) {
							const app_default = await APP_DEFAULTS.findOne({
								attributes: { exclude: ['id'] },
								where: {
									criteria: app_defaults.paystack_secret_key
								}
							});

							if (app_default) {
								try {
									const paystack_transaction_res = await axios.get(
										`${paystack_verify_payment_url}${current_payments_details.reference}`,
										{
											headers: {
												'Authorization': `Bearer ${app_default.value}`
											}
										}
									);

									if (paystack_transaction_res.data.status !== true) {
										BadRequestError(res, { unique_id: user_details.unique_id, text: "Error getting payment for validation" }, null);
									} else if (paystack_transaction_res.data.data.status !== "success") {
										BadRequestError(res, { unique_id: user_details.unique_id, text: `Payment unsuccessful (Status - ${return_all_letters_uppercase(paystack_transaction_res.data.data.status)})` }, null);
									} else {
										const { email_html, email_subject, email_text } = user_complete_payment({ reference: payload.reference, sum_total: "NGN " + sum_total.toLocaleString() });

										const mailer_response = await axios.post(
											`${mailer_url}/send`,
											{
												host_type: host_type,
												smtp_host: smtp_host,
												username: cloud_mailer_username,
												password: cloud_mailer_password,
												from_email: from_email,
												to_email: user_details.email,
												subject: email_subject,
												text: email_text,
												html: email_html
											},
											{
												headers: {
													'mailer-access-key': cloud_mailer_key
												}
											}
										);

										if (mailer_response.data.success) {
											if (mailer_response.data.data === null) {
												BadRequestError(response, { unique_id: tag_root, text: "Unable to send email to user" }, null);
											} else {
												await db.sequelize.transaction(async (transaction) => {
													const payments = await PAYMENTS.update(
														{
															payment_status: completed,
														}, {
															where: {
																user_unique_id: user_details.unique_id,
																reference: payload.reference,
																type: transaction_types.payment,
																status: default_status
															},
															transaction
														}
													);
		
													if (payments > 0) {
														const enrollments = await ENROLLMENTS.bulkCreate(return_enrollment_courses_array(current_payments, { user_unique_id: user_details.unique_id }), { transaction });
		
														if (enrollments.length > 0) {
															SuccessResponse(res, { unique_id: user_details.unique_id, text: "Payment was completed successfully!" });
														} else {
															throw new Error("Error adding payments");
														}
													} else {
														throw new Error("Error completing payment");
													}
												});
											}
										} else {
											BadRequestError(res, { unique_id: user_details.unique_id, text: mailer_response.data.message }, null);
										}
									}
								} catch (error) {
									BadRequestError(res, { unique_id: user_details.unique_id, text: error.response ? error.response.data.message : error.message }, { err_code: error.code });
								}
							} else {
								BadRequestError(res, { unique_id: user_details.unique_id, text: "App Default for Paystack Gateway not found!" }, null);
							}
						} else if (current_payments_details.gateway === gateways.squad) {
							const app_default = await APP_DEFAULTS.findOne({
								attributes: { exclude: ['id'] },
								where: {
									criteria: app_defaults.squad_secret_key
								}
							});

							if (app_default) {
								try {
									const squad_transaction_res = await axios.get(
										`${squad_sandbox_verify_payment_url}${current_payments_details.reference}`,
										{
											headers: {
												'Authorization': `Bearer ${app_default.value}`
											}
										}
									);

									if (squad_transaction_res.data.success !== true) {
										BadRequestError(res, { unique_id: user_details.unique_id, text: "Error getting payment for validation" }, null);
									} else if (squad_transaction_res.data.data.transaction_status !== "success") {
										BadRequestError(res, { unique_id: user_details.unique_id, text: `Payment unsuccessful (Status - ${squad_transaction_res.data.data.transaction_status})` }, null);
									} 
									// else if (squad_transaction_res.data.data.transaction_amount < current_payments.amount) {
									// 	BadRequestError(res, { unique_id: user_details.unique_id, text: `Invalid transaction amount!` }, null);
									// } 
									else {
										const { email_html, email_subject, email_text } = user_complete_payment({ reference: payload.reference, sum_total: "NGN " + sum_total.toLocaleString() });

										const mailer_response = await axios.post(
											`${mailer_url}/send`,
											{
												host_type: host_type,
												smtp_host: smtp_host,
												username: cloud_mailer_username,
												password: cloud_mailer_password,
												from_email: from_email,
												to_email: user_details.email,
												subject: email_subject,
												text: email_text,
												html: email_html
											},
											{
												headers: {
													'mailer-access-key': cloud_mailer_key
												}
											}
										);

										if (mailer_response.data.success) {
											if (mailer_response.data.data === null) {
												BadRequestError(response, { unique_id: tag_root, text: "Unable to send email to user" }, null);
											} else {
												await db.sequelize.transaction(async (transaction) => {
													const payments = await PAYMENTS.update(
														{
															payment_status: completed,
														}, {
															where: {
																user_unique_id: user_details.unique_id,
																reference: payload.reference,
																type: transaction_types.payment,
																status: default_status
															},
															transaction
														}
													);
		
													if (payments > 0) {
														const enrollments = await ENROLLMENTS.bulkCreate(return_enrollment_courses_array(current_payments, { user_unique_id: user_details.unique_id }), { transaction });
		
														if (enrollments.length > 0) {
															SuccessResponse(res, { unique_id: user_details.unique_id, text: "Payment was completed successfully!" });
														} else {
															throw new Error("Error adding payments");
														}
													} else {
														throw new Error("Error completing payment");
													}
												});
											}
										} else {
											BadRequestError(res, { unique_id: user_details.unique_id, text: mailer_response.data.message }, null);
										}
									}
								} catch (error) {
									BadRequestError(res, { unique_id: user_details.unique_id, text: error.response ? error.response.data.message : error.message }, { err_code: error.code });
								}
							} else {
								BadRequestError(res, { unique_id: user_details.unique_id, text: "App Default for Squad Gateway not found!" }, null);
							}
						} else {
							BadRequestError(res, { unique_id: user_details.unique_id, text: "Invalid transaction gateway!" }, null);
						}
					} else {
						const { email_html, email_subject, email_text } = user_complete_payment({ reference: payload.reference, sum_total: "NGN " + sum_total.toLocaleString() });

						const mailer_response = await axios.post(
							`${mailer_url}/send`,
							{
								host_type: host_type,
								smtp_host: smtp_host,
								username: cloud_mailer_username,
								password: cloud_mailer_password,
								from_email: from_email,
								to_email: user_details.email,
								subject: email_subject,
								text: email_text,
								html: email_html
							},
							{
								headers: {
									'mailer-access-key': cloud_mailer_key
								}
							}
						);

						if (mailer_response.data.success) {
							if (mailer_response.data.data === null) {
								BadRequestError(response, { unique_id: tag_root, text: "Unable to send email to user" }, null);
							} else {
								await db.sequelize.transaction(async (transaction) => {
									const payments = await PAYMENTS.update(
										{
											payment_status: completed,
										}, {
											where: {
												user_unique_id: user_details.unique_id,
												reference: payload.reference,
												type: transaction_types.payment,
												status: default_status
											},
											transaction
										}
									);
		
									if (payments > 0) {
										const enrollments = await ENROLLMENTS.bulkCreate(return_enrollment_courses_array(current_payments, { user_unique_id: user_details.unique_id }), { transaction });
		
										if (enrollments.length > 0) {
											SuccessResponse(res, { unique_id: user_details.unique_id, text: "Payment was completed successfully!" });
										} else {
											throw new Error("Error adding payments");
										}
									} else {
										throw new Error("Error completing payment");
									}
								});
							}
						} else {
							BadRequestError(res, { unique_id: user_details.unique_id, text: mailer_response.data.message }, null);
						}
					}
				} else {
					BadRequestError(res, { unique_id: user_details.unique_id, text: "Processing Payment not found!" }, null);
				}
			} else {
				BadRequestError(res, { unique_id: anonymous, text: "User not found!" }, null);
			}
		} catch (err) {
			ServerError(res, { unique_id: anonymous, text: err.message }, null);
		}
	}
};

export async function deletePayment(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			await db.sequelize.transaction(async (transaction) => {
				const payment = await PAYMENTS.destroy(
					{
						where: {
							unique_id: payload.unique_id,
							status: default_status
						},
						transaction
					}
				);

				if (payment > 0) {
					OtherSuccessResponse(res, { unique_id: user_unique_id, text: "Payment was deleted successfully!" });
				} else {
					throw new Error("Error deleting payment");
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		}
	}
};