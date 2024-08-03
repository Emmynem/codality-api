import { validationResult, matchedData } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import dotenv from 'dotenv';
import bycrypt from "bcryptjs";
import { ServerError, SuccessResponse, ValidationError, OtherSuccessResponse, UnauthorizedError, NotFoundError, BadRequestError, logger } from '../common/index.js';
import {
	access_granted, access_revoked, access_suspended, default_delete_status, default_status, false_status, true_status, clouder_url, 
	tag_root, paginate, return_all_letters_uppercase, email_templates, random_uuid, primary_domain, return_all_letters_lowercase, mailer_url
} from '../config/config.js';
import db from "../models/index.js";
import { user_changed_password } from '../config/templates.js';
// import { sendEmail } from './mailing.controller.js';
import { deleteImage } from "../middleware/uploads.js";

dotenv.config();

const { clouder_key, cloudy_name, cloudy_key, cloudy_secret, cloud_mailer_key, host_type, smtp_host, cloud_mailer_username, cloud_mailer_password, from_email } = process.env;

const USERS = db.users;
const Op = db.Sequelize.Op;

const { compareSync } = bycrypt;
const { hashSync } = bycrypt;

export async function rootGetUsers(req, res) {
	const total_records = await USERS.count();
	const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
	const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
	const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

	USERS.findAndCountAll({
		attributes: { exclude: ['privates', 'id'] },
		order: [
			[orderBy, sortBy]
		],
		distinct: true,
		offset: pagination.start,
		limit: pagination.limit
	}).then(users => {
		if (!users || users.length === 0) {
			SuccessResponse(res, { unique_id: tag_root, text: "Users Not found" }, []);
		} else {
			SuccessResponse(res, { unique_id: tag_root, text: "Users loaded" }, { ...users, pages: pagination.pages });
		}
	}).catch(err => {
		ServerError(res, { unique_id: tag_root, text: err.message }, null);
	});
};

