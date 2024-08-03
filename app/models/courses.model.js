import { db_end, db_start } from "../config/config.js";

export default (sequelize, Sequelize) => {

	const courses = sequelize.define("course", {
		id: {
			type: Sequelize.BIGINT,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		unique_id: {
			type: Sequelize.STRING(40),
			allowNull: false,
			unique: true
		},
		reference: {
			type: Sequelize.STRING(20),
			allowNull: false,
			unique: true
		},
		title: {
			type: Sequelize.STRING(300),
			allowNull: false,
			unique: true
		},
		file: {
			type: Sequelize.STRING(500),
			allowNull: true,
		},
		file_type: {
			type: Sequelize.STRING(20),
			allowNull: true,
		},
		file_public_id: {
			type: Sequelize.STRING(500),
			allowNull: true,
		},
		content: {
			type: Sequelize.TEXT,
			allowNull: false,
		},
		certificate: {
			type: Sequelize.STRING(50),
			allowNull: true,
		},
		amount: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		status: {
			type: Sequelize.INTEGER(1),
			allowNull: false,
		}
	}, {
		tableName: `${db_start}courses${db_end}`
	});
	return courses;
};
