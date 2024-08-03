import { db_end, db_start } from "../config/config";
import usersModel from "./users.model.js";
import coursesModel from "./courses.model.js";

export default (sequelize, Sequelize) => {

	const users = usersModel(sequelize, Sequelize);
	const courses = coursesModel(sequelize, Sequelize);

	const enrollments = sequelize.define("enrollment", {
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
		user_unique_id: {
			type: Sequelize.STRING(40),
			allowNull: false,
			references: {
				model: users,
				key: "unique_id"
			}
		},
		course_unique_id: {
			type: Sequelize.STRING(40),
			allowNull: false,
			references: {
				model: courses,
				key: "unique_id"
			}
		},
		enrollment_status: {
			type: Sequelize.STRING(50),
			allowNull: false,
		},
		status: {
			type: Sequelize.INTEGER(1),
			allowNull: false,
		}
	}, {
		tableName: `${db_start}enrollments${db_end}`
	});
	return enrollments;
};