export function rootGetUser(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		USERS.findOne({
			attributes: { exclude: ['privates', 'id'] },
			where: {
				...payload
			}
		}).then(user => {
			if (!user) {
				NotFoundError(res, { unique_id: tag_root, text: "User not found" }, null);
			} else {
				SuccessResponse(res, { unique_id: tag_root, text: "User loaded" }, user);
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function rootSearchUsers(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await USERS.count({
			where: {
				[Op.or]: [
					{
						firstname: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						}
					},
					{
						lastname: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						}
					},
					{
						middlename: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						}
					},
					{
						email: {
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

		USERS.findAndCountAll({
			attributes: { exclude: ['privates', 'id'] },
			where: {
				[Op.or]: [
					{
						firstname: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						}
					},
					{
						lastname: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						}
					},
					{
						middlename: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						}
					},
					{
						email: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						}
					},
				]
			},
			order: [
				['firstname', 'ASC'],
				['lastname', 'ASC'],
				['middlename', 'ASC'],
				['createdAt', 'DESC']
			],
			distinct: true,
			offset: pagination.start,
			limit: pagination.limit
		}).then(users => {
			if (!users || users.length === 0) {
				SuccessResponse(res, { unique_id: tag_root, text: "Users Not found" }, []);
			} else {
				SuccessResponse(res, { unique_id: tag_root, text: "Users loaded" }, { ...users, pages: pagination.pages });
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export function getUserProfile(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	USERS.findOne({
		attributes: { exclude: ['privates', 'id', 'access', 'status', 'updatedAt'] },
		where: {
			unique_id: user_unique_id,
			status: default_status
		}
	}).then(user => {
		if (!user) {
			NotFoundError(res, { unique_id: user_unique_id, text: "User not found" }, null);
		} else {
			SuccessResponse(res, { unique_id: user_unique_id, text: "User loaded" }, user);
		}
	}).catch(err => {
		ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
	});
};

export async function updateUserNames(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;
	
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			await db.sequelize.transaction(async (transaction) => {
				const user = await USERS.update(
					{
						...payload,
						middlename: payload.middlename ? payload.middlename : null,
					}, {
						where: {
							unique_id: user_unique_id,
							status: default_status
						},
						transaction
					}
				);

				if (user > 0) {
					SuccessResponse(res, { unique_id: user_unique_id, text: "Details updated successfully!" }, null);
				} else {
					throw new Error("User not found");
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		}
	}
};

export async function updateUserDetails(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			await db.sequelize.transaction(async (transaction) => {
				const user = await USERS.update(
					{
						...payload,
						alt_phone_number: payload.alt_phone_number ? payload.alt_phone_number : null,
					}, {
						where: {
							unique_id: user_unique_id,
							status: default_status
						},
						transaction
					}
				);

				if (user > 0) {
					SuccessResponse(res, { unique_id: user_unique_id, text: "Details updated successfully!" }, null);
				} else {
					throw new Error("User not found");
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		}
	}
};

export async function updateUserAddress(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			await db.sequelize.transaction(async (transaction) => {
				const user = await USERS.update(
					{
						...payload,
					}, {
						where: {
							unique_id: user_unique_id,
							status: default_status
						},
						transaction
					}
				);

				if (user > 0) {
					SuccessResponse(res, { unique_id: user_unique_id, text: "Details updated successfully!" }, null);
				} else {
					throw new Error("User not found");
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		}
	}
};

export async function rootUpdateUserEmail(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const user_details = await USERS.findOne({
				attributes: ['unique_id', 'type', 'firstname', 'middlename', 'lastname', 'email', 'phone_number'],
				where: {
					unique_id: payload.unique_id
				}
			});

			if (!user_details) {
				BadRequestError(res, { unique_id: tag_root, text: "User not found!" });
			} else {
				const verification_link = primary_domain + "/email/verify" + `?email=${payload.email}&verification_id=${random_uuid(20)}`;
				const new_password = random_uuid(6).toUpperCase();
				
				const { email_html, email_subject, email_text } = user_email_verification_other({ verification_link, new_password, email: payload.email });

				const mailer_response = await axios.post(
					`${mailer_url}/send`,
					{
						host_type: host_type,
						smtp_host: smtp_host,
						username: cloud_mailer_username,
						password: cloud_mailer_password,
						from_email: from_email,
						to_email: return_all_letters_lowercase(payload.email),
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
							const user = await USERS.update(
								{
									email: payload.email,
									privates: hashSync(new_password, 8),
								}, {
									where: {
										unique_id: payload.unique_id,
										status: default_status
									},
									transaction
								}
							);
		
							if (user > 0) {
								SuccessResponse(res, { unique_id: tag_root, text: "Details updated successfully!" }, null);
							} else {
								throw new Error("User not found");
							}
						});
					}
				} else {
					BadRequestError(res, { unique_id: tag_root, text: mailer_response.data.message }, null);
				}
			}
		} catch (err) {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		}
	}
};

export async function updateUserProfileImage(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const edit_details = await USERS.findOne({
				attributes: ["profile_image", "profile_image_public_id"],
				where: {
					unique_id: user_unique_id
				}
			});

			if (!edit_details) {
				BadRequestError(res, { unique_id: user_unique_id, text: "User not found" }, null);
			} else {
				await db.sequelize.transaction(async (transaction) => {
					const user = await USERS.update(
						{
							profile_image: payload.profile_image,
							profile_image_public_id: payload.profile_image_public_id,
						}, {
							where: {
								unique_id: user_unique_id,
								status: default_status
							},
							transaction
						}
					);

					if (user > 0) {
						SuccessResponse(res, { unique_id: user_unique_id, text: "Details updated successfully!" }, null);

						// Delete former file available
						if (edit_details.profile_image_public_id !== null) {
							await deleteImage(clouder_key, { cloudinary_name: cloudy_name, cloudinary_key: cloudy_key, cloudinary_secret: cloudy_secret, cloud_mailer_key, host_type, smtp_host, cloud_mailer_username, cloud_mailer_password, from_email, public_id: edit_details.profile_image_public_id });
						}
					} else {
						throw new Error("User not found");
					}
				});
			}
		} catch (err) {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		}
	}
};

export async function userChangePassword(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;
	
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const user = await USERS.findOne({
				where: {
					unique_id: user_unique_id,
					status: default_status
				}
			});

			if (!user) {
				NotFoundError(res, { unique_id: user_unique_id, text: "User not found" }, null);
			} else if (user.access === access_suspended) {
				ForbiddenError(res, { unique_id: user_unique_id, text: "Account has been suspended" }, null);
			} else if (user.access === access_revoked) {
				ForbiddenError(res, { unique_id: user_unique_id, text: "Account access has been revoked" }, null);
			} else {
				const passwordIsValid = compareSync(payload.oldPassword, user.privates);

				if (!passwordIsValid) {
					UnauthorizedError(res, { unique_id: user_unique_id, text: "Invalid Old Password!" }, null);
				} else {
					const update_password = await db.sequelize.transaction((t) => {
						return USERS.update({
							privates: hashSync(payload.password, 8)
						}, {
							where: {
								unique_id: user.unique_id,
								status: default_status
							}
						}, { transaction: t });
					})

					if (update_password > 0) {
						SuccessResponse(res, { unique_id: user.unique_id, text: "User's password changed successfully!" }, null);
					} else {
						throw new Error("Error creating password!");
					}
				}
			}
		} catch (err) {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		}
	}
};

export async function updateUserAccessGranted(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, `${tag_root} | updateUserAccessGranted | Validation Error Occured`, errors.array())
	} else {
		try {
			await db.sequelize.transaction(async (transaction) => {

				const user = await USERS.update(
					{
						access: access_granted
					}, {
						where: {
							...payload,
							access: {
								[Op.ne]: access_granted
							},
							status: default_status
						},
						transaction
					}
				);

				if (user > 0) {
					SuccessResponse(res, { unique_id: tag_root + " | " + payload.unique_id, text: "User's access granted successfully!" });
				} else {
					throw new Error("User access already granted");
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: tag_root + " | " + payload.unique_id, text: err.message }, null);
		}
	}
};

export async function updateUserAccessSuspended(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, `${tag_root} | updateUserAccessSuspended | Validation Error Occured`, errors.array())
	} else {
		try {
			await db.sequelize.transaction(async (transaction) => {

				const user = await USERS.update(
					{
						access: access_suspended
					}, {
						where: {
							...payload,
							access: {
								[Op.ne]: access_suspended
							},
							status: default_status
						},
						transaction
					}
				);

				if (user > 0) {
					SuccessResponse(res, { unique_id: tag_root + " | " + payload.unique_id, text: "User's access suspended successfully!" });
				} else {
					throw new Error("User access already suspended");
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: tag_root + " | " + payload.unique_id, text: err.message }, null);
		}
	}
};

export async function updateUserAccessRevoked(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, `${tag_root} | updateUserAccessRevoked | Validation Error Occured`, errors.array())
	} else {
		try {
			await db.sequelize.transaction(async (transaction) => {

				const user = await USERS.update(
					{
						access: access_revoked
					}, {
						where: {
							...payload,
							access: {
								[Op.ne]: access_revoked
							},
							status: default_status
						},
						transaction
					}
				);

				if (user > 0) {
					SuccessResponse(res, { unique_id: tag_root + " | " + payload.unique_id, text: "User's access revoked successfully!" });
				} else {
					throw new Error("User access already revoked");
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: tag_root + " | " + payload.unique_id, text: err.message }, null);
		}
	}
};

