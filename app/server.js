import express, { json, urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import fileMiddleware from 'express-multipart-file-parser';
import { SuccessResponse } from './common/index.js';
import logger from "./common/logger.js";
import { codality_header_key, codality_header_token, primary_domain } from './config/config.js';
import { createAppDefaults } from './config/default.config.js';
import morganMiddleware from "./middleware/morgan.js";
import db from "./models/index.js";
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import coursesRoutes from "./routes/courses.routes.js";
import paymentsRoutes from "./routes/payments.routes.js";
import enrollmentsRoutes from "./routes/enrollments.routes.js";

const app = express();

const appWhitelist = [primary_domain, "http://localhost", "http://localhost:80", "http://localhost:3000", "http://localhost:5173"];
//options for cors midddleware
const options = cors.CorsOptions = {
	allowedHeaders: [
		'Access-Control-Allow-Headers',
		'Origin',
		'X-Requested-With',
		'Content-Type',
		'Accept',
		codality_header_key,
		codality_header_token
	],
	methods: 'GET,PUT,POST,DELETE',
	credentials: true,
	origin: function (origin, callback) {
		if (appWhitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(null, false);
		}
	},
};

app.use(json());
app.use(urlencoded({ extended: true, limit: '100mb' }));
app.use(fileMiddleware);
app.use(helmet());
app.use(morganMiddleware);

// add cors
app.use(cors(options));

// simple route
app.get("/", (request, response) => {
	SuccessResponse(response, "Codality API activated!");
})

// Sequelize initialization
db.sequelize.sync({ alter: false }).then(() => {
	logger.info("DB Connected 🚀");
	// creating defaults
	createAppDefaults();
});

// app.use(express.static(path.join(__dirname, '../public')));

// Binding routes
authRoutes(app);
usersRoutes(app);
coursesRoutes(app);
paymentsRoutes(app);
enrollmentsRoutes(app);

// change timezone for app
process.env.TZ = "UTC";

process.on('SIGINT', function () {
	db.sequelize.close(function (err) {
		process.exit(err ? 1 : 0);
	});
});

export default app;
