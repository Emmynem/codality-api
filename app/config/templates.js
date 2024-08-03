export const user_email_verification = (data) => {
	const email_subject = `Email verification`;
	const email_text = `Open the link below on a new tab to verify your email <br/><br/> Verification Link: <a href="${data.verification_link}" target="_blank">${data.verification_link}</a>`;
	const email_html = `Open the link below on a new tab to verify your email <br/><br/> Verification Link: <a href="${data.verification_link}" target="_blank">${data.verification_link}</a>`;

	return { email_html, email_subject, email_text };
};

export const user_email_verification_other = (data) => {
	const email_subject = `Email verification`;
	const email_text = `Open the link below on a new tab to verify your email <br/><br/> Verification Link: <a href="${data.verification_link}" target="_blank">${data.verification_link}</a>  <br/><br/> Password: ${data.new_password}`;
	const email_html = `Open the link below on a new tab to verify your email <br/><br/> Verification Link: <a href="${data.verification_link}" target="_blank">${data.verification_link}</a>  <br/><br/> Password: ${data.new_password}`;

	return { email_html, email_subject, email_text };
};

export const user_changed_password = (data) => {
	const email_subject = `Email changed! ⚠️`;
	const email_text = `Open the link below on a new tab to verify your email.<br/><br/> Verification Link: <a href="${data.verification_link}" target="_blank">${data.verification_link}</a> <br/><br/> Email: ${data.email} <br/><br/> Password: ${data.new_password}`;
	const email_html = `Open the link below on a new tab to verify your email.<br/><br/> Verification Link: <a href="${data.verification_link}" target="_blank">${data.verification_link}</a> <br/><br/> Email: ${data.email} <br/><br/> Password: ${data.new_password}`;

	return { email_html, email_subject, email_text };
};

export const user_reset_password = (data) => {
	const email_subject = `Password recovery`;
	const email_text = `Here's your new password <br/><br/> Password: ${data.new_password}`;
	const email_html = `Here's your new password <br/><br/> Password: ${data.new_password}`;

	return { email_html, email_subject, email_text };
};

export const user_cancel_payment = (data) => {
	const email_subject = `Payment cancelled`;
	const email_text = `Your payment for ${data.title} course has been cancelled <br/><br/>`;
	const email_html = `Your payment for ${data.title} course has been cancelled <br/><br/>`;

	return { email_html, email_subject, email_text };
};

export const user_cancel_payment_via_reference = (data) => {
	const email_subject = `Payment cancelled`;
	const email_text = `Your payment for courses with reference - ${data.reference} has been cancelled <br/><br/>`;
	const email_html = `Your payment for courses with reference - ${data.reference} has been cancelled <br/><br/>`;

	return { email_html, email_subject, email_text };
};

export const user_complete_payment = (data) => {
	const email_subject = `Payment complete for course(s)`;
	const email_text = `Your payment for courses with reference - ${data.reference} has been completed <br/><br/> Total Paid: ${data.sum_total}`;
	const email_html = `Your payment for courses with reference - ${data.reference} has been completed <br/><br/> Total Paid: ${data.sum_total}`;

	return { email_html, email_subject, email_text };
};