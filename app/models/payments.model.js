import { db_end, db_start } from "../config/config";
import usersModel from "./users.model.js";
import coursesModel from "./courses.model.js";

export default (sequelize, Sequelize) => {

	const users = usersModel(sequelize, Sequelize);
	const courses = coursesModel(sequelize, Sequelize);

	const payments = sequelize.define("payment", {
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
		type: {
			type: Sequelize.STRING(50),
			allowNull: false,
		},
		gateway: {
			type: Sequelize.STRING(50),
			allowNull: false,
		},
		payment_method: {
			type: Sequelize.STRING(50),
			allowNull: false,
		}, 
		amount: {
			type: Sequelize.FLOAT,
			allowNull: false,
		},
		reference: {
			type: Sequelize.STRING(200),
			allowNull: true,
		},
		payment_status: {
			type: Sequelize.STRING(50),
			allowNull: false,
		},
		details: {
			type: Sequelize.STRING(500),
			allowNull: true,
		},
		status: {
			type: Sequelize.INTEGER(1),
			allowNull: false,
		}
	}, {
		tableName: `${db_start}payments${db_end}`
	});
	return payments;
};