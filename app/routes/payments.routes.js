import { checks } from "../middleware/index.js";
import { payment_rules } from "../rules/payments.rules.js";
import { user_rules } from "../rules/users.rules.js";
import { courses_rules } from "../rules/courses.rules.js";
import { default_rules } from "../rules/default.rules.js";
import {
	addMultiplePayment, addPayment, cancelPayment, cancelPaymentViaReference, completePayment, deletePayment, publicGetPayment, publicGetPaymentsSpecifically, 
	rootGetPayment, rootGetPayments, rootGetPaymentsSpecifically, rootSearchPayments, userGetPayment, userGetPayments, userGetPaymentsSpecifically, userSearchPayments
} from "../controllers/payments.controller.js";

export default function (app) {
	app.get("/root/payments", [checks.verifyKey], rootGetPayments);
	app.get("/root/payments/via/user", [checks.verifyKey, user_rules.forFindingUserAlt], rootGetPaymentsSpecifically);
	app.get("/root/payments/via/course", [checks.verifyKey, courses_rules.forFindingCourseAlt], rootGetPaymentsSpecifically);
	app.get("/root/payments/via/type", [checks.verifyKey, payment_rules.forFindingViaType], rootGetPaymentsSpecifically);
	app.get("/root/payments/via/gateway", [checks.verifyKey, payment_rules.forFindingViaGateway], rootGetPaymentsSpecifically);
	app.get("/root/payments/via/payment_status", [checks.verifyKey, payment_rules.forFindingViaPaymentStatus], rootGetPaymentsSpecifically);
	app.get("/root/payments/via/reference", [checks.verifyKey, payment_rules.forFindingViaReference], rootGetPaymentsSpecifically);
	app.get("/root/search/payments", [checks.verifyKey, default_rules.forSearching], rootSearchPayments);
	app.get("/root/payment", [checks.verifyKey, payment_rules.forFindingPayment], rootGetPayment);
	
	app.get("/payments", [checks.verifyToken, checks.isUser], userGetPayments);
	app.get("/payments/via/course", [checks.verifyToken, checks.isUser, courses_rules.forFindingCourseAlt], userGetPaymentsSpecifically);
	app.get("/payments/via/type", [checks.verifyToken, checks.isUser, payment_rules.forFindingViaType], userGetPaymentsSpecifically);
	app.get("/payments/via/gateway", [checks.verifyToken, checks.isUser, payment_rules.forFindingViaGateway], userGetPaymentsSpecifically);
	app.get("/payments/via/payment_status", [checks.verifyToken, checks.isUser, payment_rules.forFindingViaPaymentStatus], userGetPaymentsSpecifically);
	app.get("/payments/via/reference", [checks.verifyToken, checks.isUser, payment_rules.forFindingViaReference], userGetPaymentsSpecifically);
	app.get("/search/payments", [checks.verifyToken, checks.isUser, default_rules.forSearching], userSearchPayments);
	app.get("/payment", [checks.verifyToken, checks.isUser, payment_rules.forFindingPayment], userGetPayment);
	
	app.post("/add/payment", [checks.verifyToken, checks.isUser, payment_rules.forAdding], addPayment);
	app.post("/add/multiple/payments", [checks.verifyToken, checks.isUser, payment_rules.forAddingMultiple], addMultiplePayment);

	app.put("/complete/payments", [checks.verifyToken, checks.isUser, payment_rules.forFindingViaReference], completePayment);
	app.put("/root/complete/payments", [checks.verifyKey, user_rules.forFindingUserAlt, payment_rules.forFindingViaReference], completePayment);
	app.put("/cancel/payment", [checks.verifyToken, checks.isUser, payment_rules.forFindingPayment], cancelPayment);
	app.put("/cancel/payments/via/reference", [checks.verifyToken, checks.isUser, payment_rules.forFindingViaReference], cancelPaymentViaReference);

};
