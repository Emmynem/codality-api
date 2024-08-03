import { check } from 'express-validator';

export const default_rules = {
	forSearching: [
		check('search', "Search is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.isString().isLength({ min: 2, max: 500 })
			.withMessage("Invalid length (2 - 500) characters"),
	],
	forMessasge: [
		check('message', "Message is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.isString().isLength({ min: 3, max: 1000 })
			.withMessage("Invalid length (3 - 1000) characters")
	]
}