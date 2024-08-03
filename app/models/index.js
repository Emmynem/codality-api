import { DB, USER, PASSWORD, HOST, dialect as _dialect, logging as _logging, pool as _pool, dialectOptions as _dialectOptions, timezone, production } from "../config/db.config.js";
import Sequelize from "sequelize";
import appDefaultsModel from "./appDefaults.model.js";
import usersModel from "./users.model.js";
import coursesModel from "./courses.model.js";
import paymentsModel from "./payments.model.js";
import enrollmentsModel from "./enrollments.model.js";

const sequelize = new Sequelize(
	DB,
	USER,
	PASSWORD,
	{
		host: HOST,
		dialect: _dialect,
		logging: _logging,
		operatorsAliases: 0,
		pool: {
			max: _pool.max,
			min: _pool.min,
			acquire: _pool.acquire,
			idle: _pool.idle,
			evict: _pool.evict
		},
		dialectOptions: {
			// useUTC: _dialectOptions.useUTC, 
			dateStrings: _dialectOptions.dateStrings,
			typeCast: _dialectOptions.typeCast
		},
		timezone: timezone
	}
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// * Binding models
db.app_defaults = appDefaultsModel(sequelize, Sequelize);
db.users = usersModel(sequelize, Sequelize);
db.courses = coursesModel(sequelize, Sequelize);
db.payments = paymentsModel(sequelize, Sequelize);
db.enrollments = enrollmentsModel(sequelize, Sequelize);

// End - Binding models

// Associations

//    - Payments
db.users.hasMany(db.payments, { foreignKey: 'user_unique_id', sourceKey: 'unique_id' });
db.payments.belongsTo(db.users, { foreignKey: 'user_unique_id', targetKey: 'unique_id' });

db.courses.hasMany(db.payments, { foreignKey: 'course_unique_id', sourceKey: 'unique_id' });
db.payments.belongsTo(db.courses, { foreignKey: 'course_unique_id', targetKey: 'unique_id' });

//    - Enrollments
db.users.hasMany(db.enrollments, { foreignKey: 'user_unique_id', sourceKey: 'unique_id' });
db.enrollments.belongsTo(db.users, { foreignKey: 'user_unique_id', targetKey: 'unique_id' });

db.courses.hasMany(db.enrollments, { foreignKey: 'course_unique_id', sourceKey: 'unique_id' });
db.enrollments.belongsTo(db.courses, { foreignKey: 'course_unique_id', targetKey: 'unique_id' });

// End - Associations

export default db;
