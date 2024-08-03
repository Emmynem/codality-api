import { validationResult, matchedData } from 'express-validator';
import moment from 'moment';
import axios from "axios";
import jwt from "jsonwebtoken";
import bycrypt from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { ServerError, SuccessResponse, OtherSuccessResponse, ValidationError, UnauthorizedError, ForbiddenError, NotFoundError, BadRequestError } from '../common/index.js';
import {
	access_granted, access_revoked, access_suspended, default_status, false_status, primary_domain, 
	random_uuid, zero, true_status, email_templates, return_all_letters_lowercase, mailer_url, unverified_status
} from '../config/config.js';
import { user_email_verification, user_email_verification_other, user_reset_password } from '../config/templates.js';
import db from "../models/index.js";

dotenv.config();

const { secret, cloud_mailer_key, host_type, smtp_host, cloud_mailer_username, cloud_mailer_password, from_email, } = process.env;

const USERS = db.users;
const Op = db.Sequelize.Op;

const { sign } = jwt;
const { hashSync } = bycrypt;
const { compareSync } = bycrypt;

export async function userSignUp(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: payload.email, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const verification_link = primary_domain + "/email/verify" + `?email=${payload.email}&verification_id=${random_uuid(20)}`;

			const { email_html, email_subject, email_text } = user_email_verification({ verification_link });

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
					BadRequestError(response, { unique_id: payload.email, text: "Unable to send email to user" }, null);
				} else {
					await db.sequelize.transaction(async (transaction) => {
		
						const users = await USERS.create(
							{
								unique_id: uuidv4(),
								method: payload.method,
								middlename: payload.middlename ? payload.middlename : null,
								email: return_all_letters_lowercase(payload.email),
								...payload,
								email_verification: false_status,
								phone_number_verification: false_status,
								alt_phone_number: payload.alt_phone_number ? payload.alt_phone_number : null,
								address: payload.address ? payload.address : null,
								country: payload.country ? payload.country : null,
								state: payload.state ? payload.state : null,
								city: payload.city ? payload.city : null,
								balance: zero,
								privates: hashSync(payload.password, 8),
								profile_image: null,
								access: access_granted,
								status: default_status
							}, { transaction }
						);
		
						if (users) {
							SuccessResponse(res, { unique_id: users.unique_id, text: "Signed up successfully!" });
						} else {
							throw new Error("Error signing up");
						}
					});
				}
			} else {
				BadRequestError(res, { unique_id: payload.email, text: mailer_response.data.message }, null);
			}
		} catch (err) {
			ServerError(res, { unique_id: payload.email, text: err.message }, null);
		}
	}
};

export async function userSignUpViaOther(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: payload.email, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const verification_link = primary_domain + "/email/verify" + `?email=${payload.email}&verification_id=${random_uuid(20)}`;

			const new_password = random_uuid(6).toUpperCase();

			const { email_html, email_subject, email_text } = user_email_verification_other({ verification_link, new_password });

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
					BadRequestError(response, { unique_id: payload.email, text: "Unable to send email to user" }, null);
				} else {
					await db.sequelize.transaction(async (transaction) => {
		
						const users = await USERS.create(
							{
								unique_id: uuidv4(),
								method: payload.method,
								middlename: payload.middlename ? payload.middlename : null,
								email: return_all_letters_lowercase(payload.email),
								...payload,
								email_verification: false_status,
								phone_number_verification: false_status,
								alt_phone_number: payload.alt_phone_number ? payload.alt_phone_number : null,
								address: payload.address ? payload.address : null,
								country: payload.country ? payload.country : null,
								state: payload.state ? payload.state : null,
								city: payload.city ? payload.city : null,
								balance: zero,
								privates: hashSync(new_password, 8),
								profile_image: payload.profile_image,
								access: access_granted,
								status: default_status
							}, { transaction }
						);
		
						if (users) {s
							SuccessResponse(res, { unique_id: users.unique_id, text: `Signed up successfully via ${payload.method}!` });
						} else {
							throw new Error("Error signing up");
						}
					});
				}
			} else {
				BadRequestError(res, { unique_id: payload.email, text: mailer_response.data.message }, null);
			}
		} catch (err) {
			ServerError(res, { unique_id: payload.email, text: err.response.data.message ? err.response.data.message : err.message }, null);
		}
	}
};

