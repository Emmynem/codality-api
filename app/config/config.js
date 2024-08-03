import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export const primary_domain = "https://codalityacademy.com";
export const mailer_url = "https://api.mailer.xnyder.com";
export const clouder_url = "https://api.clouder.xnyder.com";
export const paystack_verify_payment_url = "https://api.paystack.co/transaction/verify/";
export const squad_sandbox_verify_payment_url = "https://sandbox-api-d.squadco.com/transaction/verify/";
export const squad_live_verify_payment_url = "https://api-d.squadco.com/transaction/verify/";
export const default_path = "codality";

export const api_keys = [
	"71a59125-17aa-4b6a-b7f1-3b9ba2b62183", // Used
	"32f3e0a6-5d4b-4411-aa70-7b4a0b9cfd88",
	"9f900151-ca76-45e6-8de9-916524bba3c3",
	"16979eb8-57e4-4aa5-958a-b4e20af2e02c",
	"6ba0b997-2229-4232-a623-434dcf93c16c",
	"92c85ce5-a3b8-4bba-8acc-b2d82da1dc41",
	"810be2e9-35d3-4e58-8d93-3e752181fbf9",
	"a3938af7-bbeb-4315-8c06-1e36a23f35f8",
	"257f4007-249e-4345-a700-de4611784710",
	"2db23d65-975c-46e5-af76-5e52cce17409",
	"2aa0c0ed-6066-4807-b7b0-f1dbba619820",
	"02275b0f-776a-4e90-a4f8-98cb023b0c8b",
	"b5830816-8190-4ef4-bd44-aaae9c0cd38f",
	"648d8557-c2ce-4a8d-b87c-537eec3546af",
	"d0b99c74-02f5-4461-a600-7f80829b2705",
	"61b70361-a4c0-49ec-bed1-64e4aa3ed437",
	"f70969c5-4beb-4fdf-a424-293d8e589277",
	"022b9319-f7dc-49ca-b6c6-60e1156f9259",
	"65146b5d-3bd2-4d0b-8b59-b709314b13e8",
	"133f79a0-ac92-4843-b72e-9b271f4f1ea7"
];

// Password options
export const password_options = {
	minLength: 8,
	maxLength: 30,
	minLowercase: 1,
	minNumbers: 1,
	minSymbols: 1,
	minUppercase: 1
};

// Email Templates 
export const email_templates = {
	user_changed_password: "user-changed-password",
	user_reset_password: "user-reset-password",
	user_email_verification: "user-email-verification",
	user_email_verification_other: "user-email-verification-other",
	user_email_verification_internal: "user-email-verification-internal",
	user_complete_payment: "user-complete-payment",
	user_cancel_payment: "user-cancel-payment",
};

export const tag_root = "Root";
export const anonymous = "Anonymous";
export const db_start = "codality_";
export const db_end = "_tbl";

export const codality_header_key = "codality-access-key";
export const codality_header_token = "codality-access-token";

export const false_status = false;
export const true_status = true;

export const verified_status = true;
export const unverified_status = false;

export const default_status = 1;
export const default_delete_status = 0;
export const default_pending_status = 2;

export const zero = 0;

// App Defaults 
export const app_defaults = {
	api_whitelist: "Api_Whitelist",
	paystack_public_key: "Paystack_Public_Key",
	paystack_secret_key: "Paystack_Secret_Key",
	squad_public_key: "Squad_Public_Key",
	squad_secret_key: "Squad_Secret_Key",
	users_emails: "Users_Emails",
	users_phone_numbers: "Users_Phone_Numbers",
	maintenance: "Maintenance"
};

export const default_app_values = [
	{
		unique_id: uuidv4(),
		criteria: "Maintenance",
		data_type: "BOOLEAN",
		value: false,
		status: 1
	},
	{
		unique_id: uuidv4(),
		criteria: "Paystack_Secret_Key",
		data_type: "STRING",
		value: null,
		status: 1
	},
	{
		unique_id: uuidv4(),
		criteria: "Paystack_Public_Key",
		data_type: "STRING",
		value: null,
		status: 1
	},
	{
		unique_id: uuidv4(),
		criteria: "Squad_Secret_Key",
		data_type: "STRING",
		value: null,
		status: 1
	},
	{
		unique_id: uuidv4(),
		criteria: "Squad_Public_Key",
		data_type: "STRING",
		value: null,
		status: 1
	},
	{
		unique_id: uuidv4(),
		criteria: "Users_Emails",
		data_type: "ARRAY",
		value: null,
		status: 1
	},
	{
		unique_id: uuidv4(),
		criteria: "Users_Phone_Numbers",
		data_type: "ARRAY",
		value: null,
		status: 1
	},
	{
		unique_id: uuidv4(),
		criteria: "Api_Whitelist",
		data_type: "ARRAY",
		value: null,
		status: 1
	}
];
// End - App Defaults

export const check_length_TINYTEXT = 255;
export const check_length_TEXT = 65535;
export const check_length_MEDIUMTEXT = 16777215;
export const check_length_LONGTEXT = 4294967295;

