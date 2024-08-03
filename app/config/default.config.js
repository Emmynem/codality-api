import db from "../models/index.js";
import { logger } from '../common/index.js';
import { default_app_values } from './config.js';

const APP_DEFAULTS = db.app_defaults;

export async function createAppDefaults() {

    const count = await APP_DEFAULTS.count();

    if (count <= 0) {
        try {
            await db.sequelize.transaction((t) => {
                const appDefaults = APP_DEFAULTS.bulkCreate(default_app_values, { transaction: t });
                return appDefaults;
            })
            logger.info('Added app defaults');
        } catch (error) {
            logger.error(error)
            logger.error('Error adding app defaults');
        }
    }
};
