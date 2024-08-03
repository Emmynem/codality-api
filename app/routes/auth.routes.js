import { checks } from "../middleware/index.js";
import { user_rules } from "../rules/users.rules.js";
import {
	passwordRecovery, resendVerificationEmail, userSignIn, userSignInViaEmail, userSignInViaOther, userSignUp, userSignUpViaOther, 
	verifyEmail
} from "../controllers/auth.controller.js";

export default function (app) {
	// User Auth Routes 
	app.post("/auth/signin/email", [user_rules.forEmailLogin], userSignInViaEmail);
	app.post("/auth/signin/other", [user_rules.forEmailLoginAlt], userSignInViaOther);
	app.post("/auth/signup", [user_rules.forAdding], userSignUp);
	app.post("/auth/signup/other", [user_rules.forAddingViaOther], userSignUpViaOther);
	
	// User recovery routes
	app.post("/password/recover", [user_rules.forEmailPasswordReset], passwordRecovery);
	
	// User resend verification email
	app.post("/resend/email/verification", [user_rules.forEmailPasswordReset], resendVerificationEmail);

	// User verify email and phone number routes
	app.post("/email/verify", [user_rules.forFindingUserEmailForVerification], verifyEmail);
};