export async function userSignInViaEmail(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: payload.email, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const user = await USERS.findOne({
				where: {
					email: payload.email,
					status: default_status
				}
			});

			if (!user) {
				NotFoundError(res, { unique_id: payload.email, text: "User not found" }, null);
			} else if (user.access === access_suspended) {
				ForbiddenError(res, { unique_id: payload.email, text: "Account has been suspended" }, null);
			} else if (user.access === access_revoked) {
				ForbiddenError(res, { unique_id: payload.email, text: "Account access has been revoked" }, null);
			} else if (user.email_verification === unverified_status) {
				ForbiddenError(res, { unique_id: payload.email, text: "Unverified email" }, null);
			} else {
				const passwordIsValid = compareSync(payload.password, user.privates);

				if (!passwordIsValid) {
					UnauthorizedError(res, { unique_id: payload.email, text: "Invalid Password!" }, null);
				} else {
					const token = sign({ user_unique_id: user.unique_id }, secret, {
						expiresIn: payload.remember_me ? 604800 /* 7 days */ : 86400 // 24 hours
					});

					const return_data = {
						token,
						fullname: user.firstname + (user.middlename !== null ? " " + user.middlename + " " : " ") + user.lastname,
					};
					SuccessResponse(res, { unique_id: user.unique_id, text: "Logged in successfully!" }, return_data);
				}
			}
		} catch (err) {
			ServerError(res, { unique_id: payload.email, text: err.message }, null);
		}
	}
};

export async function userSignIn(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: payload.login_id, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const user = await USERS.findOne({
				where: {
					[Op.or]: [
						{
							email: payload.login_id,
						}
					],
					status: default_status
				}
			});

			if (!user) {
				NotFoundError(res, { unique_id: payload.login_id, text: "User not found" }, null);
			} else if (user.access === access_suspended) {
				ForbiddenError(res, { unique_id: payload.login_id, text: "Account has been suspended" }, null);
			} else if (user.access === access_revoked) {
				ForbiddenError(res, { unique_id: payload.login_id, text: "Account access has been revoked" }, null);
			} else if (user.email_verification === unverified_status) {
				ForbiddenError(res, { unique_id: payload.email, text: "Unverified email" }, null);
			} else {
				const passwordIsValid = compareSync(payload.password, user.privates);

				if (!passwordIsValid) {
					UnauthorizedError(res, { unique_id: payload.login_id, text: "Invalid Password!" }, null);
				} else {
					const token = sign({ user_unique_id: user.unique_id }, secret, {
						expiresIn: payload.remember_me ? 604800 /* 7 days */ : 86400 // 24 hours
					});

					const return_data = {
						token,
						fullname: user.firstname + (user.middlename !== null ? " " + user.middlename + " " : " ") + user.lastname,
					};
					SuccessResponse(res, { unique_id: user.unique_id, text: "Logged in successfully!" }, return_data);
				}
			}
		} catch (err) {
			ServerError(res, { unique_id: payload.login_id, text: err.message }, null);
		}
	}
};

export async function userSignInViaOther(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: payload.email, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const user = await USERS.findOne({
				where: {
					email: payload.email,
					status: default_status
				}
			});

			if (!user) {
				NotFoundError(res, { unique_id: payload.email, text: "User not found" }, null);
			} else if (user.access === access_suspended) {
				ForbiddenError(res, { unique_id: payload.email, text: "Account has been suspended" }, null);
			} else if (user.access === access_revoked) {
				ForbiddenError(res, { unique_id: payload.email, text: "Account access has been revoked" }, null);
			} else if (user.email_verification === unverified_status) {
				ForbiddenError(res, { unique_id: payload.email, text: "Unverified email" }, null);
			} else {
				const token = sign({ user_unique_id: user.unique_id }, secret, {
					expiresIn: payload.remember_me ? 604800 /* 7 days */ : 86400 // 24 hours
				});

				const return_data = {
					token,
					fullname: user.firstname + (user.middlename !== null ? " " + user.middlename + " " : " ") + user.lastname,
				};
				SuccessResponse(res, { unique_id: user.unique_id, text: "Logged in successfully!" }, return_data);
			}
		} catch (err) {
			ServerError(res, { unique_id: payload.email, text: err.message }, null);
		}
	}
};

