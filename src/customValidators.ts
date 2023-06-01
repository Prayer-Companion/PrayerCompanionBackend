import {CustomValidator} from "express-validator/src/base";
import moment from "moment-timezone";

export const validateTimeZone: CustomValidator = async value => {
    if (moment.tz.zone(value) == null) {
        throw new Error('invalid value')
    }
}