// Default Actions
export const completed = "Completed";
export const processing = "Processing";
export const cancelled = "Cancelled";
export const refunded = "Refunded";
export const pending = "Pending";
export const ongoing = "Ongoing";
export const certified = "Certified";
export const payment_methods = {
	card: "Credit/Debit Card",
	wallet: "Wallet",
	transfer: "Transfer"
};
export const gateways = {
	paystack: "PAYSTACK",
	squad: "SQUAD",
	internal: "INTERNAL"
};
// End - Default Actions

// Default Transaction Types
export const withdrawal = "Withdrawal";
export const deposit = "Deposit";
export const refund = "Refund";
export const payment = "Payment";
export const reversal = "Reversal";
export const transfer = "Transfer";
export const fees = "Fees";
export const subscription = "Subscription";
export const charges = "Charges";
export const transaction_types = { withdrawal, deposit, refund, payment, reversal, transfer, fees, subscription, charges };
// End - Default Transaction Types

export const paginate_limit = 20;

// File lengths
export const file_length_5Mb = 5000000;
export const file_length_10Mb = 10000000;
export const file_length_15Mb = 15000000;
export const file_length_20Mb = 20000000;
export const file_length_25Mb = 25000000;
export const file_length_30Mb = 30000000;
export const file_length_35Mb = 35000000;
export const file_length_40Mb = 40000000;
export const file_length_45Mb = 45000000;
export const file_length_50Mb = 50000000;
export const file_length_55Mb = 55000000;
export const file_length_60Mb = 60000000;
export const file_length_65Mb = 65000000;
export const file_length_70Mb = 70000000;
export const file_length_75Mb = 75000000;
export const file_length_80Mb = 80000000;
export const file_length_85Mb = 85000000;
export const file_length_90Mb = 90000000;
export const file_length_95Mb = 95000000;
export const file_length_100Mb = 100000000;

// Accesses
export const access_granted = 1;
export const access_suspended = 2;
export const access_revoked = 3;
export const all_access = [access_granted, access_suspended, access_revoked];
// End - Accesses

export const today_str = () => {
	const d = new Date();
	const date_str = d.getFullYear() + "-" + ((d.getUTCMonth() + 1) < 10 ? "0" + (d.getUTCMonth() + 1) : (d.getUTCMonth() + 1)) + "-" + (d.getDate() < 10 ? "0" + d.getDate() : d.getDate());
	return date_str;
};

export const todays_date = () => {
	const d = new Date();
	return d.toDateString();
};

export const year_str = () => {
	const d = new Date();
	const date_str = d.getFullYear();
	return date_str;
};

export const timestamp_str = (date) => {
	const d = new Date(date * 1000);
	return {
		fulldate: d.toDateString() + " at " + d.toLocaleTimeString(),
		date: d.toDateString(),
		time: d.toLocaleTimeString(),
	};
};

export const timestamp_str_alt = (date) => {
	const d = new Date(date);
	const date_ = d.getFullYear() + "-" + ((d.getUTCMonth() + 1) < 10 ? "0" + (d.getUTCMonth() + 1) : (d.getUTCMonth() + 1)) + "-" + (d.getDate() < 10 ? "0" + d.getDate() : d.getDate());
	const time_ = (d.getHours() < 10 ? "0" + d.getHours() : d.getHours()) + ":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()) + ":" + (d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds());
	return date_ + " " + time_;
};

export const time_zero_hundred = () => {
	const d = new Date();
	const time_str = (d.getHours() < 10 ? "0" + d.getHours() : d.getHours()) + "00";
	return time_str;
};

export const random_uuid = (length) => {
	if (length === undefined || length === null || length === 0) {
		let values = crypto.randomBytes(20).toString('hex');
		return values;
	} else {
		let values = crypto.randomBytes(length).toString('hex');
		return values;
	}
};

export const random_numbers = (length) => {
	if (length === undefined || length === null || length === 0) {
		return 0;
	} else {
		let rand_number = "";
		for (let index = 0; index < length; index++) {
			rand_number += Math.floor(Math.random() * 10);
		}
		return rand_number;
	}
};

export const test_all_regex = (data, regex) => {
	if (!data) {
		return false;
	}

	const valid = regex.test(data);
	if (!valid) {
		return false;
	}

	return true;
};