export async function passwordRecovery(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: payload.login_id, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const user = await USERS.findOne({
				where: {
					[Op.or]: [
						{
							email: payload.login_id,
						}
					],
					status: default_status
				},
			});

			if (!user) {
				NotFoundError(res, { unique_id: payload.login_id, text: "User not found" }, null);
			} else if (user.access === access_suspended) {
				ForbiddenError(res, { unique_id: payload.login_id, text: "Account has been suspended" }, null);
			} else if (user.access === access_revoked) {
				ForbiddenError(res, { unique_id: payload.login_id, text: "Account access has been revoked" }, null);
			} else {
				const new_password = random_uuid(6).toUpperCase();

				const { email_html, email_subject, email_text } = user_reset_password({ new_password });

				const mailer_response = await axios.post(
					`${mailer_url}/send`,
					{
						host_type: host_type,
						smtp_host: smtp_host,
						username: cloud_mailer_username,
						password: cloud_mailer_password,
						from_email: from_email,
						to_email: return_all_letters_lowercase(user.email),
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
						BadRequestError(response, { unique_id: payload.email, text: "Unable to send email to user" }, null);
					} else {
						const update_password = await db.sequelize.transaction((t) => {
							return USERS.update({
								privates: hashSync(new_password, 8)
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
							BadRequestError(res, { unique_id: user.unique_id, text: "Error generating password!" }, null);
						}
					}
				} else {
					BadRequestError(res, { unique_id: payload.email, text: mailer_response.data.message }, null);
				}
			}
		} catch (err) {
			ServerError(res, { unique_id: payload.login_id, text: err.message }, null);
		}
	}
};

export async function resendVerificationEmail(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: payload.email, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const user_details = await USERS.findOne({
				attributes: ['unique_id', 'type', 'firstname', 'middlename', 'lastname', 'email', 'phone_number'],
				where: {
					[Op.or]: [
						{
							email: payload.login_id,
						}
					],
					status: default_status
				},
			});

			if (!user_details) {
				NotFoundError(res, { unique_id: payload.email, text: "User not found" }, null);
			} else {
				const verification_link = primary_domain + "/email/verify" + `?email=${user_details.email}&verification_id=${random_uuid(20)}`;
				
				const { email_html, email_subject, email_text } = user_email_verification({ verification_link });

				const mailer_response = await axios.post(
					`${mailer_url}/send`,
					{
						host_type: host_type,
						smtp_host: smtp_host,
						username: cloud_mailer_username,
						password: cloud_mailer_password,
						from_email: from_email,
						to_email: return_all_letters_lowercase(user_details.email),
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
						BadRequestError(response, { unique_id: payload.email, text: "Unable to send email to user" }, null);
					} else {
						SuccessResponse(res, { unique_id: payload.email, text: "Email sent successfully!" });
					}
				} else {
					BadRequestError(res, { unique_id: payload.email, text: mailer_response.data.message }, null);
				}
			}
		} catch (err) {
			ServerError(res, { unique_id: payload.email, text: err.message }, null);
		}
	}
};

export async function verifyEmail(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: payload.email, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const user = await USERS.findOne({
				attributes: ['unique_id'],
				where: {
					email: payload.email,
					status: default_status
				},
			});

			await db.sequelize.transaction(async (transaction) => {

				const user = await USERS.update(
					{
						email_verification: true_status
					}, {
						where: {
							...payload,
							email_verification: {
								[Op.ne]: true_status
							},
							status: default_status
						},
						transaction
					}
				);

				if (user > 0) {
					OtherSuccessResponse(res, { unique_id: payload.email, text: "User email verified successfully!" });
				} else {
					throw new Error("User email verified already");
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: payload.email, text: err.message }, null);
		}
	}
};
