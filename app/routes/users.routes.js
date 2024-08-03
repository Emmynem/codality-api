import { checks } from "../middleware/index.js";
import { user_rules } from "../rules/users.rules.js";
import { default_rules } from "../rules/default.rules.js";
import {
	getUserProfile, rootGetUser, rootGetUsers, rootSearchUsers, rootUpdateUserEmail, updateUserAccessGranted, updateUserAccessRevoked, updateUserAccessSuspended, 
	updateUserNames, updateUserProfileImage, userChangePassword, updateUserAddress, updateUserDetails
} from "../controllers/users.controller.js";

export default function (app) {
	app.get("/root/users", [checks.verifyKey], rootGetUsers);
	app.get("/root/search/users", [checks.verifyKey, default_rules.forSearching], rootSearchUsers);
	app.get("/root/user", [checks.verifyKey, user_rules.forFindingUser], rootGetUser);

	app.get("/profile", [checks.verifyToken, checks.isUser], getUserProfile);

	app.post("/password/change", [checks.verifyToken, checks.isUser, user_rules.forChangingPassword], userChangePassword);
	app.post("/profile/image", [checks.verifyToken, checks.isUser, user_rules.forProfileImageUpload], updateUserProfileImage);

	app.put("/profile/names", [checks.verifyToken, checks.isUser, user_rules.forUpdatingNames], updateUserNames);
	app.put("/profile/details", [checks.verifyToken, checks.isUser, user_rules.forUpdatingDetails], updateUserDetails);
	app.put("/profile/address", [checks.verifyToken, checks.isUser, user_rules.forUpdatingAddressDetails], updateUserAddress);

	app.put("/root/user/profile/email", [checks.verifyKey, user_rules.forFindingUser, user_rules.forEmail], rootUpdateUserEmail);

	app.put("/root/user/access/grant", [checks.verifyKey, user_rules.forFindingUser], updateUserAccessGranted);
	app.put("/root/user/access/suspend", [checks.verifyKey, user_rules.forFindingUser], updateUserAccessSuspended);
	app.put("/root/user/access/revoke", [checks.verifyKey, user_rules.forFindingUser], updateUserAccessRevoked);
};