export const digit_filter = (digits) => {
	return digits.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const strip_text = (text) => {
	//Lower case everything
	let string = text.toLowerCase();
	//Make alphanumeric (removes all other characters)
	string = string.replace(/[^a-z0-9_\s-]/g, "");
	//Clean up multiple dashes or whitespaces
	string = string.replace(/[\s-]+/g, " ");
	//Convert whitespaces and underscore to dash
	string = string.replace(/[\s_]/g, "-");
	return string;
};

export const unstrip_text = (text) => {
	let string = text.replace(/[-_]/g, " ");
	return string;
};

export const unstrip_text_alt = (text) => {
	let string = text.replace(/[-_]/g, "");
	return string;
};

export const filterBytes = (bytes) => {
	if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
	var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
		number = Math.floor(Math.log(bytes) / Math.log(1024));
	return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
};

export const strip_text_underscore = (text) => {
	string = text.replace(/[\s]/g, "_");
	return string;
};

export const return_first_letter_uppercase = (str) => {
	return str.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
};

export const return_first_letter_uppercase_alt = (_str) => {
	const str = unstrip_text(_str);
	return str.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
};

export const return_all_letters_uppercase = (str) => {
	return str ? str.toUpperCase() : str;
};

export const return_all_letters_lowercase = (str) => {
	return str ? str.toLowerCase() : str;
};

export const return_trimmed_data = (str) => {
	return str.trim();
};

export const return_sort_by = (str) => {
	if (!str) return "desc";
	else if (str.toLowerCase() !== "asc" && str.toLowerCase() !== "desc") return "desc";
	else return str.toLowerCase();
};

export const return_order_by_for_others = (str) => {
	if (!str) return "createdAt";
	else if (str !== "updatedAt") return "createdAt";
	else return (str === "updatedAt") ? str : str.toLowerCase();
};

export const validate_future_date = (date) => {
	const d = new Date(date);
	const today = new Date();
	if (d === "Invalid Date") return false;
	if (today.getTime() > d.getTime()) return false;
	return true;
};

export const validate_past_date = (date) => {
	const d = new Date(date);
	const today = new Date();
	if (d === "Invalid Date") return false;
	if (today.getTime() < d.getTime()) return false;
	return true;
};

export const validate_future_end_date = (_start, _end) => {
	const start = new Date(_start);
	const end = new Date(_end);
	if (start === "Invalid Date") return false;
	if (end === "Invalid Date") return false;
	if (start.getTime() >= end.getTime()) return false;
	return true;
};

export const validate_future_end_date_alt = (_start, _end) => {
	const start = new Date(_start);
	const end = new Date(_end * 1000);
	if (start === "Invalid Date") return false;
	if (end === "Invalid Date") return false;
	if (start.getTime() >= end.getTime()) return false;
	return true;
};

export const validate_payment_method = (obj) => {
	const method = obj;
	if (method !== payment_methods.card && method !== payment_methods.wallet && method !== payment_methods.transfer) return false;
	return true;
};

export const validate_gateway = (obj) => {
	const method = obj;
	if (method !== gateways.paystack && method !== gateways.squad && method !== gateways.internal) return false;
	return true;
};

export const validate_app_default_type = (app_default) => {
	if (!app_defaults_data_type.includes(app_default)) return false;
	return true;
};

export const validate_app_default_value = (value, data_type) => {
	if (data_type === "BOOLEAN" && typeof value === "boolean") return true
	else if (data_type === "STRING" && typeof value === "string") return true
	else if (data_type === "INTEGER" && typeof value === "number") return true
	else if (data_type === "BIGINT" && typeof value === "bigint") return true
	else if (data_type === "ARRAY" && Array.isArray(value) && value.length !== 0) return true
	else if (data_type === "MAP" && typeof value === "object") return true
	else return false
};

export const return_bulk_payments_array = (courses, data) => {
	var results = [];
	for (let index = 0; index < courses.length; index++) {
		const element = courses[index];
		const details = `NGN ${element.amount.toLocaleString()} ${transaction_types.payment.toLowerCase()} via ${payment_methods.card} for ${element.title} course`;

		results.push({
			unique_id: uuidv4(),
			user_unique_id: data.user_unique_id,
			course_unique_id: element.unique_id,
			type: transaction_types.payment,
			gateway: data.gateway,
			payment_method: payment_methods.card,
			amount: parseInt(element.amount),
			reference: data.reference,
			payment_status: processing,
			details,
			status: 1
		});

		if (index === courses.length - 1) return results;
	}
};

export const return_enrollment_courses_array = (payments, data) => {
	var results = [];
	for (let index = 0; index < payments.length; index++) {
		const element = payments[index];

		results.push({
			unique_id: uuidv4(),
			user_unique_id: data.user_unique_id,
			course_unique_id: element.course_unique_id,
			enrollment_status: ongoing,
			status: 1
		});

		if (index === payments.length - 1) return results;
	}
};

export const return_courses_from_payments = (payments, data) => {
	var results = [];
	for (let index = 0; index < payments.length; index++) {
		const element = payments[index];

		results.push(element.course_unique_id);

		if (index === payments.length - 1) return results;
	}
};

export const paginate = (page, _records, total_records) => {
	// Get total pages available for the amount of records needed in each page with total records
	const records = !_records || _records < paginate_limit ? paginate_limit : _records;
	const pages = Math.ceil(total_records / records);
	// return false if page is less than 1 (first page) or greater than pages (last page)
	if (page < 1 || page > pages || !page) {
		return {
			start: 0,
			end: total_records < records ? total_records : records,
			pages: pages,
			limit: total_records < records ? total_records : records,
		};
	}

	// get the end limit
	const end = pages === page ? total_records : (page === 1 ? page * records : page * records);
	// get start limit
	// if records are uneven at the last page, show all records from last ending to the end
	const start = page === 1 ? 0 : (pages === page ? ((total_records - records) - (total_records - (page * records))) : end - records);

	// return object
	return {
		start: start,
		end: end,
		pages: pages,
		limit: end - start,
	};
};
